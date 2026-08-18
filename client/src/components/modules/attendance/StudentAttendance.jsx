import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaCalendarAlt, FaCheck, FaTimes, FaClock, FaUserCheck,
  FaSave, FaBell, FaSms 
} from 'react-icons/fa';
import DataTable from '../../common/DataTable';
import './StudentAttendance.css';

const StudentAttendance = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('10A');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, selectedClass, selectedSubject]);

  const fetchAttendance = () => {
    setLoading(true);
    setTimeout(() => {
      const sampleStudents = [
        { id: 1, rollNumber: '101', name: 'Alice Johnson', studentId: 'STU2024001' },
        { id: 2, rollNumber: '102', name: 'Charlie Smith', studentId: 'STU2024002' },
        { id: 3, rollNumber: '103', name: 'Eva Williams', studentId: 'STU2024003' },
        { id: 4, rollNumber: '104', name: 'David Brown', studentId: 'STU2024004' },
        { id: 5, rollNumber: '105', name: 'Fiona Green', studentId: 'STU2024005' }
      ];
      
      const sampleAttendance = sampleStudents.map(s => ({
        ...s,
        status: Math.random() > 0.2 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'late'),
        checkIn: '08:30',
        checkOut: '15:00',
        remarks: ''
      }));
      
      setAttendance(sampleAttendance);
      setLoading(false);
    }, 600);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => prev.map(a => 
      a.id === studentId ? { ...a, status } : a
    ));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      success('Attendance saved successfully');
    }, 1000);
  };

  const handleNotifyParents = () => {
    const absentStudents = attendance.filter(a => a.status === 'absent');
    if (absentStudents.length === 0) {
      error('No absent students to notify');
      return;
    }
    success(`SMS sent to ${absentStudents.length} parents`);
  };

  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    percentage: attendance.length > 0 ? ((attendance.filter(a => a.status === 'present').length / attendance.length) * 100).toFixed(1) : 0
  };

  const columns = [
    { key: 'rollNumber', label: 'Roll No', sortable: true },
    { key: 'name', label: 'Student Name', sortable: true },
    { 
      key: 'status', 
      label: 'Status',
      render: (_, student) => (
        <div className="attendance-toggle">
          <button 
            className={`status-btn ${student.status === 'present' ? 'active' : ''}`}
            onClick={() => handleStatusChange(student.id, 'present')}
            disabled={!hasPermission('attendance', 'write')}
          >
            <FaCheck /> Present
          </button>
          <button 
            className={`status-btn ${student.status === 'absent' ? 'active' : ''}`}
            onClick={() => handleStatusChange(student.id, 'absent')}
            disabled={!hasPermission('attendance', 'write')}
          >
            <FaTimes /> Absent
          </button>
          <button 
            className={`status-btn ${student.status === 'late' ? 'active' : ''}`}
            onClick={() => handleStatusChange(student.id, 'late')}
            disabled={!hasPermission('attendance', 'write')}
          >
            <FaClock /> Late
          </button>
        </div>
      )
    },
    { 
      key: 'checkIn', 
      label: 'Check In',
      render: (_, student) => (
        <input 
          type="time" 
          value={student.checkIn || ''}
          onChange={(e) => setAttendance(prev => prev.map(a => a.id === student.id ? { ...a, checkIn: e.target.value } : a))}
          disabled={!hasPermission('attendance', 'write')}
        />
      )
    },
    { 
      key: 'checkOut', 
      label: 'Check Out',
      render: (_, student) => (
        <input 
          type="time" 
          value={student.checkOut || ''}
          onChange={(e) => setAttendance(prev => prev.map(a => a.id === student.id ? { ...a, checkOut: e.target.value } : a))}
          disabled={!hasPermission('attendance', 'write')}
        />
      )
    },
    { 
      key: 'remarks', 
      label: 'Remarks',
      render: (_, student) => (
        <input 
          type="text" 
          value={student.remarks || ''}
          onChange={(e) => setAttendance(prev => prev.map(a => a.id === student.id ? { ...a, remarks: e.target.value } : a))}
          placeholder="Optional"
          disabled={!hasPermission('attendance', 'write')}
        />
      )
    }
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaUserCheck /> Student Attendance</h1>
        {hasPermission('attendance', 'write') && (
          <div className="header-actions">
            <button className="btn-secondary" onClick={handleNotifyParents}><FaSms /> Notify Parents</button>
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
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="10A">Class 10-A</option>
            <option value="10B">Class 10-B</option>
            <option value="11A">Class 11-A</option>
            <option value="11B">Class 11-B</option>
            <option value="9A">Class 9-A</option>
            <option value="9B">Class 9-B</option>
          </select>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="all">All Subjects (Daily)</option>
            <option value="mathematics">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="english">English</option>
          </select>
        </div>
      </div>

      <div className="attendance-stats">
        <div className="stat-card">
          <h4>Total Students</h4>
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
        <div className="stat-card late">
          <h4>Late</h4>
          <span className="stat-value">{stats.late}</span>
        </div>
        <div className="stat-card">
          <h4>Attendance %</h4>
          <span className="stat-value">{stats.percentage}%</span>
        </div>
      </div>

      <DataTable columns={columns} data={attendance} loading={loading} pagination={false} />

      {stats.absent > 0 && (
        <div className="absence-alert">
          <FaBell /> {stats.absent} students absent today. 
          <button className="btn-link" onClick={handleNotifyParents}>Send notifications to parents</button>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;