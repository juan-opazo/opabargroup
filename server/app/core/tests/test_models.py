"""
Test for models.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model

from core import models


class ModelTests(TestCase):
    """Test models."""

    def test_create_user_with_username_successful(self):
        """Test creating a user with an username is successful."""
        username = 'test@example.com'
        password = 'thisisnotapassword'
        user = get_user_model().objects.create_user(
            username=username,
            password=password,
        )

        self.assertEqual(user.username, username)
        self.assertTrue(user.check_password(password))

    def test_create_superuser(self):
        """Test creating a superuser."""
        user = get_user_model().objects.create_superuser(
            'root',
            'root',
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_create_stock(self):
        """Test creating a stock."""
        stock = models.Stock.objects.create(name='Alphabet', code='GOOG')
        self.assertEqual(str(stock), stock.name)

    def test_create_user_stock(self):
        """Test creating a stock for a user."""
        stock = models.Stock.objects.create(name='Alphabet', code='GOOG')
        user = get_user_model().objects.create_user(
            username='test',
            password='test',
        )
        user_stock = models.UserStock.objects.create(
            user=user,
            stock=stock,
            shares=3
        )
        self.assertEqual(str(user_stock), stock.name)
