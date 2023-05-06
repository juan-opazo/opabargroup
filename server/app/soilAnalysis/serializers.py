"""
Serializers for sector APIs
"""
from rest_framework import serializers

from core.models import SoilAnalysis


class SoilAnalysisSerializer(serializers.ModelSerializer):
    """Serializer for soil anaylisis."""

    class Meta:
        model = SoilAnalysis
        # fields = ['id', 'date_created', 'area', 'crop']
        fields = '__all__'
        read_only_fields = ['id']

    def create(self, validated_data):
        """Create a new soilAnalysis instance"""
        owner_id = self.context['request'].user.id
        soil_analysis = SoilAnalysis.objects.create(owner_id=owner_id, **validated_data)
        return soil_analysis


class SoilAnalysisDetailSerializer(SoilAnalysisSerializer):
    """Serializers for soilAnalysis details."""

    class Meta(SoilAnalysisSerializer.Meta):
        fields = SoilAnalysisSerializer.Meta.fields
