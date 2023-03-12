"""
URL mappings for the sector app
"""
from django.urls import (
    path,
    include,
)

from rest_framework.routers import DefaultRouter

from sector import views


router = DefaultRouter()
router.register('sectors', views.SectorViewSet)

app_name = 'sector'

urlpatterns = [
    path('', include(router.urls)),
]
