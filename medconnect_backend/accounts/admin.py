from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'phone', 'role', 'is_active', 'is_staff', 'is_verified', 'created_at')
    list_filter = ('role', 'is_active', 'is_staff', 'is_verified', 'created_at')
    search_fields = ('email', 'phone')
    ordering = ('-created_at',)
    list_editable = ('is_active', 'is_verified')
    
    fieldsets = (
        (None, {'fields': ('email', 'phone', 'password')}),
        ('Role & Status', {'fields': ('role', 'is_active', 'is_verified')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'role', 'password1', 'password2'),
        }),
    )
    
    actions = ['verify_users', 'unverify_users', 'activate_users', 'deactivate_users']
    
    def verify_users(self, request, queryset):
        count = queryset.update(is_verified=True)
        self.message_user(request, f"{count} user(s) verified.")
    verify_users.short_description = "✅ Verify selected users"
    
    def unverify_users(self, request, queryset):
        count = queryset.update(is_verified=False)
        self.message_user(request, f"{count} user(s) unverified.")
    unverify_users.short_description = "❌ Unverify selected users"
    
    def activate_users(self, request, queryset):
        count = queryset.update(is_active=True)
        self.message_user(request, f"{count} user(s) activated.")
    activate_users.short_description = "🟢 Activate selected users"
    
    def deactivate_users(self, request, queryset):
        count = queryset.update(is_active=False)
        self.message_user(request, f"{count} user(s) deactivated.")
    deactivate_users.short_description = "🔴 Deactivate selected users"
