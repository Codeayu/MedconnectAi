from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from lab_tests.models import Lab, LabTest, LabTestCart, LabTestOffering


class CreateBookingViewTests(APITestCase):
	def setUp(self):
		self.user = User.objects.create_user(
			email='patient@example.com',
			phone='9999999999',
			password='testpass123',
			role='PATIENT',
		)
		self.client.force_authenticate(self.user)

		self.rohan_lab = Lab.objects.create(
			name='Rohan Pathology Lab',
			address='123 Main Street',
			city='Pune',
			state='Maharashtra',
			pincode='411001',
			phone='9876543210',
			is_active=True,
			is_verified=True,
		)
		self.medlab = Lab.objects.create(
			name='MedLab',
			address='456 Health Avenue',
			city='Pune',
			state='Maharashtra',
			pincode='411002',
			phone='9876500000',
			is_active=True,
			is_verified=True,
		)
		self.test = LabTest.objects.create(
			name='Complete Blood Count',
			code='CBC-001',
			base_price='500.00',
			is_active=True,
		)
		LabTestOffering.objects.create(
			lab=self.rohan_lab,
			test=self.test,
			price='450.00',
			discounted_price='400.00',
			is_available=True,
		)

		self.booking_url = reverse('create-booking')
		self.booking_payload = {
			'lab_id': self.medlab.id,
			'test_ids': [self.test.id],
			'collection_type': 'HOME',
			'scheduled_date': (timezone.now().date() + timedelta(days=1)).isoformat(),
			'scheduled_time': '10:30',
			'collection_address': '221B Baker Street',
			'collection_city': 'Pune',
			'collection_pincode': '411001',
			'collection_landmark': 'Near Park',
			'patient_name': 'Test Patient',
			'patient_age': 30,
			'patient_gender': 'MALE',
			'patient_phone': '9999999999',
			'patient_notes': 'Handle with care',
		}

	def test_booking_uses_selected_cart_lab_instead_of_requested_lab(self):
		cart = LabTestCart.objects.create(patient=self.user, selected_lab=self.rohan_lab)
		cart.tests.add(self.test)

		response = self.client.post(self.booking_url, self.booking_payload, format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['lab']['id'], self.rohan_lab.id)
		self.assertEqual(response.data['lab']['name'], self.rohan_lab.name)

		cart.refresh_from_db()
		self.assertIsNone(cart.selected_lab)
		self.assertEqual(cart.tests.count(), 0)
		self.assertEqual(cart.packages.count(), 0)

	def test_booking_fails_when_selected_lab_does_not_offer_test(self):
		response = self.client.post(self.booking_url, self.booking_payload, format='json')

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(response.data['error'], 'Selected lab does not offer one or more tests')
		self.assertEqual(response.data['tests'], [self.test.name])
