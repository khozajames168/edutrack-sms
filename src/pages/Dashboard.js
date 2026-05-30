import Register from './RegisterSASC';
import logo from '../sasc-logo.png';
import Students from './Students';
import ProofOfRegistration from './ProofOfRegistration';
import Marks from './Marks';
import Finance from './Finance';
import Attendance from './Attendance';
import Reports from './Reports';
import Communication from './Communication';
import UserManual from './UserManual';
import React, { useState, useEffect } from 'react';
import { logout } from '../utils/api';


export default function Dashboard() {
const [activePage, setActivePage] = useState('dashboard');
const [selectedStudent, setSelectedStudent] = useState(null);
const [sidebarOpen, setSidebarOpen] = useState(false);
const [permissions, setPermissions] = useState({
  canRegister: true,
  canViewStudents: true,
  canCaptureMarks: true,
  canViewFinance: true,
  canEditFinance: true,
  canTakeAttendance: true,
  canExport: true,
  canCommunicate: true,
});
const [userRole, setUserRole] = useState('admin');
const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);
const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);

const admin = JSON.parse(localStorage.getItem('admin') || '{}');
const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
const role = localStorage.getItem('role') || 'admin';
const [stats, setStats] = useState({
  totalStudents: 0,
  activeStudents: 0,
  totalFees: 0,
  totalPaid: 0,
  burgersfort: 0,
  polokwane: 0,
});

useEffect(() => {
  loadStats();
  loadPermissions();
  loadNotifications();
}, []); // eslint-disable-line

const loadPermissions = () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role || 'admin');
      setPermissions({
        canRegister: ['admin', 'superadmin'].includes(payload.role),
        canViewStudents: true,
        canCaptureMarks: ['admin', 'superadmin', 'lecturer'].includes(payload.role),
        canViewFinance: ['admin', 'superadmin', 'principal'].includes(payload.role),
        canEditFinance: ['admin', 'superadmin'].includes(payload.role),
        canTakeAttendance: ['admin', 'superadmin', 'lecturer'].includes(payload.role),
        canExport: ['admin', 'superadmin', 'principal'].includes(payload.role),
        canCommunicate: ['admin', 'superadmin'].includes(payload.role),
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const loadNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (Array.isArray(data)) setNotifications(data);
  } catch (err) {
    console.error(err);
  }
};

