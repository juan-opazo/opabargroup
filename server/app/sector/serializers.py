"""
Serializers for sector APIs
"""
from rest_framework import serializers

from core.models import Sector
from sector.exceptions.custom_exceptions import CreatePermissionDeniedException


class SectorSerializer(serializers.ModelSerializer):
    """Serializer for sectors."""

    class Meta:
        model = Sector
        fields = ['id', 'name', 'area', 'crop']
        read_only_fields = ['id']

    def create(self, validated_data):
        """Create a new sector instance"""
        user = self.context['request'].user
        if user.groups.filter(name='colaboradores').exists():
            raise CreatePermissionDeniedException()
        owner_id = user.id
        sector = Sector.objects.create(owner_id=owner_id, **validated_data)
        return sector


class SectorDetailSerializer(SectorSerializer):
    """Serializers for sector details."""

    class Meta(SectorSerializer.Meta):
        fields = SectorSerializer.Meta.fields
