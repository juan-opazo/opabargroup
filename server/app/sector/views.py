"""
Views for the sector APIs
"""
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Sector
from sector import serializers


class SectorViewSet(viewsets.ModelViewSet):
    """View for manage sector APIs"""
    serializer_class = serializers.SectorDetailSerializer
    queryset = Sector.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve sectors for authenticated user"""
        return self. queryset.filter(owner=self.request.user).order_by('-id')

    def get_serializer_class(self):
        """Return the serializer class for request"""
        if self.action == 'list':
            return serializers.SectorSerializer

        return self.serializer_class

    def perform_create_serializer(self):
        """Create a new recipe"""
        serializers.save(owner=self.request.user)
