"""
User models
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.common.models import TimeStampedModel


class User(AbstractUser):
    """
    Custom user model
    """
    email = models.EmailField(unique=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    is_verified = models.BooleanField(default=False, verbose_name="Vérifié")
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"


class UserProfile(TimeStampedModel):
    """
    Extended user profile
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, verbose_name="Biographie")
    avatar = models.ImageField(upload_to='avatars/', blank=True, verbose_name="Avatar")
    birth_date = models.DateField(null=True, blank=True, verbose_name="Date de naissance")
    address = models.TextField(blank=True, verbose_name="Adresse")

    class Meta:
        verbose_name = "Profil utilisateur"
        verbose_name_plural = "Profils utilisateurs"

    def __str__(self):
        return f"Profil de {self.user.username}"