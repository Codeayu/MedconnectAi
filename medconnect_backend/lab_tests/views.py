from django.utils import timezone
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status

from .models import (
    LabTestCategory, Lab, LabTest, LabTestPackage,
    LabTestBooking, LabTestResult, LabReview, LabTimeSlot, LabTestCart,
    LabProviderProfile, LabTestOffering
)
from .serializers import (
    LabTestCategorySerializer, LabListSerializer, LabDetailSerializer,
    LabTestListSerializer, LabTestDetailSerializer,
    LabTestPackageListSerializer, LabTestPackageDetailSerializer,
    LabTimeSlotSerializer, CreateBookingSerializer,
    LabTestBookingListSerializer, LabTestBookingDetailSerializer,
    UpdateBookingStatusSerializer, CancelBookingSerializer,
    LabTestResultSerializer, CreateResultSerializer,
    LabReviewSerializer, CreateReviewSerializer,
    LabTestCartSerializer, AddToCartSerializer, RemoveFromCartSerializer,
    LabTestOfferingSerializer
)
from accounts.permissions import IsPatient, IsAdmin
from consultations.models import Consultation


# ========================
# Category Views
# ========================
class LabTestCategoryListView(APIView):
    """List all active lab test categories"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        categories = LabTestCategory.objects.filter(is_active=True)
        serializer = LabTestCategorySerializer(categories, many=True)
        return Response(serializer.data)


# ========================
# Lab Views
# ========================
class LabListView(APIView):
    """List all active and verified labs with filtering"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        labs = Lab.objects.filter(is_active=True, is_verified=True)
        
        # Filter by city
        city = request.query_params.get('city')
        if city:
            labs = labs.filter(city__iexact=city)
        
        # Filter by home collection
        home_collection = request.query_params.get('home_collection')
        if home_collection and home_collection.lower() == 'true':
            labs = labs.filter(offers_home_collection=True)
        
        # Filter by certification
        nabl = request.query_params.get('nabl_certified')
        if nabl and nabl.lower() == 'true':
            labs = labs.filter(is_nabl_certified=True)
        
        # Search by name
        search = request.query_params.get('search')
        if search:
            labs = labs.filter(name__icontains=search)
        
        serializer = LabListSerializer(labs, many=True)
        return Response(serializer.data)


