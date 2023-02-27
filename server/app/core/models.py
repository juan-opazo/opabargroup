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


class Stock(models.Model):
    """Stock to be used for investments"""
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=15)
    owners = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='UserStock'
    )

    def __str__(self):
        return self.name


class UserStock(models.Model):
    """Stock per user"""
    stock = models.ForeignKey(
        'Stock',
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    shares = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=False,
        null=False
    )

    def __str__(self):
        return self.stock.name


class Investment(models.Model):
    """Investment by user"""
    CASH = 'CA'
    FACTORING = 'FA'
    STOCK = 'ST'
    TYPE_CHOICES = [
        (CASH, 'Cash'),
        (FACTORING, 'Factoring'),
        (STOCK, 'Stocks'),
    ]
    date = models.DateField(blank=False, null=False)
    amount = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=False,
        null=False
    )
    type = models.CharField(
        max_length=2,
        choices=TYPE_CHOICES,
        blank=False,
        null=False
    )
    stock = models.ForeignKey(
        'Stock',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
