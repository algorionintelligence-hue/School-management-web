import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaPlus, FaEdit, FaTrash, FaMoneyBillWave, FaLayerGroup,
  FaCalendarAlt, FaPercentage 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './FeeStructure.css';

const FeeStructure = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    class: '',
    category: 'tuition',
    amount: '',
    frequency: 'monthly',
    dueDate: '',
    lateFee: 0,
    description: '',
    status: 'active'
  });

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const fetchFeeStructures = () => {
    setLoading(true);
    setTimeout(() => {
      setFeeStructures([
        { id: 1, name: 'Tuition Fee', class: 'All', category: 'tuition', amount: 2500, frequency: 'monthly', dueDate: '10', lateFee: 100, description: 'Monthly tuition fee', status: 'active' },
        { id: 2, name: 'Examination Fee', class: 'All', category: 'examination', amount: 500, frequency: 'per-term', dueDate: '15', lateFee: 50, description: 'Per term examination fee', status: 'active' },
        { id: 3, name: 'Library Fee', class: 'All', category: 'library', amount: 200, frequency: 'annual', dueDate: '30', lateFee: 25, description: 'Annual library membership', status: 'active' },
        { id: 4, name: 'Sports Fee', class: 'All', category: 'sports', amount: 300, frequency: 'annual', dueDate: '30', lateFee: 25, description: 'Annual sports fee', status: 'active' },
        { id: 5, name: 'Transportation Fee', class: 'All', category: 'transport', amount: 1500, frequency: 'monthly', dueDate: '10', lateFee: 100, description: 'Monthly bus fee', status: 'active' },
        { id: 6, name: 'Computer Lab Fee', class: '9-12', category: 'lab', amount: 400, frequency: 'annual', dueDate: '30', lateFee: 50, description: 'Computer lab usage fee', status: 'active' }
      ]);
      setLoading(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingFee) {
        setFeeStructures(prev => prev.map(f => f.id === editingFee.id ? { ...f, ...formData } : f));
        success('Fee structure updated');
      } else {
        setFeeStructures(prev => [...prev, { ...formData, id: Date.now() }]);
        success('Fee structure created');
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      error('Operation failed');
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this fee structure?')) return;
    setFeeStructures(prev => prev.filter(f => f.id !== id));
    success('Fee structure deleted');
  };

  const resetForm = () => {
    setFormData({ name: '', class: '', category: 'tuition', amount: '', frequency: 'monthly', dueDate: '', lateFee: 0, description: '', status: 'active' });
    setEditingFee(null);
  };

  const columns = [
    { key: 'name', label: 'Fee Name', sortable: true },
    { key: 'class', label: 'Applicable Class', sortable: true },
    { key: 'category', label: 'Category', sortable: true, render: (v) => <span className={`category-badge ${v}`}>{v}</span> },
    { key: 'amount', label: 'Amount', sortable: true, render: (v) => `$${v.toLocaleString()}` },
    { key: 'frequency', label: 'Frequency', sortable: true },
    { key: 'dueDate', label: 'Due Date', render: (v) => `Day ${v} of month` },
    { key: 'lateFee', label: 'Late Fee', render: (v) => `$${v}` },
    { key: 'status', label: 'Status', render: (v) => <span className={`status-badge ${v}`}>{v}</span> },
    { key: 'actions', label: 'Actions', render: (_, fee) => (
      <div className="action-buttons">
        {hasPermission('finance', 'write') && (
          <>
            <button onClick={() => { setEditingFee(fee); setFormData({...fee}); setShowModal(true); }} className="btn-icon edit"><FaEdit /></button>
            <button onClick={() => handleDelete(fee.id)} className="btn-icon delete"><FaTrash /></button>
          </>
        )}
      </div>
    )}
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaLayerGroup /> Fee Structure</h1>
        {hasPermission('finance', 'write') && (
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <FaPlus /> Add Fee
          </button>
        )}
      </div>

      <div className="fee-summary">
        <div className="summary-card">
          <h4>Total Fee Categories</h4>
          <span className="summary-value">{feeStructures.length}</span>
        </div>
        <div className="summary-card">
          <h4>Monthly Total</h4>
          <span className="summary-value">${feeStructures.filter(f => f.frequency === 'monthly').reduce((a, f) => a + f.amount, 0).toLocaleString()}</span>
        </div>
        <div className="summary-card">
          <h4>Annual Total</h4>
          <span className="summary-value">${feeStructures.filter(f => f.frequency === 'annual').reduce((a, f) => a + f.amount, 0).toLocaleString()}</span>
        </div>
      </div>

      <DataTable columns={columns} data={feeStructures} loading={loading} pagination={true} itemsPerPage={10} />

      {showModal && (
        <Modal title={editingFee ? 'Edit Fee Structure' : 'Add Fee Structure'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Fee Name *</label>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                  <option value="tuition">Tuition</option>
                  <option value="examination">Examination</option>
                  <option value="library">Library</option>
                  <option value="sports">Sports</option>
                  <option value="transport">Transport</option>
                  <option value="lab">Lab</option>
                  <option value="misc">Miscellaneous</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Applicable Class</label>
                <input value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} placeholder="e.g., All, 9-12, 10" />
              </div>
              <div className="form-group">
                <label>Amount *</label>
                <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Frequency</label>
                <select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})}>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="per-term">Per Term</option>
                  <option value="annual">Annual</option>
                  <option value="one-time">One Time</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date (Day of Month)</label>
                <input type="number" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} min="1" max="31" />
              </div>
              <div className="form-group">
                <label>Late Fee</label>
                <input type="number" value={formData.lateFee} onChange={(e) => setFormData({...formData, lateFee: parseFloat(e.target.value)})} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="2" />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">{editingFee ? 'Update' : 'Create'} Fee</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FeeStructure;