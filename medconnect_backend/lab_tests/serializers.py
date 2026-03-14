from rest_framework import serializers
from .models import (
    LabTestCategory, Lab, LabTest, LabTestPackage,
    LabTestBooking, LabTestResult, LabReview, LabTimeSlot, LabTestCart
)
from patients.models import PatientProfile


# ========================
# Category Serializers
# ========================
class LabTestCategorySerializer(serializers.ModelSerializer):
    test_count = serializers.SerializerMethodField()

    class Meta:
        model = LabTestCategory
        fields = ['id', 'name', 'description', 'icon', 'is_active', 'test_count']

    def get_test_count(self, obj):
        return obj.tests.filter(is_active=True).count()


# ========================
# Lab Serializers
# ========================
class LabListSerializer(serializers.ModelSerializer):
    """Serializer for listing labs"""
    average_rating = serializers.ReadOnlyField()
    total_reviews = serializers.ReadOnlyField()

    class Meta:
        model = Lab
        fields = [
            'id', 'name', 'address', 'city', 'state', 'pincode',
            'phone', 'logo', 'is_nabl_certified', 'is_cap_certified',
            'opening_time', 'closing_time', 'working_days',
            'offers_home_collection', 'home_collection_fee',
            'average_rating', 'total_reviews', 'latitude', 'longitude'
        ]


class LabDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for lab view"""
    average_rating = serializers.ReadOnlyField()
    total_reviews = serializers.ReadOnlyField()
    time_slots = serializers.SerializerMethodField()

    class Meta:
        model = Lab
        fields = [
            'id', 'name', 'address', 'city', 'state', 'pincode',
            'phone', 'email', 'description', 'logo', 'website',
            'is_nabl_certified', 'is_cap_certified', 'certifications',
            'opening_time', 'closing_time', 'working_days',
            'offers_home_collection', 'home_collection_fee',
            'is_verified', 'average_rating', 'total_reviews',
            'latitude', 'longitude', 'time_slots'
        ]

    def get_time_slots(self, obj):
        slots = obj.time_slots.filter(is_active=True)
        return LabTimeSlotSerializer(slots, many=True).data


# ========================
# Lab Test Serializers
# ========================
class LabTestListSerializer(serializers.ModelSerializer):
    """Serializer for listing lab tests"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    effective_price = serializers.ReadOnlyField()
    discount_percentage = serializers.SerializerMethodField()

    class Meta:
        model = LabTest
        fields = [
            'id', 'name', 'code', 'description', 'category', 'category_name',
            'sample_type', 'fasting_required', 'fasting_hours',
            'report_time_hours', 'base_price', 'discounted_price',
            'effective_price', 'discount_percentage',
            'home_collection_available', 'is_popular'
        ]

    def get_discount_percentage(self, obj):
        if obj.discounted_price and obj.base_price > 0:
            discount = ((obj.base_price - obj.discounted_price) / obj.base_price) * 100
            return round(discount, 1)
        return 0


class LabTestDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for lab test view"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    effective_price = serializers.ReadOnlyField()

    class Meta:
        model = LabTest
        fields = [
            'id', 'name', 'code', 'description', 'category', 'category_name',
            'sample_type', 'fasting_required', 'fasting_hours',
            'preparation_instructions', 'parameters', 'report_time_hours',
            'base_price', 'discounted_price', 'effective_price',
            'home_collection_available', 'is_popular', 'is_active'
        ]


# ========================
# Package Serializers
# ========================
class LabTestPackageListSerializer(serializers.ModelSerializer):
    """Serializer for listing packages"""
    test_count = serializers.SerializerMethodField()
    discount_percentage = serializers.ReadOnlyField()

    class Meta:
        model = LabTestPackage
        fields = [
            'id', 'name', 'code', 'description', 'target_gender', 'age_group',
            'total_value', 'package_price', 'discount_percentage',
            'fasting_required', 'fasting_hours', 'report_time_hours',
            'home_collection_available', 'is_featured', 'test_count'
        ]

    def get_test_count(self, obj):
        return obj.tests.count()


class LabTestPackageDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for package view"""
    tests = LabTestListSerializer(many=True, read_only=True)
    discount_percentage = serializers.ReadOnlyField()

    class Meta:
        model = LabTestPackage
        fields = [
            'id', 'name', 'code', 'description', 'tests',
            'target_gender', 'age_group', 'total_value', 'package_price',
            'discount_percentage', 'fasting_required', 'fasting_hours',
            'preparation_instructions', 'report_time_hours',
            'home_collection_available', 'is_featured', 'is_active'
        ]


# ========================
# Time Slot Serializers
# ========================
class LabTimeSlotSerializer(serializers.ModelSerializer):
    day_name = serializers.SerializerMethodField()
    available_slots = serializers.SerializerMethodField()

    class Meta:
        model = LabTimeSlot
        fields = [
            'id', 'slot_type', 'day_of_week', 'day_name',
            'start_time', 'end_time', 'max_bookings', 'available_slots'
        ]

    def get_day_name(self, obj):
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        return days[obj.day_of_week]

    def get_available_slots(self, obj):
        # Calculate available slots based on existing bookings
        from django.utils import timezone
        from datetime import timedelta
        
        today = timezone.now().date()
        # Get bookings for the next 7 days for this slot
        booked_count = LabTestBooking.objects.filter(
            lab=obj.lab,
            scheduled_time__gte=obj.start_time,
            scheduled_time__lt=obj.end_time,
            status__in=['PENDING', 'CONFIRMED'],
            scheduled_date__gte=today,
            scheduled_date__lte=today + timedelta(days=7)
        ).count()
        
        return max(0, obj.max_bookings - booked_count)


# ========================
# Booking Serializers
# ========================
class CreateBookingSerializer(serializers.Serializer):
    """Serializer for creating a new booking"""
    lab_id = serializers.IntegerField()
    test_ids = serializers.ListField(child=serializers.IntegerField(), required=False)
    package_id = serializers.IntegerField(required=False, allow_null=True)
    
    collection_type = serializers.ChoiceField(choices=['HOME', 'LAB'])
    scheduled_date = serializers.DateField()
    scheduled_time = serializers.TimeField()
    
    # Home collection address (required if collection_type is HOME)
    collection_address = serializers.CharField(required=False, allow_blank=True)
    collection_city = serializers.CharField(required=False, allow_blank=True)
    collection_pincode = serializers.CharField(required=False, allow_blank=True)
    collection_landmark = serializers.CharField(required=False, allow_blank=True)
    
    # Patient details
    patient_name = serializers.CharField(max_length=100)
    patient_age = serializers.IntegerField(min_value=1, max_value=150)
    patient_gender = serializers.ChoiceField(choices=['MALE', 'FEMALE', 'OTHER'])
    patient_phone = serializers.CharField(max_length=15)
    
    patient_notes = serializers.CharField(required=False, allow_blank=True)
    prescription_image = serializers.URLField(required=False, allow_blank=True)
    consultation_id = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, data):
        # Ensure at least test_ids or package_id is provided
        if not data.get('test_ids') and not data.get('package_id'):
            raise serializers.ValidationError("Either test_ids or package_id must be provided")
        
        # If home collection, address is required
        if data.get('collection_type') == 'HOME':
            if not data.get('collection_address'):
                raise serializers.ValidationError("Collection address is required for home collection")
            if not data.get('collection_pincode'):
                raise serializers.ValidationError("Pincode is required for home collection")
        
        # Validate scheduled date is not in the past
        from django.utils import timezone
        if data['scheduled_date'] < timezone.now().date():
            raise serializers.ValidationError("Scheduled date cannot be in the past")
        
        return data


class LabTestBookingListSerializer(serializers.ModelSerializer):
    """Serializer for listing bookings"""
    lab_name = serializers.CharField(source='lab.name', read_only=True)
    test_names = serializers.SerializerMethodField()
    package_name = serializers.CharField(source='package.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)

    class Meta:
        model = LabTestBooking
        fields = [
            'id', 'booking_id', 'lab', 'lab_name', 'test_names', 'package_name',
            'collection_type', 'scheduled_date', 'scheduled_time',
            'patient_name', 'total_amount', 'status', 'status_display',
            'payment_status', 'payment_status_display', 'created_at'
        ]

    def get_test_names(self, obj):
        return [test.name for test in obj.tests.all()]


class LabTestBookingDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for booking view"""
    lab = LabListSerializer(read_only=True)
    tests = LabTestListSerializer(many=True, read_only=True)
    package = LabTestPackageListSerializer(read_only=True)
    results = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)

    class Meta:
        model = LabTestBooking
        fields = [
            'id', 'booking_id', 'lab', 'tests', 'package',
            'collection_type', 'scheduled_date', 'scheduled_time',
            'collection_address', 'collection_city', 'collection_pincode', 'collection_landmark',
            'patient_name', 'patient_age', 'patient_gender', 'patient_phone',
            'subtotal', 'home_collection_fee', 'discount', 'total_amount',
            'payment_status', 'payment_status_display', 'payment_id', 'payment_method',
            'status', 'status_display', 'sample_collected_at', 'sample_collector_name',
            'patient_notes', 'admin_notes', 'prescription_image',
            'created_at', 'updated_at', 'completed_at', 'cancelled_at', 'cancellation_reason',
            'results'
        ]

    def get_results(self, obj):
        return LabTestResultSerializer(obj.results.all(), many=True).data


