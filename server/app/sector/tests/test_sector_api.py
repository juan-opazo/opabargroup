"""
Tests for sector APIs.
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import Sector

from sector.serializers import SectorSerializer

SECTORS_URL = reverse('sector:sector-list')


def create_sector(owner, **params):
    """Create and return a sample sector"""
    defaults = {
        'name': 'Sector A',
        'area': 10.2,
        'crop': 'PASS',
    }
    defaults.update(params)

    sector = Sector.objects.create(owner=owner, **defaults)
    return sector


class PublicSectorAPITests(TestCase):
    """Test unauthenticated API requests"""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test auth is required to call API"""
        res = self.client.get(SECTORS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateSectorAPITests(TestCase):
    """Test authenticated API requests"""
    def setUp(self):
        self.client = APIClient()
        self.owner = get_user_model().objects.create_user(
            'test',
            'thisisnotthepassword'
        )
        self.client.force_authenticate(self.owner)

    def test_retrieve_sectors(self):
        """Test retrieving user sectors"""
        create_sector(owner=self.owner)
        create_sector(owner=self.owner)

        res = self.client.get(SECTORS_URL)
        sectors = Sector.objects.all().order_by('-id')
        serializer = SectorSerializer(sectors, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_sector_list_limited_to_user(self):
        """Test list of sectors is limited to authenticated user"""
        other_owner = get_user_model().objects.create_user(
            'othertestuser',
            'thisisnotthepassword'
        )
        create_sector(owner=other_owner)
        create_sector(owner=self.owner)

        res = self.client.get(SECTORS_URL)
        sectors = Sector.objects.filter(owner=self.owner)
        serializer = SectorSerializer(sectors, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)
