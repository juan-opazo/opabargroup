"""
URL mappings for the sector app
"""
from django.urls import (
    path,
    include,
)

from rest_framework.routers import DefaultRouter

from recordWeight import views


router = DefaultRouter()
router.register('recordWeights', views.RecordWeightViewSet)

app_name = 'recordWeight'

urlpatterns = [
    path('', include(router.urls)),
]
