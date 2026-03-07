from django.contrib import admin
from .models import PatientProfile


@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'age', 'gender', 'created_at')
    list_filter = ('gender', 'created_at')
    search_fields = ('full_name', 'user__email', 'user__phone')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('User Link', {
            'fields': ('user',)
        }),
        ('Patient Info', {
            'fields': ('full_name', 'age', 'gender')
        }),
    )
    
    readonly_fields = ('created_at',)