const loadStats = async () => {
  try {
    const { getStats } = await import('../utils/api');
    const data = await getStats();
    if (data && !data.error) setStats(data);
  } catch (err) {
    console.error(err);
  }

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
};
 const navItems = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard', show: true },
  { key: 'register', icon: '📝', label: 'Register Student', show: permissions.canRegister },
  { key: 'students', icon: '👥', label: 'Students', show: permissions.canViewStudents },
  { key: 'proof', icon: '📄', label: 'Proof of Registration', show: permissions.canViewStudents },
  { key: 'marks', icon: '🎓', label: 'Marks & Assessments', show: permissions.canCaptureMarks },
  { key: 'finance', icon: '💰', label: 'Finance', show: permissions.canViewFinance },
  { key: 'attendance', icon: '📅', label: 'Attendance', show: permissions.canTakeAttendance },
  { key: 'reports', icon: '📊', label: 'Reports & Exports', show: permissions.canExport },
  { key: 'communication', icon: '💬', label: 'Communication', show: permissions.canCommunicate },
  { key: 'manual', icon: '📖', label: 'User Manual', show: true },
];

  const pageTitles = {
    dashboard: 'Dashboard',
    register: 'Register New Student',
    students: 'Students',
    proof: 'Proof of Registration',
    marks: 'Marks & Assessments',
    finance: 'Finance',
    attendance: 'Attendance',
  };

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex w-64 flex-col shadow-xl fixed md:relative h-full z-50`} style={{ background: '#1B1F8A' }}>
        
        {/* Logo */}
        <div className="p-5 border-b border-blue-800">
          <img src={logo} alt="SA Shepherd College" className="w-full" />
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
           {navItems.filter(item => item.show).map(item => (
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

        {/* Campus Info */}
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
  {/* Notifications */}
  <div className="relative">
    <button onClick={() => setShowNotifications(!showNotifications)}
      className="relative p-2 rounded-lg hover:bg-gray-100">
      🔔
      {notifications.filter(n => !n.is_read).length > 0 && (
        <span className="absolute top-0 right-0 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center"
          style={{ background: '#E91E8C' }}>
          {notifications.filter(n => !n.is_read).length}
        </span>
      )}
    </button>
    {showNotifications && (
      <div className="absolute right-0 top-10 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <p className="font-semibold text-sm text-gray-800">Notifications</p>
          <button onClick={() => setShowNotifications(false)} className="text-gray-400 text-lg">×</button>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 p-4 text-center">No notifications</p>
          ) : (
            notifications.slice(0, 10).map(n => (
              <div key={n.id} className="p-3 border-b border-gray-50 hover:bg-gray-50"
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
    <p className="text-sm font-medium text-gray-700 capitalize">{userRole}</p>
    <p className="text-xs text-gray-400">SA Shepherd College</p>
  </div>
  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
    style={{ background: '#E91E8C' }}>
    {userRole[0].toUpperCase()}
  </div>
</div>
    <h2 className="text-lg font-bold" style={{ color: '#1B1F8A' }}>
      {pageTitles[activePage]}
    </h2>
    <p className="text-xs text-gray-400 hidden md:block">SA Shepherd College Management System</p>
  </div>
</div>
          <div className="flex items-center gap-4">
  {/* Notifications */}
  <div className="relative">
    <button onClick={() => setShowNotifications(!showNotifications)}
      className="relative p-2 rounded-lg hover:bg-gray-100">
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

  <div className="text-right">
    <p className="text-sm font-medium text-gray-700">{admin.name || 'Administrator'}</p>
    <p className="text-xs px-2 py-0.5 rounded-full text-white inline-block capitalize"
      style={{ background: role === 'principal' ? '#8DC63F' : role === 'lecturer' ? '#E91E8C' : '#1B1F8A' }}>
      {role}
    </p>
  </div>
  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
    style={{ background: '#E91E8C' }}>
    {admin.name?.[0] || 'A'}
  </div>
  {onLogout && (
    <button onClick={() => { logout(); onLogout(); }}
      className="text-xs text-gray-400 hover:text-red-500 ml-2">
      Sign Out
    </button>
  )}
</div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Dashboard Home */}
          {activePage === 'dashboard' && (
            <div className="p-8">

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 mb-8">
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

              {/* Campuses */}
              <div className="grid grid-cols-2 gap-6 mb-8">
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

              {/* Recent Registrations */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Recent Registrations</h3>
                  <button
                    onClick={() => setActivePage('students')}
                    className="text-sm font-medium"
                    style={{ color: '#E91E8C' }}>
                    View all →
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 border-b">
                      <th className="pb-3">Student</th>
                      <th className="pb-3">Course</th>
                      <th className="pb-3">Campus</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      { name: 'Thabo Mokoena', course: 'Electrical Engineering N4', campus: 'Burgersfort', status: 'Active' },
                      { name: 'Nomsa Sithole', course: 'Social Auxiliary Work NQF L4', campus: 'Polokwane', status: 'Active' },
                      { name: 'Lebo Nkosi', course: 'ECD Level 4', campus: 'Burgersfort', status: 'Pending' },
                      { name: 'Kagiso Baloyi', course: 'Human Resource N4', campus: 'Polokwane', status: 'Active' },
                      { name: 'Priya Moodley', course: 'First Aid Level 2', campus: 'Burgersfort', status: 'Active' },
                    ].map(s => (
                      <tr key={s.name} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium">{s.name}</td>
                        <td className="py-3 text-gray-500">{s.course}</td>
                        <td className="py-3 text-gray-500">{s.campus}</td>
                        <td className="py-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: s.status === 'Active' ? '#f0fdf4' : '#fefce8',
                              color: s.status === 'Active' ? '#16a34a' : '#ca8a04'
                            }}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePage === 'register' && <Register onRegistered={() => setActivePage('students')} />}
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
          {activePage === 'finance' && <Finance />}
          {activePage === 'attendance' && <Attendance />}
          {activePage === 'reports' && <Reports />}
          {activePage === 'communication' && <Communication />}
          {activePage === 'manual' && <UserManual />}

        </div>
      </div>
    </div>
  );
}