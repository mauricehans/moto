"""
User serializers
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    User serializer
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'is_verified']
        read_only_fields = ['id', 'is_verified']


class UserProfileSerializer(serializers.ModelSerializer):
    """
    User profile serializer
    """
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'avatar', 'birth_date', 'address', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    User registration serializer
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user