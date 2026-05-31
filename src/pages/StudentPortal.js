import React, { useState } from 'react';

const studentData = {
  'PC-2025-001': {
    name: 'Thabo Mokoena',
    course: 'N4 Engineering',
    campus: 'Main Campus',
    email: 'thabo@email.com',
    password: '1234',
    balance: 0,
    marks: [
      { subject: 'Mathematics', term1: 72, term2: 75 },
      { subject: 'Engineering Science', term1: 68, term2: 71 },
      { subject: 'Industrial Electronics', term1: 75, term2: 78 },
      { subject: 'Engineering Drawing', term1: 80, term2: 82 },
    ],
  },
  'PC-2025-003': {
    name: 'Lebo Nkosi',
    course: 'ECD Level 4',
    campus: 'Branch Campus',
    email: 'lebo@email.com',
    password: '1234',
    balance: 2400,
    marks: [
      { subject: 'Child Development', term1: 65, term2: 70 },
      { subject: 'Health & Nutrition', term1: 70, term2: 72 },
      { subject: 'Learning Programme Design', term1: 68, term2: 69 },
      { subject: 'Family & Community', term1: 72, term2: 75 },
    ],
  },
};

export default function StudentPortal({ onBackToAdmin }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogin = (e) => {
    e.preventDefault();
    const found = studentData[studentId];
    if (found && found.password === password) {
      setStudent({ ...found, id: studentId });
      setError('');
    } else {
      setError('Invalid student number or password. Please try again.');
    }
  };

  const getAverage = (marks) => {
    const total = marks.reduce((a, b) => a + b.term1 + b.term2, 0);
    return (total / (marks.length * 2)).toFixed(1);
  };

  const today = new Date().toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">P</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-900">Student Portal</h1>
            <p className="text-gray-500 mt-1">Pinnacle College</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Number</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. PC-2025-001"
                required
              />
            </div>
            <div className="mb-4">
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
            {error && (
              <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <button type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg">
              Sign In
            </button>
          </form>
          <button onClick={onBackToAdmin}
            className="w-full mt-4 text-center text-sm text-gray-400 hover:text-gray-600">
            ← Back to Admin Login
          </button>
          <div className="mt-6 bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
            <p className="font-medium mb-1">Demo credentials:</p>
            <p>Student Number: PC-2025-001 | Password: 1234</p>
            <p>Student Number: PC-2025-003 | Password: 1234</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-lg font-bold">Student Portal</h1>
          <p className="text-blue-300 text-sm mt-1">Pinnacle College</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[
              { key: 'overview', icon: '📊', label: 'My Overview' },
              { key: 'marks', icon: '📝', label: 'My Marks' },
              { key: 'proof', icon: '📄', label: 'Proof of Registration' },
              { key: 'finance', icon: '💰', label: 'My Account' },
            ].map(item => (
              <li key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`rounded-lg px-4 py-3 cursor-pointer flex items-center gap-3 ${activeTab === item.key ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>
                <span>{item.icon}</span> {item.label}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <p className="text-blue-300 text-sm">{student.name}</p>
          <p className="text-blue-400 text-xs">{student.id}</p>
          <button onClick={() => setStudent(null)}
            className="mt-2 text-xs text-blue-400 hover:text-white">
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === 'overview' && 'My Overview'}
            {activeTab === 'marks' && 'My Marks'}
            {activeTab === 'proof' && 'Proof of Registration'}
            {activeTab === 'finance' && 'My Account'}
          </h2>
          <span className="text-sm text-gray-500">Welcome, {student.name.split(' ')[0]}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-8">

          {/* Overview */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <p className="text-sm text-gray-500">My Course</p>
                  <p className="text-lg font-bold text-blue-900 mt-1">{student.course}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <p className="text-sm text-gray-500">My Average</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">{getAverage(student.marks)}%</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <p className="text-sm text-gray-500">Outstanding Balance</p>
                  <p className={`text-3xl font-bold mt-1 ${student.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {student.balance > 0 ? `R${student.balance.toLocaleString()}` : '✓ Paid'}
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">📢 Notice Board</h3>
                <p className="text-blue-800 text-sm">Term 2 examinations begin 15 July 2025. Please ensure all outstanding fees are paid before exam entry.</p>
              </div>
            </div>
          )}

          {/* Marks */}
          {activeTab === 'marks' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">{student.course} — My Results</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Term 1</th>
                    <th className="px-6 py-4">Term 2</th>
                    <th className="px-6 py-4">Average</th>
                    <th className="px-6 py-4">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {student.marks.map(m => {
                    const avg = ((m.term1 + m.term2) / 2).toFixed(1);
                    return (
                      <tr key={m.subject} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{m.subject}</td>
                        <td className="px-6 py-4">{m.term1}%</td>
                        <td className="px-6 py-4">{m.term2}%</td>
                        <td className="px-6 py-4 font-bold text-blue-700">{avg}%</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${parseFloat(avg) >= 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {parseFloat(avg) >= 50 ? 'Pass' : 'Fail'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Proof */}
          {activeTab === 'proof' && (
  <div className="max-w-2xl mx-auto">
    <div className="flex gap-4 mb-6 justify-end">
      <button onClick={() => window.print()}
        className="px-6 py-3 text-white font-semibold rounded-lg"
        style={{ background: '#1B1F8A' }}>
        🖨️ Print
      </button>
      <button onClick={async () => {
        const { jsPDF } = await import('jspdf');
        const html2canvas = (await import('html2canvas')).default;
        const element = document.getElementById('student-proof');
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Proof_of_Registration_${student.id}.pdf`);
      }}
        className="px-6 py-3 text-white font-semibold rounded-lg"
        style={{ background: '#E91E8C' }}>
        📥 Download PDF
      </button>
    </div>

    <div id="student-proof" className="bg-white rounded-xl shadow-sm p-8 border border-gray-200"
      style={{ position: 'relative' }}>

      {/* Watermark */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        fontSize: '60px', color: 'rgba(27, 31, 138, 0.04)',
        fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none',
        zIndex: 0, userSelect: 'none'
      }}>SA SHEPHERD COLLEGE</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '4px solid #1B1F8A', marginBottom: '15px' }}>
          <div>
            <h1 style={{ color: '#1B1F8A', fontSize: '20px', fontWeight: 'bold' }}>SA SHEPHERD COLLEGE</h1>
            <p style={{ color: '#666', fontSize: '11px' }}>DHET Exam Center No. 6999 926 54</p>
            <p style={{ color: '#666', fontSize: '11px' }}>Burgersfort: 010 055 5115 | Polokwane: 015 008 5102</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ width: '70px', height: '70px', border: '2px solid #1B1F8A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 'bold', color: '#1B1F8A', textAlign: 'center', padding: '8px' }}>
              <div>SA SHEPHERD OFFICIAL STAMP</div>
            </div>
          </div>
        </div>

        {/* Pink bar */}
        <div style={{ background: '#E91E8C', color: 'white', textAlign: 'center', padding: '8px', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '15px' }}>
          OFFICIAL CONFIRMATION OF REGISTRATION
        </div>

        {/* Green bar */}
        <div style={{ background: '#8DC63F', color: 'white', textAlign: 'center', padding: '4px', fontSize: '11px', marginBottom: '20px' }}>
          TO WHOM IT MAY CONCERN — Academic Year {new Date().getFullYear()}
        </div>

        {/* Student details */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flexShrink: 0 }}>
            {student.photo
              ? <img src={student.photo} alt="Student" style={{ width: '90px', height: '110px', objectFit: 'cover', border: '3px solid #1B1F8A' }} />
              : <div style={{ width: '90px', height: '110px', border: '3px solid #1B1F8A', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ff', fontSize: '30px' }}>👤</div>
            }
          </div>
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              {[
                { label: 'Student Name', value: student.name },
                { label: 'Student Number', value: student.id },
                { label: 'Course Enrolled', value: student.course },
                { label: 'Campus', value: student.campus },
                { label: 'Registration Date', value: today },
                { label: 'Academic Year', value: new Date().getFullYear().toString() },
                { label: 'Status', value: '✓ REGISTERED & ACTIVE' },
              ].map(({ label, value }) => (
                <tr key={label}>
                  <td style={{ padding: '5px 8px', fontWeight: 'bold', color: '#1B1F8A', background: '#f8f9ff', borderBottom: '1px solid #eee', width: '40%' }}>{label}</td>
                  <td style={{ padding: '5px 8px', borderBottom: '1px solid #eee', color: label === 'Status' ? '#16a34a' : '#333', fontWeight: label === 'Student Number' || label === 'Status' ? 'bold' : 'normal' }}>{value}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>

        {/* Notice */}
        <div style={{ background: '#fff8e1', borderLeft: '4px solid #E91E8C', padding: '8px 12px', fontSize: '11px', color: '#333', marginBottom: '15px' }}>
          This letter certifies that <strong>{student.name}</strong> is currently enrolled at SA Shepherd College for the {new Date().getFullYear()} academic year.
        </div>

        {/* Signature */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #1B1F8A' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '2px solid #333', width: '180px', marginBottom: '4px' }}></div>
            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#1B1F8A' }}>Campus Manager</p>
            <p style={{ fontSize: '10px', color: '#666' }}>SA Shepherd College</p>
            <p style={{ fontSize: '10px', color: '#666' }}>{today}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '70px', height: '70px', border: '2px solid #1B1F8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '35px' }}>▦</div>
            <p style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>Scan to verify</p>
          </div>
        </div>

        {/* Verification */}
        <div style={{ background: '#f0f4ff', border: '1px solid #1B1F8A', padding: '6px 12px', fontSize: '10px', color: '#1B1F8A', marginTop: '12px', textAlign: 'center' }}>
          🔒 VERIFICATION: SASC-{student.id}-{new Date().getFullYear()}-VRF — Verify at: sashepherdcollege.org.za
        </div>

        {/* Footer */}
        <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '3px solid #8DC63F', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#666' }}>
          <span>Burgersfort: Main Road, RCS Building | Tel: 010 055 5115</span>
          <span>Polokwane: 17 Rissik Street | Tel: 015 008 5102</span>
        </div>
      </div>
    </div>
  </div>
)}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                  <div className="w-16 h-16 bg-blue-900 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">P</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-blue-900">Pinnacle College</h1>
                    <p className="text-gray-500">Official Proof of Registration</p>
                  </div>
                  <div className="ml-auto w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-2xl">▦</p>
                  </div>
                </div>
                <div className="space-y-3 mb-8">
                  {[
                    { label: 'Student Name', value: student.name },
                    { label: 'Student Number', value: student.id },
                    { label: 'Course Enrolled', value: student.course },
                    { label: 'Campus', value: student.campus },
                    { label: 'Registration Date', value: today },
                    { label: 'Academic Year', value: '2025' },
                    { label: 'Status', value: 'Active' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500 text-sm">{label}</span>
                      <span className="font-semibold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 text-center">
                    This document serves as official proof of registration at Pinnacle College.
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => window.print()}
                    className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg">
                    🖨️ Print Document
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Finance */}
          {activeTab === 'finance' && (
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Account Summary</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Course Fees', value: `R${student.balance > 0 ? (student.balance + 9600).toLocaleString() : '12,000'}` },
                    { label: 'Amount Paid', value: `R${student.balance > 0 ? '9,600' : '12,000'}`, green: true },
                    { label: 'Outstanding Balance', value: student.balance > 0 ? `R${student.balance.toLocaleString()}` : 'R0 — Fully Paid', red: student.balance > 0 },
                  ].map(({ label, value, green, red }) => (
                    <div key={label} className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-500">{label}</span>
                      <span className={`font-semibold ${green ? 'text-green-600' : red ? 'text-red-600' : 'text-gray-800'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {student.balance > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="font-semibold text-red-800 mb-2">⚠️ Outstanding Balance</h3>
                  <p className="text-red-700 text-sm">You have an outstanding balance of <strong>R{student.balance.toLocaleString()}</strong>. Please contact the finance office or visit the campus to make a payment.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}