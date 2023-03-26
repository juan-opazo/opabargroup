"""
Serializers for sector APIs
"""
from rest_framework import serializers

from core.models import RecordWeight


class RecordWeightSerializer(serializers.ModelSerializer):
    """Serializer for record weights."""

    class Meta:
        model = RecordWeight
        fields = ['id', 'date_created', 'amount', 'box', 'registration']
        read_only_fields = ['id']


class RecordWeightDetailSerializer(RecordWeightSerializer):
    """Serializers for RecordWeight details."""

    class Meta(RecordWeightSerializer.Meta):
        fields = RecordWeightSerializer.Meta.fields


class RecordWeightListSerializer(serializers.Serializer):
    """Serializer for a list of record weights."""

    records = RecordWeightSerializer(many=True)

    def create(self, validated_data):
        records_data = validated_data.pop('records')
        records = [RecordWeight(**record_data) for record_data in records_data]
        return RecordWeight.objects.bulk_create(records)
