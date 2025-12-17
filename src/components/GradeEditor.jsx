import React, { useState, useEffect, useCallback } from 'react';
import { gradesAPI } from '../services/api';

function GradeEditor({ student, onBack, onLogout, readOnly }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadGrades = useCallback(async () => {
    try {
      const response = await gradesAPI.getStudentGrades(student.user_id);
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [student.user_id]);

  useEffect(() => {
    loadGrades();
  }, [loadGrades]);

  const handleGradeChange = (subjectId, value) => {
    setData({
      ...data,
      grades: data.grades.map((g) =>
        g.subject_id === subjectId ? { ...g, grade_value: value } : g
      ),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const grade of data.grades) {
        await gradesAPI.updateGrade(
          student.user_id,
          grade.subject_id,
          grade.grade_value
        );
      }
      alert('Grades saved successfully!');
    } catch (err) {
      alert('Failed to save grades');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="header">
        <div>
          <button className="btn btn-primary" onClick={onBack}>← Back</button>
          <span style={{ marginLeft: '20px', fontSize: '18px' }}>
            Grades for {data.student.full_name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          
          {!readOnly && (
          <button 
            className="btn btn-success" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Grades'}
          </button>
          )}

          <button className="btn btn-primary" onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="card">
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
                <td>
                  <select
                    value={grade.grade_value || ''}
                    onChange={(e) => handleGradeChange(grade.subject_id, e.target.value)}
                    disabled={readOnly}
                    style={{ width: '150px', padding: '8px', backgroundColor: '#fff',
                  color: '#000',
                  pointerEvents: readOnly ? 'none' : 'auto',
                  cursor: readOnly ? 'default' : 'pointer' }}
                  >
                    <option value="">-- Select Grade --</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GradeEditor;