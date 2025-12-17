import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';
import AdminView from './components/AdminView';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    localStorage.setItem('user_id', userData.user_id);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.role === 'student') {
    return <StudentView user={user} onLogout={handleLogout} />;
  }

  if (user.role === 'teacher') {
    return <TeacherView user={user} onLogout={handleLogout} />;
  }

  if (user.role === 'admin') {
    return <AdminView user={user} onLogout={handleLogout} />;
  }

  return null;
}

export default App;