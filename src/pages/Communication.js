import React, { useState, useEffect } from 'react';
import { getStudents } from '../utils/api';

export default function Communication() {
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('sms');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      if (Array.isArray(data)) setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = students.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'burgersfort') return s.campus === 'Burgersfort Campus';
    if (filter === 'polokwane') return s.campus === 'Polokwane Campus';
    if (filter === 'outstanding') return parseFloat(s.total_fee || 0) > 0;
    return true;
  });

  const toggleStudent = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleSend = async () => {
    if (!message.trim() || selectedStudents.length === 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    const record = {
      id: Date.now(),
      type: activeTab.toUpperCase(),
      message,
      recipients: selectedStudents.length,
      date: new Date().toLocaleDateString('en-ZA'),
      time: new Date().toLocaleTimeString('en-ZA'),
      status: 'Sent',
    };
    setHistory(prev => [record, ...prev]);
    setSent(true);
    setMessage('');
    setSelectedStudents([]);
    setLoading(false);
    setTimeout(() => setSent(false), 3000);
  };

  const templates = [
    { label: 'Fee Reminder', text: `Dear Student, this is a reminder that your fees at SA Shepherd College are outstanding. Please make payment before the 3rd of the month to avoid being excluded from classes. Contact us: 010 055 5115.` },
    { label: 'Exam Notice', text: `Dear Student, examinations are scheduled to begin soon at SA Shepherd College. Please ensure all outstanding fees are settled before exam entry. Contact your campus for more information.` },
    { label: 'Registration Open', text: `SA Shepherd College - Registration is now open for the new term. Visit our Burgersfort or Polokwane campus to register. Call: 010 055 5115 or 015 008 5102.` },
    { label: 'Results Ready', text: `Dear Student, your results are now available on the SA Shepherd College Student Portal. Log in with your student number to view your marks.` },
    { label: 'Welcome Message', text: `Welcome to SA Shepherd College! Your registration is confirmed. Please check your student portal for your timetable and important notices. We wish you a successful academic journey.` },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#1B1F8A' }}>Communication</h2>
        <p className="text-gray-500 text-sm mt-1">Send bulk SMS and WhatsApp messages to students</p>
      </div>

      {sent && (
        <div className="mb-6 p-4 rounded-xl text-white font-medium text-center" style={{ background: '#8DC63F' }}>
          ✅ Messages sent successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {[
          { key: 'sms', label: '📱 Bulk SMS' },
          { key: 'whatsapp', label: '💬 WhatsApp' },
          { key: 'history', label: '📋 Message History' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="px-5 py-2 rounded-lg text-sm font-medium"
            style={{
              background: activeTab === tab.key ? '#1B1F8A' : 'white',
              color: activeTab === tab.key ? 'white' : '#374151',
              border: activeTab === tab.key ? 'none' : '1px solid #d1d5db'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTab === 'sms' || activeTab === 'whatsapp') && (
        <div className="grid grid-cols-2 gap-6">

          {/* Left - Student Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Select Recipients</h3>
              <span className="text-sm font-medium px-3 py-1 rounded-full text-white"
                style={{ background: '#E91E8C' }}>
                {selectedStudents.length} selected
              </span>
            </div>

            {/* Filter */}
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none">
              <option value="all">All Students ({students.length})</option>
              <option value="burgersfort">Burgersfort Campus</option>
              <option value="polokwane">Polokwane Campus</option>
              <option value="outstanding">Students with Outstanding Fees</option>
            </select>

            <button onClick={selectAll}
              className="w-full py-2 text-sm font-medium rounded-lg mb-3 border"
              style={{ color: '#1B1F8A', borderColor: '#1B1F8A' }}>
              {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
            </button>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredStudents.map(student => (
                <div key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition"
                  style={{
                    borderColor: selectedStudents.includes(student.id) ? '#1B1F8A' : '#e5e7eb',
                    background: selectedStudents.includes(student.id) ? '#f0f4ff' : 'white'
                  }}>
                  <div className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: selectedStudents.includes(student.id) ? '#1B1F8A' : '#d1d5db',
                      background: selectedStudents.includes(student.id) ? '#1B1F8A' : 'white'
                    }}>
                    {selectedStudents.includes(student.id) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{student.cell_number} — {student.campus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Message */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">
              {activeTab === 'sms' ? '📱 SMS Message' : '💬 WhatsApp Message'}
            </h3>

            {/* Templates */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
              <div className="space-y-2">
                {templates.map(t => (
                  <button key={t.label}
                    onClick={() => setMessage(t.text)}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition">
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message box */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-gray-400">({message.length} characters)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
                placeholder="Type your message here or select a template above..."
              />
            </div>

            {activeTab === 'whatsapp' && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  💬 WhatsApp messages will be sent via the SA Shepherd College WhatsApp Business account: <strong>081 773 0975</strong>
                </p>
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={loading || selectedStudents.length === 0 || !message.trim()}
              className="w-full py-3 text-white font-bold rounded-lg disabled:opacity-50"
              style={{ background: activeTab === 'whatsapp' ? '#25D366' : '#1B1F8A' }}>
              {loading ? 'Sending...' : `Send to ${selectedStudents.length} students`}
            </button>

            {selectedStudents.length === 0 && (
              <p className="text-xs text-red-500 text-center mt-2">Please select at least one student</p>
            )}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {history.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-500">No messages sent yet. Send your first message to see history here.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead style={{ background: '#1B1F8A' }}>
                <tr className="text-left text-xs text-white">
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Recipients</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {history.map(h => (
                  <tr key={h.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ background: h.type === 'WHATSAPP' ? '#25D366' : '#1B1F8A' }}>
                        {h.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{h.message}</td>
                    <td className="px-6 py-4 font-medium" style={{ color: '#E91E8C' }}>{h.recipients} students</td>
                    <td className="px-6 py-4 text-gray-600">{h.date}</td>
                    <td className="px-6 py-4 text-gray-600">{h.time}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}