class LabDetailView(APIView):
    """Get lab details including available tests"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, lab_id):
        try:
            lab = Lab.objects.get(id=lab_id, is_active=True, is_verified=True)
            serializer = LabDetailSerializer(lab)
            return Response(serializer.data)
        except Lab.DoesNotExist:
            return Response(
                {"error": "Lab not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class LabReviewsView(APIView):
    """Get reviews for a lab"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, lab_id):
        try:
            lab = Lab.objects.get(id=lab_id)
            reviews = LabReview.objects.filter(lab=lab).order_by('-created_at')
            serializer = LabReviewSerializer(reviews, many=True)
            return Response({
                "average_rating": lab.average_rating,
                "total_reviews": lab.total_reviews,
                "reviews": serializer.data
            })
        except Lab.DoesNotExist:
            return Response(
                {"error": "Lab not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# ========================
# Lab Test Views
# ========================
class LabTestListView(APIView):
    """List all lab tests with filtering"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        tests = LabTest.objects.filter(is_active=True)
        
        # Filter by category
        category_id = request.query_params.get('category')
        if category_id:
            tests = tests.filter(category_id=category_id)
        
        # Filter by sample type
        sample_type = request.query_params.get('sample_type')
        if sample_type:
            tests = tests.filter(sample_type=sample_type.upper())
        
        # Filter popular tests
        popular = request.query_params.get('popular')
        if popular and popular.lower() == 'true':
            tests = tests.filter(is_popular=True)
        
        # Filter by home collection
        home_collection = request.query_params.get('home_collection')
        if home_collection and home_collection.lower() == 'true':
            tests = tests.filter(home_collection_available=True)
        
        # Price range filter
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        if min_price:
            tests = tests.filter(base_price__gte=min_price)
        if max_price:
            tests = tests.filter(base_price__lte=max_price)
        
        # Search by name or code
        search = request.query_params.get('search')
        if search:
            tests = tests.filter(
                Q(name__icontains=search) | Q(code__icontains=search)
            )
        
        serializer = LabTestListSerializer(tests, many=True)
        return Response(serializer.data)


class LabTestDetailView(APIView):
    """Get lab test details"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, test_id):
        try:
            test = LabTest.objects.get(id=test_id, is_active=True)
            serializer = LabTestDetailSerializer(test)
            return Response(serializer.data)
        except LabTest.DoesNotExist:
            return Response(
                {"error": "Test not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class PopularTestsView(APIView):
    """Get popular lab tests"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        tests = LabTest.objects.filter(is_active=True, is_popular=True)[:10]
        serializer = LabTestListSerializer(tests, many=True)
        return Response(serializer.data)


# ========================
# Package Views
# ========================
class LabTestPackageListView(APIView):
    """List all health check packages"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        packages = LabTestPackage.objects.filter(is_active=True)
        
        # Filter featured
        featured = request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            packages = packages.filter(is_featured=True)
        
        # Filter by gender
        gender = request.query_params.get('gender')
        if gender:
            packages = packages.filter(
                Q(target_gender='ALL') | Q(target_gender=gender.upper())
            )
        
        # Search
        search = request.query_params.get('search')
        if search:
            packages = packages.filter(name__icontains=search)
        
        serializer = LabTestPackageListSerializer(packages, many=True)
        return Response(serializer.data)


class LabTestPackageDetailView(APIView):
    """Get package details with included tests"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, package_id):
        try:
            package = LabTestPackage.objects.get(id=package_id, is_active=True)
            serializer = LabTestPackageDetailSerializer(package)
            return Response(serializer.data)
        except LabTestPackage.DoesNotExist:
            return Response(
                {"error": "Package not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class FeaturedPackagesView(APIView):
    """Get featured health packages"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        packages = LabTestPackage.objects.filter(is_active=True, is_featured=True)[:6]
        serializer = LabTestPackageListSerializer(packages, many=True)
        return Response(serializer.data)


# ========================
# Booking Views
# ========================
class CreateBookingView(APIView):
    """Create a new lab test booking"""
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request):
        serializer = CreateBookingSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            cart = LabTestCart.objects.filter(patient=request.user).first()
            requested_test_ids = data.get('test_ids') or []
            requested_package_id = data.get('package_id')

            cart_test_ids = set(cart.tests.values_list('id', flat=True)) if cart else set()
            cart_package_ids = set(cart.packages.values_list('id', flat=True)) if cart else set()
            is_cart_booking = bool(cart) and (
                (requested_test_ids and set(requested_test_ids).issubset(cart_test_ids)) or
                (requested_package_id and requested_package_id in cart_package_ids)
            )

            lab_id = data['lab_id']
            if is_cart_booking and cart and cart.selected_lab_id:
                lab_id = cart.selected_lab_id
            
            try:
                # Get lab - allow verified labs OR labs with approved providers
                lab = Lab.objects.filter(
                    Q(id=lab_id, is_active=True, is_verified=True) |
                    Q(id=lab_id, is_active=True, provider_profile__is_approved=True)
                ).distinct().first()
                
                if not lab:
                    raise Lab.DoesNotExist()
            except Lab.DoesNotExist:
                return Response(
                    {"error": "Lab not found or not available"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Calculate pricing
            subtotal = 0
            tests_list = []
            package = None
            
            if data.get('test_ids'):
                tests_list = LabTest.objects.filter(
                    id__in=data['test_ids'],
                    is_active=True
                )
                if not tests_list.exists():
                    return Response(
                        {"error": "One or more tests not found"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if tests_list.count() != len(set(data['test_ids'])):
                    return Response(
                        {"error": "One or more tests not found"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                unavailable_test_names = []
                # Use lab-specific pricing from LabTestOffering if available
                for test in tests_list:
                    offering = LabTestOffering.objects.filter(
                        lab=lab,
                        test=test,
                        is_available=True
                    ).first()
                    if not offering:
                        unavailable_test_names.append(test.name)
                        continue
                    subtotal += offering.effective_price

                if unavailable_test_names:
                    return Response(
                        {
                            "error": "Selected lab does not offer one or more tests",
                            "tests": unavailable_test_names,
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            if data.get('package_id'):
                try:
                    package = LabTestPackage.objects.get(
                        id=data['package_id'],
                        is_active=True
                    )
                    subtotal += package.package_price
                except LabTestPackage.DoesNotExist:
                    return Response(
                        {"error": "Package not found"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Calculate home collection fee
            home_collection_fee = 0
            if data['collection_type'] == 'HOME' and lab.offers_home_collection:
                home_collection_fee = lab.home_collection_fee
            
            total_amount = subtotal + home_collection_fee
            
            # Get related consultation if provided
            consultation = None
            if data.get('consultation_id'):
                try:
                    consultation = Consultation.objects.get(
                        id=data['consultation_id'],
                        patient=request.user
                    )
                except Consultation.DoesNotExist:
                    pass
            
            # Create booking
            booking = LabTestBooking.objects.create(
                patient=request.user,
                lab=lab,
                package=package,
                collection_type=data['collection_type'],
                scheduled_date=data['scheduled_date'],
                scheduled_time=data['scheduled_time'],
                collection_address=data.get('collection_address', ''),
                collection_city=data.get('collection_city', ''),
                collection_pincode=data.get('collection_pincode', ''),
                collection_landmark=data.get('collection_landmark', ''),
                patient_name=data['patient_name'],
                patient_age=data['patient_age'],
                patient_gender=data['patient_gender'],
                patient_phone=data['patient_phone'],
                subtotal=subtotal,
                home_collection_fee=home_collection_fee,
                total_amount=total_amount,
                patient_notes=data.get('patient_notes', ''),
                prescription_image=data.get('prescription_image', ''),
                consultation=consultation,
                status='PENDING'
            )
            
            # Add tests to booking
            if tests_list:
                booking.tests.set(tests_list)

            if is_cart_booking and cart:
                cart.tests.clear()
                cart.packages.clear()
                cart.selected_lab = None
                cart.save(update_fields=['selected_lab', 'updated_at'])
            
            return Response(
                LabTestBookingDetailSerializer(booking).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatientBookingsView(APIView):
    """Get patient's lab test bookings"""
    permission_classes = [IsAuthenticated, IsPatient]

    def get(self, request):
        bookings = LabTestBooking.objects.filter(patient=request.user)
        
        # Filter by status
        status_filter = request.query_params.get('status')
        if status_filter:
            bookings = bookings.filter(status=status_filter.upper())
        
        bookings = bookings.order_by('-created_at')
        serializer = LabTestBookingListSerializer(bookings, many=True)
        return Response(serializer.data)


class BookingDetailView(APIView):
    """Get booking details"""
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
        try:
            # Patients can only see their own bookings
            if hasattr(request.user, 'patient_profile') or request.user.role == 'PATIENT':
                booking = LabTestBooking.objects.get(
                    Q(id=booking_id) | Q(booking_id=booking_id),
                    patient=request.user
                )
            else:
                # Admin can see all bookings
                booking = LabTestBooking.objects.get(
                    Q(id=booking_id) | Q(booking_id=booking_id)
                )
            
            serializer = LabTestBookingDetailSerializer(booking)
            return Response(serializer.data)
        except LabTestBooking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class CancelBookingView(APIView):
    """Cancel a booking"""
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request, booking_id):
        try:
            booking = LabTestBooking.objects.get(
                Q(id=booking_id) | Q(booking_id=booking_id),
                patient=request.user
            )
            
            # Can only cancel pending or confirmed bookings
            if booking.status not in ['PENDING', 'CONFIRMED']:
                return Response(
                    {"error": "Cannot cancel booking in current status"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = CancelBookingSerializer(data=request.data)
            if serializer.is_valid():
                booking.status = 'CANCELLED'
                booking.cancelled_at = timezone.now()
                booking.cancellation_reason = serializer.validated_data['cancellation_reason']
                booking.save()
                
                return Response({
                    "message": "Booking cancelled successfully",
                    "booking": LabTestBookingDetailSerializer(booking).data
                })
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except LabTestBooking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class RescheduleBookingView(APIView):
    """Reschedule a booking"""
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request, booking_id):
        try:
            booking = LabTestBooking.objects.get(
                Q(id=booking_id) | Q(booking_id=booking_id),
                patient=request.user
            )
            
            # Can only reschedule pending or confirmed bookings
            if booking.status not in ['PENDING', 'CONFIRMED']:
                return Response(
                    {"error": "Cannot reschedule booking in current status"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            new_date = request.data.get('scheduled_date')
            new_time = request.data.get('scheduled_time')
            
            if not new_date or not new_time:
                return Response(
                    {"error": "Both scheduled_date and scheduled_time are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            from datetime import datetime
            try:
                new_date = datetime.strptime(new_date, '%Y-%m-%d').date()
                new_time = datetime.strptime(new_time, '%H:%M').time()
            except ValueError:
                return Response(
                    {"error": "Invalid date/time format. Use YYYY-MM-DD for date and HH:MM for time"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if new_date < timezone.now().date():
                return Response(
                    {"error": "Cannot schedule in the past"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            booking.scheduled_date = new_date
            booking.scheduled_time = new_time
            booking.save()
            
            return Response({
                "message": "Booking rescheduled successfully",
                "booking": LabTestBookingDetailSerializer(booking).data
            })
            
        except LabTestBooking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# ========================
# Admin Booking Management
# ========================
class AdminBookingsListView(APIView):
    """Admin view for all bookings"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        bookings = LabTestBooking.objects.all()
        
        # Filter by status
        status_filter = request.query_params.get('status')
        if status_filter:
            bookings = bookings.filter(status=status_filter.upper())
        
        # Filter by lab
        lab_id = request.query_params.get('lab_id')
        if lab_id:
            bookings = bookings.filter(lab_id=lab_id)
        
        # Filter by date range
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')
        if from_date:
            bookings = bookings.filter(scheduled_date__gte=from_date)
        if to_date:
            bookings = bookings.filter(scheduled_date__lte=to_date)
        
        bookings = bookings.order_by('-created_at')
        serializer = LabTestBookingListSerializer(bookings, many=True)
        return Response(serializer.data)


class UpdateBookingStatusView(APIView):
    """Admin: Update booking status"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, booking_id):
        try:
            booking = LabTestBooking.objects.get(
                Q(id=booking_id) | Q(booking_id=booking_id)
            )
            
            serializer = UpdateBookingStatusSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.validated_data
                new_status = data['status']
                
                booking.status = new_status
                
                if data.get('admin_notes'):
                    booking.admin_notes = data['admin_notes']
                
                if new_status == 'SAMPLE_COLLECTED':
                    booking.sample_collected_at = timezone.now()
                    if data.get('sample_collector_name'):
                        booking.sample_collector_name = data['sample_collector_name']
                
                if new_status == 'COMPLETED':
                    booking.completed_at = timezone.now()
                
                if new_status == 'CANCELLED':
                    booking.cancelled_at = timezone.now()
                    if data.get('cancellation_reason'):
                        booking.cancellation_reason = data['cancellation_reason']
                
                booking.save()
                
                return Response({
                    "message": f"Booking status updated to {new_status}",
                    "booking": LabTestBookingDetailSerializer(booking).data
                })
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except LabTestBooking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class UpdatePaymentStatusView(APIView):
    """Admin: Update payment status"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, booking_id):
        try:
            booking = LabTestBooking.objects.get(
                Q(id=booking_id) | Q(booking_id=booking_id)
            )
            
            payment_status = request.data.get('payment_status')
            if payment_status not in ['PENDING', 'PAID', 'FAILED', 'REFUNDED']:
                return Response(
                    {"error": "Invalid payment status"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            booking.payment_status = payment_status
            
            if request.data.get('payment_id'):
                booking.payment_id = request.data['payment_id']
            if request.data.get('payment_method'):
                booking.payment_method = request.data['payment_method']
            
            booking.save()
            
            return Response({
                "message": f"Payment status updated to {payment_status}",
                "booking": LabTestBookingDetailSerializer(booking).data
            })
            
        except LabTestBooking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# ========================
# Result Views
# ========================
class BookingResultsView(APIView):
    """Get results for a booking"""
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
        try:
            if hasattr(request.user, 'patient_profile') or request.user.role == 'PATIENT':
                booking = LabTestBooking.objects.get(
                    Q(id=booking_id) | Q(booking_id=booking_id),
                    patient=request.user
                )
            else:
                booking = LabTestBooking.objects.get(
                    Q(id=booking_id) | Q(booking_id=booking_id)
                )
            
            results = LabTestResult.objects.filter(booking=booking)
            serializer = LabTestResultSerializer(results, many=True)
            return Response(serializer.data)
            
        except LabTestBooking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class AddResultView(APIView):
    """Admin: Add test result"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, booking_id):
        try:
            booking = LabTestBooking.objects.get(
                Q(id=booking_id) | Q(booking_id=booking_id)
            )
            
            serializer = CreateResultSerializer(data=request.data)
            if serializer.is_valid():
                result = serializer.save(booking=booking)
                
                # If verified, set verified timestamp
                if result.verified_by:
                    result.verified_at = timezone.now()
                    result.save()
                
                return Response(
                    LabTestResultSerializer(result).data,
                    status=status.HTTP_201_CREATED
                )
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except LabTestBooking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class UpdateResultView(APIView):
    """Admin: Update test result"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def put(self, request, result_id):
        try:
            result = LabTestResult.objects.get(id=result_id)
            
            serializer = CreateResultSerializer(result, data=request.data, partial=True)
            if serializer.is_valid():
                result = serializer.save()
                
                if result.verified_by and not result.verified_at:
                    result.verified_at = timezone.now()
                    result.save()
                
                return Response(LabTestResultSerializer(result).data)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except LabTestResult.DoesNotExist:
            return Response(
                {"error": "Result not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# ========================
# Review Views
# ========================
class CreateLabReviewView(APIView):
    """Create a review for a lab"""
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request):
        serializer = CreateReviewSerializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.validated_data.get('booking')
            
            # Verify the booking belongs to the patient
            if booking and booking.patient != request.user:
                return Response(
                    {"error": "You can only review your own bookings"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if review already exists
            if booking and LabReview.objects.filter(booking=booking).exists():
                return Response(
                    {"error": "Review already exists for this booking"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            review = serializer.save(
                patient=request.user,
                is_verified=booking is not None and booking.status == 'COMPLETED'
            )
            
            return Response(
                LabReviewSerializer(review).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ========================
# Cart Views
# ========================
class CartView(APIView):
    """Get and manage cart"""
    permission_classes = [IsAuthenticated, IsPatient]

    def get(self, request):
        cart, _ = LabTestCart.objects.get_or_create(patient=request.user)
        serializer = LabTestCartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    """Add test or package to cart"""
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            cart, _ = LabTestCart.objects.get_or_create(patient=request.user)
            
            # Handle lab_id - set selected lab if provided
            lab_id = serializer.validated_data.get('lab_id')
            if lab_id:
                try:
                    lab = Lab.objects.get(id=lab_id, is_active=True)
                    # If cart has a different lab, clear it first
                    if cart.selected_lab and cart.selected_lab.id != lab_id:
                        cart.tests.clear()
                        cart.packages.clear()
                    cart.selected_lab = lab
                    cart.save()
                except Lab.DoesNotExist:
                    pass
            
            if serializer.validated_data.get('test_id'):
                try:
                    test = LabTest.objects.get(
                        id=serializer.validated_data['test_id'],
                        is_active=True
                    )
                    cart.tests.add(test)
                except LabTest.DoesNotExist:
                    return Response(
                        {"error": "Test not found"},
                        status=status.HTTP_404_NOT_FOUND
                    )
            
            if serializer.validated_data.get('package_id'):
                try:
                    package = LabTestPackage.objects.get(
                        id=serializer.validated_data['package_id'],
                        is_active=True
                    )
                    cart.packages.add(package)
                except LabTestPackage.DoesNotExist:
                    return Response(
                        {"error": "Package not found"},
                        status=status.HTTP_404_NOT_FOUND
                    )
            
            return Response({
                "message": "Item added to cart",
                "cart": LabTestCartSerializer(cart).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RemoveFromCartView(APIView):
    """Remove test or package from cart"""
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request):
        serializer = RemoveFromCartSerializer(data=request.data)
        if serializer.is_valid():
            try:
                cart = LabTestCart.objects.get(patient=request.user)
            except LabTestCart.DoesNotExist:
                return Response(
                    {"error": "Cart not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            if serializer.validated_data.get('test_id'):
                cart.tests.remove(serializer.validated_data['test_id'])
            
            if serializer.validated_data.get('package_id'):
                cart.packages.remove(serializer.validated_data['package_id'])

            if not cart.tests.exists() and not cart.packages.exists() and cart.selected_lab_id is not None:
                cart.selected_lab = None
                cart.save(update_fields=['selected_lab', 'updated_at'])
            
            return Response({
                "message": "Item removed from cart",
                "cart": LabTestCartSerializer(cart).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClearCartView(APIView):
    """Clear all items from cart"""
    permission_classes = [IsAuthenticated, IsPatient]

    def post(self, request):
        try:
            cart = LabTestCart.objects.get(patient=request.user)
            cart.tests.clear()
            cart.packages.clear()
            if cart.selected_lab_id is not None:
                cart.selected_lab = None
                cart.save(update_fields=['selected_lab', 'updated_at'])
            
            return Response({
                "message": "Cart cleared",
                "cart": LabTestCartSerializer(cart).data
            })
        except LabTestCart.DoesNotExist:
            return Response(
                {"error": "Cart not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# ========================
# Time Slot Views
# ========================
class LabTimeSlotsView(APIView):
    """Get available time slots for a lab"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, lab_id):
        try:
            lab = Lab.objects.get(id=lab_id, is_active=True)
            
            slot_type = request.query_params.get('type')  # HOME, LAB, or BOTH
            slots = LabTimeSlot.objects.filter(lab=lab, is_active=True)
            
            if slot_type:
                slots = slots.filter(
                    Q(slot_type=slot_type.upper()) | Q(slot_type='BOTH')
                )
            
            serializer = LabTimeSlotSerializer(slots, many=True)
            return Response(serializer.data)
            
        except Lab.DoesNotExist:
            return Response(
                {"error": "Lab not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# ========================
# Dashboard/Statistics Views
# ========================
class PatientLabTestDashboardView(APIView):
    """Dashboard for patient's lab test activity"""
    permission_classes = [IsAuthenticated, IsPatient]

    def get(self, request):
        bookings = LabTestBooking.objects.filter(patient=request.user)
        
        # Get counts by status
        pending_count = bookings.filter(status='PENDING').count()
        confirmed_count = bookings.filter(status='CONFIRMED').count()
        completed_count = bookings.filter(status='COMPLETED').count()
        
        # Get upcoming bookings
        upcoming = bookings.filter(
            status__in=['PENDING', 'CONFIRMED'],
            scheduled_date__gte=timezone.now().date()
        ).order_by('scheduled_date', 'scheduled_time')[:5]
        
        # Get recent results
        recent_results = LabTestResult.objects.filter(
            booking__patient=request.user,
            status='READY'
        ).order_by('-created_at')[:5]
        
        return Response({
            "statistics": {
                "total_bookings": bookings.count(),
                "pending": pending_count,
                "confirmed": confirmed_count,
                "completed": completed_count
            },
            "upcoming_bookings": LabTestBookingListSerializer(upcoming, many=True).data,
            "recent_results": LabTestResultSerializer(recent_results, many=True).data
        })


class AdminLabTestDashboardView(APIView):
    """Dashboard for admin - lab test statistics"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        bookings = LabTestBooking.objects.all()
        
        # Today's bookings
        today = timezone.now().date()
        today_bookings = bookings.filter(scheduled_date=today)
        
        # Status counts
        status_counts = {
            'pending': bookings.filter(status='PENDING').count(),
            'confirmed': bookings.filter(status='CONFIRMED').count(),
            'sample_collected': bookings.filter(status='SAMPLE_COLLECTED').count(),
            'processing': bookings.filter(status='PROCESSING').count(),
            'completed': bookings.filter(status='COMPLETED').count(),
            'cancelled': bookings.filter(status='CANCELLED').count()
        }
        
        # Revenue stats
        from django.db.models import Sum
        total_revenue = bookings.filter(
            payment_status='PAID'
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # Recent bookings
        recent_bookings = bookings.order_by('-created_at')[:10]
        
        # Pending results
        pending_results = LabTestResult.objects.filter(
            status__in=['PENDING', 'PROCESSING']
        ).count()
        
        return Response({
            "today_bookings": today_bookings.count(),
            "status_counts": status_counts,
            "total_revenue": float(total_revenue),
            "pending_results": pending_results,
            "recent_bookings": LabTestBookingListSerializer(recent_bookings, many=True).data
        })


# ========================
# Lab Provider Views
# ========================
from .models import LabProviderProfile, LabTestOffering
from .serializers import (
    LabProviderRegisterSerializer, LabProviderProfileSerializer,
    LabProviderProfileUpdateSerializer, LabUpdateSerializer,
    LabTestOfferingSerializer, CreateLabTestOfferingSerializer,
    LabProviderBookingSerializer, LabProviderDashboardSerializer
)
from accounts.permissions import IsLabProvider


class LabProviderRegisterView(APIView):
    """Register a new lab service provider"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LabProviderRegisterSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save()
            return Response({
                "message": "Registration successful! Your account is pending approval.",
                "provider_id": profile.id,
                "lab_id": profile.lab.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LabProviderProfileView(APIView):
    """Get and update lab provider profile"""
    permission_classes = [IsAuthenticated, IsLabProvider]

    def get(self, request):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            serializer = LabProviderProfileSerializer(profile)
            return Response(serializer.data)
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            serializer = LabProviderProfileUpdateSerializer(
                profile, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(LabProviderProfileSerializer(profile).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class LabProviderLabUpdateView(APIView):
    """Update lab details by lab provider"""
    permission_classes = [IsAuthenticated, IsLabProvider]

    def get(self, request):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            serializer = LabDetailSerializer(profile.lab)
            return Response(serializer.data)
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            serializer = LabUpdateSerializer(
                profile.lab, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Lab details updated successfully",
                    "lab": LabDetailSerializer(profile.lab).data
                })
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class LabProviderTestOfferingsView(APIView):
    """Manage test offerings for a lab"""
    permission_classes = [IsAuthenticated, IsLabProvider]

    def get(self, request):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            offerings = LabTestOffering.objects.filter(lab=profile.lab)
            serializer = LabTestOfferingSerializer(offerings, many=True)
            return Response(serializer.data)
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            serializer = CreateLabTestOfferingSerializer(data=request.data)
            if serializer.is_valid():
                offering = serializer.save(lab=profile.lab)
                return Response(
                    LabTestOfferingSerializer(offering).data,
                    status=status.HTTP_201_CREATED
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class LabProviderTestOfferingDetailView(APIView):
    """Update or delete a specific test offering"""
    permission_classes = [IsAuthenticated, IsLabProvider]

    def put(self, request, offering_id):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            offering = LabTestOffering.objects.get(id=offering_id, lab=profile.lab)
            serializer = CreateLabTestOfferingSerializer(
                offering, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(LabTestOfferingSerializer(offering).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except LabTestOffering.DoesNotExist:
            return Response(
                {"error": "Test offering not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, offering_id):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            offering = LabTestOffering.objects.get(id=offering_id, lab=profile.lab)
            offering.delete()
            return Response({"message": "Test offering deleted successfully"})
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except LabTestOffering.DoesNotExist:
            return Response(
                {"error": "Test offering not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class LabProviderBookingsView(APIView):
    """View bookings for a lab provider"""
    permission_classes = [IsAuthenticated, IsLabProvider]

    def get(self, request):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            bookings = LabTestBooking.objects.filter(lab=profile.lab)
            
            # Filter by status
            status_filter = request.query_params.get('status')
            if status_filter:
                bookings = bookings.filter(status=status_filter.upper())
            
            # Filter by date range
            from_date = request.query_params.get('from_date')
            to_date = request.query_params.get('to_date')
            if from_date:
                bookings = bookings.filter(scheduled_date__gte=from_date)
            if to_date:
                bookings = bookings.filter(scheduled_date__lte=to_date)
            
            bookings = bookings.order_by('-created_at')
            serializer = LabProviderBookingSerializer(bookings, many=True)
            return Response(serializer.data)
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class LabProviderBookingDetailView(APIView):
    """View and update a specific booking"""
    permission_classes = [IsAuthenticated, IsLabProvider]

    def get(self, request, booking_id):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            booking = LabTestBooking.objects.get(
                Q(id=booking_id) | Q(booking_id=booking_id),
                lab=profile.lab
            )
            serializer = LabProviderBookingSerializer(booking)
            return Response(serializer.data)
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except LabTestBooking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class LabProviderUpdateBookingStatusView(APIView):
    """Lab provider: Update booking status"""
    permission_classes = [IsAuthenticated, IsLabProvider]

    def post(self, request, booking_id):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            booking = LabTestBooking.objects.get(
                Q(id=booking_id) | Q(booking_id=booking_id),
                lab=profile.lab
            )
            
            serializer = UpdateBookingStatusSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.validated_data
                new_status = data['status']
                
                booking.status = new_status
                
                if data.get('admin_notes'):
                    booking.admin_notes = data['admin_notes']
                
                if new_status == 'SAMPLE_COLLECTED':
                    booking.sample_collected_at = timezone.now()
                    if data.get('sample_collector_name'):
                        booking.sample_collector_name = data['sample_collector_name']
                
                if new_status == 'COMPLETED':
                    booking.completed_at = timezone.now()
                
                if new_status == 'CANCELLED':
                    booking.cancelled_at = timezone.now()
                    if data.get('cancellation_reason'):
                        booking.cancellation_reason = data['cancellation_reason']
                
                booking.save()
                
                return Response({
                    "message": f"Booking status updated to {new_status}",
                    "booking": LabProviderBookingSerializer(booking).data
                })
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except LabTestBooking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class LabProviderAddResultView(APIView):
    """Lab provider: Add test result"""
    permission_classes = [IsAuthenticated, IsLabProvider]

    def post(self, request, booking_id):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            booking = LabTestBooking.objects.get(
                Q(id=booking_id) | Q(booking_id=booking_id),
                lab=profile.lab
            )
            
            serializer = CreateResultSerializer(data=request.data)
            if serializer.is_valid():
                result = serializer.save(booking=booking)
                
                if result.verified_by:
                    result.verified_at = timezone.now()
                    result.save()
                
                return Response(
                    LabTestResultSerializer(result).data,
                    status=status.HTTP_201_CREATED
                )
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except LabTestBooking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class LabProviderDashboardView(APIView):
    """Dashboard for lab provider"""
    permission_classes = [IsAuthenticated, IsLabProvider]

    def get(self, request):
        try:
            profile = LabProviderProfile.objects.get(user=request.user)
            lab = profile.lab
            bookings = LabTestBooking.objects.filter(lab=lab)
            
            # Today's bookings
            today = timezone.now().date()
            today_bookings = bookings.filter(scheduled_date=today).count()
            
            # Status counts
            from django.db.models import Sum
            total_revenue = bookings.filter(
                payment_status='PAID'
            ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
            
            # Test offerings count
            total_tests = LabTestOffering.objects.filter(lab=lab).count()
            
            data = {
                "total_bookings": bookings.count(),
                "pending_bookings": bookings.filter(status='PENDING').count(),
                "confirmed_bookings": bookings.filter(status='CONFIRMED').count(),
                "completed_bookings": bookings.filter(status='COMPLETED').count(),
                "cancelled_bookings": bookings.filter(status='CANCELLED').count(),
                "total_revenue": float(total_revenue),
                "today_bookings": today_bookings,
                "total_tests_offered": total_tests,
                "average_rating": lab.average_rating,
                "total_reviews": lab.total_reviews
            }
            
            return Response(data)
            
        except LabProviderProfile.DoesNotExist:
            return Response(
                {"error": "Lab provider profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class LabsWithTestsView(APIView):
    """Get all labs with their test offerings for user selection"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        # Get lab IDs from approved providers
        approved_lab_ids = LabProviderProfile.objects.filter(
            is_approved=True, is_active=True
        ).values_list('lab_id', flat=True)
        
        # Get all labs that are either verified or have approved providers
        labs = Lab.objects.filter(
            Q(is_active=True, is_verified=True) | Q(id__in=approved_lab_ids, is_active=True)
        ).distinct()
        
        # Filter by city
        city = request.query_params.get('city')
        if city:
            labs = labs.filter(city__iexact=city)
        
        # Search by name
        search = request.query_params.get('search')
        if search:
            labs = labs.filter(name__icontains=search)
        
        result = []
        for lab in labs:
            lab_data = LabListSerializer(lab).data
            # Get test offerings for this lab
            offerings = LabTestOffering.objects.filter(lab=lab, is_available=True)
            lab_data['test_offerings'] = LabTestOfferingSerializer(offerings, many=True).data
            lab_data['test_offerings_count'] = offerings.count()
            result.append(lab_data)
        
        return Response(result)


class LabTestsOfferingsByLabView(APIView):
    """Get all tests offered by a specific lab"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, lab_id):
        try:
            # Get lab if it's verified/active OR has an approved provider
            lab = Lab.objects.filter(
                Q(id=lab_id, is_active=True, is_verified=True) |
                Q(id=lab_id, is_active=True, provider_profile__is_approved=True)
            ).distinct().first()
            
            if not lab:
                return Response(
                    {"error": "Lab not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            offerings = LabTestOffering.objects.filter(lab=lab, is_available=True)
            
            # Filter by category
            category_id = request.query_params.get('category')
            if category_id:
                offerings = offerings.filter(test__category_id=category_id)
            
            # Search
            search = request.query_params.get('search')
            if search:
                offerings = offerings.filter(
                    Q(test__name__icontains=search) | Q(test__code__icontains=search)
                )
            
            return Response({
                "lab": LabListSerializer(lab).data,
                "test_offerings": LabTestOfferingSerializer(offerings, many=True).data
            })
        except Lab.DoesNotExist:
            return Response(
                {"error": "Lab not found"},
                status=status.HTTP_404_NOT_FOUND
            )
