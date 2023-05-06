"""
Views for the soil analysis APIs
"""
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import SoilAnalysis
from soilAnalysis import serializers


class SoilAnalysisViewSet(viewsets.ModelViewSet):
    """View for manage soil analysis APIs"""
    serializer_class = serializers.SoilAnalysisDetailSerializer
    queryset = SoilAnalysis.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve soil analysiss for authenticated user"""
        return self.queryset.filter(owner=self.request.user).order_by('-id')

    def get_serializer_class(self):
        """Return the serializer class for request"""
        if self.action == 'list':
            return serializers.SoilAnalysisSerializer

        return self.serializer_class

    def perform_create_serializer(self):
        """Create a new soil analysis"""
        serializers.save(owner=self.request.user)
