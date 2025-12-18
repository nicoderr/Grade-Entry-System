
#Centralized definitions for user roles and permission groups

# user roles
class UserRole:
  # user role constant
    ADMIN = 'admin'
    TEACHER = 'teacher'
    STUDENT = 'student'

# permission groups
# Admin only
ADMIN_ONLY = [UserRole.ADMIN]

# Teacher and Admin
TEACHER_AND_ADMIN = [UserRole.ADMIN, UserRole.TEACHER]

# Student only
STUDENT_ONLY = [UserRole.STUDENT]

# All roles
ALL_ROLES = [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]
