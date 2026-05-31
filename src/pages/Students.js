import React, { useState, useEffect } from 'react';
import { getStudents } from '../utils/api';

export default function Students({ onSelectStudent }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getStudents();
     if (Array.isArray(data)) {
  setStudents(data.filter(s => !s.is_deleted && s.status !== 'Deleted'));
}
    } catch (err) {
      console.error('Error loading students:', err);
    }
    setLoading(false);
  };

  const filtered = students.filter(s => {
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) || 
      (s.student_number && s.student_number.includes(search));
    const matchCourse = filterCourse ? s.course === filterCourse : true;
    return matchSearch && matchCourse;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#1B1F8A' }}>Students</h2>
        <span className="px-4 py-1 rounded-full text-sm font-medium text-white"
          style={{ background: '#E91E8C' }}>
          {filtered.length} students
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or student number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
        />
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2">
          <option value="">All Courses</option>
          <option>Safety Management (OHS) L2</option>
          <option>Electrical Engineering N1-N6</option>
          <option>ECD Level 4</option>
          <option>Human Resource N4-N6</option>
          <option>First Aid Level 1</option>
          <option>Matric Rewrite - 1 Subject</option>
        </select>
        <button onClick={loadStudents}
          className="px-4 py-2.5 text-white rounded-lg text-sm font-medium"
          style={{ background: '#1B1F8A' }}>
          🔄 Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500">Loading students...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-gray-500">No students found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead style={{ background: '#1B1F8A' }}>
              <tr className="text-left text-xs text-white">
                <th className="px-6 py-4">Photo</th>
                <th className="px-6 py-4">Student Number</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Campus</th>
                <th className="px-6 py-4">Cell</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {student.photo
                      ? <img src={student.photo} alt="" className="w-10 h-12 object-cover rounded-lg border" style={{ borderColor: '#1B1F8A' }} />
                      : <div className="w-10 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold"
                          style={{ background: '#1B1F8A' }}>
                          {student.first_name?.[0]}{student.last_name?.[0]}
                        </div>
                    }
                  </td>
                  <td className="px-6 py-4 font-medium" style={{ color: '#E91E8C' }}>
                    {student.student_number}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {student.title} {student.first_name} {student.last_name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.course}</td>
                  <td className="px-6 py-4 text-gray-600">{student.campus}</td>
                  <td className="px-6 py-4 text-gray-600">{student.cell_number}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: student.status === 'Active' ? '#f0fdf4' : '#fefce8',
                        color: student.status === 'Active' ? '#16a34a' : '#ca8a04'
                      }}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="text-sm font-medium px-3 py-1 rounded-lg text-white"
                      style={{ background: '#1B1F8A' }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}