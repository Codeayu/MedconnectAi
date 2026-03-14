class UserRole:
    PATIENT = 'PATIENT'
    DOCTOR = 'DOCTOR'
    LAB_PROVIDER = 'LAB_PROVIDER'
    ADMIN = 'ADMIN'

    CHOICES = [
        (PATIENT, 'Patient'),
        (DOCTOR, 'Doctor'),
        (LAB_PROVIDER, 'Lab Provider'),
        (ADMIN, 'Admin'),
    ]