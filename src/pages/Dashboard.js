import React, { useState, useEffect } from 'react';
import logo from '../sasc-logo.png';
import Register from './RegisterSASC';
import Students from './Students';
import ProofOfRegistration from './ProofOfRegistration';
import Marks from './Marks';
import Finance from './Finance';
import Attendance from './Attendance';
import Reports from './Reports';
import Communication from './Communication';
import UserManual from './UserManual';
import { logout } from '../utils/api';

export default function Dashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalFees: 0,
    totalPaid: 0,
    burgersfort: 0,
    polokwane: 0,
  });

  const [admin] = useState(() => JSON.parse(localStorage.getItem('admin') || '{}'));
const [permissions] = useState(() => JSON.parse(localStorage.getItem('permissions') || '{}'));
const [role] = useState(() => localStorage.getItem('role') || 'admin');

  useEffect(() => {
    loadStats();
  }, []); // eslint-disable-line

  const loadStats = async () => {
    try {
      const { getStats, getNotifications } = await import('../utils/api');
      const data = await getStats();
      if (data && !data.error) setStats(data);
      const notifs = await getNotifications();
      if (Array.isArray(notifs)) setNotifications(notifs);
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard', show: true },
  { key: 'register', icon: '📝', label: 'Register Student', show: role === 'admin' || role === 'superadmin' },
  { key: 'students', icon: '👥', label: 'Students', show: role !== 'lecturer' },
  { key: 'proof', icon: '📄', label: 'Proof of Registration', show: role !== 'lecturer' },
  { key: 'marks', icon: '🎓', label: 'Marks & Assessments', show: true },
  { key: 'finance', icon: '💰', label: 'Finance', show: role === 'admin' || role === 'superadmin' || role === 'principal' },
  { key: 'attendance', icon: '📅', label: 'Attendance', show: true },
  { key: 'reports', icon: '📊', label: 'Reports & Exports', show: role === 'admin' || role === 'superadmin' || role === 'principal' },
  { key: 'communication', icon: '💬', label: 'Communication', show: role === 'admin' || role === 'superadmin' },
  { key: 'manual', icon: '📖', label: 'User Manual', show: true },
].filter(item => item.show);

  const pageTitles = {
    dashboard: 'Dashboard',
    register: 'Register New Student',
    students: 'Students',
    proof: 'Proof of Registration',
    marks: 'Marks & Assessments',
    finance: 'Finance',
    attendance: 'Attendance',
    reports: 'Reports & Exports',
    communication: 'Communication',
    manual: 'User Manual',
  };

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex w-64 flex-col shadow-xl fixed md:relative h-full z-50`}
        style={{ background: '#1B1F8A' }}>

        <div className="p-5 border-b border-blue-800">
          <img src={logo} alt="SA Shepherd College" className="w-full" />
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.key}
                onClick={() => { setActivePage(item.key); setSidebarOpen(false); }}
                className="rounded-lg px-4 py-3 cursor-pointer flex items-center gap-3 text-sm transition"
                style={{
                  background: activePage === item.key ? '#E91E8C' : 'transparent',
                  color: 'white',
                  fontWeight: activePage === item.key ? '600' : '400',
                }}>
                <span>{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <p className="text-xs text-blue-300">DHET Exam Center No.</p>
          <p className="text-xs text-white font-medium">6999 926 54</p>
          <p className="text-xs text-blue-300 mt-2">Burgersfort | Polokwane</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white shadow-sm px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg text-white"
              style={{ background: '#1B1F8A' }}>
              ☰
            </button>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#1B1F8A' }}>
                {pageTitles[activePage]}
              </h2>
              <p className="text-xs text-gray-400 hidden md:block">SA Shepherd College Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 text-xl">
                🔔
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                    style={{ background: '#E91E8C' }}>
                    {notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                  <div className="p-4 border-b">
                    <p className="font-semibold text-gray-800">Notifications</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-gray-500">No notifications</p>
                    ) : (
                      notifications.slice(0, 10).map(n => (
                        <div key={n.id} className="p-3 border-b hover:bg-gray-50"
                          style={{ background: n.is_read ? 'white' : '#f0f4ff' }}>
                          <p className="text-sm font-medium text-gray-800">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-700">{admin.name || 'Administrator'}</p>
              <span className="text-xs px-2 py-0.5 rounded-full text-white capitalize"
                style={{ background: role === 'principal' ? '#8DC63F' : role === 'lecturer' ? '#E91E8C' : '#1B1F8A' }}>
                {role}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: '#E91E8C' }}>
              {admin.name?.[0] || 'A'}
            </div>
            <button onClick={() => { logout(); onLogout && onLogout(); }}
              className="text-xs text-gray-400 hover:text-red-500 hidden md:block">
              Sign Out
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">

          {activePage === 'dashboard' && (
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Students', value: stats.totalStudents, sub: 'Registered students', color: '#1B1F8A' },
                  { label: 'Burgersfort Campus', value: stats.burgersfort, sub: 'Students enrolled', color: '#8DC63F' },
                  { label: 'Fees Collected', value: `R${stats.totalPaid.toLocaleString()}`, sub: 'Total payments received', color: '#1B1F8A' },
                  { label: 'Outstanding Fees', value: `R${(stats.totalFees - stats.totalPaid).toLocaleString()}`, sub: 'Amount outstanding', color: '#E91E8C' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border-t-4"
                    style={{ borderColor: stat.color }}>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-2">{stat.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  { name: 'Burgersfort Campus', address: 'Main Road, RCS Building Between CashBuild and Caltex', tel: '010 055 5115', students: stats.burgersfort },
                  { name: 'Polokwane Campus', address: '17 Rissik Street CNR Landros Mare, next to Engine Garage', tel: '015 008 5102', students: stats.polokwane },
                ].map(campus => (
                  <div key={campus.name} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ background: '#1B1F8A' }}>
                        {campus.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{campus.name}</p>
                        <p className="text-xs text-gray-400">{campus.tel}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{campus.address}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Enrolled students</span>
                      <span className="font-bold text-lg" style={{ color: '#E91E8C' }}>{campus.students}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Register Student', icon: '📝', page: 'register', color: '#1B1F8A' },
                    { label: 'View Students', icon: '👥', page: 'students', color: '#E91E8C' },
                    { label: 'Capture Marks', icon: '🎓', page: 'marks', color: '#8DC63F' },
                    { label: 'Export Reports', icon: '📊', page: 'reports', color: '#1B1F8A' },
                  ].map(action => (
                    <button key={action.label}
                      onClick={() => setActivePage(action.page)}
                      className="p-4 rounded-xl text-white text-sm font-medium text-center"
                      style={{ background: action.color }}>
                      <div className="text-2xl mb-2">{action.icon}</div>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePage === 'register' && (role === 'admin' || role === 'superadmin') && (
  <Register onRegistered={() => setActivePage('students')} />
)}

{activePage === 'register' && role !== 'admin' && role !== 'superadmin' && (
  <div className="p-8">
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <p className="text-4xl mb-3">🚫</p>
      <p className="text-red-700 font-semibold">Access Denied</p>
      <p className="text-red-500 text-sm mt-2">You do not have permission to register students.</p>
    </div>
  </div>
)}

          {activePage === 'students' && (
            <Students onSelectStudent={(student) => {
              setSelectedStudent(student);
              setActivePage('proof');
            }} />
          )}

          {activePage === 'proof' && (
            <ProofOfRegistration
              student={selectedStudent}
              onBack={() => setActivePage('students')}
            />
          )}

          {activePage === 'marks' && <Marks />}
         {activePage === 'finance' && (role === 'admin' || role === 'superadmin' || role === 'principal') && <Finance />}
{activePage === 'finance' && role === 'lecturer' && (
  <div className="p-8">
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <p className="text-4xl mb-3">🚫</p>
      <p className="text-red-700 font-semibold">Access Denied</p>
      <p className="text-red-500 text-sm mt-2">Lecturers do not have access to finance information.</p>
    </div>
  </div>
)}
          {activePage === 'attendance' && <Attendance />}
         {activePage === 'reports' && (role === 'admin' || role === 'superadmin' || role === 'principal') && <Reports />}
{activePage === 'reports' && role === 'lecturer' && (
  <div className="p-8">
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <p className="text-4xl mb-3">🚫</p>
      <p className="text-red-700 font-semibold">Access Denied</p>
      <p className="text-red-500 text-sm mt-2">Lecturers do not have access to reports.</p>
    </div>
  </div>
)}
         {activePage === 'communication' && (role === 'admin' || role === 'superadmin') && <Communication />}
{activePage === 'communication' && role !== 'admin' && role !== 'superadmin' && (
  <div className="p-8">
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <p className="text-4xl mb-3">🚫</p>
      <p className="text-red-700 font-semibold">Access Denied</p>
      <p className="text-red-500 text-sm mt-2">You do not have permission to send communications.</p>
    </div>
  </div>
)}
          {activePage === 'manual' && <UserManual />}

        </div>
      </div>
    </div>
  );
}