class UpdateBookingStatusSerializer(serializers.Serializer):
    """Serializer for updating booking status"""
    status = serializers.ChoiceField(
        choices=['CONFIRMED', 'SAMPLE_COLLECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED']
    )
    admin_notes = serializers.CharField(required=False, allow_blank=True)
    sample_collector_name = serializers.CharField(required=False, allow_blank=True)
    cancellation_reason = serializers.CharField(required=False, allow_blank=True)


class CancelBookingSerializer(serializers.Serializer):
    """Serializer for cancelling a booking"""
    cancellation_reason = serializers.CharField(required=True)


# ========================
# Result Serializers
# ========================
class LabTestResultSerializer(serializers.ModelSerializer):
    """Serializer for lab test results"""
    test_name = serializers.CharField(source='test.name', read_only=True)
    test_code = serializers.CharField(source='test.code', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = LabTestResult
        fields = [
            'id', 'booking', 'test', 'test_name', 'test_code',
            'result_data', 'result_summary', 'report_file_url',
            'status', 'status_display', 'is_normal', 'interpretation',
            'doctor_remarks', 'verified_by', 'verified_at', 'created_at'
        ]


class CreateResultSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating results (admin)"""
    class Meta:
        model = LabTestResult
        fields = [
            'test', 'result_data', 'result_summary', 'report_file_url',
            'status', 'is_normal', 'interpretation', 'doctor_remarks',
            'verified_by'
        ]


# ========================
# Review Serializers
# ========================
class LabReviewSerializer(serializers.ModelSerializer):
    """Serializer for lab reviews"""
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = LabReview
        fields = [
            'id', 'rating', 'sample_collection_rating', 'report_accuracy_rating',
            'timeliness_rating', 'comment', 'patient_name',
            'lab_response', 'lab_response_at', 'is_verified', 'created_at'
        ]

    def get_patient_name(self, obj):
        try:
            profile = PatientProfile.objects.get(user=obj.patient)
            return profile.full_name
        except PatientProfile.DoesNotExist:
            return "Anonymous"


class CreateReviewSerializer(serializers.ModelSerializer):
    """Serializer for creating a review"""
    class Meta:
        model = LabReview
        fields = [
            'lab', 'booking', 'rating', 'sample_collection_rating',
            'report_accuracy_rating', 'timeliness_rating', 'comment'
        ]


# ========================
# Cart Serializers
# ========================
class LabTestCartSerializer(serializers.ModelSerializer):
    """Serializer for cart"""
    tests = serializers.SerializerMethodField()
    packages = LabTestPackageListSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_amount = serializers.ReadOnlyField()
    selected_lab_id = serializers.IntegerField(source='selected_lab.id', read_only=True, allow_null=True)
    selected_lab_name = serializers.CharField(source='selected_lab.name', read_only=True, allow_null=True)

    class Meta:
        model = LabTestCart
        fields = ['id', 'tests', 'packages', 'total_items', 'total_amount', 'selected_lab_id', 'selected_lab_name', 'updated_at']

    def get_tests(self, obj):
        """Get tests with lab-specific pricing if a lab is selected"""
        from .models import LabTestOffering
        tests_data = []
        
        # Get offering prices if lab is selected
        offering_prices = {}
        if obj.selected_lab:
            for offering in LabTestOffering.objects.filter(lab=obj.selected_lab, is_available=True):
                offering_prices[offering.test_id] = {
                    'price': float(offering.price),
                    'discounted_price': float(offering.discounted_price) if offering.discounted_price else None,
                    'effective_price': float(offering.discounted_price or offering.price)
                }
        
        for test in obj.tests.all():
            test_data = LabTestListSerializer(test).data
            # Override with lab-specific pricing if available
            if test.id in offering_prices:
                test_data['price'] = offering_prices[test.id]['price']
                test_data['discounted_price'] = offering_prices[test.id]['discounted_price']
                test_data['effective_price'] = offering_prices[test.id]['effective_price']
            tests_data.append(test_data)
        
        return tests_data


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding items to cart"""
    test_id = serializers.IntegerField(required=False, allow_null=True)
    package_id = serializers.IntegerField(required=False, allow_null=True)
    lab_id = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, data):
        if not data.get('test_id') and not data.get('package_id'):
            raise serializers.ValidationError("Either test_id or package_id must be provided")
        return data


class RemoveFromCartSerializer(serializers.Serializer):
    """Serializer for removing items from cart"""
    test_id = serializers.IntegerField(required=False, allow_null=True)
    package_id = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, data):
        if not data.get('test_id') and not data.get('package_id'):
            raise serializers.ValidationError("Either test_id or package_id must be provided")
        return data


# ========================
# Lab Provider Serializers
# ========================
from .models import LabProviderProfile, LabTestOffering
from accounts.models import User


class LabProviderRegisterSerializer(serializers.Serializer):
    """Serializer for lab provider registration"""
    # User credentials
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    password = serializers.CharField(write_only=True, min_length=6)
    
    # Provider details
    full_name = serializers.CharField(max_length=100)
    designation = serializers.CharField(max_length=100, required=False, allow_blank=True)
    contact_phone = serializers.CharField(max_length=15)
    alternate_phone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    
    # Lab details
    lab_name = serializers.CharField(max_length=200)
    lab_address = serializers.CharField()
    lab_city = serializers.CharField(max_length=100)
    lab_state = serializers.CharField(max_length=100)
    lab_pincode = serializers.CharField(max_length=10)
    lab_phone = serializers.CharField(max_length=15)
    lab_email = serializers.EmailField(required=False, allow_blank=True)
    lab_description = serializers.CharField(required=False, allow_blank=True)
    lab_website = serializers.URLField(required=False, allow_blank=True)
    
    # Certifications
    is_nabl_certified = serializers.BooleanField(default=False)
    is_cap_certified = serializers.BooleanField(default=False)
    certifications = serializers.CharField(required=False, allow_blank=True)
    
    # License details
    license_number = serializers.CharField(max_length=100)
    gst_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    # Operating hours
    opening_time = serializers.TimeField(default='08:00')
    closing_time = serializers.TimeField(default='20:00')
    working_days = serializers.CharField(default="Mon,Tue,Wed,Thu,Fri,Sat")
    
    # Home collection
    offers_home_collection = serializers.BooleanField(default=True)
    home_collection_fee = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return value

    def validate_license_number(self, value):
        if LabProviderProfile.objects.filter(license_number=value).exists():
            raise serializers.ValidationError("This license number is already registered.")
        return value

    def create(self, validated_data):
        from django.db import transaction
        
        with transaction.atomic():
            # Create user
            user = User.objects.create_user(
                email=validated_data['email'],
                phone=validated_data['phone'],
                password=validated_data['password'],
                role='LAB_PROVIDER'
            )
            
            # Create lab
            from .models import Lab
            lab = Lab.objects.create(
                name=validated_data['lab_name'],
                address=validated_data['lab_address'],
                city=validated_data['lab_city'],
                state=validated_data['lab_state'],
                pincode=validated_data['lab_pincode'],
                phone=validated_data['lab_phone'],
                email=validated_data.get('lab_email', ''),
                description=validated_data.get('lab_description', ''),
                website=validated_data.get('lab_website', ''),
                is_nabl_certified=validated_data.get('is_nabl_certified', False),
                is_cap_certified=validated_data.get('is_cap_certified', False),
                certifications=validated_data.get('certifications', ''),
                opening_time=validated_data.get('opening_time', '08:00'),
                closing_time=validated_data.get('closing_time', '20:00'),
                working_days=validated_data.get('working_days', 'Mon,Tue,Wed,Thu,Fri,Sat'),
                offers_home_collection=validated_data.get('offers_home_collection', True),
                home_collection_fee=validated_data.get('home_collection_fee', 0),
                is_active=True,
                is_verified=False  # Needs admin verification
            )
            
            # Create lab provider profile
            profile = LabProviderProfile.objects.create(
                user=user,
                lab=lab,
                full_name=validated_data['full_name'],
                designation=validated_data.get('designation', ''),
                contact_phone=validated_data['contact_phone'],
                alternate_phone=validated_data.get('alternate_phone', ''),
                license_number=validated_data['license_number'],
                gst_number=validated_data.get('gst_number', ''),
                is_approved=False,
                is_active=True
            )
            
            return profile


