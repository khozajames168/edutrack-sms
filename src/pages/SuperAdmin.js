import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function SuperAdmin({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [colleges, setColleges] = useState([]);
  const [stats, setStats] = useState({});
const [loading, setLoading] = useState(true); // eslint-disable-line
 const [showAddCollege, setShowAddCollege] = useState(false);
const [showAddInvoice, setShowAddInvoice] = useState(false);
const [invoices, setInvoices] = useState([]);
const [invoiceForm, setInvoiceForm] = useState({ collegeId: '', amount: '2500', dueDate: '' });
  const [form, setForm] = useState({
    name: '', slug: '', email: '', phone: '', address: '',
    primaryColor: '#1B1F8A', secondaryColor: '#E91E8C', accentColor: '#8DC63F',
    dhetNumber: '', subscriptionAmount: '2500',
    adminName: '', adminEmail: '', adminPassword: '',
    campus1Name: '', campus1Address: '', campus1Phone: '',
    campus2Name: '', campus2Address: '', campus2Phone: '',
  });

  const token = localStorage.getItem('supertoken');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line
 const loadData = async () => {
  try {
    const [statsRes, collegesRes, invoicesRes] = await Promise.all([
      fetch(`${API_URL}/api/super/stats`, { headers }),
      fetch(`${API_URL}/api/super/colleges`, { headers }),
      fetch(`${API_URL}/api/super/invoices`, { headers }),
    ]);
    const statsData = await statsRes.json();
    const collegesData = await collegesRes.json();
    const invoicesData = await invoicesRes.json();
    if (!statsData.error) setStats(statsData);
    if (Array.isArray(collegesData)) setColleges(collegesData);
    if (Array.isArray(invoicesData)) setInvoices(invoicesData);
  } catch (err) {
    console.error(err);
  }
  setLoading(false); // eslint-disable-line
};

const markInvoicePaid = async (invoiceId) => {
  try {
    await fetch(`${API_URL}/api/super/invoices/${invoiceId}/pay`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ paymentMethod: 'EFT', reference: `PAY-${Date.now()}` }),
    });
    loadData();
  } catch (err) {
    console.error(err);
  }
};

