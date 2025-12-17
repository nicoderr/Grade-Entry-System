import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add user_id to all requests that need authentication
const addUserId = (config) => {
  const userId = localStorage.getItem('user_id');
  if (userId && config.params) {
    config.params.user_id = userId;
  } else if (userId) {
    config.params = { user_id: userId };
  }
  return config;
};

api.interceptors.request.use(addUserId);

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
};

export const studentsAPI = {
  getAll: () => api.get('/students'),
};

export const gradesAPI = {
  getMyGrades: () => api.get('/grades/my-grades'),
  getStudentGrades: (studentId) => api.get(`/grades/student/${studentId}`),
  updateGrade: (studentId, subjectId, gradeValue) =>
    api.put(`/grades/student/${studentId}/subject/${subjectId}`, { grade_value: gradeValue }),
};

export const subjectsAPI = {
  getAll: () => api.get('/subjects'),
  create: (subjectName) => api.post('/subjects', { subject_name: subjectName }),
  delete: (subjectId) => api.delete(`/subjects/${subjectId}`),
};

export const usersAPI = {
  create: (userData) => api.post('/users', userData),
  getAll: () => api.get('/users'),
  delete: (userId) => api.delete(`/users/${userId}`),
};

export default api;