class LabProviderProfileSerializer(serializers.ModelSerializer):
    """Serializer for lab provider profile"""
    lab = LabDetailSerializer(read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = LabProviderProfile
        fields = [
            'id', 'email', 'full_name', 'designation', 'contact_phone', 'alternate_phone',
            'license_number', 'license_expiry', 'gst_number',
            'license_document', 'registration_certificate',
            'is_approved', 'is_active', 'lab', 'created_at', 'updated_at'
        ]


class LabProviderProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating lab provider profile"""
    class Meta:
        model = LabProviderProfile
        fields = [
            'full_name', 'designation', 'contact_phone', 'alternate_phone',
            'license_expiry', 'gst_number', 'license_document', 'registration_certificate'
        ]


class LabUpdateSerializer(serializers.ModelSerializer):
    """Serializer for lab provider to update their lab details"""
    class Meta:
        model = Lab
        fields = [
            'name', 'address', 'city', 'state', 'pincode',
            'phone', 'email', 'description', 'logo', 'website',
            'certifications', 'opening_time', 'closing_time', 'working_days',
            'offers_home_collection', 'home_collection_fee', 'latitude', 'longitude'
        ]


class LabTestOfferingSerializer(serializers.ModelSerializer):
    """Serializer for lab test offerings"""
    test_name = serializers.CharField(source='test.name', read_only=True)
    test_code = serializers.CharField(source='test.code', read_only=True)
    test_category = serializers.CharField(source='test.category.name', read_only=True)
    sample_type = serializers.CharField(source='test.sample_type', read_only=True)
    effective_price = serializers.ReadOnlyField()

    class Meta:
        model = LabTestOffering
        fields = [
            'id', 'lab', 'test', 'test_name', 'test_code', 'test_category',
            'sample_type', 'price', 'discounted_price', 'effective_price',
            'report_time_hours', 'is_available', 'home_collection_available',
            'created_at', 'updated_at'
        ]


class CreateLabTestOfferingSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating lab test offerings"""
    class Meta:
        model = LabTestOffering
        fields = [
            'test', 'price', 'discounted_price', 'report_time_hours',
            'is_available', 'home_collection_available'
        ]


class LabProviderBookingSerializer(serializers.ModelSerializer):
    """Serializer for lab provider to view bookings"""
    patient_email = serializers.CharField(source='patient.email', read_only=True)
    test_names = serializers.SerializerMethodField()
    package_name = serializers.CharField(source='package.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)

    class Meta:
        model = LabTestBooking
        fields = [
            'id', 'booking_id', 'patient_email', 'test_names', 'package_name',
            'collection_type', 'scheduled_date', 'scheduled_time',
            'collection_address', 'collection_city', 'collection_pincode', 'collection_landmark',
            'patient_name', 'patient_age', 'patient_gender', 'patient_phone',
            'subtotal', 'home_collection_fee', 'discount', 'total_amount',
            'payment_status', 'payment_status_display', 'status', 'status_display',
            'sample_collected_at', 'sample_collector_name',
            'patient_notes', 'admin_notes', 'prescription_image',
            'created_at', 'updated_at', 'completed_at', 'cancelled_at', 'cancellation_reason'
        ]

    def get_test_names(self, obj):
        return [test.name for test in obj.tests.all()]


class LabProviderDashboardSerializer(serializers.Serializer):
    """Serializer for lab provider dashboard stats"""
    total_bookings = serializers.IntegerField()
    pending_bookings = serializers.IntegerField()
    confirmed_bookings = serializers.IntegerField()
    completed_bookings = serializers.IntegerField()
    cancelled_bookings = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    today_bookings = serializers.IntegerField()
    total_tests_offered = serializers.IntegerField()
    average_rating = serializers.FloatField()
    total_reviews = serializers.IntegerField()
