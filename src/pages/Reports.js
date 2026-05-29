import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { getStudents, getFinance, getAttendance } from '../utils/api';

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [finance, setFinance] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('exports');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, f, a] = await Promise.all([
        getStudents(),
        getFinance(),
        getAttendance(),
      ]);
      if (Array.isArray(s)) setStudents(s);
      if (Array.isArray(f)) setFinance(f);
      if (Array.isArray(a)) setAttendance(a);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const exportStudentsExcel = () => {
    const data = students.map(s => ({
      'Student Number': s.student_number,
      'Title': s.title,
      'First Name': s.first_name,
      'Last Name': s.last_name,
      'ID Number': s.id_number,
      'Date of Birth': s.date_of_birth,
      'Gender': s.gender,
      'Home Language': s.home_language,
      'Cell Number': s.cell_number,
      'Email': s.email,
      'Address': s.address,
      'Faculty': s.faculty,
      'Course': s.course,
      'Campus': s.campus,
      'Study Mode': s.study_mode,
      'Payer Type': s.payer_type,
      'Payer Name': s.payer_name,
      'Deposit (R)': s.deposit,
      'Monthly Fee (R)': s.monthly_fee,
      'Total Fee (R)': s.total_fee,
      'Duration': s.duration,
      'Status': s.status,
      'Registration Date': new Date(s.created_at).toLocaleDateString('en-ZA'),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Column widths
    ws['!cols'] = [
      { wch: 18 }, { wch: 8 }, { wch: 15 }, { wch: 15 },
      { wch: 16 }, { wch: 14 }, { wch: 10 }, { wch: 14 },
      { wch: 14 }, { wch: 25 }, { wch: 30 }, { wch: 20 },
      { wch: 35 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
      { wch: 20 }, { wch: 12 }, { wch: 14 }, { wch: 12 },
      { wch: 12 }, { wch: 10 }, { wch: 18 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, `SASC_Students_${new Date().getFullYear()}.xlsx`);
  };

  const exportFinanceExcel = () => {
    const data = students.map(s => {
      const paid = finance
        .filter(f => f.student_number === s.student_number)
        .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
      const outstanding = parseFloat(s.total_fee || 0) - paid;
      return {
        'Student Number': s.student_number,
        'Student Name': `${s.first_name} ${s.last_name}`,
        'Course': s.course,
        'Campus': s.campus,
        'Payer Type': s.payer_type,
        'Payer Name': s.payer_name,
        'Payer Cell': s.payer_cell,
        'Deposit (R)': s.deposit,
        'Monthly Fee (R)': s.monthly_fee,
        'Total Fee (R)': s.total_fee,
        'Amount Paid (R)': paid.toFixed(2),
        'Outstanding (R)': outstanding.toFixed(2),
        'Payment Status': outstanding <= 0 ? 'PAID' : 'OUTSTANDING',
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = Array(13).fill({ wch: 18 });
    XLSX.utils.book_append_sheet(wb, ws, 'Finance');

    // Receipts sheet
    const receipts = finance.map(f => ({
      'Receipt Number': f.receipt_number,
      'Student Number': f.student_number,
      'Student Name': f.student_name,
      'Amount (R)': f.amount,
      'Payment Method': f.payment_method,
      'Reference': f.reference,
      'Date': new Date(f.created_at).toLocaleDateString('en-ZA'),
    }));
    const ws2 = XLSX.utils.json_to_sheet(receipts);
    ws2['!cols'] = Array(7).fill({ wch: 20 });
    XLSX.utils.book_append_sheet(wb, ws2, 'Receipts');

    XLSX.writeFile(wb, `SASC_Finance_${new Date().getFullYear()}.xlsx`);
  };

  const exportDHET = () => {
    const data = students.map((s, index) => ({
      'No': index + 1,
      'Exam Centre Number': '6999 926 54',
      'Student Number': s.student_number,
      'Surname': s.last_name,
      'First Name(s)': s.first_name,
      'ID Number': s.id_number,
      'Gender': s.gender === 'Male' ? 'M' : 'F',
      'Date of Birth': s.date_of_birth,
      'Qualification': s.course,
      'NQF Level': s.faculty?.includes('Engineering') ? '3' :
        s.faculty?.includes('Health') ? '4' :
        s.faculty?.includes('Education') ? '4' :
        s.faculty?.includes('Business') ? '4' : '3',
      'Campus': s.campus,
      'Study Mode': s.study_mode,
      'Registration Year': new Date(s.created_at).getFullYear(),
      'Status': s.status,
    }));

    const wb = XLSX.utils.book_new();

    // Add header info
    const headerInfo = [
      ['SA SHEPHERD COLLEGE — DHET SUBMISSION'],
      ['Exam Center Number: 6999 926 54'],
      ['DHET Reg Number: 0699992654'],
      [`Generated: ${new Date().toLocaleDateString('en-ZA')}`],
      [`Total Students: ${students.length}`],
      [],
    ];

    const ws = XLSX.utils.aoa_to_sheet(headerInfo);
    XLSX.utils.sheet_add_json(ws, data, { origin: 'A7' });
    ws['!cols'] = Array(14).fill({ wch: 20 });
    XLSX.utils.book_append_sheet(wb, ws, 'DHET Submission');

    // Per campus sheets
    ['Burgersfort Campus', 'Polokwane Campus'].forEach(campus => {
      const campusData = data.filter(d => d['Campus'] === campus);
      if (campusData.length > 0) {
        const campusWs = XLSX.utils.json_to_sheet(campusData);
        campusWs['!cols'] = Array(14).fill({ wch: 20 });
        XLSX.utils.book_append_sheet(wb, campusWs, campus.replace(' Campus', ''));
      }
    });

    XLSX.writeFile(wb, `SASC_DHET_Submission_${new Date().getFullYear()}.xlsx`);
  };

  const exportAttendanceExcel = () => {
    const data = attendance.map(a => ({
      'Date': a.date,
      'Student Number': a.student_number,
      'Student Name': a.student_name,
      'Course': a.course,
      'Campus': a.campus,
      'Status': a.status,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = Array(6).fill({ wch: 20 });
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `SASC_Attendance_${new Date().getFullYear()}.xlsx`);
  };

  const exportFullReport = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1 - Students
    const studentsData = students.map(s => ({
      'Student Number': s.student_number,
      'Full Name': `${s.first_name} ${s.last_name}`,
      'ID Number': s.id_number,
      'Cell': s.cell_number,
      'Course': s.course,
      'Campus': s.campus,
      'Study Mode': s.study_mode,
      'Status': s.status,
      'Registration Date': new Date(s.created_at).toLocaleDateString('en-ZA'),
    }));
    const ws1 = XLSX.utils.json_to_sheet(studentsData);
    ws1['!cols'] = Array(9).fill({ wch: 20 });
    XLSX.utils.book_append_sheet(wb, ws1, 'Students');

    // Sheet 2 - Finance Summary
    const financeData = students.map(s => {
      const paid = finance
        .filter(f => f.student_number === s.student_number)
        .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
      return {
        'Student Number': s.student_number,
        'Student Name': `${s.first_name} ${s.last_name}`,
        'Total Fee (R)': s.total_fee,
        'Paid (R)': paid.toFixed(2),
        'Outstanding (R)': (parseFloat(s.total_fee || 0) - paid).toFixed(2),
        'Status': paid >= parseFloat(s.total_fee || 0) ? 'PAID' : 'OUTSTANDING',
      };
    });
    const ws2 = XLSX.utils.json_to_sheet(financeData);
    ws2['!cols'] = Array(6).fill({ wch: 20 });
    XLSX.utils.book_append_sheet(wb, ws2, 'Finance Summary');

    // Sheet 3 - Attendance
    const ws3 = XLSX.utils.json_to_sheet(attendance.map(a => ({
      'Date': a.date,
      'Student': a.student_name,
      'Course': a.course,
      'Campus': a.campus,
      'Status': a.status,
    })));
    ws3['!cols'] = Array(5).fill({ wch: 20 });
    XLSX.utils.book_append_sheet(wb, ws3, 'Attendance');

    XLSX.writeFile(wb, `SASC_Full_Report_${new Date().getFullYear()}.xlsx`);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#1B1F8A' }}>Reports & Exports</h2>
        <p className="text-gray-500 text-sm mt-1">Export data to Excel and generate department submissions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {['exports', 'dhet'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-lg text-sm font-medium capitalize"
            style={{
              background: activeTab === tab ? '#1B1F8A' : 'white',
              color: activeTab === tab ? 'white' : '#374151',
              border: activeTab === tab ? 'none' : '1px solid #d1d5db'
            }}>
            {tab === 'exports' ? '📊 Excel Exports' : '🏛️ DHET Submission'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500">Loading data...</p>
        </div>
      ) : (
        <>
          {activeTab === 'exports' && (
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  title: 'Student Register',
                  description: 'Complete list of all registered students with personal details, courses and payment plans.',
                  icon: '👥',
                  count: `${students.length} students`,
                  action: exportStudentsExcel,
                  label: 'Export Students',
                  color: '#1B1F8A',
                },
                {
                  title: 'Finance Report',
                  description: 'Fee statements, payment history, outstanding balances and receipts for all students.',
                  icon: '💰',
                  count: `${finance.length} transactions`,
                  action: exportFinanceExcel,
                  label: 'Export Finance',
                  color: '#E91E8C',
                },
                {
                  title: 'Attendance Register',
                  description: 'Daily attendance records for all courses and campuses.',
                  icon: '📅',
                  count: `${attendance.length} records`,
                  action: exportAttendanceExcel,
                  label: 'Export Attendance',
                  color: '#8DC63F',
                },
                {
                  title: 'Full College Report',
                  description: 'Complete report with all students, finance and attendance in one Excel file with multiple sheets.',
                  icon: '📋',
                  count: 'All data',
                  action: exportFullReport,
                  label: 'Export Full Report',
                  color: '#1B1F8A',
                },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-xl shadow-sm p-6 border-t-4"
                  style={{ borderColor: item.color }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">{item.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full text-white font-medium"
                        style={{ background: item.color }}>{item.count}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                  <button onClick={item.action}
                    className="w-full py-2.5 text-white font-semibold rounded-lg text-sm"
                    style={{ background: item.color }}>
                    📥 {item.label}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'dhet' && (
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-t-4" style={{ borderColor: '#1B1F8A' }}>
                <h3 className="font-bold text-gray-800 mb-2">DHET / QCTO Department Submission</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Generate the official submission file formatted for the Department of Higher Education and Training.
                  Includes all required fields: Exam Centre Number, student details, qualifications and NQF levels.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold" style={{ color: '#1B1F8A' }}>{students.length}</p>
                    <p className="text-sm text-gray-500">Total Students</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold" style={{ color: '#E91E8C' }}>
                      {students.filter(s => s.campus === 'Burgersfort Campus').length}
                    </p>
                    <p className="text-sm text-gray-500">Burgersfort</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold" style={{ color: '#8DC63F' }}>
                      {students.filter(s => s.campus === 'Polokwane Campus').length}
                    </p>
                    <p className="text-sm text-gray-500">Polokwane</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
                  <p className="font-semibold text-gray-700 mb-2">This export includes:</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>✅ Exam Centre Number: 6999 926 54</li>
                    <li>✅ DHET Registration Number: 0699992654</li>
                    <li>✅ Student numbers, names and ID numbers</li>
                    <li>✅ Qualifications and NQF levels</li>
                    <li>✅ Campus breakdown (Burgersfort & Polokwane)</li>
                    <li>✅ Study modes and registration year</li>
                    <li>✅ Separate sheets per campus</li>
                  </ul>
                </div>

                <button onClick={exportDHET}
                  className="w-full py-3 text-white font-bold rounded-lg text-sm"
                  style={{ background: '#1B1F8A' }}>
                  🏛️ Generate DHET Submission File
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Submission Instructions</h4>
                <ol className="text-sm text-yellow-700 space-y-2 list-decimal list-inside">
                  <li>Download the DHET submission file above</li>
                  <li>Log in to the DHET portal at <strong>dhet.gov.za</strong></li>
                  <li>Navigate to Student Registrations</li>
                  <li>Upload the Excel file</li>
                  <li>Verify all student details are correct</li>
                  <li>Submit before the deadline</li>
                </ol>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}