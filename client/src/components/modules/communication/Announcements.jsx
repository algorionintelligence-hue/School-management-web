import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaPlus, FaEdit, FaTrash, FaBullhorn, FaCalendarAlt,
  FaUserTag, FaEye, FaPaperPlane 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './Announcements.css';

const Announcements = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [filterTarget, setFilterTarget] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'all',
    priority: 'normal',
    publishDate: '',
    expiryDate: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    setLoading(true);
    setTimeout(() => {
      setAnnouncements([
        { 
          id: 1, 
          title: 'Annual Sports Day 2024', 
          content: 'The Annual Sports Day will be held on March 15, 2024. All students are required to participate. Parents are invited to attend.', 
          targetAudience: 'all', 
          priority: 'high',
          publishDate: '2024-02-01',
          expiryDate: '2024-03-15',
          status: 'published',
          views: 450,
          author: 'Principal'
        },
        { 
          id: 2, 
          title: 'Mid-Term Examination Schedule', 
          content: 'Mid-term examinations will begin from March 15, 2024. Please check the detailed schedule on the examination portal.', 
          targetAudience: 'students', 
          priority: 'high',
          publishDate: '2024-02-20',
          expiryDate: '2024-03-25',
          status: 'published',
          views: 320,
          author: 'Academic Coordinator'
        },
        { 
          id: 3, 
          title: 'Parent-Teacher Meeting', 
          content: 'PTM scheduled for February 28, 2024. Timings: 9:00 AM - 2:00 PM.', 
          targetAudience: 'parents', 
          priority: 'normal',
          publishDate: '2024-02-15',
          expiryDate: '2024-02-28',
          status: 'published',
          views: 280,
          author: 'Class Teacher'
        },
        { 
          id: 4, 
          title: 'Staff Development Workshop', 
          content: 'Mandatory workshop on new teaching methodologies on March 1, 2024.', 
          targetAudience: 'teachers', 
          priority: 'normal',
          publishDate: '2024-02-25',
          expiryDate: '2024-03-01',
          status: 'draft',
          views: 0,
          author: 'HR Manager'
        }
      ]);
      setLoading(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        setAnnouncements(prev => prev.map(a => a.id === editingAnnouncement.id ? { ...a, ...formData } : a));
        success('Announcement updated');
      } else {
        setAnnouncements(prev => [...prev, { 
          ...formData, 
          id: Date.now(), 
          views: 0, 
          author: 'Current User',
          publishDate: new Date().toISOString().split('T')[0]
        }]);
        success('Announcement created');
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      error('Operation failed');
    }
  };

  const handlePublish = (id) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, status: 'published', publishDate: new Date().toISOString().split('T')[0] } : a));
    success('Announcement published');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    success('Announcement deleted');
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', targetAudience: 'all', priority: 'normal', publishDate: '', expiryDate: '', status: 'draft' });
    setEditingAnnouncement(null);
  };

  const filteredAnnouncements = announcements.filter(a => 
    filterTarget === 'all' || a.targetAudience === filterTarget
  );

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'targetAudience', label: 'Target', sortable: true, render: (v) => (
      <span className={`target-badge ${v}`}>{v}</span>
    )},
    { key: 'priority', label: 'Priority', sortable: true, render: (v) => (
      <span className={`priority-badge ${v}`}>{v}</span>
    )},
    { key: 'publishDate', label: 'Publish Date', sortable: true },
    { key: 'status', label: 'Status', render: (v) => <span className={`status-badge ${v}`}>{v}</span> },
    { key: 'views', label: 'Views', sortable: true },
    { key: 'actions', label: 'Actions', render: (_, announcement) => (
      <div className="action-buttons">
        {announcement.status === 'draft' && hasPermission('communication', 'write') && (
          <button onClick={() => handlePublish(announcement.id)} className="btn-icon success" title="Publish"><FaPaperPlane /></button>
        )}
        <button onClick={() => { setEditingAnnouncement(announcement); setFormData({...announcement}); setShowModal(true); }} className="btn-icon edit"><FaEdit /></button>
        <button onClick={() => handleDelete(announcement.id)} className="btn-icon delete"><FaTrash /></button>
      </div>
    )}
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaBullhorn /> Announcements & Circulars</h1>
        {hasPermission('communication', 'write') && (
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <FaPlus /> New Announcement
          </button>
        )}
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <select value={filterTarget} onChange={(e) => setFilterTarget(e.target.value)}>
            <option value="all">All Audiences</option>
            <option value="all">Everyone</option>
            <option value="students">Students</option>
            <option value="parents">Parents</option>
            <option value="teachers">Teachers</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={filteredAnnouncements} loading={loading} pagination={true} itemsPerPage={10} />

      {showModal && (
        <Modal title={editingAnnouncement ? 'Edit Announcement' : 'New Announcement'} onClose={() => setShowModal(false)} wide>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Title *</label>
              <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Content *</label>
              <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows="6" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Target Audience</label>
                <select value={formData.targetAudience} onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}>
                  <option value="all">Everyone</option>
                  <option value="students">Students</option>
                  <option value="parents">Parents</option>
                  <option value="teachers">Teachers</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Publish Date</label>
                <input type="date" value={formData.publishDate} onChange={(e) => setFormData({...formData, publishDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">{editingAnnouncement ? 'Update' : 'Create'} Announcement</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Announcements;