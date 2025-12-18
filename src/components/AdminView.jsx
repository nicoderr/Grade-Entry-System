import React, { useState, useEffect } from 'react';
import { studentsAPI, subjectsAPI } from '../services/api';
import GradeEditor from './GradeEditor';
import { usersAPI } from '../services/api';

function AdminView({ user, onLogout }) {
  const [view, setView] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');

  useEffect(() => {
    if (view === 'students') {
      loadStudents();
    } else if (view === 'subjects') {
      loadSubjects();
    } else if (view === 'users') {
      loadUsers();
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

  const loadSubjects = async () => {
    try {
      const response = await subjectsAPI.getAll();
      setSubjects(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;
    try {
      await subjectsAPI.create(newSubject);
      setNewSubject('');
      loadSubjects();
      alert('Subject added successfully!');
    } catch (err) {
      alert('Failed to add subject');
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await subjectsAPI.delete(subjectId);
      loadSubjects();
      alert('Subject deleted successfully!');
    } catch (err) {
      alert('Failed to delete subject');
    }
  };

  const handleAddUser = async () => {
  if (!newFullName.trim() || !newUserEmail.trim() || !newUserName.trim() || !newPassword.trim())
    return;

  try {
    await usersAPI.create({
      full_name: newFullName,
      email: newUserEmail,
      role: newUserRole,
      username: newUserName,
      password: newPassword,
    });

    setNewFullName('');
    setNewUserEmail('');
    setNewUserRole('student');
    setNewUserName('');
    setNewPassword('');

    loadUsers();
    alert('User added successfully!');
  } catch (err) {
    alert('Failed to add user');
  }
};

const handleDeleteUser = async (userId) => {
  if (!window.confirm('Are you sure you want to delete this user?')) return;

  try {
    await usersAPI.delete(userId);
    await loadUsers();
    alert('User deleted successfully!');
  } catch (err) {
    console.error('Delete user error:', err.response?.data || err.message);
    alert('Failed to delete user: ' + (err.response?.data?.detail || err.message));
  }
};

if (view === 'users') {
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
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Manage Users
          </span>
        </div>
        <button className="btn btn-primary" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Add User */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>Add New User</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            placeholder="Full name"
            style={{ flex: 1 }}
          />
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Username"
            style={{ flex: 1 }}
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Password"
            style={{ flex: 1 }}
          />
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="Email"
            style={{ flex: 1 }}
          />
          <select
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn btn-success" onClick={handleAddUser}>
            Add User
          </button>
        </div>
      </div>

      <div className="card">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => handleDeleteUser(u.user_id)}
                    >
                      Remove User
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

  if(view === 'viewGrades' && selectedStudent) {
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

  if (view === 'subjects') {
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
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Manage Subjects</span>
          </div>
          <button className="btn btn-primary" onClick={onLogout}>Logout</button>
        </div>
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Add New Subject</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Subject name"
              style={{ flex: 1 }}
            />
            <button className="btn btn-success" onClick={handleAddSubject}>
              Add Subject
            </button>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>Current Subjects</h3>
          <table>
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.subject_id}>
                  <td>{subject.subject_name}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => handleDeleteSubject(subject.subject_id)}
                    >
                      Delete
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
        <h2>Admin Dashboard</h2>
        <button className="btn btn-primary" onClick={onLogout}>Logout</button>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => setView('students')}>
          <h3>Manage Grades</h3>
          <p style={{ marginTop: '10px', color: '#666' }}>View and edit student grades</p>
        </div>
        <div className="dashboard-card" onClick={() => setView('subjects')}>
          <h3>Manage Subjects</h3>
          <p style={{ marginTop: '10px', color: '#666' }}>Add or remove subjects</p>
        </div>
          <div className="dashboard-card" onClick={() => setView('users')}>
        <h3>Manage Users</h3>
        <p style={{ marginTop: '10px', color: '#666' }}>
          Add and view users
        </p>
      </div>
      </div>
    </div>
  );
}

export default AdminView;