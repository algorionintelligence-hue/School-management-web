import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaExclamationTriangle, FaBell, FaSms, FaEnvelope,
  FaPaperPlane, FaHistory, FaCheckCircle 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './EmergencyAlerts.css';

const EmergencyAlerts = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [alertHistory, setAlertHistory] = useState([
    { 
      id: 1, 
      type: 'weather', 
      title: 'School Closure - Heavy Rain', 
      message: 'School will remain closed tomorrow due to heavy rainfall warning. Stay safe!', 
      channels: ['sms', 'email', 'push'], 
      recipients: 450, 
      sentAt: '2024-02-15 18:30', 
      status: 'delivered',
      sentBy: 'Principal'
    },
    { 
      id: 2, 
      type: 'emergency', 
      title: 'Fire Drill Alert', 
      message: 'Fire drill scheduled for today at 11:00 AM. All students and staff must participate.', 
      channels: ['sms', 'push'], 
      recipients: 480, 
      sentAt: '2024-02-10 10:00', 
      status: 'delivered',
      sentBy: 'Admin'
    },
    { 
      id: 3, 
      type: 'health', 
      title: 'Vaccination Camp', 
      message: 'Health department vaccination camp on Feb 20. Consent forms mandatory.', 
      channels: ['email', 'sms'], 
      recipients: 450, 
      sentAt: '2024-02-05 09:00', 
      status: 'delivered',
      sentBy: 'Nurse'
    }
  ]);

  const [formData, setFormData] = useState({
    type: 'general',
    title: '',
    message: '',
    channels: [],
    targetAudience: 'all',
    priority: 'high'
  });

  const handleSendAlert = () => {
    if (!formData.title || !formData.message || formData.channels.length === 0) {
      error('Please fill all required fields and select at least one channel');
      return;
    }
    
    const newAlert = {
      id: Date.now(),
      ...formData,
      recipients: 450,
      sentAt: new Date().toLocaleString(),
      status: 'sending',
      sentBy: 'Current User'
    };
    
    setAlertHistory(prev => [newAlert, ...prev]);
    setShowModal(false);
    setFormData({ type: 'general', title: '', message: '', channels: [], targetAudience: 'all', priority: 'high' });
    success('Emergency alert sent successfully');
  };

  const toggleChannel = (channel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const columns = [
    { key: 'type', label: 'Type', render: (v) => (
      <span className={`alert-type-badge ${v}`}>
        <FaExclamationTriangle /> {v}
      </span>
    )},
    { key: 'title', label: 'Title', sortable: true },
    { key: 'channels', label: 'Channels', render: (v) => (
      <div className="channel-tags">
        {v.map(c => <span key={c} className={`channel-tag ${c}`}>{c}</span>)}
      </div>
    )},
    { key: 'recipients', label: 'Recipients', sortable: true },
    { key: 'sentAt', label: 'Sent At', sortable: true },
    { key: 'status', label: 'Status', render: (v) => (
      <span className={`status-badge ${v}`}>
        {v === 'delivered' ? <FaCheckCircle /> : null} {v}
      </span>
    )},
    { key: 'sentBy', label: 'Sent By' }
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaBell /> Emergency Alerts</h1>
        {hasPermission('communication', 'write') && (
          <button className="btn-danger" onClick={() => setShowModal(true)}>
            <FaPaperPlane /> Send Alert
          </button>
        )}
      </div>

      <div className="alert-info-banner">
        <FaExclamationTriangle />
        <p>Emergency alerts are sent immediately to all selected channels. Use responsibly.</p>
      </div>

      <DataTable columns={columns} data={alertHistory} pagination={true} itemsPerPage={10} />

      {showModal && (
        <Modal title="Send Emergency Alert" onClose={() => setShowModal(false)} wide>
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Alert Type *</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="general">General</option>
                  <option value="weather">Weather</option>
                  <option value="emergency">Emergency</option>
                  <option value="health">Health</option>
                  <option value="safety">Safety</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority *</label>
                <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Title *</label>
              <input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Brief alert title"
                required
              />
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea 
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows="4"
                placeholder="Detailed alert message"
                required
              />
            </div>

            <div className="form-group">
              <label>Communication Channels *</label>
              <div className="channel-selector">
                <button 
                  className={`channel-btn ${formData.channels.includes('sms') ? 'active' : ''}`}
                  onClick={() => toggleChannel('sms')}
                >
                  <FaSms /> SMS
                </button>
                <button 
                  className={`channel-btn ${formData.channels.includes('email') ? 'active' : ''}`}
                  onClick={() => toggleChannel('email')}
                >
                  <FaEnvelope /> Email
                </button>
                <button 
                  className={`channel-btn ${formData.channels.includes('push') ? 'active' : ''}`}
                  onClick={() => toggleChannel('push')}
                >
                  <FaBell /> Push Notification
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Target Audience</label>
              <select value={formData.targetAudience} onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}>
                <option value="all">Everyone</option>
                <option value="students">Students Only</option>
                <option value="parents">Parents Only</option>
                <option value="staff">Staff Only</option>
              </select>
            </div>

            <div className="alert-preview">
              <h4>Preview</h4>
              <div className="preview-box">
                <p><strong>{formData.title || 'Alert Title'}</strong></p>
                <p>{formData.message || 'Alert message will appear here...'}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleSendAlert}>
                <FaPaperPlane /> Send Alert
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmergencyAlerts;