"""
Database models.
"""
from datetime import datetime
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.conf import settings
from django.core.validators import (
    MaxValueValidator,
    MinValueValidator
)


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
    date_created = models.DateTimeField(
        blank=False,
        null=False,
        default=datetime.now()
    )
    registration = models.ForeignKey(
        'RegistrationWeight',
        on_delete=models.CASCADE,
    )
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
        return f"{self.registration.name} - ({self.amount}, {self.box})"

class SoilAnalysis(models.Model):
    LIMO = "LIM"
    FRANCO_ARCILLO_LIMOSO = "FRA-ARC-LIM"
    ARCILLO_LIMOSO = "ARC-LIM"
    ARCILLA = "ARC"
    FRANCO_LIMOSO = "FRA-LIM"
    FRANCO_ARCILLOSO = "FRA-ARC"
    FRANCO = "FRA"
    ARCILLO_ARENOSO = "ARC-ARE"
    FRANCO_ARENOSO = "FRA-ARE"
    FRANCO_ARCILLO_ARENOSO = "FRA-ARC-ARE"
    ARENO_FRANCOSO = "ARE-FRA"
    ARENA = "ARE"
    CLASE_TEXTURAL_CHOICES = [
        (LIMO, "Limo"),
        (FRANCO_ARCILLO_LIMOSO, "Franco-Arcillo-Limoso"),
        (ARCILLO_LIMOSO, "Arcillo-Limoso"),
        (ARCILLA, "Arcilla"),
        (FRANCO_LIMOSO, "Franco-Limoso"),
        (FRANCO_ARCILLOSO, "Franco-Arcilloso"),
        (FRANCO, "Franco"),
        (ARCILLO_ARENOSO, "Arcillo-Arenoso"),
        (FRANCO_ARENOSO, "Franco-Arenoso"),
        (FRANCO_ARCILLO_ARENOSO, "Franco-Arcillo-Arenoso"),
        (ARENO_FRANCOSO, "Areno-Francoso"),
        (ARENA, "Arena"),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    sector = models.ForeignKey(
        'Sector',
        on_delete=models.CASCADE,
    )
    date_created  = models.DateTimeField(default=datetime.now)
    ph            = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True,
                        validators=[
                            MinValueValidator(0),
                            MaxValueValidator(14)
                        ]
                    )
    ce            = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True
                    )
    caco3         = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True
                    )
    mo            = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True
                    )
    p             = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True
                    )
    k             = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True
                    )
    arena         = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True,
                        validators=[
                            MinValueValidator(0),
                            MaxValueValidator(100)
                        ]
                    )
    limo          = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True,
                        validators=[
                            MinValueValidator(0),
                            MaxValueValidator(100)
                        ]
                    )
    arcilla       = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True,
                        validators=[
                            MinValueValidator(0),
                            MaxValueValidator(100)
                        ]
                    )
    cic           = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True
                    )
    caMeq         = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True
                    )
    mgMeq         = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True
                    )
    kMeq          = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True
                    )
    naMeq         = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True
                    )
    alMeq         = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True
                    )
    claseTextural = models.CharField(
                        max_length=255, 
                        choices=CLASE_TEXTURAL_CHOICES,
                        blank=True,
                        null=True,
                    )
    sb            = models.DecimalField(
                        max_digits=8,
                        decimal_places=2,
                        blank=True,
                        null=True,
                        validators=[
                            MinValueValidator(0),
                            MaxValueValidator(100)
                        ],
                    )
    
    def __str__(self):
        date_string = self.date_created.strftime('%Y-%m-%d')
        return f"Soil Analysis: {date_string} - {self.sector.name},"