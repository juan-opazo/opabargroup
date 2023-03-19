"""
Views for the sector APIs
"""
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import RegistrationWeight
from registrationWeight import serializers


class RegistrationWeightViewSet(viewsets.ModelViewSet):
    """View for manage registrationWeight APIs"""
    serializer_class = serializers.RegistrationWeightDetailSerializer
    queryset = RegistrationWeight.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve registration weights for authenticated user"""
        return self.queryset\
            .filter(sector__owner=self.request.user)\
            .order_by('-id')

    def get_serializer_class(self):
        """Return the serializer class for request"""
        if self.action == 'list':
            return serializers.RegistrationWeightSerializer

        return self.serializer_class

    def perform_create_serializer(self):
        """Create a new registration weight"""
        serializers.save(sector__owner=self.request.user)
