import React, { useState } from 'react';
import logo from '../sasc-logo.png';

export default function UserManual() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { key: 'overview', icon: '📋', label: 'System Overview' },
    { key: 'login', icon: '🔐', label: 'Logging In' },
    { key: 'register', icon: '📝', label: 'Registering Students' },
    { key: 'students', icon: '👥', label: 'Managing Students' },
    { key: 'proof', icon: '📄', label: 'Proof of Registration' },
    { key: 'marks', icon: '🎓', label: 'Marks & Assessments' },
    { key: 'finance', icon: '💰', label: 'Finance & Payments' },
    { key: 'attendance', icon: '📅', label: 'Attendance' },
    { key: 'reports', icon: '📊', label: 'Reports & Exports' },
    { key: 'communication', icon: '💬', label: 'Communication' },
    { key: 'student-portal', icon: '🎓', label: 'Student Portal' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1B1F8A' }}>User Manual</h2>
          <p className="text-gray-500 text-sm mt-1">SA Shepherd College Student Management System</p>
        </div>
        <button onClick={handlePrint}
          className="px-6 py-3 text-white font-semibold rounded-lg"
          style={{ background: '#1B1F8A' }}>
          🖨️ Print Manual
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Contents</p>
            <ul className="space-y-1">
              {sections.map(s => (
                <li key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition"
                  style={{
                    background: activeSection === s.key ? '#1B1F8A' : 'transparent',
                    color: activeSection === s.key ? 'white' : '#374151',
                  }}>
                  <span>{s.icon}</span> {s.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-8">

          {activeSection === 'overview' && (
            <div>
              <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                <img src={logo} alt="SA Shepherd College" className="w-32" />
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#1B1F8A' }}>SA Shepherd College SMS</h3>
                  <p className="text-gray-500">Student Management System — User Manual</p>
                  <p className="text-gray-400 text-sm">Version 1.0 — {new Date().getFullYear()}</p>
                </div>
              </div>
              <h4 className="font-bold text-gray-800 mb-3">Welcome</h4>
              <p className="text-gray-600 text-sm mb-4">This system is designed to manage all student administration at SA Shepherd College — from registration to marks, finance, attendance and communication.</p>
              <h4 className="font-bold text-gray-800 mb-3">What this system does:</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '📝', label: 'Register students digitally' },
                  { icon: '📄', label: 'Generate proof of registration instantly' },
                  { icon: '🎓', label: 'Capture and calculate marks' },
                  { icon: '💰', label: 'Track fees and payments' },
                  { icon: '📅', label: 'Record daily attendance' },
                  { icon: '📊', label: 'Export reports to Excel' },
                  { icon: '💬', label: 'Send bulk SMS to students' },
                  { icon: '🏛️', label: 'Generate DHET submissions' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <span>{item.icon}</span>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg" style={{ background: '#f0f4ff' }}>
                <p className="text-sm font-semibold" style={{ color: '#1B1F8A' }}>Support Contact</p>
                <p className="text-sm text-gray-600 mt-1">For technical support contact EduTrack:</p>
                <p className="text-sm text-gray-600">📧 admin@edutrack.co.za</p>
              </div>
            </div>
          )}

          {activeSection === 'login' && (
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1B1F8A' }}>🔐 Logging In</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">Step 1 — Open the system</p>
                  <p className="text-sm text-gray-600">Open your browser and go to your college system URL.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">Step 2 — Enter your details</p>
                  <p className="text-sm text-gray-600">Enter your email address and password. Click <strong>Sign In as Admin</strong>.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">Step 3 — Dashboard</p>
                  <p className="text-sm text-gray-600">You will see the dashboard with live stats for your college.</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-semibold text-yellow-800 mb-1">⚠️ Important</p>
                  <p className="text-sm text-yellow-700">Never share your password. Log out after each session. If you forget your password click "Forgot password?" on the login page.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold" style={{ color: '#1B1F8A' }}>Default Admin Logins:</p>
                  <p className="text-sm text-gray-600 mt-1">Burgersfort: burgersfort@sashepherdcollege.org.za</p>
                  <p className="text-sm text-gray-600">Polokwane: polokwane@sashepherdcollege.org.za</p>
                  <p className="text-sm text-gray-600">Password: admin123 (change this immediately)</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'register' && (
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1B1F8A' }}>📝 Registering Students</h3>
              <p className="text-sm text-gray-600 mb-4">Registration is a 5-step process. Make sure you have the student's documents ready before starting.</p>
              <div className="space-y-3">
                {[
                  { step: 1, title: 'Personal Information', desc: 'Enter student title, full name, ID number, date of birth, gender, home language, address and contact details. Upload a passport-style photo.' },
                  { step: 2, title: 'Course Selection', desc: 'Select the faculty, then choose the specific course. Select the campus (Burgersfort or Polokwane), study mode (Full Time/Part Time/Online) and accommodation if needed. The system will show the fees automatically.' },
                  { step: 3, title: 'Document Uploads', desc: 'Upload certified ID/Passport copy, certified Grade 12 results or last grade report, and proof of registration fee payment.' },
                  { step: 4, title: 'Payer Details', desc: 'Enter details of the person paying the fees — Self, Parent/Guardian, Employer or Bursary. Get the payer to agree to the payment declaration.' },
                  { step: 5, title: 'Review & Confirm', desc: 'Review all details. Student must agree to the declaration. Click Complete Registration. The system generates a student number automatically.' },
                ].map(item => (
                  <div key={item.step} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: '#1B1F8A' }}>{item.step}</div>
                    <div>
                      <p className="font-semibold text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">✅ After registration the student number is generated automatically in the format: SASC-2025-0001. The student's default portal password is the last 6 digits of their ID number.</p>
              </div>
            </div>
          )}

          {activeSection === 'students' && (
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1B1F8A' }}>👥 Managing Students</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">Finding a student</p>
                  <p className="text-sm text-gray-600">Click Students in the sidebar. Use the search box to search by name or student number. Filter by course using the dropdown.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">Viewing a student</p>
                  <p className="text-sm text-gray-600">Click the View button next to any student to see their proof of registration and full details.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">Student status</p>
                  <p className="text-sm text-gray-600">Green = Active student. Yellow = Pending (fees outstanding or documents missing).</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'proof' && (
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1B1F8A' }}>📄 Proof of Registration</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">How to generate</p>
                  <p className="text-sm text-gray-600">Go to Students → find the student → click View. The proof of registration appears automatically.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">Download PDF</p>
                  <p className="text-sm text-gray-600">Click the pink Download PDF button. The document saves to your computer with the student number in the filename.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">Print</p>
                  <p className="text-sm text-gray-600">Click Print Document. Your printer dialog will open. Print on official letterhead if available.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm" style={{ color: '#1B1F8A' }}>The proof includes: student photo, student number, course details, official stamp, verification code and college contact details. It is accepted by NSFAS, employers and bursary providers.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'marks' && (
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1B1F8A' }}>🎓 Marks & Assessments</h3>
              <div className="space-y-3">
                {[
                  { title: 'Capturing marks', desc: 'Click Marks & Assessments in the sidebar. Select the course from the dropdown. Enter marks for each student per subject. The system automatically calculates the average and shows Pass or Fail.' },
                  { title: 'Passing mark', desc: 'Students need 50% or above to pass. The system colour codes results: green = pass, red = fail, orange = at risk (below 55%).' },
                  { title: 'Exporting marks', desc: 'Click Export to CSV to download marks as a spreadsheet. This can be used for department submission.' },
                  { title: 'Submitting to department', desc: 'Click Submit to Department. This records the submission in the system. Export the CSV file and upload it to the DHET portal.' },
                ].map(item => (
                  <div key={item.title} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'finance' && (
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1B1F8A' }}>💰 Finance & Payments</h3>
              <div className="space-y-3">
                {[
                  { title: 'Viewing fee status', desc: 'Click Finance in the sidebar. You will see total fees billed, total collected, outstanding amounts and number of students in arrears.' },
                  { title: 'Recording a payment', desc: 'Find the student in the Finance tab. Click Record Payment. Enter the amount received and confirm. A receipt number is generated automatically.' },
                  { title: 'Payment receipts', desc: 'Click the Receipts tab to see all payment history with receipt numbers, amounts and dates.' },
                  { title: 'Exporting finance report', desc: 'Click Export Report at the top right. This downloads a complete Excel file with all fee statements and receipts.' },
                  { title: 'Outstanding fees', desc: 'Students showing red amounts have outstanding balances. Use the Communication module to send SMS reminders to these students.' },
                ].map(item => (
                  <div key={item.title} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'attendance' && (
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1B1F8A' }}>📅 Attendance Tracking</h3>
              <div className="space-y-3">
                {[
                  { title: 'Taking attendance', desc: 'Click Attendance in the sidebar. Select the course and date. Mark each student as Present, Absent or Late. Click Save Register.' },
                  { title: 'Mark all present', desc: 'Click the green Mark All Present button to quickly mark everyone present, then change individual students who are absent.' },
                  { title: 'Attendance history', desc: 'Saved registers appear in the Attendance History section below. You can see present and absent counts per session.' },
                  { title: 'Exporting attendance', desc: 'Click Export Register to download the full attendance history as an Excel file.' },
                ].map(item => (
                  <div key={item.title} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'reports' && (
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1B1F8A' }}>📊 Reports & Exports</h3>
              <div className="space-y-3">
                {[
                  { title: 'Student Register Export', desc: 'Downloads a complete Excel file with all student personal details, courses and payment plans. Use this for record keeping.' },
                  { title: 'Finance Report Export', desc: 'Downloads fee statements for all students with paid amounts, outstanding balances and all receipts on a separate sheet.' },
                  { title: 'Attendance Export', desc: 'Downloads the complete attendance register for all courses and campuses.' },
                  { title: 'Full College Report', desc: 'Downloads everything — students, finance and attendance — in one Excel file with multiple sheets.' },
                  { title: 'DHET Submission', desc: 'Click the DHET Submission tab. Click Generate DHET Submission File. This creates a formatted Excel file ready to upload to the DHET portal at dhet.gov.za.' },
                ].map(item => (
                  <div key={item.title} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'communication' && (
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1B1F8A' }}>💬 Communication</h3>
              <div className="space-y-3">
                {[
                  { title: 'Sending bulk SMS', desc: 'Click Communication in the sidebar. Select the SMS tab. Choose your recipients — all students, a specific campus or students with outstanding fees. Type your message or select a template. Click Send.' },
                  { title: 'WhatsApp messages', desc: 'Select the WhatsApp tab. Same process as SMS. Messages are sent via the SA Shepherd College WhatsApp Business account: 081 773 0975.' },
                  { title: 'Message templates', desc: 'Ready-made templates are available for: fee reminders, exam notices, registration open, results ready and welcome messages. Click any template to load it.' },
                  { title: 'Message history', desc: 'Click the Message History tab to see all previously sent messages with recipient counts and dates.' },
                ].map(item => (
                  <div key={item.title} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'student-portal' && (
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#1B1F8A' }}>🎓 Student Portal</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-1">How students log in</p>
                  <p className="text-sm text-gray-600">Students go to the same URL and click Student Portal Login. They enter their student number and password. Default password is the last 6 digits of their ID number.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-1">What students can see</p>
                  <p className="text-sm text-gray-600">My Overview — course, average mark and outstanding balance. My Marks — all subjects with term marks and results. Proof of Registration — download or print their own proof. My Account — fee statement and balance.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm" style={{ color: '#1B1F8A' }}>Students cannot edit any information. They can only view their own data. This protects the integrity of college records.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}