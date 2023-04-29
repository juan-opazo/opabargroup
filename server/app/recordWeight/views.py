"""
Views for the sector APIs
"""
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import RecordWeight
from recordWeight import serializers


class RecordWeightViewSet(viewsets.ModelViewSet):
    """View for manage recordWeight APIs"""
    serializer_class = serializers.RecordWeightDetailSerializer
    queryset = RecordWeight.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve record weights for authenticated user"""
        registration_weight_id = self.request.GET.get('reg-weight')
        queryset = self.queryset\
            .filter(registration__sector__owner=self.request.user)

        if registration_weight_id:
            queryset = queryset.filter(registration__id=registration_weight_id)

        return queryset.order_by('-id')

    def get_serializer_class(self):
        """Return the serializer class for request"""
        if self.action == 'list':
            return serializers.RecordWeightSerializer

        return self.serializer_class

    def perform_create_serializer(self):
        """Create a new record weight"""
        serializer = serializers\
            .RecordWeightSerializer(data=self.request.data, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(registration__sector__owner=self.request.user)
