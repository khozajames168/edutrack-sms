import React, { useState } from 'react';

export default function Login({ onLogin, onStudentPortal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h1 className="text-3xl font-bold text-blue-900">EduTrack SMS</h1>
          <p className="text-gray-500 mt-2">Student Management System</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@college.co.za"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200">
            Sign In as Admin
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={onStudentPortal}
            className="w-full border border-blue-700 text-blue-700 hover:bg-blue-50 font-semibold py-3 rounded-lg transition duration-200">
            Student Portal Login
          </button>
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">EduTrack © 2025 — Powered by your vision</p>
      </div>
    </div>
  );
}