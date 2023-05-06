"""
URL mappings for the sector app
"""
from django.urls import (
    path,
    include,
)

from rest_framework.routers import DefaultRouter

from soilAnalysis import views


router = DefaultRouter()
router.register('soilAnalysis', views.SoilAnalysisViewSet)

app_name = 'soilAnalysis'

urlpatterns = [
    path('', include(router.urls)),
]
