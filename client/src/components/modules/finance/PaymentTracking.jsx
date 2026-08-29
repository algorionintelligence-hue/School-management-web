import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaSearch, FaFilter, FaCheck, FaTimes, FaMoneyBillWave,
  FaCreditCard, FaCashRegister, FaUniversity, FaMobileAlt 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './PaymentTracking.css';

const PaymentTracking = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');

  const [formData, setFormData] = useState({
    invoiceId: '',
    studentId: '',
    studentName: '',
    amount: '',
    method: 'cash',
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = () => {
    setLoading(true);
    setTimeout(() => {
      setPayments([
        { id: 'PAY-2024-001', invoiceId: 'INV-2024-001', studentId: 'STU2024001', studentName: 'Alice Johnson', amount: 2800, method: 'online', transactionId: 'TXN123456', date: '2024-02-05', status: 'completed' },
        { id: 'PAY-2024-002', invoiceId: 'INV-2024-004', studentId: 'STU2024004', studentName: 'David Brown', amount: 2500, method: 'cash', transactionId: 'CASH-001', date: '2024-02-08', status: 'completed' },
        { id: 'PAY-2024-003', invoiceId: 'INV-2024-002', studentId: 'STU2024002', studentName: 'Charlie Smith', amount: 2500, method: 'card', transactionId: 'CARD-789', date: '2024-02-12', status: 'pending' },
        { id: 'PAY-2024-004', invoiceId: 'INV-2024-005', studentId: 'STU2024005', studentName: 'Fiona Green', amount: 1400, method: 'online', transactionId: 'TXN789012', date: '2024-02-15', status: 'failed' }
      ]);
      setLoading(false);
    }, 800);
  };

  const handleRecordPayment = () => {
    if (!formData.invoiceId || !formData.amount || !formData.method) {
      error('Please fill all required fields');
      return;
    }
    const newPayment = {
      id: `PAY-2024-${String(payments.length + 1).padStart(3, '0')}`,
      ...formData,
      amount: parseFloat(formData.amount),
      status: 'completed'
    };
    setPayments(prev => [newPayment, ...prev]);
    setShowModal(false);
    setFormData({ invoiceId: '', studentId: '', studentName: '', amount: '', method: 'cash', transactionId: '', date: new Date().toISOString().split('T')[0], notes: '' });
    success('Payment recorded successfully');
  };

  const handleVerifyPayment = (paymentId) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'completed' } : p));
    success('Payment verified');
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'cash': return <FaCashRegister />;
      case 'card': return <FaCreditCard />;
      case 'online': return <FaUniversity />;
      case 'mobile': return <FaMobileAlt />;
      default: return <FaMoneyBillWave />;
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'all' || p.method === filterMethod
        return matchesSearch && matchesMethod;
  });

  const columns = [
    { key: 'id', label: 'Payment ID', sortable: true },
    { key: 'invoiceId', label: 'Invoice #', sortable: true },
    { key: 'studentName', label: 'Student', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, render: (v) => `$${v.toLocaleString()}` },
    { key: 'method', label: 'Method', render: (v) => (
      <span className="method-badge">
        {getMethodIcon(v)} {v}
      </span>
    )},
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', render: (v) => <span className={`status-badge ${v}`}>{v}</span> },
    { key: 'actions', label: 'Actions', render: (_, payment) => (
      <div className="action-buttons">
        {payment.status === 'pending' && hasPermission('finance', 'write') && (
          <button onClick={() => handleVerifyPayment(payment.id)} className="btn-icon success"><FaCheck /></button>
        )}
        {payment.status === 'failed' && (
          <button onClick={() => success('Retry initiated')} className="btn-icon"><FaTimes /></button>
        )}
      </div>
    )}
  ];

  const stats = {
    total: payments.reduce((a, p) => a + p.amount, 0),
    online: payments.filter(p => p.method === 'online' && p.status === 'completed').reduce((a, p) => a + p.amount, 0),
    cash: payments.filter(p => p.method === 'cash' && p.status === 'completed').reduce((a, p) => a + p.amount, 0),
    card: payments.filter(p => p.method === 'card' && p.status === 'completed').reduce((a, p) => a + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((a, p) => a + p.amount, 0)
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaMoneyBillWave /> Payment Tracking</h1>
        {hasPermission('finance', 'write') && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FaCashRegister /> Record Payment
          </button>
        )}
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search payments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-group">
          <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
      </div>

      <div className="payment-stats">
        <div className="stat-card">
          <h4>Total Collected</h4>
          <span className="stat-value">${stats.total.toLocaleString()}</span>
        </div>
        <div className="stat-card online">
          <h4>Online</h4>
          <span className="stat-value">${stats.online.toLocaleString()}</span>
        </div>
        <div className="stat-card cash">
          <h4>Cash</h4>
          <span className="stat-value">${stats.cash.toLocaleString()}</span>
        </div>
        <div className="stat-card card">
          <h4>Card</h4>
          <span className="stat-value">${stats.card.toLocaleString()}</span>
        </div>
        <div className="stat-card pending">
          <h4>Pending</h4>
          <span className="stat-value">${stats.pending.toLocaleString()}</span>
        </div>
      </div>

      <DataTable columns={columns} data={filteredPayments} loading={loading} pagination={true} itemsPerPage={10} />

      {showModal && (
        <Modal title="Record Payment" onClose={() => setShowModal(false)}>
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Invoice ID *</label>
                <input value={formData.invoiceId} onChange={(e) => setFormData({...formData, invoiceId: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Student ID</label>
                <input value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Student Name</label>
              <input value={formData.studentName} onChange={(e) => setFormData({...formData, studentName: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Amount *</label>
                <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Payment Method *</label>
                <select value={formData.method} onChange={(e) => setFormData({...formData, method: e.target.value})} required>
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="online">Online Transfer</option>
                  <option value="mobile">Mobile Payment</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Transaction ID</label>
                <input value={formData.transactionId} onChange={(e) => setFormData({...formData, transactionId: e.target.value})} placeholder="For online/card payments" />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="2" />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleRecordPayment}>Record Payment</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PaymentTracking;