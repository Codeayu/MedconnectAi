from django.urls import path
from .views import (
    # Categories
    LabTestCategoryListView,
    
    # Labs
    LabListView,
    LabDetailView,
    LabReviewsView,
    LabTimeSlotsView,
    
    # Tests
    LabTestListView,
    LabTestDetailView,
    PopularTestsView,
    
    # Packages
    LabTestPackageListView,
    LabTestPackageDetailView,
    FeaturedPackagesView,
    
    # Bookings - Patient
    CreateBookingView,
    PatientBookingsView,
    BookingDetailView,
    CancelBookingView,
    RescheduleBookingView,
    
    # Bookings - Admin
    AdminBookingsListView,
    UpdateBookingStatusView,
    UpdatePaymentStatusView,
    
    # Results
    BookingResultsView,
    AddResultView,
    UpdateResultView,
    
    # Reviews
    CreateLabReviewView,
    
    # Cart
    CartView,
    AddToCartView,
    RemoveFromCartView,
    ClearCartView,
    
    # Dashboard
    PatientLabTestDashboardView,
    AdminLabTestDashboardView,
    
    # Lab Provider
    LabProviderRegisterView,
    LabProviderProfileView,
    LabProviderLabUpdateView,
    LabProviderTestOfferingsView,
    LabProviderTestOfferingDetailView,
    LabProviderBookingsView,
    LabProviderBookingDetailView,
    LabProviderUpdateBookingStatusView,
    LabProviderAddResultView,
    LabProviderDashboardView,
    LabsWithTestsView,
    LabTestsOfferingsByLabView,
)

urlpatterns = [
    # ========================
    # Categories
    # ========================
    path("categories/", LabTestCategoryListView.as_view(), name="lab-test-categories"),
    
    # ========================
    # Labs
    # ========================
    path("labs/", LabListView.as_view(), name="lab-list"),
    path("labs/<int:lab_id>/", LabDetailView.as_view(), name="lab-detail"),
    path("labs/<int:lab_id>/reviews/", LabReviewsView.as_view(), name="lab-reviews"),
    path("labs/<int:lab_id>/time-slots/", LabTimeSlotsView.as_view(), name="lab-time-slots"),
    
    # ========================
    # Tests
    # ========================
    path("tests/", LabTestListView.as_view(), name="lab-test-list"),
    path("tests/popular/", PopularTestsView.as_view(), name="popular-tests"),
    path("tests/<int:test_id>/", LabTestDetailView.as_view(), name="lab-test-detail"),
    
    # ========================
    # Packages
    # ========================
    path("packages/", LabTestPackageListView.as_view(), name="lab-package-list"),
    path("packages/featured/", FeaturedPackagesView.as_view(), name="featured-packages"),
    path("packages/<int:package_id>/", LabTestPackageDetailView.as_view(), name="lab-package-detail"),
    
    # ========================
    # Bookings - Patient
    # ========================
    path("bookings/", PatientBookingsView.as_view(), name="patient-bookings"),
    path("bookings/create/", CreateBookingView.as_view(), name="create-booking"),
    path("bookings/<str:booking_id>/", BookingDetailView.as_view(), name="booking-detail"),
    path("bookings/<str:booking_id>/cancel/", CancelBookingView.as_view(), name="cancel-booking"),
    path("bookings/<str:booking_id>/reschedule/", RescheduleBookingView.as_view(), name="reschedule-booking"),
    path("bookings/<str:booking_id>/results/", BookingResultsView.as_view(), name="booking-results"),
    
    # ========================
    # Bookings - Admin
    # ========================
    path("admin/bookings/", AdminBookingsListView.as_view(), name="admin-bookings-list"),
    path("admin/bookings/<str:booking_id>/status/", UpdateBookingStatusView.as_view(), name="update-booking-status"),
    path("admin/bookings/<str:booking_id>/payment/", UpdatePaymentStatusView.as_view(), name="update-payment-status"),
    path("admin/bookings/<str:booking_id>/results/add/", AddResultView.as_view(), name="add-result"),
    path("admin/results/<int:result_id>/", UpdateResultView.as_view(), name="update-result"),
    
    # ========================
    # Reviews
    # ========================
    path("reviews/create/", CreateLabReviewView.as_view(), name="create-lab-review"),
    
    # ========================
    # Cart
    # ========================
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/add/", AddToCartView.as_view(), name="add-to-cart"),
    path("cart/remove/", RemoveFromCartView.as_view(), name="remove-from-cart"),
    path("cart/clear/", ClearCartView.as_view(), name="clear-cart"),
    
    # ========================
    # Dashboard
    # ========================
    path("dashboard/", PatientLabTestDashboardView.as_view(), name="patient-lab-dashboard"),
    path("admin/dashboard/", AdminLabTestDashboardView.as_view(), name="admin-lab-dashboard"),
    
    # ========================
    # Lab Provider Registration & Auth
    # ========================
    path("provider/register/", LabProviderRegisterView.as_view(), name="lab-provider-register"),
    path("provider/profile/", LabProviderProfileView.as_view(), name="lab-provider-profile"),
    path("provider/lab/", LabProviderLabUpdateView.as_view(), name="lab-provider-lab-update"),
    
    # ========================
    # Lab Provider Test Offerings Management
    # ========================
    path("provider/offerings/", LabProviderTestOfferingsView.as_view(), name="lab-provider-offerings"),
    path("provider/offerings/<int:offering_id>/", LabProviderTestOfferingDetailView.as_view(), name="lab-provider-offering-detail"),
    
    # ========================
    # Lab Provider Booking Management
    # ========================
    path("provider/bookings/", LabProviderBookingsView.as_view(), name="lab-provider-bookings"),
    path("provider/bookings/<str:booking_id>/", LabProviderBookingDetailView.as_view(), name="lab-provider-booking-detail"),
    path("provider/bookings/<str:booking_id>/status/", LabProviderUpdateBookingStatusView.as_view(), name="lab-provider-update-status"),
    path("provider/bookings/<str:booking_id>/results/add/", LabProviderAddResultView.as_view(), name="lab-provider-add-result"),
    
    # ========================
    # Lab Provider Dashboard
    # ========================
    path("provider/dashboard/", LabProviderDashboardView.as_view(), name="lab-provider-dashboard"),
    
    # ========================
    # Labs with Tests (User View)
    # ========================
    path("labs-with-tests/", LabsWithTestsView.as_view(), name="labs-with-tests"),
    path("labs/<int:lab_id>/tests/", LabTestsOfferingsByLabView.as_view(), name="lab-tests-by-lab"),
]
