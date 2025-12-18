from pydantic import BaseModel, EmailStr
from typing import Optional, List

# User schemas for authentication and management
class UserLogin(BaseModel):
    username: str
    password: str

# User response schema returning user details
class UserResponse(BaseModel):
    user_id: int
    username: str
    full_name: str
    email: str
    role: str
    
    class Config:
        from_attributes = True

# Subject schemas for subject management #

# schema for creating a new subject
class SubjectBase(BaseModel):
    subject_name: str

# schema for subject response
class SubjectResponse(BaseModel):
    subject_id: int
    subject_name: str
    
    class Config:
        from_attributes = True

# user creation schema
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    role: str  # 'student', 'teacher', 'admin'
    username: str
    password: str
    

    # Grade schemas for grade management #
    # schema for updating or creating a grade
class GradeUpdate(BaseModel):
    grade_value: Optional[str]

# schema for grade response
class GradeResponse(BaseModel):
    grade_id: Optional[int] = None
    subject_id: int
    subject_name: str
    grade_value: Optional[str]
    
    class Config:
        from_attributes = True

# schema for student grades response
class StudentGradesResponse(BaseModel):
    student: UserResponse
    grades: List[GradeResponse]