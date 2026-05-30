import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function DHETPortal() {
  const [activeTab, setActiveTab] = useState('export');
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [fileContent, setFileContent] = useState('');

  const token = localStorage.getItem('token');

  const handleExport = async () => {
    try {
      const res = await fetch(`${API_URL}/api/dhet/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DHET_Submission_${new Date().getFullYear()}.txt`;
      a.click();
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFileContent(ev.target.result);
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!fileContent) return;
    setImporting(true);
    try {
      const res = await fetch(`${API_URL}/api/dhet/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: fileContent }),
      });
      const data = await res.json();
      if (data.success) {
        setImportResults(data);
      } else {
        alert('Import failed: ' + data.error);
      }
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
    setImporting(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#1B1F8A' }}>DHET Portal</h2>
        <p className="text-gray-500 text-sm mt-1">Export student data as text file for DHET submission and import received files</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {[
          { key: 'export', label: '📤 Export to DHET' },
          { key: 'import', label: '📥 Import from DHET' },
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

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Export Student Data for DHET</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will generate a text file (.txt) containing all registered student data formatted for DHET submission.
              You can then email this file to DHET at the relevant email address.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
              <p className="font-semibold text-gray-700 mb-2">The export includes:</p>
              <ul className="space-y-1 text-gray-600">
                <li>✅ Exam Centre Number: 6999 926 54</li>
                <li>✅ Student numbers, names and ID numbers</li>
                <li>✅ Gender and date of birth</li>
                <li>✅ Course/qualification enrolled</li>
                <li>✅ Campus and status</li>
                <li>✅ Pipe-separated format (|) as required by DHET</li>
              </ul>
            </div>
            <button onClick={handleExport}
              className="w-full py-3 text-white font-bold rounded-lg"
              style={{ background: '#1B1F8A' }}>
              📥 Download DHET Text File
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-800 mb-3">📧 How to submit to DHET</h4>
            <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
              <li>Click Download DHET Text File above</li>
              <li>Open your email (Outlook or Gmail)</li>
              <li>Create a new email to your DHET regional office</li>
              <li>Attach the downloaded .txt file</li>
              <li>Subject: Student Registration Submission — SA Shepherd College — {new Date().getFullYear()}</li>
              <li>Send and keep a copy of the email for your records</li>
            </ol>
          </div>
        </div>
      )}

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Import DHET Response File</h3>
            <p className="text-sm text-gray-600 mb-4">
              When you receive a text file back from DHET, upload it here to generate a report of the data.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
              <p className="text-4xl mb-3">📄</p>
              <p className="text-gray-600 font-medium mb-2">Upload DHET Text File</p>
              <p className="text-gray-400 text-sm mb-4">Accepts .txt files only</p>
              <input type="file" accept=".txt"
                onChange={handleFileUpload}
                className="block mx-auto text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:text-white"
                style={{ '--file-bg': '#1B1F8A' }} />
            </div>

            {fileContent && (
              <div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">{fileContent.substring(0, 500)}...</pre>
                </div>
                <button onClick={handleImport} disabled={importing}
                  className="w-full py-3 text-white font-bold rounded-lg disabled:opacity-50"
                  style={{ background: '#8DC63F' }}>
                  {importing ? 'Processing...' : '📊 Process & Generate Report'}
                </button>
              </div>
            )}
          </div>

          {importResults && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">✅</div>
                <div>
                  <h3 className="font-bold text-gray-800">Import Successful</h3>
                  <p className="text-sm text-gray-500">{importResults.total} records processed</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: '#1B1F8A' }}>
                    <tr className="text-left text-xs text-white">
                      <th className="px-4 py-3">Student Number</th>
                      <th className="px-4 py-3">Surname</th>
                      <th className="px-4 py-3">First Name</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Campus</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {importResults.records.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium" style={{ color: '#E91E8C' }}>{r.studentNumber}</td>
                        <td className="px-4 py-3">{r.surname}</td>
                        <td className="px-4 py-3">{r.firstName}</td>
                        <td className="px-4 py-3 text-gray-600">{r.course}</td>
                        <td className="px-4 py-3 text-gray-600">{r.campus}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}