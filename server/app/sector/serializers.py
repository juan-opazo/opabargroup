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

    def create(self, validated_data):
        """Create a new sector instance"""
        owner_id = self.context['request'].user.id
        sector = Sector.objects.create(owner_id=owner_id, **validated_data)
        return sector


class SectorDetailSerializer(SectorSerializer):
    """Serializers for sector details."""

    class Meta(SectorSerializer.Meta):
        fields = SectorSerializer.Meta.fields
