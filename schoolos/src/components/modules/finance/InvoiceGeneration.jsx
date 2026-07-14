import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaPlus, FaFileInvoice, FaPrint, FaDownload, FaCheck,
  FaSearch, FaFilter, FaCalendarAlt 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './InvoiceGeneration.css';

const InvoiceGeneration = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    feeItems: [{ feeId: '', name: '', amount: 0 }],
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = () => {
    setLoading(true);
    setTimeout(() => {
      setInvoices([
        { id: 'INV-2024-001', studentId: 'STU2024001', studentName: 'Alice Johnson', class: '10-A', amount: 2800, dueDate: '2024-02-10', status: 'paid', paidDate: '2024-02-05', items: [{ name: 'Tuition Fee', amount: 2500 }, { name: 'Library Fee', amount: 200 }, { name: 'Late Fee', amount: 100 }] },
        { id: 'INV-2024-002', studentId: 'STU2024002', studentName: 'Charlie Smith', class: '10-A', amount: 2500, dueDate: '2024-02-10', status: 'pending', paidDate: null, items: [{ name: 'Tuition Fee', amount: 2500 }] },
        { id: 'INV-2024-003', studentId: 'STU2024003', studentName: 'Eva Williams', class: '9-B', amount: 3000, dueDate: '2024-02-10', status: 'overdue', paidDate: null, items: [{ name: 'Tuition Fee', amount: 2500 }, { name: 'Examination Fee', amount: 500 }] },
        { id: 'INV-2024-004', studentId: 'STU2024004', studentName: 'David Brown', class: '11-A', amount: 2500, dueDate: '2024-02-10', status: 'paid', paidDate: '2024-02-08', items: [{ name: 'Tuition Fee', amount: 2500 }] },
        { id: 'INV-2024-005', studentId: 'STU2024005', studentName: 'Fiona Green', class: '10-B', amount: 2800, dueDate: '2024-02-10', status: 'pending', paidDate: null, items: [{ name: 'Tuition Fee', amount: 2500 }, { name: 'Sports Fee', amount: 300 }] }
      ]);
      setLoading(false);
    }, 800);
  };

  const handleGenerate = () => {
    if (!formData.studentId || formData.feeItems.length === 0) {
      error('Please fill all required fields');
      return;
    }
    const newInvoice = {
      id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      ...formData,
      amount: formData.feeItems.reduce((a, item) => a + item.amount, 0),
      status: 'pending',
      paidDate: null
    };
    setInvoices(prev => [newInvoice, ...prev]);
    setShowModal(false);
    setFormData({ studentId: '', studentName: '', feeItems: [{ feeId: '', name: '', amount: 0 }], dueDate: '', notes: '' });
    success('Invoice generated successfully');
  };

  const handleMarkPaid = (invoiceId) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : inv
    ));
    success('Invoice marked as paid');
  };

  const openPreview = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPreviewModal(true);
  };

  const addFeeItem = () => {
    setFormData(prev => ({
      ...prev,
      feeItems: [...prev.feeItems, { feeId: '', name: '', amount: 0 }]
    }));
  };

  const updateFeeItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      feeItems: prev.feeItems.map((item, idx) => idx === index ? { ...item, [field]: value } : item)
    }));
  };

  const removeFeeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      feeItems: prev.feeItems.filter((_, idx) => idx !== index)
    }));
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: 'id', label: 'Invoice #', sortable: true },
    { key: 'studentName', label: 'Student', sortable: true },
    { key: 'class', label: 'Class', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, render: (v) => `$${v.toLocaleString()}` },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { key: 'status', label: 'Status', render: (v) => <span className={`status-badge ${v}`}>{v}</span> },
    { key: 'paidDate', label: 'Paid Date', render: (v) => v || '—' },
    { key: 'actions', label: 'Actions', render: (_, invoice) => (
      <div className="action-buttons">
        <button onClick={() => openPreview(invoice)} className="btn-icon view"><FaFileInvoice /></button>
        {invoice.status !== 'paid' && hasPermission('finance', 'write') && (
          <button onClick={() => handleMarkPaid(invoice.id)} className="btn-icon success"><FaCheck /></button>
        )}
        <button onClick={() => success('Invoice downloaded')} className="btn-icon"><FaDownload /></button>
      </div>
    )}
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaFileInvoice /> Invoice Generation</h1>
        {hasPermission('finance', 'write') && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Generate Invoice
          </button>
        )}
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search invoices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-group">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="invoice-stats">
        <div className="stat-card">
          <h4>Total Invoices</h4>
          <span className="stat-value">{invoices.length}</span>
        </div>
        <div className="stat-card">
          <h4>Pending</h4>
          <span className="stat-value">{invoices.filter(i => i.status === 'pending').length}</span>
        </div>
        <div className="stat-card">
          <h4>Paid</h4>
          <span className="stat-value">{invoices.filter(i => i.status === 'paid').length}</span>
        </div>
        <div className="stat-card">
          <h4>Overdue</h4>
          <span className="stat-value">{invoices.filter(i => i.status === 'overdue').length}</span>
        </div>
        <div className="stat-card">
          <h4>Total Revenue</h4>
          <span className="stat-value">${invoices.filter(i => i.status === 'paid').reduce((a, i) => a + i.amount, 0).toLocaleString()}</span>
        </div>
      </div>

      <DataTable columns={columns} data={filteredInvoices} loading={loading} pagination={true} itemsPerPage={10} />

      {showModal && (
        <Modal title="Generate Invoice" onClose={() => setShowModal(false)} wide>
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Student ID *</label>
                <input value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Student Name *</label>
                <input value={formData.studentName} onChange={(e) => setFormData({...formData, studentName: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Due Date *</label>
              <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} required />
            </div>
            
            <h4>Fee Items</h4>
            {formData.feeItems.map((item, idx) => (
              <div key={idx} className="fee-item-row">
                <input 
                  placeholder="Fee Name" 
                  value={item.name} 
                  onChange={(e) => updateFeeItem(idx, 'name', e.target.value)} 
                />
                <input 
                  type="number" 
                  placeholder="Amount" 
                  value={item.amount} 
                  onChange={(e) => updateFeeItem(idx, 'amount', parseFloat(e.target.value))} 
                />
                <button className="btn-icon delete" onClick={() => removeFeeItem(idx)}><FaTrash /></button>
              </div>
            ))}
            <button className="btn-secondary btn-sm" onClick={addFeeItem}><FaPlus /> Add Item</button>

            <div className="form-group">
              <label>Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="2" />
            </div>

            <div className="invoice-total">
              <strong>Total Amount: ${formData.feeItems.reduce((a, item) => a + (item.amount || 0), 0).toLocaleString()}</strong>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleGenerate}>Generate Invoice</button>
            </div>
          </div>
        </Modal>
      )}

      {showPreviewModal && selectedInvoice && (
        <Modal title={`Invoice ${selectedInvoice.id}`} onClose={() => setShowPreviewModal(false)} wide>
          <div className="invoice-preview">
            <div className="invoice-header">
              <div className="school-info">
                <h2>ABC Public School</h2>
                <p>123 Education Street, Cityville</p>
                <p>Phone: 555-0000 | Email: info@abcschool.com</p>
              </div>
              <div className="invoice-details">
                <h3>INVOICE</h3>
                <p><strong>Invoice #:</strong> {selectedInvoice.id}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
              </div>
            </div>

            <div className="invoice-to">
              <h4>Bill To:</h4>
              <p><strong>{selectedInvoice.studentName}</strong></p>
              <p>Student ID: {selectedInvoice.studentId}</p>
              <p>Class: {selectedInvoice.class}</p>
            </div>

            <table className="invoice-items">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>${selectedInvoice.amount.toLocaleString()}</strong></td>
                </tr>
              </tfoot>
            </table>

            <div className="invoice-status">
              <span className={`status-badge ${selectedInvoice.status}`}>
                {selectedInvoice.status === 'paid' ? 'PAID' : selectedInvoice.status === 'overdue' ? 'OVERDUE' : 'PENDING'}
              </span>
              {selectedInvoice.paidDate && <p>Paid on: {selectedInvoice.paidDate}</p>}
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowPreviewModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => success('Invoice printed')}><FaPrint /> Print</button>
              <button className="btn-primary" onClick={() => success('Invoice downloaded')}><FaDownload /> Download</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InvoiceGeneration;