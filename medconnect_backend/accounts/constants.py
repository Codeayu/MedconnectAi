class UserRole:
    PATIENT = 'PATIENT'
    DOCTOR = 'DOCTOR'
    ADMIN = 'ADMIN'

    CHOICES = [
        (PATIENT, 'Patient'),
        (DOCTOR, 'Doctor'),
        (ADMIN, 'Admin'),
    ]