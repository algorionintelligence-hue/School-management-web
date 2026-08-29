import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaArrowLeft, FaEdit, FaCertificate, FaCalendarAlt, 
  FaMoneyBillWave, FaBook, FaClock, FaAward 
} from 'react-icons/fa';
import './StaffProfile.css';

const StaffProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success } = useNotification();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);

  useEffect(() => {
    fetchStaffData();
  }, [id]);

  const fetchStaffData = () => {
    setLoading(true);
    setTimeout(() => {
      setStaff({
        id: parseInt(id),
        firstName: 'John',
        lastName: 'Smith',
        employeeId: 'EMP2024001',
        email: 'john.smith@school.com',
        phone: '555-0201',
        department: 'Science',
        designation: 'Senior Teacher',
        role: 'teacher',
        qualifications: 'M.Sc. Physics, B.Ed.',
        certifications: 'CBSE Certified, NET Qualified',
        joiningDate: '2018-06-01',
        salary: 45000,
        address: '789 Teacher Lane, Cityville',
        emergencyContact: 'Jane Smith - 555-0206',
        status: 'active',
        photo: null
      });
      setLeaveHistory([
        { id: 1, type: 'Sick Leave', startDate: '2024-01-10', endDate: '2024-01-12', days: 3, status: 'approved', reason: 'Fever' },
        { id: 2, type: 'Casual Leave', startDate: '2024-02-15', endDate: '2024-02-15', days: 1, status: 'approved', reason: 'Personal work' },
        { id: 3, type: 'Annual Leave', startDate: '2024-03-20', endDate: '2024-03-25', days: 6, status: 'pending', reason: 'Family vacation' }
      ]);
      setAssignedClasses([
        { id: 1, class: '10', section: 'A', subject: 'Physics', periodsPerWeek: 6 },
        { id: 2, class: '11', section: 'A', subject: 'Physics', periodsPerWeek: 8 },
        { id: 3, class: '12', section: 'B', subject: 'Physics', periodsPerWeek: 8 }
      ]);
      setLoading(false);
    }, 600);
  };

  const handleLeaveAction = (leaveId, action) => {
    setLeaveHistory(prev => prev.map(l => l.id === leaveId ? { ...l, status: action } : l));
    success(`Leave ${action} successfully`);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!staff) return <div>Staff not found</div>;

  return (
    <div className="module-container">
      <div className="profile-header">
        <button className="btn-back" onClick={() => navigate('/staff')}>
          <FaArrowLeft /> Back to Staff
        </button>
        <div className="profile-actions">
          <button className="btn-secondary"><FaEdit /> Edit Profile</button>
        </div>
      </div>

      <div className="profile-hero">
        <div className="profile-avatar">
          {staff.photo ? (
            <img src={staff.photo} alt={staff.firstName} />
          ) : (
            <div className="avatar-placeholder">
              {staff.firstName[0]}{staff.lastName[0]}
            </div>
          )}
        </div>
        <div className="profile-title">
          <h1>{staff.firstName} {staff.lastName}</h1>
          <div className="profile-meta">
            <span className="employee-id">{staff.employeeId}</span>
            <span className="designation-badge">{staff.designation}</span>
            <span className={`status-badge ${staff.status}`}>{staff.status}</span>
          </div>
          <p className="department-text">{staff.department} Department</p>
        </div>
      </div>

      <div className="profile-tabs">
        {['overview', 'classes', 'leave', 'performance'].map(tab => (
          <button 
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="profile-grid">
            <div className="info-card">
              <h3><FaCertificate /> Qualifications</h3>
              <p>{staff.qualifications}</p>
              <h4>Certifications</h4>
              <p>{staff.certifications}</p>
            </div>
            <div className="info-card">
              <h3><FaCalendarAlt /> Employment</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Joining Date</span>
                  <span className="value">{staff.joiningDate}</span>
                </div>
                <div className="info-item">
                  <span className="label">Years of Service</span>
                  <span className="value">6 years</span>
                </div>
                <div className="info-item">
                  <span className="label">Department</span>
                  <span className="value">{staff.department}</span>
                </div>
                <div className="info-item">
                  <span className="label">Role</span>
                  <span className="value capitalize">{staff.role}</span>
                </div>
              </div>
            </div>
            <div className="info-card">
              <h3><FaMoneyBillWave /> Compensation</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Monthly Salary</span>
                  <span className="value">${staff.salary.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Annual Package</span>
                  <span className="value">${(staff.salary * 12).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="info-card">
              <h3>Contact Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Email</span>
                  <span className="value">{staff.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone</span>
                  <span className="value">{staff.phone}</span>
                </div>
                <div className="info-item">
                  <span className="label">Address</span>
                  <span className="value">{staff.address}</span>
                </div>
                <div className="info-item">
                  <span className="label">Emergency Contact</span>
                  <span className="value">{staff.emergencyContact}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="classes-section">
            <h3>Assigned Classes</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Subject</th>
                  <th>Periods/Week</th>
                  <th>Total Students</th>
                </tr>
              </thead>
              <tbody>
                {assignedClasses.map(cls => (
                  <tr key={cls.id}>
                    <td>Class {cls.class}</td>
                    <td>{cls.section}</td>
                    <td>{cls.subject}</td>
                    <td>{cls.periodsPerWeek}</td>
                    <td>{Math.floor(Math.random() * 20) + 25}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="timetable-preview">
              <h4>Weekly Timetable</h4>
              <div className="timetable-grid">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                  <div key={day} className="timetable-day">
                    <h5>{day}</h5>
                    <div className="periods">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(period => (
                        <div key={period} className={`period ${Math.random() > 0.5 ? 'assigned' : 'free'}`}>
                          <span className="period-num">P{period}</span>
                          {Math.random() > 0.5 && <span className="period-class">10-A Physics</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="leave-section">
            <div className="leave-stats">
              <div className="leave-stat-card">
                <h4>Annual Leave Balance</h4>
                <span className="leave-value">12</span>
                <span className="leave-total">/ 20 days</span>
              </div>
              <div className="leave-stat-card">
                <h4>Sick Leave Balance</h4>
                <span className="leave-value">8</span>
                <span className="leave-total">/ 10 days</span>
              </div>
              <div className="leave-stat-card">
                <h4>Casual Leave Balance</h4>
                <span className="leave-value">5</span>
                <span className="leave-total">/ 8 days</span>
              </div>
            </div>

            <h3>Leave History</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map(leave => (
                  <tr key={leave.id}>
                    <td>{leave.type}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>{leave.days}</td>
                    <td>{leave.reason}</td>
                    <td><span className={`status-badge ${leave.status}`}>{leave.status}</span></td>
                    <td>
                      {leave.status === 'pending' && (
                        <div className="action-buttons">
                          <button className="btn-icon success" onClick={() => handleLeaveAction(leave.id, 'approved')}>
                            <FaAward />
                          </button>
                          <button className="btn-icon delete" onClick={() => handleLeaveAction(leave.id, 'rejected')}>
                            <FaClock />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-section">
            <div className="performance-metrics">
              <div className="metric-card">
                <h4>Student Pass Rate</h4>
                <div className="metric-circle">
                  <span className="metric-value">94%</span>
                </div>
              </div>
              <div className="metric-card">
                <h4>Average Class Score</h4>
                <div className="metric-circle">
                  <span className="metric-value">82.5</span>
                </div>
              </div>
              <div className="metric-card">
                <h4>Attendance Rate</h4>
                <div className="metric-circle">
                  <span className="metric-value">98%</span>
                </div>
              </div>
              <div className="metric-card">
                <h4>Parent Satisfaction</h4>
                <div className="metric-circle">
                  <span className="metric-value">4.8</span>
                  <span className="metric-sub">/ 5.0</span>
                </div>
              </div>
            </div>

            <h3>Recent Evaluations</h3>
            <div className="evaluations-list">
              {[
                { date: '2024-01-15', evaluator: 'Principal', rating: 4.5, comments: 'Excellent teaching methodology, good student engagement' },
                { date: '2023-12-10', evaluator: 'HOD Science', rating: 4.8, comments: 'Outstanding subject knowledge, innovative experiments' },
                { date: '2023-09-20', evaluator: 'Principal', rating: 4.2, comments: 'Good overall performance, needs improvement in documentation' }
              ].map((evalItem, idx) => (
                <div key={idx} className="evaluation-card">
                  <div className="eval-header">
                    <span className="eval-date">{evalItem.date}</span>
                    <span className="eval-rating">{evalItem.rating}/5.0</span>
                  </div>
                  <p className="eval-evaluator">Evaluated by: {evalItem.evaluator}</p>
                  <p className="eval-comments">{evalItem.comments}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffProfile;