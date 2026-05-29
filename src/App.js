import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentPortal from './pages/StudentPortal';
import SuperAdmin from './pages/SuperAdmin';
import SuperLogin from './pages/SuperLogin';

function App() {
  const [view, setView] = useState('login');

  return (
    <div>
      {view === 'login' && (
        <Login
          onLogin={() => setView('dashboard')}
          onStudentPortal={() => setView('student')}
          onSuperAdmin={() => setView('superlogin')}
        />
      )}
      {view === 'dashboard' && <Dashboard onLogout={() => setView('login')} />}
      {view === 'student' && (
        <StudentPortal onBackToAdmin={() => setView('login')} />
      )}
      {view === 'superlogin' && (
        <SuperLogin
          onLogin={() => setView('superadmin')}
          onBack={() => setView('login')}
        />
      )}
      {view === 'superadmin' && (
        <SuperAdmin onLogout={() => setView('login')} />
      )}
    </div>
  );
}

export default App;