from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    message = 'Admin access required.'
    
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role.upper() == 'ADMIN')
    

class IsDoctor(BasePermission):
    message = 'Doctor access required.'
    
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role.upper() == 'DOCTOR')
    

class IsPatient(BasePermission):
    message = 'Patient access required.'
    
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role.upper() == 'PATIENT')


class IsLabProvider(BasePermission):
    message = 'Lab Provider access required.'
    
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role.upper() == 'LAB_PROVIDER')