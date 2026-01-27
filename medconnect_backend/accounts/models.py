from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)
from .constants import UserRole


class UserManager(BaseUserManager):
    def create_user(self, email, phone, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        if not phone:
            raise ValueError("Phone is required")

        email = self.normalize_email(email)
        user = self.model(email=email, phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", UserRole.ADMIN)

        return self.create_user(email, phone, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)

    role = models.CharField(
        max_length=10,
        choices=UserRole.CHOICES,
        default=UserRole.PATIENT
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["phone"]

    def __str__(self):
        return f"{self.email} ({self.role})"
