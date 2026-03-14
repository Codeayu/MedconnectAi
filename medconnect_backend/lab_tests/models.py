from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import Avg

User = settings.AUTH_USER_MODEL


class LabTestCategory(models.Model):
    """Categories for lab tests (e.g., Blood Tests, Urine Tests, Imaging)"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.URLField(blank=True, null=True)  # Icon URL for frontend display
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Lab Test Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Lab(models.Model):
    """Diagnostic laboratories/centers that perform tests"""
    name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    
    # Lab details
    description = models.TextField(blank=True, null=True)
    logo = models.URLField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    # Certifications
    is_nabl_certified = models.BooleanField(default=False)
    is_cap_certified = models.BooleanField(default=False)
    certifications = models.TextField(blank=True, null=True)  # Additional certifications
    
    # Operating hours
    opening_time = models.TimeField(default='08:00')
    closing_time = models.TimeField(default='20:00')
    working_days = models.CharField(max_length=50, default="Mon,Tue,Wed,Thu,Fri,Sat")
    
    # Home collection
    offers_home_collection = models.BooleanField(default=True)
    home_collection_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    
    # Coordinates for location-based search
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.city}"

    @property
    def average_rating(self):
        avg = self.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0.0

    @property
    def total_reviews(self):
        return self.reviews.count()


class LabTest(models.Model):
    """Individual lab tests available for booking"""
    SAMPLE_TYPE_CHOICES = [
        ('BLOOD', 'Blood'),
        ('URINE', 'Urine'),
        ('STOOL', 'Stool'),
        ('SALIVA', 'Saliva'),
        ('SWAB', 'Swab'),
        ('TISSUE', 'Tissue'),
        ('IMAGING', 'Imaging (No Sample)'),
        ('OTHER', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)  # Test code like CBC, LFT, etc.
    description = models.TextField(blank=True, null=True)
    
    category = models.ForeignKey(
        LabTestCategory, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='tests'
    )
    
    # Sample details
    sample_type = models.CharField(max_length=20, choices=SAMPLE_TYPE_CHOICES, default='BLOOD')
    fasting_required = models.BooleanField(default=False)
    fasting_hours = models.PositiveIntegerField(default=0)  # Hours of fasting if required
    
    # Preparation instructions
    preparation_instructions = models.TextField(blank=True, null=True)
    
    # Test details
    parameters = models.JSONField(null=True, blank=True)  # List of parameters tested
    report_time_hours = models.PositiveIntegerField(default=24)  # Expected report time in hours
    
    # Pricing
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Home collection
    home_collection_available = models.BooleanField(default=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.code} - {self.name}"

    @property
    def effective_price(self):
        """Returns the discounted price if available, otherwise base price"""
        return self.discounted_price if self.discounted_price else self.base_price


class LabTestPackage(models.Model):
    """Health check packages containing multiple tests"""
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    
    tests = models.ManyToManyField(LabTest, related_name='packages')
    
    # Target demographics
    GENDER_CHOICES = [
        ('ALL', 'All'),
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
    ]
    target_gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='ALL')
    age_group = models.CharField(max_length=50, blank=True, null=True)  # e.g., "20-40 years"
    
    # Pricing
    total_value = models.DecimalField(max_digits=10, decimal_places=2)  # Sum of individual tests
    package_price = models.DecimalField(max_digits=10, decimal_places=2)  # Discounted package price
    
    # Details
    fasting_required = models.BooleanField(default=False)
    fasting_hours = models.PositiveIntegerField(default=0)
    preparation_instructions = models.TextField(blank=True, null=True)
    report_time_hours = models.PositiveIntegerField(default=48)
    
    home_collection_available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.code} - {self.name}"

    @property
    def discount_percentage(self):
        if self.total_value > 0:
            discount = ((self.total_value - self.package_price) / self.total_value) * 100
            return round(discount, 1)
        return 0


class LabTestBooking(models.Model):
    """Lab test booking/order made by patients"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('SAMPLE_COLLECTED', 'Sample Collected'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('REFUNDED', 'Refunded'),
    ]
    
    COLLECTION_TYPE_CHOICES = [
        ('HOME', 'Home Collection'),
        ('LAB', 'Lab Visit'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    ]
    
    # Booking reference
    booking_id = models.CharField(max_length=20, unique=True, editable=False)
    
    # Patient and Lab
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='lab_test_bookings'
    )
    lab = models.ForeignKey(
        Lab,
        on_delete=models.SET_NULL,
        null=True,
        related_name='bookings'
    )
    
    # Tests or Package
    tests = models.ManyToManyField(LabTest, related_name='bookings', blank=True)
    package = models.ForeignKey(
        LabTestPackage,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='bookings'
    )
    
    # Collection details
    collection_type = models.CharField(
        max_length=10,
        choices=COLLECTION_TYPE_CHOICES,
        default='HOME'
    )
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    
    # Home collection address
    collection_address = models.TextField(blank=True, null=True)
    collection_city = models.CharField(max_length=100, blank=True, null=True)
    collection_pincode = models.CharField(max_length=10, blank=True, null=True)
    collection_landmark = models.CharField(max_length=200, blank=True, null=True)
    
    # Patient details for this booking
    patient_name = models.CharField(max_length=100)
    patient_age = models.PositiveIntegerField()
    patient_gender = models.CharField(
        max_length=10,
        choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('OTHER', 'Other')]
    )
    patient_phone = models.CharField(max_length=15)
    
    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    home_collection_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='PENDING'
    )
    payment_id = models.CharField(max_length=100, blank=True, null=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )
    
    # Sample collection tracking
    sample_collected_at = models.DateTimeField(null=True, blank=True)
    sample_collector_name = models.CharField(max_length=100, blank=True, null=True)
    
    # Notes
    patient_notes = models.TextField(blank=True, null=True)
    admin_notes = models.TextField(blank=True, null=True)
    
    # Prescription (if required)
    prescription_image = models.URLField(blank=True, null=True)
    
    # Related consultation (if test was recommended by doctor)
    consultation = models.ForeignKey(
        'consultations.Consultation',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='lab_test_bookings'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking #{self.booking_id} - {self.patient_name}"

    def save(self, *args, **kwargs):
        if not self.booking_id:
            # Generate unique booking ID
            import uuid
            self.booking_id = f"LTB{timezone.now().strftime('%Y%m%d')}{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)


class LabTestResult(models.Model):
    """Test results for completed bookings"""
    booking = models.ForeignKey(
        LabTestBooking,
        on_delete=models.CASCADE,
        related_name='results'
    )
    test = models.ForeignKey(
        LabTest,
        on_delete=models.SET_NULL,
        null=True,
        related_name='results'
    )
    
    # Result details
    result_data = models.JSONField(null=True, blank=True)  # Structured result data
    result_summary = models.TextField(blank=True, null=True)
    
    # Result file
    report_file_url = models.URLField(blank=True, null=True)
    
    # Status
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('READY', 'Ready'),
        ('DELIVERED', 'Delivered'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    # Interpretation
    is_normal = models.BooleanField(null=True, blank=True)
    interpretation = models.TextField(blank=True, null=True)
    doctor_remarks = models.TextField(blank=True, null=True)
    
    # Verified by
    verified_by = models.CharField(max_length=100, blank=True, null=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Result for {self.test.name if self.test else 'Unknown'} - Booking #{self.booking.booking_id}"


class LabReview(models.Model):
    """Reviews for labs by patients"""
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name='reviews')
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lab_reviews')
    booking = models.OneToOneField(
        LabTestBooking,
        on_delete=models.CASCADE,
        related_name='review',
        null=True,
        blank=True
    )
    
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    
    # Specific ratings
    sample_collection_rating = models.PositiveIntegerField(
        choices=[(i, i) for i in range(1, 6)],
        null=True,
        blank=True
    )
    report_accuracy_rating = models.PositiveIntegerField(
        choices=[(i, i) for i in range(1, 6)],
        null=True,
        blank=True
    )
    timeliness_rating = models.PositiveIntegerField(
        choices=[(i, i) for i in range(1, 6)],
        null=True,
        blank=True
    )
    
    comment = models.TextField(blank=True, null=True)
    
    # Response from lab
    lab_response = models.TextField(blank=True, null=True)
    lab_response_at = models.DateTimeField(null=True, blank=True)
    
    is_verified = models.BooleanField(default=False)  # Verified purchase
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('lab', 'booking')
        ordering = ['-created_at']

    def __str__(self):
        return f"Review for {self.lab.name} by {self.patient.email}"


class LabTimeSlot(models.Model):
    """Available time slots for lab visits and home collection"""
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name='time_slots')
    
    SLOT_TYPE_CHOICES = [
        ('HOME', 'Home Collection'),
        ('LAB', 'Lab Visit'),
        ('BOTH', 'Both'),
    ]
    slot_type = models.CharField(max_length=10, choices=SLOT_TYPE_CHOICES, default='BOTH')
    
    day_of_week = models.PositiveIntegerField(choices=[
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ])
    
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    max_bookings = models.PositiveIntegerField(default=10)  # Max bookings per slot
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['day_of_week', 'start_time']
        unique_together = ('lab', 'slot_type', 'day_of_week', 'start_time')

    def __str__(self):
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        return f"{self.lab.name} - {days[self.day_of_week]} {self.start_time}-{self.end_time}"


class LabTestCart(models.Model):
    """Shopping cart for lab tests"""
    patient = models.OneToOneField(User, on_delete=models.CASCADE, related_name='lab_test_cart')
    tests = models.ManyToManyField(LabTest, related_name='in_carts', blank=True)
    packages = models.ManyToManyField(LabTestPackage, related_name='in_carts', blank=True)
    selected_lab = models.ForeignKey(Lab, on_delete=models.SET_NULL, null=True, blank=True, related_name='carts')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.patient.email}"

    @property
    def total_items(self):
        return self.tests.count() + self.packages.count()

    @property
    def total_amount(self):
        # If a lab is selected, use that lab's offering prices
        if self.selected_lab:
            offering_prices = {}
            for offering in LabTestOffering.objects.filter(lab=self.selected_lab, is_available=True):
                offering_prices[offering.test_id] = offering.discounted_price or offering.price
            
            test_total = 0
            for test in self.tests.all():
                if test.id in offering_prices:
                    test_total += offering_prices[test.id]
                else:
                    test_total += test.effective_price
        else:
            test_total = sum(test.effective_price for test in self.tests.all())
        
        package_total = sum(pkg.package_price for pkg in self.packages.all())
        return test_total + package_total


