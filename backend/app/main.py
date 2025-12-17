from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, crud
from .database import get_db

app = FastAPI(title="Grade Entry System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to check role permissions
def check_permission(current_user: models.User, allowed_roles: List[str]):
    if current_user.role not in allowed_roles:
        raise HTTPException(status_code=403, detail="Not enough permissions")

def create_user_if_not_exists(db: Session, full_name: str, email: str, role: str, username: str, password: str):
    user = crud.get_user_by_email(db, email)
    if not user:
        user = crud.create_user(db, schemas.UserCreate(
            full_name=full_name,
            email=email,
            role=role,
            username=username,
            password=password))
    return user

# Authentication endpoint
@app.post("/api/auth/login", response_model=schemas.UserResponse)
def login(user_login: schemas.UserLogin, db: Session = Depends(get_db)):
    print("LOGIN INPUT:", user_login.username, user_login.password)
    user = crud.get_user_by_credentials(
        db, user_login.username, user_login.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return user

# Students endpoints
@app.get("/api/students", response_model=List[schemas.UserResponse])
def list_students(user_id: int, db: Session = Depends(get_db)):
    # Verify user has permission (teacher or admin)
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    check_permission(user, ['admin', 'teacher'])
    
    return crud.get_all_students(db)

# Grades endpoints
@app.get("/api/grades/my-grades", response_model=schemas.StudentGradesResponse)
def get_my_grades(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user or user.role != 'student':
        raise HTTPException(status_code=403, detail="Only students can view their own grades")
    
    grades = crud.get_student_grades(db, user_id)
    return {
        "student": user,
        "grades": grades
    }

@app.get("/api/grades/student/{student_id}", response_model=schemas.StudentGradesResponse)
def get_student_grades(student_id: int, user_id: int, db: Session = Depends(get_db)):
    # Verify user has permission (teacher or admin)
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    check_permission(user, ['admin', 'teacher'])
    
    student = crud.get_student_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    grades = crud.get_student_grades(db, student_id)
    return {
        "student": student,
        "grades": grades
    }

@app.put("/api/grades/student/{student_id}/subject/{subject_id}")
def update_student_grade(
    student_id: int,
    subject_id: int,
    grade_update: schemas.GradeUpdate,
    user_id: int,
    db: Session = Depends(get_db)
):
    # Verify user has permission (teacher or admin)
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    check_permission(user, ['admin', 'teacher'])
    
    grade = crud.update_grade(db, student_id, subject_id, grade_update.grade_value)
    return {"message": "Grade updated successfully"}

# Subjects endpoints
@app.get("/api/subjects", response_model=List[schemas.SubjectResponse])
def list_subjects(db: Session = Depends(get_db)):
    return crud.get_all_subjects(db)

@app.post("/api/subjects", response_model=schemas.SubjectResponse)
def add_subject(subject: schemas.SubjectBase, user_id: int, db: Session = Depends(get_db)):
    # Verify user is admin
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    check_permission(user, ['admin'])
    
    return crud.create_subject(db, subject.subject_name)

@app.delete("/api/subjects/{subject_id}")
def remove_subject(subject_id: int, user_id: int, db: Session = Depends(get_db)):
    # Verify user is admin
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    check_permission(user, ['admin'])
    
    if crud.delete_subject(db, subject_id):
        return {"message": "Subject deleted successfully"}
    raise HTTPException(status_code=404, detail="Subject not found")

@app.post("/api/users", response_model=schemas.UserResponse)
def create_user(user_create: schemas.UserCreate, user_id: int=Query(...), db: Session = Depends(get_db)):
    # Verify user is admin
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    check_permission(user, ['admin'])

    existing_user = crud.get_user_by_email(db, user_create.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    return crud.create_user(db, user_create)

@app.get("/api/users", response_model=List[schemas.UserResponse])
def list_users(user_id: int, db: Session = Depends(get_db)):
    # Verify user is admin
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    check_permission(user, ['admin'])
    
    return db.query(models.User).all()

@app.delete("/api/users/{delete_user_id}")
def delete_user(delete_user_id: int, user_id: int, db: Session = Depends(get_db)):
    # Verify user is admin
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    check_permission(user, ['admin'])
    
    if crud.delete_user(db, delete_user_id):
        return {"message": "User deleted successfully"}
    raise HTTPException(status_code=404, detail="User not found")

@app.get("/")
def root():
    return {"message": "Grade Entry System API"}