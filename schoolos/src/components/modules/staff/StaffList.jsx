import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter,
  FaChalkboardTeacher, FaCertificate, FaCalendarAlt, FaMoneyBillWave 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './StaffList.css';

const StaffList = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ department: 'all', role: 'all', status: 'all' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    designation: '',
    role: 'teacher',
    qualifications: '',
    certifications: '',
    joiningDate: '',
    salary: '',
    address: '',
    emergencyContact: '',
    status: 'active'
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = () => {
    setLoading(true);
    setTimeout(() => {
      setStaff([
        { id: 1, firstName: 'John', lastName: 'Smith', employeeId: 'EMP2024001', email: 'john.smith@school.com', phone: '555-0201', department: 'Science', designation: 'Senior Teacher', role: 'teacher', qualifications: 'M.Sc. Physics, B.Ed.', certifications: 'CBSE Certified', joiningDate: '2018-06-01', salary: 45000, status: 'active' },
        { id: 2, firstName: 'Sarah', lastName: 'Johnson', employeeId: 'EMP2024002', email: 'sarah.j@school.com', phone: '555-0202', department: 'Mathematics', designation: 'Head of Department', role: 'teacher', qualifications: 'M.Sc. Mathematics, Ph.D.', certifications: 'NET Qualified', joiningDate: '2015-06-01', salary: 65000, status: 'active' },
        { id: 3, firstName: 'Michael', lastName: 'Brown', employeeId: 'EMP2024003', email: 'michael.b@school.com', phone: '555-0203', department: 'English', designation: 'Teacher', role: 'teacher', qualifications: 'M.A. English, B.Ed.', certifications: 'TESOL', joiningDate: '2020-06-01', salary: 35000, status: 'active' },
        { id: 4, firstName: 'Emily', lastName: 'Davis', employeeId: 'EMP2024004', email: 'emily.d@school.com', phone: '555-0204', department: 'Administration', designation: 'Office Manager', role: 'staff', qualifications: 'MBA', certifications: 'HR Management', joiningDate: '2019-06-01', salary: 40000, status: 'active' },
        { id: 5, firstName: 'Robert', lastName: 'Wilson', employeeId: 'EMP2024005', email: 'robert.w@school.com', phone: '555-0205', department: 'Sports', designation: 'Physical Education Teacher', role: 'teacher', qualifications: 'B.P.Ed.', certifications: 'First Aid', joiningDate: '2021-06-01', salary: 32000, status: 'on-leave' }
      ]);
      setLoading(false);
    }, 800);
  };

  const generateEmployeeId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `EMP${year}${random}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...formData } : s));
        success('Staff updated successfully');
      } else {
        const newStaff = { 
          ...formData, 
          id: Date.now(), 
          employeeId: generateEmployeeId(),
          joiningDate: new Date().toISOString().split('T')[0]
        };
        setStaff(prev => [...prev, newStaff]);
        success('Staff member added successfully');
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      error('Operation failed');
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this staff record?')) return;
    setStaff(prev => prev.filter(s => s.id !== id));
    success('Staff deleted');
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', employeeId: '',
      department: '', designation: '', role: 'teacher', qualifications: '',
      certifications: '', joiningDate: '', salary: '', address: '',
      emergencyContact: '', status: 'active'
    });
    setEditingStaff(null);
  };

  const openEditModal = (member) => {
    setEditingStaff(member);
    setFormData({ ...member });
    setShowModal(true);
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName} ${s.employeeId}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filters.department === 'all' || s.department === filters.department;
    const matchesRole = filters.role === 'all' || s.role === filters.role;
    const matchesStatus = filters.status === 'all' || s.status === filters.status;
    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  const departments = [...new Set(staff.map(s => s.department))];

  const columns = [
    { key: 'employeeId', label: 'Employee ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true, render: (_, s) => `${s.firstName} ${s.lastName}` },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    { key: 'role', label: 'Role', render: (v) => <span className={`role-badge ${v}`}>{v}</span> },
    { key: 'joiningDate', label: 'Joining Date', sortable: true },
    { key: 'salary', label: 'Salary', sortable: true, render: (v) => `$${v.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (v) => <span className={`status-badge ${v}`}>{v}</span> },
    { key: 'actions', label: 'Actions', render: (_, member) => (
      <div className="action-buttons">
        <button onClick={() => navigate(`/staff/${member.id}`)} className="btn-icon view"><FaEye /></button>
        {hasPermission('staff', 'write') && (
          <>
            <button onClick={() => openEditModal(member)} className="btn-icon edit"><FaEdit /></button>
            <button onClick={() => handleDelete(member.id)} className="btn-icon delete"><FaTrash /></button>
          </>
        )}
      </div>
    )}
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaChalkboardTeacher /> Staff & Faculty Management</h1>
        {hasPermission('staff', 'write') && (
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <FaPlus /> Add Staff
          </button>
        )}
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search staff..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-group">
          <select value={filters.department} onChange={(e) => setFilters({...filters, department: e.target.value})}>
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filters.role} onChange={(e) => setFilters({...filters, role: e.target.value})}>
            <option value="all">All Roles</option>
            <option value="teacher">Teacher</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h4>Total Staff</h4>
          <span className="stat-value">{staff.length}</span>
        </div>
        <div className="stat-card">
          <h4>Teachers</h4>
          <span className="stat-value">{staff.filter(s => s.role === 'teacher').length}</span>
        </div>
        <div className="stat-card">
          <h4>On Leave</h4>
          <span className="stat-value">{staff.filter(s => s.status === 'on-leave').length}</span>
        </div>
        <div className="stat-card">
          <h4>Avg Salary</h4>
          <span className="stat-value">${Math.round(staff.reduce((a, s) => a + s.salary, 0) / staff.length).toLocaleString()}</span>
        </div>
      </div>

      <DataTable columns={columns} data={filteredStaff} loading={loading} pagination={true} itemsPerPage={10} />

      {showModal && (
        <Modal title={editingStaff ? 'Edit Staff' : 'Add Staff'} onClose={() => setShowModal(false)} wide>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Employment Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required>
                    <option value="">Select Department</option>
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="Languages">Languages</option>
                    <option value="Arts">Arts</option>
                    <option value="Sports">Sports</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Designation *</label>
                  <input value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Joining Date</label>
                  <input type="date" value={formData.joiningDate} onChange={(e) => setFormData({...formData, joiningDate: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3><FaCertificate /> Qualifications & Certifications</h3>
              <div className="form-group">
                <label>Qualifications</label>
                <textarea value={formData.qualifications} onChange={(e) => setFormData({...formData, qualifications: e.target.value})} rows="2" placeholder="e.g., M.Sc. Physics, B.Ed." />
              </div>
              <div className="form-group">
                <label>Certifications</label>
                <textarea value={formData.certifications} onChange={(e) => setFormData({...formData, certifications: e.target.value})} rows="2" placeholder="e.g., CBSE Certified, NET Qualified" />
              </div>
            </div>

            <div className="form-section">
              <h3><FaMoneyBillWave /> Compensation</h3>
              <div className="form-group">
                <label>Monthly Salary</label>
                <input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">
                {editingStaff ? 'Update' : 'Add'} Staff
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StaffList;