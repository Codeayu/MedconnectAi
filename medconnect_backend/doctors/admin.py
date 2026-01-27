from django.contrib import admin
from .models import DoctorProfile, DoctorReview


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ("full_name", "specialization", "license_number", "experience_years", 
                    "consultation_fee", "is_approved", "is_active", "is_online", "created_at")
    list_filter = ("is_approved", "is_active", "specialization", "is_online")
    search_fields = ("full_name", "license_number", "user__email", "user__phone")
    list_editable = ("is_approved", "is_active")  # Quick edit from list view
    ordering = ("-created_at",)
    
    fieldsets = (
        ("Doctor Info", {
            "fields": ("user", "full_name", "specialization", "license_number", "bio", "profile_image")
        }),
        ("Professional Details", {
            "fields": ("experience_years", "consultation_fee")
        }),
        ("Status", {
            "fields": ("is_approved", "is_active", "is_online")
        }),
        ("Availability", {
            "fields": ("available_from", "available_to", "available_days")
        }),
    )
    
    actions = ["approve_doctors", "disapprove_doctors", "activate_doctors", "deactivate_doctors"]

    def approve_doctors(self, request, queryset):
        count = queryset.update(is_approved=True)
        self.message_user(request, f"{count} doctor(s) approved successfully.")
    approve_doctors.short_description = "✅ Approve selected doctors"

    def disapprove_doctors(self, request, queryset):
        count = queryset.update(is_approved=False)
        self.message_user(request, f"{count} doctor(s) disapproved.")
    disapprove_doctors.short_description = "❌ Disapprove selected doctors"

    def activate_doctors(self, request, queryset):
        count = queryset.update(is_active=True)
        self.message_user(request, f"{count} doctor(s) activated.")
    activate_doctors.short_description = "🟢 Activate selected doctors"

    def deactivate_doctors(self, request, queryset):
        count = queryset.update(is_active=False)
        self.message_user(request, f"{count} doctor(s) deactivated.")
    deactivate_doctors.short_description = "🔴 Deactivate selected doctors"


@admin.register(DoctorReview)
class DoctorReviewAdmin(admin.ModelAdmin):
    list_display = ("doctor", "patient", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("doctor__full_name", "patient__email", "comment")