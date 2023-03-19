"""
Serializers for sector APIs
"""
from rest_framework import serializers

from core.models import RegistrationWeight


class RegistrationWeightSerializer(serializers.ModelSerializer):
    """Serializer for registration weights."""

    class Meta:
        model = RegistrationWeight
        fields = ['id', 'name', 'date_created', 'sector']
        read_only_fields = ['id']


class RegistrationWeightDetailSerializer(RegistrationWeightSerializer):
    """Serializers for RegistrationWeight details."""

    class Meta(RegistrationWeightSerializer.Meta):
        fields = RegistrationWeightSerializer.Meta.fields
