"""
Application Constants

Centralized definitions for user roles and permission levels.
All role strings and role lists should be referenced from this module.
"""

# ============================================================================
# USER ROLES
# ============================================================================

class UserRole:
    """User role constants"""
    ADMIN = 'admin'
    TEACHER = 'teacher'
    STUDENT = 'student'


# ============================================================================
# PERMISSION GROUPS
# ============================================================================

# Admin only
ADMIN_ONLY = [UserRole.ADMIN]

# Teacher and Admin
TEACHER_AND_ADMIN = [UserRole.ADMIN, UserRole.TEACHER]

# Student only
STUDENT_ONLY = [UserRole.STUDENT]

# All roles
ALL_ROLES = [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]
