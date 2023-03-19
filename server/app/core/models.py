"""
Database models.
"""
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.conf import settings


class UserManager(BaseUserManager):
    """Manager for users."""

    def create_user(self, username, password=None, **extra_fields):
        """Create, save and return a new user."""
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, password, **extra_fields):
        """Create and return a new superuser."""
        user = self.create_user(username, password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """User in the system."""
    username = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'


class Sector(models.Model):
    """Sector to be used for investments"""

    PASSION_FRUIT = 'PASS'
    MANGO = 'MANG'
    CROP_CHOICES = [
        (PASSION_FRUIT, 'Maracuyá'),
        (MANGO, 'Mango'),
    ]

    name = models.CharField(max_length=255)
    area = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=False,
        null=False
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    crop = models.CharField(
        max_length=4,
        choices=CROP_CHOICES,
        blank=False,
        null=False
    )

    def __str__(self):
        return self.name


class RegistrationWeight(models.Model):
    """Registration for weights"""
    date_created = models.DateField(blank=False, null=False)
    name = models.CharField(max_length=255)
    sector = models.ForeignKey(
        'Sector',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.name


class RecordWeight(models.Model):
    """Record of Registration Weight Table"""
    registration = models.ForeignKey(
        'RegistrationWeight',
        on_delete=models.CASCADE,
    )
    item = models.IntegerField(blank=False, null=False)
    amount = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=False,
        null=False
    )
    box = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=False,
        null=False
    )

    def __str__(self):
        return f"{self.registration.name} - {self.item}"
