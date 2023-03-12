"""
Serializers for sector APIs
"""
from rest_framework import serializers

from core.models import Sector


class SectorSerializer(serializers.ModelSerializer):
    """Serializer for sectors."""

    class Meta:
        model = Sector
        fields = ['id', 'name', 'area', 'crop']
        read_only_fields = ['id']


class SectorDetailSerializer(SectorSerializer):
    """Serializers for sector details."""

    class Meta(SectorSerializer.Meta):
        fields = SectorSerializer.Meta.fields
