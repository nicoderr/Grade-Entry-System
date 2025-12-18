import React, { useState, useEffect } from 'react';
import { studentsAPI } from '../services/api';
import GradeEditor from './GradeEditor';

function TeacherView({onLogout }) {
  const [view, setView] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (view === 'students') {
      loadStudents();
    }
  }, [view]);

  const loadStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      setStudents(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (view === 'editGrades' && selectedStudent) {
    return (
      <GradeEditor
        student={selectedStudent}
        onBack={() => {
          setSelectedStudent(null);
          setView('students');
        }}
        onLogout={onLogout}
      />
    );
  }

  if (view === 'viewGrades' && selectedStudent) {
    return (
      <GradeEditor
        student={selectedStudent}
        readOnly={true}
        onBack={() => {
          setSelectedStudent(null);
          setView('students');
        }}
        onLogout={onLogout}
      />
    );
  }

  if (view === 'students') {
    return (
      <div className="container">
        <div className="header">
          <div>
            <button 
              className="btn btn-primary" 
              onClick={() => setView('dashboard')}
              style={{ marginRight: '15px' }}
            >
              ← Back
            </button>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Manage Student Grades</span>
          </div>
          <button className="btn btn-primary" onClick={onLogout}>Logout</button>
        </div>
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.user_id}>
                  <td>{student.full_name}</td>
                  <td>{student.email}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => {
                        setSelectedStudent(student);
                        setView('editGrades');
                      }}
                    >
                      Edit Grades
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px', marginLeft: '10px' }}
                      onClick={() => {
                        setSelectedStudent(student);
                        setView('viewGrades');
                      }}
                    >
                      View Grades
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Teacher Dashboard</h2>
        <button className="btn btn-primary" onClick={onLogout}>Logout</button>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => setView('students')}>
          <h3>Manage Grades</h3>
          <p style={{ marginTop: '10px', color: '#666' }}>View and edit student grades</p>
        </div>
      </div>
    </div>
  );
}

export default TeacherView;