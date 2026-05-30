import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Deregistration({ role }) {
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reason, setReason] = useState('');
  const [confirmName, setConfirmName] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line

  const loadData = async () => {
    try {
      const [reqRes, studRes] = await Promise.all([
        fetch(`${API_URL}/api/deregistration`, { headers }),
        fetch(`${API_URL}/api/students`, { headers }),
      ]);
      const reqData = await reqRes.json();
      const studData = await studRes.json();
      if (Array.isArray(reqData)) setRequests(reqData);
      if (Array.isArray(studData)) setStudents(studData.filter(s => s.status === 'Active' && !s.is_deleted));
    } catch (err) { console.error(err); }
  };

  const handleRequest = async () => {
    if (!selectedStudent || !reason) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/deregistration/request`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          studentId: selectedStudent.id,
          studentNumber: selectedStudent.student_number,
          studentName: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
          reason,
          requestedBy: role,
        }),
      });
      const data = await res.json();
      if (data.id) {
        alert('✅ Deregistration request submitted successfully!');
        setShowRequest(false);
        setSelectedStudent(null);
        setReason('');
        loadData();
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to APPROVE this deregistration? This will deregister the student.')) return;
    try {
      await fetch(`${API_URL}/api/deregistration/${id}/approve`, { method: 'PATCH', headers });
      loadData();
      alert('✅ Deregistration approved.');
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    try {
      await fetch(`${API_URL}/api/deregistration/${id}/reject`, { method: 'PATCH', headers });
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!selectedStudent || !confirmName || !deleteReason) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/students/${selectedStudent.id}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ confirmName, reason: deleteReason }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.message}`);
        setShowDelete(false);
        setSelectedStudent(null);
        setConfirmName('');
        setDeleteReason('');
        setStep(1);
        loadData();
      } else {
        alert('❌ ' + data.error);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1B1F8A' }}>Deregistration</h2>
          <p className="text-gray-500 text-sm mt-1">Manage student deregistration requests</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowRequest(true)}
            className="px-4 py-2 text-white rounded-lg text-sm font-medium"
            style={{ background: '#E91E8C' }}>
            📋 New Request
          </button>
          {(role === 'admin' || role === 'superadmin') && (
            <button onClick={() => { setShowDelete(true); setStep(1); }}
              className="px-4 py-2 text-white rounded-lg text-sm font-medium"
              style={{ background: '#dc2626' }}>
              🗑️ Delete Student
            </button>
          )}
        </div>
      </div>

      {/* Requests */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold text-gray-800">Deregistration Requests ({requests.length})</h3>
        </div>
        {requests.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-500">No deregistration requests yet.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ background: '#1B1F8A' }}>
              <tr className="text-left text-xs text-white">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Student Number</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Requested By</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                {(role === 'admin' || role === 'superadmin') && <th className="px-6 py-4">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{req.student_name}</td>
                  <td className="px-6 py-4" style={{ color: '#E91E8C' }}>{req.student_number}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{req.reason}</td>
                  <td className="px-6 py-4 capitalize text-gray-600">{req.requested_by}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(req.created_at).toLocaleDateString('en-ZA')}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: req.status === 'approved' ? '#f0fdf4' : req.status === 'rejected' ? '#fef2f2' : '#fefce8',
                        color: req.status === 'approved' ? '#16a34a' : req.status === 'rejected' ? '#dc2626' : '#ca8a04'
                      }}>
                      {req.status}
                    </span>
                  </td>
                  {(role === 'admin' || role === 'superadmin') && (
                    <td className="px-6 py-4">
                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(req.id)}
                            className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                            style={{ background: '#8DC63F' }}>
                            ✅ Approve
                          </button>
                          <button onClick={() => handleReject(req.id)}
                            className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                            style={{ background: '#dc2626' }}>
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Request Modal */}
      {showRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-6" style={{ color: '#1B1F8A' }}>New Deregistration Request</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student *</label>
                <select value={selectedStudent?.id || ''}
                  onChange={(e) => setSelectedStudent(students.find(s => s.id === parseInt(e.target.value)))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name} — {s.student_number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Deregistration *</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none"
                  rows={4} placeholder="Provide a detailed reason..." />
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">⚠️ This request will be reviewed and must be approved by an administrator before taking effect.</p>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setShowRequest(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700">Cancel</button>
              <button onClick={handleRequest} disabled={loading}
                className="flex-1 py-3 text-white font-bold rounded-lg disabled:opacity-50"
                style={{ background: '#E91E8C' }}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Student Modal — 3 steps */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                {step}
              </div>
              <h3 className="text-lg font-bold text-red-600">Delete Student — Step {step} of 3</h3>
            </div>

            {step === 1 && (
              <div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <p className="text-sm text-red-800 font-semibold mb-2">⚠️ WARNING — This action is permanent!</p>
                  <p className="text-sm text-red-700">Deleting a student will remove them from the active system. This should only be done for wrongly registered students. You cannot undo this action.</p>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student to Delete *</label>
                <select value={selectedStudent?.id || ''}
                  onChange={(e) => setSelectedStudent(students.find(s => s.id === parseInt(e.target.value)))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none mb-4">
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name} — {s.student_number}</option>
                  ))}
                </select>
                <div className="flex gap-4">
                  <button onClick={() => setShowDelete(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700">Cancel</button>
                  <button onClick={() => selectedStudent && setStep(2)}
                    disabled={!selectedStudent}
                    className="flex-1 py-3 text-white font-bold rounded-lg disabled:opacity-50"
                    style={{ background: '#dc2626' }}>
                    Next →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  You are about to delete: <strong>{selectedStudent?.first_name} {selectedStudent?.last_name}</strong>
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for deletion *</label>
                  <textarea value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none"
                    rows={3} placeholder="e.g. Wrong student registered, duplicate entry..." />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700">← Back</button>
                  <button onClick={() => deleteReason && setStep(3)}
                    disabled={!deleteReason}
                    className="flex-1 py-3 text-white font-bold rounded-lg disabled:opacity-50"
                    style={{ background: '#dc2626' }}>
                    Next →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg mb-6">
                  <p className="text-sm text-red-800 font-semibold mb-2">🔒 Final Confirmation Required</p>
                  <p className="text-sm text-red-700 mb-3">
                    To confirm deletion, type the student's full name exactly as shown below:
                  </p>
                  <p className="font-bold text-red-900 text-center text-lg">
                    {selectedStudent?.first_name} {selectedStudent?.last_name}
                  </p>
                </div>
                <input value={confirmName} onChange={(e) => setConfirmName(e.target.value)}
                  className="w-full border-2 border-red-300 rounded-lg px-4 py-3 text-sm focus:outline-none mb-4"
                  placeholder="Type student's full name to confirm" />
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700">← Back</button>
                  <button onClick={handleDelete} disabled={loading ||
                    confirmName !== `${selectedStudent?.first_name} ${selectedStudent?.last_name}`}
                    className="flex-1 py-3 text-white font-bold rounded-lg disabled:opacity-50"
                    style={{ background: '#dc2626' }}>
                    {loading ? 'Deleting...' : '🗑️ Delete Permanently'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}