import React, { useState, useEffect } from 'react';
import { gradesAPI } from '../services/api';

function StudentView({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  //load student grades
  useEffect(() => {
    loadGrades();
  }, []);

  //function to fetch grades
  const loadGrades = async () => {
    try {
      const response = await gradesAPI.getMyGrades();
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load grades');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container"><div className="error">{error}</div></div>;

  //render student grades view
  return (
    <div className="container">
      <div className="header">
        <h2>My Grades - {data.student.full_name}</h2>
        <button className="btn btn-primary" onClick={onLogout}>Logout</button>
      </div>
      <div className="card">

        {/* grades table for student */}
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {data.grades.map((grade) => (
              <tr key={grade.subject_id}>
                <td>{grade.subject_name}</td>
                <td>{grade.grade_value !== null ? grade.grade_value : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentView;