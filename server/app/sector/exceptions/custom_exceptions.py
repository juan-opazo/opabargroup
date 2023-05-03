from rest_framework import status
from rest_framework.exceptions import APIException


class CreatePermissionDeniedException(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'No tiene permisos para crear campos.'
    default_code = 'permission_denied'
