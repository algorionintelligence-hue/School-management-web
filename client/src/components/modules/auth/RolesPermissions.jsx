import React, { useState } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import Modal from '../../common/Modal';
import './RolesPermissions.css';

const defaultPermissions = [
  { module: 'dashboard', actions: ['read'] },
  { module: 'sis', actions: ['read', 'write', 'delete'] },
  { module: 'staff', actions: ['read', 'write', 'delete'] },
  { module: 'academic', actions: ['read', 'write', 'delete'] },
  { module: 'examination', actions: ['read', 'write', 'delete'] },
  { module: 'attendance', actions: ['read', 'write', 'delete'] },
  { module: 'finance', actions: ['read', 'write', 'delete'] },
  { module: 'communication', actions: ['read', 'write', 'delete'] },
  { module: 'users', actions: ['read', 'write', 'delete'] }
];

const RolesPermissions = () => {
  const { success } = useNotification();
  const [roles, setRoles] = useState([
    { 
      id: 1, 
      name: 'Administrator', 
      description: 'Full system access',
      permissions: defaultPermissions.map(p => ({ ...p, actions: ['*'] }))
    },
    { 
      id: 2, 
      name: 'Teacher', 
      description: 'Academic and attendance management',
      permissions: defaultPermissions.filter(p => ['dashboard', 'academic', 'attendance', 'examination', 'communication'].includes(p.module))
    },
    { 
      id: 3, 
      name: 'Student', 
      description: 'View-only access to personal data',
      permissions: defaultPermissions.filter(p => ['dashboard', 'sis'].includes(p.module)).map(p => ({ ...p, actions: ['read'] }))
    },
    { 
      id: 4, 
      name: 'Parent', 
      description: 'View child progress and communicate',
      permissions: defaultPermissions.filter(p => ['dashboard', 'sis', 'attendance', 'examination', 'communication'].includes(p.module)).map(p => ({ ...p, actions: ['read'] }))
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const handlePermissionToggle = (module, action) => {
    setFormData(prev => {
      const newPerms = [...prev.permissions];
      const existing = newPerms.find(p => p.module === module);
      
      if (existing) {
        if (action === '*') {
          existing.actions = existing.actions.includes('*') ? [] : ['*'];
        } else {
          if (existing.actions.includes('*')) {
            existing.actions = [action];
          } else if (existing.actions.includes(action)) {
            existing.actions = existing.actions.filter(a => a !== action);
          } else {
            existing.actions.push(action);
          }
        }
      } else {
        newPerms.push({ module, actions: action === '*' ? ['*'] : [action] });
      }
      
      return { ...prev, permissions: newPerms };
    });
  };

  const hasPermission = (module, action) => {
    const perm = formData.permissions.find(p => p.module === module);
    if (!perm) return false;
    return perm.actions.includes('*') || perm.actions.includes(action);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRole) {
      setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...r, ...formData } : r));
      success('Role updated successfully');
    } else {
      setRoles(prev => [...prev, { ...formData, id: Date.now() }]);
      success('Role created successfully');
    }
    setShowModal(false);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: JSON.parse(JSON.stringify(role.permissions))
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this role?')) return;
    setRoles(prev => prev.filter(r => r.id !== id));
    success('Role deleted');
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h1>Roles & Permissions</h1>
        <button className="btn-primary" onClick={() => { 
          setEditingRole(null); 
          setFormData({ name: '', description: '', permissions: [] });
          setShowModal(true); 
        }}>
          <FaPlus /> Add Role
        </button>
      </div>

      <div className="roles-grid">
        {roles.map(role => (
          <div key={role.id} className="role-card">
            <div className="role-header">
              <h3>{role.name}</h3>
              <div className="role-actions">
                <button onClick={() => openEditModal(role)} className="btn-icon"><FaEdit /></button>
                <button onClick={() => handleDelete(role.id)} className="btn-icon delete"><FaTrash /></button>
              </div>
            </div>
            <p className="role-description">{role.description}</p>
            <div className="permissions-summary">
              {role.permissions.map(p => (
                <span key={p.module} className="perm-tag">
                  {p.module}: {p.actions.includes('*') ? 'All' : p.actions.join(', ')}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editingRole ? 'Edit Role' : 'Add Role'} onClose={() => setShowModal(false)} wide>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Role Name *</label>
              <input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="2"
              />
            </div>

            <div className="permissions-matrix">
              <h4>Module Permissions</h4>
              <table className="permissions-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Read</th>
                    <th>Write</th>
                    <th>Delete</th>
                    <th>All</th>
                  </tr>
                </thead>
                <tbody>
                  {defaultPermissions.map(mod => (
                    <tr key={mod.module}>
                      <td className="module-name">{mod.module}</td>
                      <td>
                        <button 
                          type="button"
                          className={`perm-toggle ${hasPermission(mod.module, 'read') ? 'active' : ''}`}
                          onClick={() => handlePermissionToggle(mod.module, 'read')}
                        >
                          {hasPermission(mod.module, 'read') ? <FaCheck /> : <FaTimes />}
                        </button>
                      </td>
                      <td>
                        <button 
                          type="button"
                          className={`perm-toggle ${hasPermission(mod.module, 'write') ? 'active' : ''}`}
                          onClick={() => handlePermissionToggle(mod.module, 'write')}
                        >
                          {hasPermission(mod.module, 'write') ? <FaCheck /> : <FaTimes />}
                        </button>
                      </td>
                      <td>
                        <button 
                          type="button"
                          className={`perm-toggle ${hasPermission(mod.module, 'delete') ? 'active' : ''}`}
                          onClick={() => handlePermissionToggle(mod.module, 'delete')}
                        >
                          {hasPermission(mod.module, 'delete') ? <FaCheck /> : <FaTimes />}
                        </button>
                      </td>
                      <td>
                        <button 
                          type="button"
                          className={`perm-toggle ${hasPermission(mod.module, '*') ? 'active' : ''}`}
                          onClick={() => handlePermissionToggle(mod.module, '*')}
                        >
                          {hasPermission(mod.module, '*') ? <FaCheck /> : <FaTimes />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Save Role</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RolesPermissions;