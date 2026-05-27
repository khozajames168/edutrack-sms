import React from 'react';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold">EduTrack SMS</h1>
          <p className="text-blue-300 text-sm mt-1">College Admin</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li className="bg-blue-800 rounded-lg px-4 py-3 cursor-pointer flex items-center gap-3">
              <span>📊</span> Dashboard
            </li>
            <li className="hover:bg-blue-800 rounded-lg px-4 py-3 cursor-pointer flex items-center gap-3">
              <span>👤</span> Register Student
            </li>
            <li className="hover:bg-blue-800 rounded-lg px-4 py-3 cursor-pointer flex items-center gap-3">
              <span>👥</span> Students
            </li>
            <li className="hover:bg-blue-800 rounded-lg px-4 py-3 cursor-pointer flex items-center gap-3">
              <span>📄</span> Proof of Registration
            </li>
            <li className="hover:bg-blue-800 rounded-lg px-4 py-3 cursor-pointer flex items-center gap-3">
              <span>📝</span> Marks
            </li>
            <li className="hover:bg-blue-800 rounded-lg px-4 py-3 cursor-pointer flex items-center gap-3">
              <span>💰</span> Finance
            </li>
            <li className="hover:bg-blue-800 rounded-lg px-4 py-3 cursor-pointer flex items-center gap-3">
              <span>📅</span> Attendance
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <p className="text-blue-300 text-sm">Pinnacle College</p>
          <p className="text-blue-400 text-xs">Administrator</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Welcome, Admin</span>
            <div className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">312</p>
              <p className="text-xs text-green-500 mt-2">↑ 14 this month</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500">Active Courses</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">9</p>
              <p className="text-xs text-gray-400 mt-2">Engineering, IT, ECD...</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500">Fees Collected</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">R184k</p>
              <p className="text-xs text-green-500 mt-2">This month</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500">Outstanding Fees</p>
              <p className="text-3xl font-bold text-red-600 mt-1">R62k</p>
              <p className="text-xs text-red-400 mt-2">38 students</p>
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Registrations</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Course</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">Thabo Mokoena</td>
                  <td className="py-3 text-gray-600">N4 Engineering</td>
                  <td className="py-3 text-gray-600">27 May 2025</td>
                  <td className="py-3"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Active</span></td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">Nomsa Sithole</td>
                  <td className="py-3 text-gray-600">Management N4</td>
                  <td className="py-3 text-gray-600">26 May 2025</td>
                  <td className="py-3"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Active</span></td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">Lebo Nkosi</td>
                  <td className="py-3 text-gray-600">ECD Level 4</td>
                  <td className="py-3 text-gray-600">25 May 2025</td>
                  <td className="py-3"><span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">Pending</span></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 font-medium">Kagiso Baloyi</td>
                  <td className="py-3 text-gray-600">IT Support N4</td>
                  <td className="py-3 text-gray-600">24 May 2025</td>
                  <td className="py-3"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}