from django.contrib import admin
from .models import (
    LabTestCategory, Lab, LabTest, LabTestPackage,
    LabTestBooking, LabTestResult, LabReview, LabTimeSlot, LabTestCart,
    LabProviderProfile, LabTestOffering
)


@admin.register(LabTestCategory)
class LabTestCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(Lab)
class LabAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'city', 'phone', 'is_nabl_certified', 
        'offers_home_collection', 'is_active', 'is_verified'
    ]
    list_filter = [
        'city', 'state', 'is_nabl_certified', 'is_cap_certified',
        'offers_home_collection', 'is_active', 'is_verified'
    ]
    search_fields = ['name', 'address', 'city', 'phone', 'email']
    ordering = ['name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'logo', 'website')
        }),
        ('Contact & Location', {
            'fields': ('address', 'city', 'state', 'pincode', 'phone', 'email', 'latitude', 'longitude')
        }),
        ('Certifications', {
            'fields': ('is_nabl_certified', 'is_cap_certified', 'certifications')
        }),
        ('Operating Hours', {
            'fields': ('opening_time', 'closing_time', 'working_days')
        }),
        ('Home Collection', {
            'fields': ('offers_home_collection', 'home_collection_fee')
        }),
        ('Status', {
            'fields': ('is_active', 'is_verified')
        }),
    )


@admin.register(LabTest)
class LabTestAdmin(admin.ModelAdmin):
    list_display = [
        'code', 'name', 'category', 'sample_type', 
        'base_price', 'discounted_price', 'is_popular', 'is_active'
    ]
    list_filter = ['category', 'sample_type', 'fasting_required', 'is_popular', 'is_active']
    search_fields = ['name', 'code', 'description']
    ordering = ['name']
    autocomplete_fields = ['category']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description', 'category')
        }),
        ('Sample Details', {
            'fields': ('sample_type', 'fasting_required', 'fasting_hours', 'preparation_instructions')
        }),
        ('Test Details', {
            'fields': ('parameters', 'report_time_hours')
        }),
        ('Pricing', {
            'fields': ('base_price', 'discounted_price')
        }),
        ('Availability', {
            'fields': ('home_collection_available', 'is_popular', 'is_active')
        }),
    )


@admin.register(LabTestPackage)
class LabTestPackageAdmin(admin.ModelAdmin):
    list_display = [
        'code', 'name', 'target_gender', 'total_value', 
        'package_price', 'is_featured', 'is_active'
    ]
    list_filter = ['target_gender', 'is_featured', 'is_active', 'fasting_required']
    search_fields = ['name', 'code', 'description']
    filter_horizontal = ['tests']
    ordering = ['name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description')
        }),
        ('Included Tests', {
            'fields': ('tests',)
        }),
        ('Target Demographics', {
            'fields': ('target_gender', 'age_group')
        }),
        ('Pricing', {
            'fields': ('total_value', 'package_price')
        }),
        ('Test Details', {
            'fields': ('fasting_required', 'fasting_hours', 'preparation_instructions', 'report_time_hours')
        }),
        ('Availability', {
            'fields': ('home_collection_available', 'is_featured', 'is_active')
        }),
    )


class LabTestResultInline(admin.TabularInline):
    model = LabTestResult
    extra = 0
    readonly_fields = ['created_at', 'updated_at']


