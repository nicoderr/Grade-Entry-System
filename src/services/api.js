import axios from 'axios';

// Base URL for the API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//add user_id to each request if available
const addUserId = (config) => {
  const userId = localStorage.getItem('user_id');
  if (userId && config.params) {
    config.params.user_id = userId;
  } else if (userId) {
    config.params = { user_id: userId };
  }
  return config;
};

//apply interceptor to add user_id and define APIs
api.interceptors.request.use(addUserId);

// handles login and authentication and sends login request to backend
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
};

// students API used by admin and teachers to fetch students
export const studentsAPI = {
  getAll: () => api.get('/students'),
};

// grades API to fetch and update grades used by students, teachers, and admins
export const gradesAPI = {
  getMyGrades: () => api.get('/grades/my-grades'),
  getStudentGrades: (studentId) => api.get(`/grades/student/${studentId}`),
  updateGrade: (studentId, subjectId, gradeValue) =>
    api.put(`/grades/student/${studentId}/subject/${subjectId}`, { grade_value: gradeValue }),
};

// subjects API used to manage subjects by admin
export const subjectsAPI = {
  getAll: () => api.get('/subjects'),
  create: (subjectName) => api.post('/subjects', { subject_name: subjectName }),
  delete: (subjectId) => api.delete(`/subjects/${subjectId}`),
};

// users API used by admin to manage users and send requests to backend
export const usersAPI = {
  create: (userData) => api.post('/users', userData),
  getAll: () => api.get('/users'),
  delete: (userId) => api.delete(`/users/${userId}`),
};

export default api;