class LabProviderProfile(models.Model):
    """Profile for Lab Service Providers - links User to Lab"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='lab_provider_profile')
    lab = models.OneToOneField(Lab, on_delete=models.CASCADE, related_name='provider_profile')
    
    # Provider details
    full_name = models.CharField(max_length=100)
    designation = models.CharField(max_length=100, blank=True, null=True)  # e.g., Owner, Manager
    
    # Contact
    contact_phone = models.CharField(max_length=15)
    alternate_phone = models.CharField(max_length=15, blank=True, null=True)
    
    # Business details
    license_number = models.CharField(max_length=100, unique=True)
    license_expiry = models.DateField(null=True, blank=True)
    gst_number = models.CharField(max_length=20, blank=True, null=True)
    
    # Documents (URLs)
    license_document = models.URLField(blank=True, null=True)
    registration_certificate = models.URLField(blank=True, null=True)
    
    # Status
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} - {self.lab.name}"


class LabTestOffering(models.Model):
    """Tests offered by a specific lab with their pricing"""
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name='test_offerings')
    test = models.ForeignKey(LabTest, on_delete=models.CASCADE, related_name='lab_offerings')
    
    # Lab-specific pricing (overrides base test price)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Lab-specific details
    report_time_hours = models.PositiveIntegerField(null=True, blank=True)  # Override default
    is_available = models.BooleanField(default=True)
    
    # Home collection for this test at this lab
    home_collection_available = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('lab', 'test')
        ordering = ['test__name']

    def __str__(self):
        return f"{self.lab.name} - {self.test.name}"

    @property
    def effective_price(self):
        return self.discounted_price if self.discounted_price else self.price
