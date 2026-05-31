import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const COURSES = [
  'Diesel & Motor Mechanic N1-N6',
  'Mechanical Engineering N1-N6',
  'Electrical Engineering N1-N6',
  'Rigging Course N1-N6',
  'Fitting & Turning N1-N6',
  'Instrumentation N4-N6',
  'Safety Management (OHS) L2',
  'Occupational Health & Safety (OHS) L5',
  'Social Auxiliary Work NQF Level 4',
  'Health Promotion Officer L3',
  'Diploma Early Childhood Full Time',
  'Early Childhood Development L4',
  'Human Resource N4-N6',
  'Tourism Management N4-N6',
  'Management Assistance N4-N6',
  'Public Relations N4-N6',
  'SHAMTRACK', 'Basic Fire Fighting', 'Working at Heights',
  'First Aid Level 1', 'First Aid Level 2', 'First Aid Level 3',
  'Matric Rewrite - 1 Subject', 'Matric Rewrite - 2 Subjects',
];

export default function Assessments({ assignedCourse, role }) {
  const [assessments, setAssessments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(assignedCourse || '');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [results, setResults] = useState({});
  const [form, setForm] = useState({
    subject: '', title: '', type: 'Assignment', weight: '', maxMark: '100', dueDate: ''
  });

  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    if (selectedCourse) {
      loadAssessments();
      loadStudents();
    }
  }, [selectedCourse]); // eslint-disable-line

  const loadAssessments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/assessments/${encodeURIComponent(selectedCourse)}`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) setAssessments(data);
    } catch (err) { console.error(err); }
  };

  const loadStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/students`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data.filter(s => s.course === selectedCourse && s.status === 'Active'));
      }
    } catch (err) { console.error(err); }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(`${API_URL}/api/assessments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...form, course: selectedCourse }),
      });
      const data = await res.json();
      if (data.id) {
        setShowCreate(false);
        setForm({ subject: '', title: '', type: 'Assignment', weight: '', maxMark: '100', dueDate: '' });
        loadAssessments();
        alert('✅ Assessment created successfully!');
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveResults = async () => {
    try {
      const resultData = students.map(s => ({
        studentId: s.id,
        studentNumber: s.student_number,
        studentName: `${s.first_name} ${s.last_name}`,
        mark: parseFloat(results[s.student_number] || 0),
      }));
      const res = await fetch(`${API_URL}/api/assessments/${selectedAssessment.id}/results`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ results: resultData }),
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Results saved successfully!');
        setSelectedAssessment(null);
        setResults({});
      }
    } catch (err) { console.error(err); }
  };

  const totalWeight = assessments.reduce((sum, a) => sum + parseFloat(a.weight || 0), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1B1F8A' }}>Summative Assessments</h2>
          <p className="text-gray-500 text-sm mt-1">Create and manage assessments with custom weightings</p>
        </div>
        {selectedCourse && (
          <button onClick={() => setShowCreate(true)}
            className="px-4 py-2 text-white rounded-lg text-sm font-medium"
            style={{ background: '#1B1F8A' }}>
            ➕ Create Assessment
          </button>
        )}
      </div>

      {!assignedCourse && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
            <option value="">-- Select Course --</option>
            {COURSES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      )}

      {assignedCourse && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium" style={{ color: '#1B1F8A' }}>
            📚 Your assigned course: <strong>{assignedCourse}</strong>
          </p>
        </div>
      )}

      {selectedCourse && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-gray-500">Total Assessments</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#1B1F8A' }}>{assessments.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-gray-500">Total Weight</p>
              <p className="text-2xl font-bold mt-1" style={{ color: totalWeight === 100 ? '#8DC63F' : '#E91E8C' }}>
                {totalWeight}%
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-gray-500">Students in Course</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#1B1F8A' }}>{students.length}</p>
            </div>
          </div>

          {totalWeight !== 100 && assessments.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">⚠️ Total weight is {totalWeight}%. Weightings should add up to 100%.</p>
            </div>
          )}

          {assessments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-gray-500">No assessments yet. Create your first assessment above.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead style={{ background: '#1B1F8A' }}>
                  <tr className="text-left text-xs text-white">
                    <th className="px-6 py-4">Assessment Title</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Weight</th>
                    <th className="px-6 py-4">Max Mark</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {assessments.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{a.title}</td>
                      <td className="px-6 py-4 text-gray-600">{a.subject}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ background: '#f0f4ff', color: '#1B1F8A' }}>
                          {a.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold" style={{ color: '#E91E8C' }}>{a.weight}%</td>
                      <td className="px-6 py-4">{a.max_mark}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {a.due_date ? new Date(a.due_date).toLocaleDateString('en-ZA') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setSelectedAssessment(a)}
                          className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                          style={{ background: '#8DC63F' }}>
                          Enter Results
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Create Assessment Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
            <h3 className="text-lg font-bold mb-6" style={{ color: '#1B1F8A' }}>Create New Assessment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Title *</label>
                <input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                  placeholder="e.g. Assignment 1, Test 2, Final Exam" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input value={form.subject} onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                  placeholder="e.g. Mathematics N3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select value={form.type} onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
                    <option>Assignment</option>
                    <option>Test</option>
                    <option>Exam</option>
                    <option>Project</option>
                    <option>Practical</option>
                    <option>Portfolio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (%) *</label>
                  <input type="number" value={form.weight}
                    onChange={(e) => setForm(p => ({ ...p, weight: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                    placeholder="e.g. 30" min="1" max="100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Mark</label>
                  <input type="number" value={form.maxMark}
                    onChange={(e) => setForm(p => ({ ...p, maxMark: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                    placeholder="100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" value={form.dueDate}
                    onChange={(e) => setForm(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  Current total weight: <strong>{totalWeight}%</strong> + this: <strong>{form.weight || 0}%</strong> = <strong>{totalWeight + parseFloat(form.weight || 0)}%</strong>
                </p>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setShowCreate(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700">Cancel</button>
              <button onClick={handleCreate}
                className="flex-1 py-3 text-white font-bold rounded-lg"
                style={{ background: '#1B1F8A' }}>
                Create Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enter Results Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto p-8">
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1B1F8A' }}>
              Enter Results: {selectedAssessment.title}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Max Mark: {selectedAssessment.max_mark} | Weight: {selectedAssessment.weight}%
            </p>
            {students.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active students found for this course.</p>
            ) : (
              <table className="w-full mb-6">
                <thead style={{ background: '#1B1F8A' }}>
                  <tr className="text-left text-xs text-white">
                    <th className="px-4 py-3">Student Number</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Mark (/{selectedAssessment.max_mark})</th>
                    <th className="px-4 py-3">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {students.map(s => {
                    const mark = parseFloat(results[s.student_number] || 0);
                    const percent = ((mark / parseFloat(selectedAssessment.max_mark)) * 100).toFixed(1);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium" style={{ color: '#E91E8C' }}>{s.student_number}</td>
                        <td className="px-4 py-3">{s.first_name} {s.last_name}</td>
                        <td className="px-4 py-3">
                          <input type="number" min="0" max={selectedAssessment.max_mark}
                            value={results[s.student_number] || ''}
                            onChange={(e) => setResults(p => ({ ...p, [s.student_number]: e.target.value }))}
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-center text-sm focus:outline-none"
                            placeholder="0" />
                        </td>
                        <td className="px-4 py-3 font-medium"
                          style={{ color: parseFloat(percent) >= 50 ? '#8DC63F' : '#E91E8C' }}>
                          {results[s.student_number] ? `${percent}%` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            <div className="flex gap-4">
              <button onClick={() => { setSelectedAssessment(null); setResults({}); }}
                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700">Cancel</button>
              <button onClick={handleSaveResults}
                className="flex-1 py-3 text-white font-bold rounded-lg"
                style={{ background: '#8DC63F' }}>
                💾 Save Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}