from django.contrib import admin
from .models import Consultation


@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'consultation_type', 'status', 
                    'scheduled_date', 'scheduled_time', 'fee', 'is_paid', 'created_at')
    list_filter = ('status', 'consultation_type', 'is_paid', 'scheduled_date', 'created_at')
    search_fields = ('patient__email', 'doctor__email', 'symptoms', 'diagnosis')
    ordering = ('-created_at',)
    list_editable = ('status', 'is_paid')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Participants', {
            'fields': ('patient', 'doctor')
        }),
        ('Appointment Details', {
            'fields': ('consultation_type', 'scheduled_date', 'scheduled_time', 'status')
        }),
        ('Symptoms & AI', {
            'fields': ('symptoms', 'ai_prediction')
        }),
        ('Doctor Notes', {
            'fields': ('diagnosis', 'prescription', 'notes')
        }),
        ('Payment', {
            'fields': ('fee', 'is_paid')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    actions = ['mark_as_completed', 'mark_as_cancelled', 'mark_as_paid']
    
    def mark_as_completed(self, request, queryset):
        from django.utils import timezone
        count = queryset.update(status='COMPLETED', completed_at=timezone.now())
        self.message_user(request, f"{count} consultation(s) marked as completed.")
    mark_as_completed.short_description = "✅ Mark as Completed"
    
    def mark_as_cancelled(self, request, queryset):
        count = queryset.update(status='CANCELLED')
        self.message_user(request, f"{count} consultation(s) cancelled.")
    mark_as_cancelled.short_description = "❌ Mark as Cancelled"
    
    def mark_as_paid(self, request, queryset):
        count = queryset.update(is_paid=True)
        self.message_user(request, f"{count} consultation(s) marked as paid.")
    mark_as_paid.short_description = "💰 Mark as Paid"
