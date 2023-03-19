"""
URL mappings for the sector app
"""
from django.urls import (
    path,
    include,
)

from rest_framework.routers import DefaultRouter

from registrationWeight import views


router = DefaultRouter()
router.register('registrationWeights', views.RegistrationWeightViewSet)

app_name = 'registrationWeight'

urlpatterns = [
    path('', include(router.urls)),
]
