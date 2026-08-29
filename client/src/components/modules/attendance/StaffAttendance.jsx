import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaCalendarAlt, FaCheck, FaTimes, FaClock, FaUserTie,
  FaSave, FaCalendarPlus 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './StaffAttendance.css';

const StaffAttendance = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    staffId: '',
    type: 'sick',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = () => {
    setLoading(true);
    setTimeout(() => {
      const sampleStaff = [
        { id: 1, employeeId: 'EMP2024001', name: 'John Smith', department: 'Science', designation: 'Senior Teacher' },
        { id: 2, employeeId: 'EMP2024002', name: 'Sarah Johnson', department: 'Mathematics', designation: 'HOD' },
        { id: 3, employeeId: 'EMP2024003', name: 'Michael Brown', department: 'English', designation: 'Teacher' },
        { id: 4, employeeId: 'EMP2024004', name: 'Emily Davis', department: 'Administration', designation: 'Office Manager' },
        { id: 5, employeeId: 'EMP2024005', name: 'Robert Wilson', department: 'Sports', designation: 'PE Teacher' }
      ];
      
      const sampleAttendance = sampleStaff.map(s => ({
        ...s,
        status: Math.random() > 0.15 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'on-leave'),
        checkIn: '08:00',
        checkOut: '15:30',
        remarks: ''
      }));
      
      setAttendance(sampleAttendance);
      setLoading(false);
    }, 600);
  };

  const handleStatusChange = (staffId, status) => {
    setAttendance(prev => prev.map(a => 
      a.id === staffId ? { ...a, status } : a
    ));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      success('Staff attendance saved');
    }, 1000);
  };

  const handleApplyLeave = () => {
    if (!leaveForm.staffId || !leaveForm.startDate || !leaveForm.endDate) {
      error('Please fill all required fields');
      return;
    }
    setShowLeaveModal(false);
    setLeaveForm({ staffId: '', type: 'sick', startDate: '', endDate: '', reason: '' });
    success('Leave application submitted');
  };

  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    onLeave: attendance.filter(a => a.status === 'on-leave').length,
    percentage: attendance.length > 0 ? ((attendance.filter(a => a.status === 'present').length / attendance.length) * 100).toFixed(1) : 0
  };

  const columns = [
    { key: 'employeeId', label: 'Employee ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    { 
      key: 'status', 
      label: 'Status',
      render: (_, staff) => (
        <div className="attendance-toggle">
          <button 
            className={`status-btn ${staff.status === 'present' ? 'active' : ''}`}
            onClick={() => handleStatusChange(staff.id, 'present')}
            disabled={!hasPermission('attendance', 'write')}
          >
            <FaCheck /> Present
          </button>
          <button 
            className={`status-btn ${staff.status === 'absent' ? 'active' : ''}`}
            onClick={() => handleStatusChange(staff.id, 'absent')}
            disabled={!hasPermission('attendance', 'write')}
          >
            <FaTimes /> Absent
          </button>
          <button 
            className={`status-btn ${staff.status === 'on-leave' ? 'active' : ''}`}
            onClick={() => handleStatusChange(staff.id, 'on-leave')}
            disabled={!hasPermission('attendance', 'write')}
          >
            <FaCalendarAlt /> Leave
          </button>
        </div>
      )
    },
    { 
      key: 'checkIn', 
      label: 'Check In',
      render: (_, staff) => (
        <input 
          type="time" 
          value={staff.checkIn || ''}
          onChange={(e) => setAttendance(prev => prev.map(a => a.id === staff.id ? { ...a, checkIn: e.target.value } : a))}
          disabled={!hasPermission('attendance', 'write')}
        />
      )
    },
    { 
      key: 'checkOut', 
      label: 'Check Out',
      render: (_, staff) => (
        <input 
          type="time" 
          value={staff.checkOut || ''}
          onChange={(e) => setAttendance(prev => prev.map(a => a.id === staff.id ? { ...a, checkOut: e.target.value } : a))}
          disabled={!hasPermission('attendance', 'write')}
        />
      )
    },
    { 
      key: 'remarks', 
      label: 'Remarks',
      render: (_, staff) => (
        <input 
          type="text" 
          value={staff.remarks || ''}
          onChange={(e) => setAttendance(prev => prev.map(a => a.id === staff.id ? { ...a, remarks: e.target.value } : a))}
          placeholder="Optional"
          disabled={!hasPermission('attendance', 'write')}
        />
      )
    }
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaUserTie /> Staff Attendance</h1>
        {hasPermission('attendance', 'write') && (
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => setShowLeaveModal(true)}>
              <FaCalendarPlus /> Apply Leave
            </button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              <FaSave /> {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        )}
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="attendance-stats">
        <div className="stat-card">
          <h4>Total Staff</h4>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card present">
          <h4>Present</h4>
          <span className="stat-value">{stats.present}</span>
        </div>
        <div className="stat-card absent">
          <h4>Absent</h4>
          <span className="stat-value">{stats.absent}</span>
        </div>
        <div className="stat-card on-leave">
          <h4>On Leave</h4>
          <span className="stat-value">{stats.onLeave}</span>
        </div>
        <div className="stat-card">
          <h4>Attendance %</h4>
          <span className="stat-value">{stats.percentage}%</span>
        </div>
      </div>

      <DataTable columns={columns} data={attendance} loading={loading} pagination={false} />

      {showLeaveModal && (
        <Modal title="Apply Leave" onClose={() => setShowLeaveModal(false)}>
          <div className="modal-form">
            <div className="form-group">
              <label>Staff Member *</label>
              <select 
                value={leaveForm.staffId} 
                onChange={(e) => setLeaveForm({...leaveForm, staffId: e.target.value})}
                required
              >
                <option value="">Select Staff</option>
                {attendance.map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.name} ({staff.employeeId})</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Leave Type *</label>
                <select 
                  value={leaveForm.type} 
                  onChange={(e) => setLeaveForm({...leaveForm, type: e.target.value})}
                >
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="annual">Annual Leave</option>
                  <option value="emergency">Emergency Leave</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input 
                  type="date" 
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input 
                  type="date" 
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Reason</label>
              <textarea 
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                rows="3"
                placeholder="Enter reason for leave"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowLeaveModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleApplyLeave}>Submit Leave</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StaffAttendance;