import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './UserManagement.css';

const UserManagement = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'teacher',
    phone: '',
    status: 'active',
    mfaEnabled: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'System Administrator', email: 'admin@school.com', role: 'admin', status: 'active', mfaEnabled: true, lastLogin: '2024-01-15 09:30', createdAt: '2023-01-01' },
        { id: 2, name: 'John Teacher', email: 'teacher@school.com', role: 'teacher', status: 'active', mfaEnabled: false, lastLogin: '2024-01-14 14:20', createdAt: '2023-02-15' },
        { id: 3, name: 'Sarah Johnson', email: 'sarah.j@school.com', role: 'teacher', status: 'active', mfaEnabled: true, lastLogin: '2024-01-15 08:45', createdAt: '2023-03-10' },
        { id: 4, name: 'Mike Parent', email: 'mike.p@email.com', role: 'parent', status: 'active', mfaEnabled: false, lastLogin: '2024-01-10 19:15', createdAt: '2023-04-20' },
        { id: 5, name: 'Lisa Student', email: 'lisa.s@school.com', role: 'student', status: 'inactive', mfaEnabled: false, lastLogin: '2023-12-20 10:00', createdAt: '2023-05-01' }
      ]);
      setLoading(false);
    }, 800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
        success('User updated successfully');
      } else {
        const newUser = { ...formData, id: Date.now(), lastLogin: '-', createdAt: new Date().toISOString().split('T')[0] };
        setUsers(prev => [...prev, newUser]);
        success('User created successfully');
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      error('Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setUsers(prev => prev.filter(u => u.id !== id));
    success('User deleted successfully');
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'teacher',
      phone: '',
      status: 'active',
      mfaEnabled: false
    });
    setEditingUser(null);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      status: user.status,
      mfaEnabled: user.mfaEnabled
    });
    setShowModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (value) => (
      <span className={`role-badge ${value}`}>{value}</span>
    )},
    { key: 'status', label: 'Status', sortable: true, render: (value) => (
      <span className={`status-badge ${value}`}>{value}</span>
    )},
    { key: 'mfaEnabled', label: 'MFA', render: (value) => (
      value ? <span className="mfa-enabled">Enabled</span> : <span className="mfa-disabled">Disabled</span>
    )},
    { key: 'lastLogin', label: 'Last Login' },
    { key: 'actions', label: 'Actions', render: (_, user) => (
      <div className="action-buttons">
        {hasPermission('users', 'write') && (
          <>
            <button onClick={() => openEditModal(user)} className="btn-icon edit"><FaEdit /></button>
            <button onClick={() => handleToggleStatus(user)} className="btn-icon toggle">
              {user.status === 'active' ? <FaUserTimes /> : <FaUserCheck />}
            </button>
            <button onClick={() => handleDelete(user.id)} className="btn-icon delete"><FaTrash /></button>
          </>
        )}
      </div>
    )}
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1>User Management</h1>
        {hasPermission('users', 'write') && (
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <FaPlus /> Add User
          </button>
        )}
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FaFilter />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredUsers} 
        loading={loading}
        pagination={true}
        itemsPerPage={10}
      />

      {showModal && (
        <Modal title={editingUser ? 'Edit User' : 'Add User'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Role *</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="admin">Administrator</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={formData.mfaEnabled}
                    onChange={(e) => setFormData({...formData, mfaEnabled: e.target.checked})}
                  />
                  Enable Multi-Factor Authentication
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">
                {editingUser ? 'Update' : 'Create'} User
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;