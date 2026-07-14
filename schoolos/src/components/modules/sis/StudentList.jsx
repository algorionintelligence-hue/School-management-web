import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, 
  FaIdCard, FaEnvelope, FaPhone, FaMapMarkerAlt 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './StudentList.css';

const StudentList = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ class: 'all', section: 'all', status: 'all' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    class: '',
    section: '',
    rollNumber: '',
    admissionDate: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianRelation: '',
    bloodGroup: '',
    status: 'active'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setTimeout(() => {
      setStudents([
        { id: 1, firstName: 'Alice', lastName: 'Johnson', studentId: 'STU2024001', email: 'alice@school.com', phone: '555-0101', class: '10', section: 'A', rollNumber: '101', gender: 'female', dateOfBirth: '2008-05-15', address: '123 Main St', guardianName: 'Bob Johnson', guardianPhone: '555-0102', guardianEmail: 'bob@email.com', guardianRelation: 'Father', bloodGroup: 'A+', admissionDate: '2020-06-01', status: 'active' },
        { id: 2, firstName: 'Charlie', lastName: 'Smith', studentId: 'STU2024002', email: 'charlie@school.com', phone: '555-0103', class: '10', section: 'A', rollNumber: '102', gender: 'male', dateOfBirth: '2008-08-22', address: '456 Oak Ave', guardianName: 'Diana Smith', guardianPhone: '555-0104', guardianEmail: 'diana@email.com', guardianRelation: 'Mother', bloodGroup: 'O+', admissionDate: '2020-06-01', status: 'active' },
        { id: 3, firstName: 'Eva', lastName: 'Williams', studentId: 'STU2024003', email: 'eva@school.com', phone: '555-0105', class: '9', section: 'B', rollNumber: '201', gender: 'female', dateOfBirth: '2009-03-10', address: '789 Pine Rd', guardianName: 'Frank Williams', guardianPhone: '555-0106', guardianEmail: 'frank@email.com', guardianRelation: 'Father', bloodGroup: 'B+', admissionDate: '2021-06-01', status: 'active' },
        { id: 4, firstName: 'David', lastName: 'Brown', studentId: 'STU2024004', email: 'david@school.com', phone: '555-0107', class: '11', section: 'A', rollNumber: '301', gender: 'male', dateOfBirth: '2007-11-30', address: '321 Elm St', guardianName: 'Grace Brown', guardianPhone: '555-0108', guardianEmail: 'grace@email.com', guardianRelation: 'Mother', bloodGroup: 'AB+', admissionDate: '2019-06-01', status: 'inactive' }
      ]);
      setLoading(false);
    }, 800);
  };

  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `STU${year}${random}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...formData } : s));
        success('Student updated successfully');
      } else {
        const newStudent = { 
          ...formData, 
          id: Date.now(), 
          studentId: generateStudentId(),
          admissionDate: new Date().toISOString().split('T')[0]
        };
        setStudents(prev => [...prev, newStudent]);
        success('Student enrolled successfully');
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      error('Operation failed');
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this student record?')) return;
    setStudents(prev => prev.filter(s => s.id !== id));
    success('Student deleted');
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', studentId: '', email: '', phone: '',
      dateOfBirth: '', gender: 'male', address: '', class: '', section: '',
      rollNumber: '', admissionDate: '', guardianName: '', guardianPhone: '',
      guardianEmail: '', guardianRelation: '', bloodGroup: '', status: 'active'
    });
    setEditingStudent(null);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setShowModal(true);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName} ${s.studentId}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filters.class === 'all' || s.class === filters.class;
    const matchesSection = filters.section === 'all' || s.section === filters.section;
    const matchesStatus = filters.status === 'all' || s.status === filters.status;
    return matchesSearch && matchesClass && matchesSection && matchesStatus;
  });

  const columns = [
    { key: 'studentId', label: 'Student ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true, render: (_, s) => `${s.firstName} ${s.lastName}` },
    { key: 'class', label: 'Class', sortable: true, render: (_, s) => `${s.class}-${s.section}` },
    { key: 'rollNumber', label: 'Roll No', sortable: true },
    { key: 'guardianName', label: 'Guardian' },
    { key: 'guardianPhone', label: 'Contact' },
    { key: 'status', label: 'Status', render: (v) => <span className={`status-badge ${v}`}>{v}</span> },
    { key: 'actions', label: 'Actions', render: (_, student) => (
      <div className="action-buttons">
        <button onClick={() => navigate(`/students/${student.id}`)} className="btn-icon view"><FaEye /></button>
        {hasPermission('sis', 'write') && (
          <>
            <button onClick={() => openEditModal(student)} className="btn-icon edit"><FaEdit /></button>
            <button onClick={() => handleDelete(student.id)} className="btn-icon delete"><FaTrash /></button>
          </>
        )}
      </div>
    )}
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaIdCard /> Student Information System</h1>
        {hasPermission('sis', 'write') && (
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <FaPlus /> Enroll Student
          </button>
        )}
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={filters.class} onChange={(e) => setFilters({...filters, class: e.target.value})}>
            <option value="all">All Classes</option>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
          <select value={filters.section} onChange={(e) => setFilters({...filters, section: e.target.value})}>
            <option value="all">All Sections</option>
            {['A','B','C','D'].map(s => (
              <option key={s} value={s}>Section {s}</option>
            ))}
          </select>
          <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h4>Total Students</h4>
          <span className="stat-value">{students.length}</span>
        </div>
        <div className="stat-card">
          <h4>Active</h4>
          <span className="stat-value">{students.filter(s => s.status === 'active').length}</span>
        </div>
        <div className="stat-card">
          <h4>New This Year</h4>
          <span className="stat-value">{students.filter(s => s.admissionDate?.startsWith('2024')).length}</span>
        </div>
      </div>

      <DataTable columns={columns} data={filteredStudents} loading={loading} pagination={true} itemsPerPage={15} />

      {showModal && (
        <Modal title={editingStudent ? 'Edit Student' : 'Enroll New Student'} onClose={() => setShowModal(false)} wide>
          <form onSubmit={handleSubmit} className="modal-form student-form">
            <div className="form-section">
              <h3>Personal Information</h3>
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
                  <label>Date of Birth *</label>
                  <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}>
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows="2" />
              </div>
            </div>

            <div className="form-section">
              <h3>Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label><FaEnvelope /> Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label><FaPhone /> Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Academic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Class *</label>
                  <select value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} required>
                    <option value="">Select Class</option>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Section *</label>
                  <select value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} required>
                    <option value="">Select Section</option>
                    {['A','B','C','D'].map(s => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Roll Number *</label>
                  <input value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Guardian Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Guardian Name *</label>
                  <input value={formData.guardianName} onChange={(e) => setFormData({...formData, guardianName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Relation *</label>
                  <select value={formData.guardianRelation} onChange={(e) => setFormData({...formData, guardianRelation: e.target.value})} required>
                    <option value="">Select</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Guardian Phone *</label>
                  <input type="tel" value={formData.guardianPhone} onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Guardian Email</label>
                  <input type="email" value={formData.guardianEmail} onChange={(e) => setFormData({...formData, guardianEmail: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">
                {editingStudent ? 'Update' : 'Enroll'} Student
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudentList;