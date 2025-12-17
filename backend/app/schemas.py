from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    user_id: int
    username: str
    full_name: str
    email: str
    role: str
    
    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    subject_name: str

class SubjectResponse(BaseModel):
    subject_id: int
    subject_name: str
    
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    role: str  # 'student', 'teacher', 'admin'
    username: str
    password: str
    
class GradeUpdate(BaseModel):
    grade_value: Optional[str]

class GradeResponse(BaseModel):
    grade_id: Optional[int] = None
    subject_id: int
    subject_name: str
    grade_value: Optional[str]
    
    class Config:
        from_attributes = True

class StudentGradesResponse(BaseModel):
    student: UserResponse
    grades: List[GradeResponse]