@admin.register(LabTestBooking)
class LabTestBookingAdmin(admin.ModelAdmin):
    list_display = [
        'booking_id', 'patient_name', 'lab', 'collection_type',
        'scheduled_date', 'total_amount', 'payment_status', 'status', 'created_at'
    ]
    list_filter = [
        'status', 'payment_status', 'collection_type',
        'scheduled_date', 'lab', 'created_at'
    ]
    search_fields = [
        'booking_id', 'patient_name', 'patient_phone',
        'patient__email', 'lab__name'
    ]
    ordering = ['-created_at']
    readonly_fields = ['booking_id', 'created_at', 'updated_at']
    autocomplete_fields = ['patient', 'lab', 'package', 'consultation']
    filter_horizontal = ['tests']
    inlines = [LabTestResultInline]
    
    fieldsets = (
        ('Booking Reference', {
            'fields': ('booking_id',)
        }),
        ('Patient & Lab', {
            'fields': ('patient', 'lab')
        }),
        ('Tests & Package', {
            'fields': ('tests', 'package')
        }),
        ('Schedule', {
            'fields': ('collection_type', 'scheduled_date', 'scheduled_time')
        }),
        ('Collection Address', {
            'fields': ('collection_address', 'collection_city', 'collection_pincode', 'collection_landmark'),
            'classes': ('collapse',)
        }),
        ('Patient Details for Booking', {
            'fields': ('patient_name', 'patient_age', 'patient_gender', 'patient_phone')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'home_collection_fee', 'discount', 'total_amount')
        }),
        ('Payment', {
            'fields': ('payment_status', 'payment_id', 'payment_method')
        }),
        ('Status', {
            'fields': ('status', 'sample_collected_at', 'sample_collector_name')
        }),
        ('Notes', {
            'fields': ('patient_notes', 'admin_notes', 'prescription_image'),
            'classes': ('collapse',)
        }),
        ('Related Consultation', {
            'fields': ('consultation',),
            'classes': ('collapse',)
        }),
        ('Cancellation', {
            'fields': ('cancelled_at', 'cancellation_reason'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(LabTestResult)
class LabTestResultAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'booking', 'test', 'status', 'is_normal',
        'verified_by', 'created_at'
    ]
    list_filter = ['status', 'is_normal', 'created_at']
    search_fields = ['booking__booking_id', 'test__name', 'verified_by']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['booking', 'test']


@admin.register(LabReview)
class LabReviewAdmin(admin.ModelAdmin):
    list_display = [
        'lab', 'patient', 'rating', 'is_verified', 'created_at'
    ]
    list_filter = ['rating', 'is_verified', 'created_at', 'lab']
    search_fields = ['lab__name', 'patient__email', 'comment']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    autocomplete_fields = ['lab', 'patient', 'booking']


@admin.register(LabTimeSlot)
class LabTimeSlotAdmin(admin.ModelAdmin):
    list_display = [
        'lab', 'slot_type', 'day_of_week', 'start_time',
        'end_time', 'max_bookings', 'is_active'
    ]
    list_filter = ['lab', 'slot_type', 'day_of_week', 'is_active']
    search_fields = ['lab__name']
    ordering = ['lab', 'day_of_week', 'start_time']
    autocomplete_fields = ['lab']


@admin.register(LabTestCart)
class LabTestCartAdmin(admin.ModelAdmin):
    list_display = ['patient', 'total_items', 'total_amount', 'updated_at']
    search_fields = ['patient__email']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['tests', 'packages']


@admin.register(LabProviderProfile)
class LabProviderProfileAdmin(admin.ModelAdmin):
    list_display = [
        'full_name', 'lab', 'contact_phone', 'license_number',
        'is_approved', 'is_active', 'created_at'
    ]
    list_filter = ['is_approved', 'is_active', 'created_at']
    search_fields = ['full_name', 'user__email', 'lab__name', 'license_number']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['user', 'lab']
    
    fieldsets = (
        ('User & Lab', {
            'fields': ('user', 'lab')
        }),
        ('Personal Information', {
            'fields': ('full_name', 'designation', 'contact_phone', 'alternate_phone')
        }),
        ('License & Business', {
            'fields': ('license_number', 'license_expiry', 'gst_number')
        }),
        ('Documents', {
            'fields': ('license_document', 'registration_certificate'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_approved', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_providers', 'deactivate_providers']
    
    @admin.action(description='Approve selected lab providers')
    def approve_providers(self, request, queryset):
        # Iterate through each profile to approve and verify lab
        updated = 0
        for profile in queryset.select_related('lab'):
            profile.is_approved = True
            profile.save()
            if profile.lab:
                profile.lab.is_verified = True
                profile.lab.is_active = True
                profile.lab.save()
            updated += 1
        self.message_user(request, f'{updated} lab provider(s) approved and verified successfully.')
    
    @admin.action(description='Deactivate selected lab providers')
    def deactivate_providers(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} lab provider(s) deactivated.')


@admin.register(LabTestOffering)
class LabTestOfferingAdmin(admin.ModelAdmin):
    list_display = [
        'lab', 'test', 'price', 'discounted_price',
        'is_available', 'home_collection_available', 'created_at'
    ]
    list_filter = ['lab', 'is_available', 'home_collection_available', 'created_at']
    search_fields = ['lab__name', 'test__name', 'test__code']
    ordering = ['lab', 'test__name']
    autocomplete_fields = ['lab', 'test']
    
    fieldsets = (
        ('Lab & Test', {
            'fields': ('lab', 'test')
        }),
        ('Pricing', {
            'fields': ('price', 'discounted_price')
        }),
        ('Details', {
            'fields': ('report_time_hours', 'is_available', 'home_collection_available')
        }),
    )
