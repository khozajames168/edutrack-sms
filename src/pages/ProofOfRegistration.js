import React, { useRef } from 'react';
import logo from '../sasc-logo.png';

export default function ProofOfRegistration({ student, onBack }) {
  const printRef = useRef();

  const today = new Date().toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const verificationCode = student
    ? `SASC-${student.student_number || student.studentNumber}-${new Date().getFullYear()}-VRF`
    : '';

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Proof of Registration - SA Shepherd College</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; }
            .proof { position: relative; width: 210mm; min-height: 297mm; padding: 15mm; background: white; }
            .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(27, 31, 138, 0.06); font-weight: bold; white-space: nowrap; pointer-events: none; z-index: 0; }
            .header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; border-bottom: 4px solid #1B1F8A; margin-bottom: 15px; }
            .logo { width: 180px; }
            .header-right { text-align: right; }
            .header-right h1 { color: #1B1F8A; font-size: 20px; font-weight: bold; }
            .header-right p { color: #666; font-size: 11px; }
            .pink-bar { background: #E91E8C; color: white; text-align: center; padding: 8px; font-size: 14px; font-weight: bold; letter-spacing: 2px; margin-bottom: 15px; }
            .content { display: flex; gap: 20px; margin-bottom: 15px; position: relative; z-index: 1; }
            .photo-box { width: 110px; height: 130px; border: 3px solid #1B1F8A; flex-shrink: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f0f4ff; }
            .photo-box img { width: 100%; height: 100%; object-fit: cover; }
            .photo-placeholder { text-align: center; color: #1B1F8A; font-size: 12px; }
            .details { flex: 1; }
            .details table { width: 100%; border-collapse: collapse; font-size: 12px; }
            .details td { padding: 5px 8px; border-bottom: 1px solid #eee; }
            .details td:first-child { font-weight: bold; color: #1B1F8A; width: 40%; background: #f8f9ff; }
            .stamp-area { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; padding-top: 15px; border-top: 2px solid #1B1F8A; }
            .stamp { width: 100px; height: 100px; border: 3px solid #1B1F8A; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-align: center; color: #1B1F8A; font-size: 8px; font-weight: bold; padding: 10px; }
            .signature-line { border-top: 1px solid #333; width: 200px; margin-top: 50px; }
            .verification { background: #f0f4ff; border: 1px solid #1B1F8A; padding: 8px 12px; font-size: 10px; color: #1B1F8A; margin-top: 15px; text-align: center; }
            .qr-placeholder { width: 80px; height: 80px; border: 2px solid #1B1F8A; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #1B1F8A; text-align: center; }
            .footer { margin-top: 15px; padding-top: 10px; border-top: 2px solid #8DC63F; display: flex; justify-content: space-between; font-size: 10px; color: #666; }
            .notice { background: #fff8e1; border-left: 4px solid #E91E8C; padding: 8px 12px; font-size: 10px; color: #333; margin-top: 10px; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  if (!student) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-4xl mb-3">📄</p>
          <p className="text-gray-500">Go to Students and click "View" to generate proof of registration.</p>
        </div>
      </div>
    );
  }

  const studentName = student.first_name
    ? `${student.title || ''} ${student.first_name} ${student.last_name}`
    : `${student.firstName || ''} ${student.lastName || ''}`;

  const studentNumber = student.student_number || student.studentNumber;
  const course = student.course;
  const campus = student.campus;
  const studyMode = student.study_mode || student.studyMode;
  const faculty = student.faculty;
  const idNumber = student.id_number || student.idNumber;
  const cellNumber = student.cell_number || student.cellNumber;
  const photo = student.photo;

  return (
    <div className="p-8">
      {onBack && (
        <button onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm font-medium"
          style={{ color: '#1B1F8A' }}>
          ← Back to Students
        </button>
      )}

      <div className="flex gap-4 mb-6 justify-end">
        <button onClick={handlePrint}
          className="px-6 py-3 text-white font-semibold rounded-lg flex items-center gap-2"
          style={{ background: '#1B1F8A' }}>
          🖨️ Print Document
        </button>
        <button
          className="px-6 py-3 text-white font-semibold rounded-lg flex items-center gap-2"
          style={{ background: '#E91E8C' }}>
          📧 Email to Student
        </button>
      </div>

      {/* Proof Document */}
      <div ref={printRef} className="proof"
        style={{ maxWidth: '800px', margin: '0 auto', background: 'white', position: 'relative', padding: '40px', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

        {/* Watermark */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%) rotate(-45deg)',
          fontSize: '80px', color: 'rgba(27, 31, 138, 0.04)',
          fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none',
          zIndex: 0, userSelect: 'none'
        }}>
          SA SHEPHERD COLLEGE
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '4px solid #1B1F8A', marginBottom: '15px' }}>
            <img src={logo} alt="SA Shepherd College" style={{ width: '200px' }} />
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ color: '#1B1F8A', fontSize: '20px', fontWeight: 'bold' }}>SA SHEPHERD COLLEGE</h1>
              <p style={{ color: '#666', fontSize: '11px' }}>DHET Exam Center No. 6999 926 54</p>
              <p style={{ color: '#666', fontSize: '11px' }}>Burgersfort: 010 055 5115 | Polokwane: 015 008 5102</p>
              <p style={{ color: '#666', fontSize: '11px' }}>admin@sashepherdcollege.org.za</p>
            </div>
          </div>

          {/* Pink Title Bar */}
          <div style={{ background: '#E91E8C', color: 'white', textAlign: 'center', padding: '10px', fontSize: '16px', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '20px' }}>
            OFFICIAL CONFIRMATION OF REGISTRATION
          </div>

          {/* Green subtitle */}
          <div style={{ background: '#8DC63F', color: 'white', textAlign: 'center', padding: '5px', fontSize: '11px', marginBottom: '20px' }}>
            TO WHOM IT MAY CONCERN — Academic Year {new Date().getFullYear()}
          </div>

          {/* Student Details + Photo */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>

            {/* Photo */}
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: '110px', height: '130px', border: '3px solid #1B1F8A', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ff' }}>
                {photo
                  ? <img src={photo} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ textAlign: 'center', color: '#1B1F8A', fontSize: '11px', padding: '10px' }}>
                      <div style={{ fontSize: '30px' }}>👤</div>
                      <div>No Photo</div>
                    </div>
                }
              </div>
              <p style={{ fontSize: '9px', color: '#666', textAlign: 'center', marginTop: '4px' }}>Student Photo</p>
            </div>

            {/* Details Table */}
            <div style={{ flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                {[
                  { label: 'Student Name', value: studentName },
                  { label: 'Student Number', value: studentNumber },
                  { label: 'ID Number', value: idNumber },
                  { label: 'Cell Number', value: cellNumber },
                  { label: 'Faculty', value: faculty },
                  { label: 'Course Enrolled', value: course },
                  { label: 'Campus', value: campus },
                  { label: 'Study Mode', value: studyMode },
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
          <div style={{ background: '#fff8e1', borderLeft: '4px solid #E91E8C', padding: '10px 15px', fontSize: '11px', color: '#333', marginBottom: '20px' }}>
            This letter certifies that <strong>{studentName}</strong> is currently enrolled at SA Shepherd College for the {new Date().getFullYear()} academic year. This document serves as official proof of registration and is valid for use with NSFAS, bursary applications, employers and other institutions.
          </div>

          {/* Stamp + Signature + QR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #1B1F8A' }}>

            {/* Official Stamp */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '100px', height: '100px', border: '3px solid #1B1F8A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#1B1F8A', fontSize: '8px', fontWeight: 'bold', padding: '10px', background: 'rgba(27,31,138,0.03)' }}>
                <div>
                  <div style={{ fontSize: '10px' }}>SA SHEPHERD</div>
                  <div style={{ fontSize: '7px', color: '#E91E8C' }}>OFFICIAL STAMP</div>
                  <div style={{ fontSize: '7px' }}>COLLEGE</div>
                  <div style={{ fontSize: '7px' }}>REG. NO.</div>
                  <div style={{ fontSize: '7px' }}>6999 926 54</div>
                </div>
              </div>
              <p style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>Official Stamp</p>
            </div>

            {/* Signature */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '2px solid #333', width: '200px', marginBottom: '4px' }}></div>
              <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#1B1F8A' }}>Campus Manager</p>
              <p style={{ fontSize: '10px', color: '#666' }}>SA Shepherd College</p>
              <p style={{ fontSize: '10px', color: '#666' }}>{today}</p>
            </div>

            {/* QR Code Placeholder */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', border: '2px solid #1B1F8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                ▦
              </div>
              <p style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>Scan to verify</p>
            </div>
          </div>

          {/* Verification Code */}
          <div style={{ background: '#f0f4ff', border: '1px solid #1B1F8A', padding: '8px 15px', fontSize: '10px', color: '#1B1F8A', marginTop: '15px', textAlign: 'center', letterSpacing: '1px' }}>
            🔒 VERIFICATION CODE: <strong>{verificationCode}</strong> — Verify at: sashepherdcollege.org.za
          </div>

          {/* Footer */}
          <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '3px solid #8DC63F', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#666' }}>
            <span>Burgersfort: Main Road, RCS Building | Tel: 010 055 5115</span>
            <span>Polokwane: 17 Rissik Street | Tel: 015 008 5102</span>
          </div>

        </div>
      </div>
    </div>
  );
}