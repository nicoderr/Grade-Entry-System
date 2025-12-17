from sqlalchemy.orm import Session
from sqlalchemy import and_
from . import models

from sqlalchemy import or_, and_

def get_user_by_credentials(db: Session, login: str, password: str):
    print("QUERY LOGIN:", login, password)

    user = (
        db.query(models.User)
        .filter(
            (models.User.username == login) | (models.User.email == login),
            models.User.password == password
        )
        .first()
    )

    print("FOUND USER:", user)
    return user


def create_user(db: Session, user): 
    user = models.User(
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        username=user.username,
        password=user.password
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_all_students(db: Session):
    return db.query(models.User).filter(models.User.role == 'student').all()

def get_student_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(
        and_(models.User.user_id == user_id, models.User.role == 'student')
    ).first()

def get_student_grades(db: Session, student_id: int):
    subjects = db.query(models.Subject).all()
    grades = db.query(models.Grade).filter(models.Grade.student_id == student_id).all()
    
    grade_dict = {g.subject_id: g.grade_value for g in grades}
    grade_id_dict = {g.subject_id: g.grade_id for g in grades}
    
    result = []
    for subject in subjects:
        result.append({
            'grade_id': grade_id_dict.get(subject.subject_id),
            'subject_id': subject.subject_id,
            'subject_name': subject.subject_name,
            'grade_value': grade_dict.get(subject.subject_id)
        })
    
    return result

def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return True
    return False

def update_grade(db: Session, student_id: int, subject_id: int, grade_value: float):
    grade = db.query(models.Grade).filter(
        and_(models.Grade.student_id == student_id, models.Grade.subject_id == subject_id)
    ).first()
    
    if grade:
        grade.grade_value = grade_value
    else:
        grade = models.Grade(student_id=student_id, subject_id=subject_id, grade_value=grade_value)
        db.add(grade)
    
    db.commit()
    db.refresh(grade)
    return grade

def get_all_subjects(db: Session):
    return db.query(models.Subject).all()

def create_subject(db: Session, subject_name: str):
    subject = models.Subject(subject_name=subject_name)
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject

def delete_subject(db: Session, subject_id: int):
    subject = db.query(models.Subject).filter(models.Subject.subject_id == subject_id).first()
    if subject:
        db.delete(subject)
        db.commit()
        return True
    return False