const handleAddInvoice = async () => {
  try {
    const res = await fetch(`${API_URL}/api/super/invoices`, {
      method: 'POST',
      headers,
      body: JSON.stringify(invoiceForm),
    });
    const data = await res.json();
    if (data.id) {
      alert('✅ Invoice generated successfully!');
      setShowAddInvoice(false);
      loadData();
    }
  } catch (err) {
    console.error(err);
  }
};

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddCollege = async () => {
    try {
      const res = await fetch(`${API_URL}/api/super/colleges`, {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.college) {
        alert(`✅ ${data.college.name} added successfully!`);
        setShowAddCollege(false);
        setForm({
          name: '', slug: '', email: '', phone: '', address: '',
          primaryColor: '#1B1F8A', secondaryColor: '#E91E8C', accentColor: '#8DC63F',
          dhetNumber: '', subscriptionAmount: '2500',
          adminName: '', adminEmail: '', adminPassword: '',
          campus1Name: '', campus1Address: '', campus1Phone: '',
          campus2Name: '', campus2Address: '', campus2Phone: '',
        });
        loadData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Connection error');
    }
  };

  const toggleStatus = async (college) => {
    const newStatus = college.subscription_status === 'active' ? 'suspended' : 'active';
    try {
      await fetch(`${API_URL}/api/super/colleges/${college.id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-64 flex flex-col shadow-xl" style={{ background: '#0f172a' }}>
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">EduTrack</h1>
          <p className="text-gray-400 text-sm mt-1">Super Admin Panel</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {[
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'colleges', icon: '🏫', label: 'Colleges' },
  { key: 'invoices', icon: '💳', label: 'Invoices' },
  { key: 'add', icon: '➕', label: 'Add College' },
].map(item => (
              <li key={item.key}
                onClick={() => { setActiveTab(item.key); if (item.key === 'add') setShowAddCollege(true); }}
                className="rounded-lg px-4 py-3 cursor-pointer flex items-center gap-3 text-sm transition"
                style={{
                  background: activeTab === item.key ? '#1B1F8A' : 'transparent',
                  color: 'white',
                }}>
                <span>{item.icon}</span> {item.label}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={onLogout}
            className="w-full py-2 text-sm text-gray-400 hover:text-white">
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'colleges' ? 'All Colleges' : 'Add College'}
          </h2>
          <span className="text-sm text-gray-500">superadmin@edutrack.co.za</span>
        </div>

        <div className="flex-1 overflow-y-auto p-8">

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Colleges', value: stats.totalColleges || 0, color: '#1B1F8A' },
                  { label: 'Active Colleges', value: stats.activeColleges || 0, color: '#8DC63F' },
                  { label: 'Total Students', value: stats.totalStudents || 0, color: '#1B1F8A' },
                  { label: 'Total Revenue', value: `R${(stats.totalRevenue || 0).toLocaleString()}`, color: '#E91E8C' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border-t-4"
                    style={{ borderColor: stat.color }}>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4">Active Colleges</h3>
                <table className="w-full">
                  <thead style={{ background: '#0f172a' }}>
                    <tr className="text-left text-xs text-white">
                      <th className="px-4 py-3">College</th>
                      <th className="px-4 py-3">Students</th>
                      <th className="px-4 py-3">Monthly Fee</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {colleges.map(college => (
                      <tr key={college.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{college.name}</td>
                        <td className="px-4 py-3">{college.studentCount}</td>
                        <td className="px-4 py-3">R{parseFloat(college.subscription_amount).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: college.subscription_status === 'active' ? '#f0fdf4' : '#fef2f2',
                              color: college.subscription_status === 'active' ? '#16a34a' : '#dc2626'
                            }}>
                            {college.subscription_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Colleges List */}
          {activeTab === 'colleges' && (
            <div>
              <div className="flex justify-between mb-6">
                <h3 className="font-bold text-gray-800 text-lg">All Colleges ({colleges.length})</h3>
                <button onClick={() => setShowAddCollege(true)}
                  className="px-4 py-2 text-white rounded-lg text-sm font-medium"
                  style={{ background: '#1B1F8A' }}>
                  ➕ Add New College
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {colleges.map(college => (
                  <div key={college.id} className="bg-white rounded-xl shadow-sm p-6 border-t-4"
                    style={{ borderColor: college.primary_color || '#1B1F8A' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-800">{college.name}</h4>
                      <span className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: college.subscription_status === 'active' ? '#f0fdf4' : '#fef2f2',
                          color: college.subscription_status === 'active' ? '#16a34a' : '#dc2626'
                        }}>
                        {college.subscription_status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>📧 {college.email}</p>
                      <p>📱 {college.phone}</p>
                      <p>🏛️ DHET: {college.dhet_number}</p>
                      <p>👥 Students: <strong>{college.studentCount}</strong></p>
                      <p>💰 Monthly: <strong>R{parseFloat(college.subscription_amount).toLocaleString()}</strong></p>
                      <p>💵 Total Revenue: <strong>R{college.totalRevenue?.toLocaleString()}</strong></p>
                    </div>
                    <button onClick={() => toggleStatus(college)}
                      className="w-full py-2 rounded-lg text-sm font-medium border"
                      style={{
                        color: college.subscription_status === 'active' ? '#dc2626' : '#16a34a',
                        borderColor: college.subscription_status === 'active' ? '#dc2626' : '#16a34a',
                      }}>
                      {college.subscription_status === 'active' ? '🔒 Suspend Access' : '✅ Restore Access'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Invoices */}
          {activeTab === 'invoices' && (
            <div>
              <div className="flex justify-between mb-6">
                <h3 className="font-bold text-gray-800 text-lg">Invoice Management</h3>
                <button onClick={() => setShowAddInvoice(true)}
                  className="px-4 py-2 text-white rounded-lg text-sm font-medium"
                  style={{ background: '#1B1F8A' }}>
                  ➕ Generate Invoice
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-5 border-t-4" style={{ borderColor: '#1B1F8A' }}>
                  <p className="text-sm text-gray-500">Total Invoiced</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#1B1F8A' }}>
                    R{invoices.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 border-t-4" style={{ borderColor: '#8DC63F' }}>
                  <p className="text-sm text-gray-500">Total Paid</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#8DC63F' }}>
                    R{invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseFloat(i.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 border-t-4" style={{ borderColor: '#E91E8C' }}>
                  <p className="text-sm text-gray-500">Outstanding</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#E91E8C' }}>
                    R{invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + parseFloat(i.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead style={{ background: '#0f172a' }}>
                    <tr className="text-left text-xs text-white">
                      <th className="px-4 py-3">Invoice No</th>
                      <th className="px-4 py-3">College</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {invoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium" style={{ color: '#1B1F8A' }}>{invoice.invoice_number}</td>
                        <td className="px-4 py-3">{invoice.college_name}</td>
                        <td className="px-4 py-3 font-medium">R{parseFloat(invoice.amount).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-600">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-ZA') : '-'}</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: invoice.status === 'paid' ? '#f0fdf4' : '#fef2f2',
                              color: invoice.status === 'paid' ? '#16a34a' : '#dc2626'
                            }}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {invoice.status === 'unpaid' && (
                            <button
                              onClick={() => markInvoicePaid(invoice.id)}
                              className="text-xs px-3 py-1 rounded-lg text-white font-medium"
                              style={{ background: '#8DC63F' }}>
                              Mark Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

      {/* Add College Modal */}
      {showAddCollege && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-screen overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Add New College</h3>
              <button onClick={() => setShowAddCollege(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="space-y-6">

              {/* College Details */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b">College Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className={labelClass}>College Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="e.g. Pinnacle College" /></div>
                  <div><label className={labelClass}>Slug (unique ID) *</label>
                    <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} placeholder="e.g. pinnacle" /></div>
                  <div><label className={labelClass}>DHET Number</label>
                    <input name="dhetNumber" value={form.dhetNumber} onChange={handleChange} className={inputClass} placeholder="e.g. 6999 926 54" /></div>
                  <div><label className={labelClass}>Email *</label>
                    <input name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="admin@college.co.za" /></div>
                  <div><label className={labelClass}>Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="010 000 0000" /></div>
                  <div className="col-span-2"><label className={labelClass}>Address</label>
                    <input name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Physical address" /></div>
                  <div><label className={labelClass}>Monthly Subscription (R)</label>
                    <input name="subscriptionAmount" value={form.subscriptionAmount} onChange={handleChange} className={inputClass} /></div>
                  <div className="flex gap-3 items-end">
                    <div><label className={labelClass}>Primary Color</label>
                      <input name="primaryColor" type="color" value={form.primaryColor} onChange={handleChange} className="w-12 h-10 rounded cursor-pointer" /></div>
                    <div><label className={labelClass}>Secondary</label>
                      <input name="secondaryColor" type="color" value={form.secondaryColor} onChange={handleChange} className="w-12 h-10 rounded cursor-pointer" /></div>
                    <div><label className={labelClass}>Accent</label>
                      <input name="accentColor" type="color" value={form.accentColor} onChange={handleChange} className="w-12 h-10 rounded cursor-pointer" /></div>
                  </div>
                </div>
              </div>

              {/* Admin Account */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b">Admin Account</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Admin Name *</label>
                    <input name="adminName" value={form.adminName} onChange={handleChange} className={inputClass} placeholder="Full name" /></div>
                  <div><label className={labelClass}>Admin Email *</label>
                    <input name="adminEmail" value={form.adminEmail} onChange={handleChange} className={inputClass} placeholder="admin@college.co.za" /></div>
                  <div className="col-span-2"><label className={labelClass}>Admin Password *</label>
                    <input name="adminPassword" type="password" value={form.adminPassword} onChange={handleChange} className={inputClass} placeholder="Strong password" /></div>
                </div>
              </div>

              {/* Campuses */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b">Campus 1</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className={labelClass}>Campus Name</label>
                    <input name="campus1Name" value={form.campus1Name} onChange={handleChange} className={inputClass} placeholder="Main Campus" /></div>
                  <div><label className={labelClass}>Address</label>
                    <input name="campus1Address" value={form.campus1Address} onChange={handleChange} className={inputClass} placeholder="Address" /></div>
                  <div><label className={labelClass}>Phone</label>
                    <input name="campus1Phone" value={form.campus1Phone} onChange={handleChange} className={inputClass} placeholder="Phone" /></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b">Campus 2 (Optional)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className={labelClass}>Campus Name</label>
                    <input name="campus2Name" value={form.campus2Name} onChange={handleChange} className={inputClass} placeholder="Branch Campus" /></div>
                  <div><label className={labelClass}>Address</label>
                    <input name="campus2Address" value={form.campus2Address} onChange={handleChange} className={inputClass} placeholder="Address" /></div>
                  <div><label className={labelClass}>Phone</label>
                    <input name="campus2Phone" value={form.campus2Phone} onChange={handleChange} className={inputClass} placeholder="Phone" /></div>
                </div>
              </div>

            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowAddCollege(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium">
                Cancel
              </button>
              <button onClick={handleAddCollege}
                className="flex-1 py-3 text-white font-bold rounded-lg"
                style={{ background: '#1B1F8A' }}>
                ✅ Create College
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    {/* Generate Invoice Modal */}
{showAddInvoice && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h3 className="text-lg font-bold mb-6 text-gray-800">Generate Invoice</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
          <select value={invoiceForm.collegeId}
            onChange={(e) => setInvoiceForm(prev => ({ ...prev, collegeId: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
            <option value="">Select college</option>
            {colleges.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (R)</label>
          <input type="number"
            value={invoiceForm.amount}
            onChange={(e) => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
            placeholder="2500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input type="date"
            value={invoiceForm.dueDate}
            onChange={(e) => setInvoiceForm(prev => ({ ...prev, dueDate: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button onClick={() => setShowAddInvoice(false)}
          className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700">
          Cancel
        </button>
        <button onClick={handleAddInvoice}
          className="flex-1 py-3 text-white font-bold rounded-lg"
          style={{ background: '#1B1F8A' }}>
          Generate Invoice
        </button>
      </div>
    </div>
  </div>
)}
  );
}