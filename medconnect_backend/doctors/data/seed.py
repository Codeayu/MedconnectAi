"""
Seed script to populate dummy Indian doctor data.

Usage:
    python manage.py shell -c "from doctors.data.seed import seed_doctors; seed_doctors()"
"""

import random
from datetime import time
from faker import Faker
from accounts.models import User
from doctors.models import DoctorProfile

fake = Faker('en_IN')

INDIAN_FIRST_NAMES_MALE = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan",
    "Krishna", "Ishaan", "Shaurya", "Atharva", "Advait", "Arnav", "Dhruv", "Kabir",
    "Ritvik", "Anirudh", "Rohan", "Harsh", "Vikram", "Manish", "Rajesh", "Suresh",
    "Amit", "Nikhil", "Pranav", "Siddharth", "Karthik", "Varun",
]

INDIAN_FIRST_NAMES_FEMALE = [
    "Ananya", "Diya", "Myra", "Aadhya", "Aarohi", "Anvi", "Amaira", "Pari",
    "Saanvi", "Anika", "Kavya", "Isha", "Riya", "Neha", "Priya", "Sneha",
    "Meera", "Pooja", "Swati", "Divya", "Shreya", "Tanvi", "Nandini", "Pallavi",
    "Anjali", "Deepika", "Lakshmi", "Shalini", "Bhavana", "Kriti",
]

INDIAN_LAST_NAMES = [
    "Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Reddy", "Nair",
    "Iyer", "Rao", "Mehta", "Joshi", "Desai", "Chatterjee", "Banerjee", "Mukherjee",
    "Pillai", "Menon", "Kulkarni", "Patil", "Agarwal", "Bhat", "Kapoor", "Malhotra",
    "Saxena", "Tiwari", "Pandey", "Mishra", "Chauhan", "Thakur",
]

INDIAN_CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune",
    "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Bhopal", "Kochi",
    "Coimbatore", "Indore", "Nagpur", "Thiruvananthapuram", "Visakhapatnam",
    "Mangalore", "Mysore",
]

SPECIALIZATIONS = [
    'GENERAL', 'CARDIOLOGY', 'DERMATOLOGY', 'NEUROLOGY', 'ORTHOPEDICS',
    'PEDIATRICS', 'PSYCHIATRY', 'GYNECOLOGY', 'ENT', 'OPHTHALMOLOGY', 'DENTAL',
]

BIO_TEMPLATES = [
    "Experienced {spec} with {exp} years of practice in {city}. Dedicated to providing compassionate and evidence-based care.",
    "Passionate {spec} based in {city}, specializing in advanced treatments with {exp} years of clinical experience.",
    "Board-certified {spec} practicing in {city} for over {exp} years. Committed to patient-centric healthcare.",
    "Renowned {spec} in {city} with {exp} years of expertise. Known for thorough diagnosis and personalized treatment plans.",
    "Senior {spec} at a leading hospital in {city}. {exp} years of experience in both clinical and research settings.",
    "Highly skilled {spec} from {city} with a track record of {exp} years. Focuses on preventive care and holistic wellness.",
]

SPEC_DISPLAY = {
    'GENERAL': 'General Physician',
    'CARDIOLOGY': 'Cardiologist',
    'DERMATOLOGY': 'Dermatologist',
    'NEUROLOGY': 'Neurologist',
    'ORTHOPEDICS': 'Orthopedic Surgeon',
    'PEDIATRICS': 'Pediatrician',
    'PSYCHIATRY': 'Psychiatrist',
    'GYNECOLOGY': 'Gynecologist',
    'ENT': 'ENT Specialist',
    'OPHTHALMOLOGY': 'Ophthalmologist',
    'DENTAL': 'Dentist',
}

FEE_RANGES = {
    'GENERAL': (300, 800),
    'CARDIOLOGY': (800, 2000),
    'DERMATOLOGY': (500, 1500),
    'NEUROLOGY': (800, 2000),
    'ORTHOPEDICS': (600, 1800),
    'PEDIATRICS': (400, 1200),
    'PSYCHIATRY': (800, 2000),
    'GYNECOLOGY': (500, 1500),
    'ENT': (500, 1200),
    'OPHTHALMOLOGY': (500, 1500),
    'DENTAL': (400, 1200),
}

AVAILABLE_DAY_COMBOS = [
    "Mon,Tue,Wed,Thu,Fri",
    "Mon,Tue,Wed,Thu,Fri,Sat",
    "Mon,Wed,Fri",
    "Tue,Thu,Sat",
    "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
]


def generate_indian_phone():
    """Generate a random Indian mobile number."""
    prefix = random.choice(["70", "72", "73", "74", "75", "76", "77", "78", "79",
                            "80", "81", "82", "83", "84", "85", "86", "87", "88", "89",
                            "90", "91", "92", "93", "94", "95", "96", "97", "98", "99"])
    return f"+91{prefix}{random.randint(10000000, 99999999)}"


def generate_license_number(state_code=None):
    """Generate a realistic-looking Indian medical license number."""
    states = ["MH", "DL", "KA", "TN", "AP", "KL", "WB", "GJ", "RJ", "UP", "MP", "HR", "PB"]
    state = state_code or random.choice(states)
    year = random.randint(2005, 2023)
    num = random.randint(10000, 99999)
    return f"{state}/{year}/{num}"


def seed_doctors(count=30, password="doctor@123"):
    """
    Create `count` dummy doctor profiles with Indian names and details.

    Args:
        count: Number of doctors to create (default 30).
        password: Default password for all seeded doctor accounts.
    """
    created = 0

    for i in range(count):
        is_female = random.random() < 0.4
        if is_female:
            first_name = random.choice(INDIAN_FIRST_NAMES_FEMALE)
        else:
            first_name = random.choice(INDIAN_FIRST_NAMES_MALE)

        last_name = random.choice(INDIAN_LAST_NAMES)
        base_name = f"{first_name} {last_name}"
        full_name = f"Dr. {base_name}"

        email = f"dr.{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}@medconnect.in"
        phone = generate_indian_phone()

        # Ensure unique email & phone
        if User.objects.filter(email=email).exists() or User.objects.filter(phone=phone).exists():
            continue

        specialization = random.choice(SPECIALIZATIONS)
        experience = random.randint(2, 30)
        city = random.choice(INDIAN_CITIES)
        fee_low, fee_high = FEE_RANGES[specialization]
        fee = round(random.randint(fee_low, fee_high), -1)  # round to nearest 10

        bio = random.choice(BIO_TEMPLATES).format(
            spec=SPEC_DISPLAY[specialization],
            exp=experience,
            city=city,
        )

        # Random working hours
        start_hour = random.choice([8, 9, 10])
        end_hour = random.choice([17, 18, 19, 20, 21])
        available_from = time(start_hour, 0)
        available_to = time(end_hour, 0)
        available_days = random.choice(AVAILABLE_DAY_COMBOS)

        # Create User
        user = User.objects.create_user(
            email=email,
            phone=phone,
            password=password,
            role="DOCTOR",
        )

        # Create DoctorProfile
        DoctorProfile.objects.create(
            user=user,
            full_name=full_name,
            specialization=specialization,
            license_number=generate_license_number(),
            bio=bio,
            experience_years=experience,
            consultation_fee=fee,
            is_approved=True,
            is_active=True,
            is_online=random.choice([True, False]),
            available_from=available_from,
            available_to=available_to,
            available_days=available_days,
        )

        created += 1
        print(f"[{created}] Created {full_name} - {SPEC_DISPLAY[specialization]}")

    print(f"\nDone! {created} doctors seeded successfully.")
