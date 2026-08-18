import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaArrowLeft, FaEdit, FaIdCard, FaEnvelope, FaPhone, 
  FaMapMarkerAlt, FaUserGraduate, FaCalendarAlt, FaTint,
  FaFileAlt, FaDownload, FaUpload 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import './StudentProfile.css';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success } = useNotification();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDocModal, setShowDocModal] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = () => {
    setLoading(true);
    setTimeout(() => {
      setStudent({
        id: parseInt(id),
        firstName: 'Alice',
        lastName: 'Johnson',
        studentId: 'STU2024001',
        email: 'alice@school.com',
        phone: '555-0101',
        dateOfBirth: '2008-05-15',
        gender: 'female',
        address: '123 Main St, Cityville',
        class: '10',
        section: 'A',
        rollNumber: '101',
        admissionDate: '2020-06-01',
        guardianName: 'Bob Johnson',
        guardianPhone: '555-0102',
        guardianEmail: 'bob@email.com',
        guardianRelation: 'Father',
        bloodGroup: 'A+',
        status: 'active',
        photo: null
      });
      setDocuments([
        { id: 1, name: 'Birth Certificate', type: 'pdf', uploadedAt: '2020-06-01', size: '1.2 MB' },
        { id: 2, name: 'Previous School TC', type: 'pdf', uploadedAt: '2020-06-01', size: '0.8 MB' },
        { id: 3, name: 'Medical Report', type: 'pdf', uploadedAt: '2021-01-15', size: '2.1 MB' }
      ]);
      setLoading(false);
    }, 600);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        type: file.name.split('.').pop(),
        uploadedAt: new Date().toISOString().split('T')[0],
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      };
      setDocuments(prev => [...prev, newDoc]);
      success('Document uploaded successfully');
    }
  };

  const handleDeleteDoc = (docId) => {
    if (!window.confirm('Delete this document?')) return;
    setDocuments(prev => prev.filter(d => d.id !== docId));
    success('Document deleted');
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!student) return <div>Student not found</div>;

  return (
    <div className="module-container">
      <div className="profile-header">
        <button className="btn-back" onClick={() => navigate('/students')}>
          <FaArrowLeft /> Back to Students
        </button>
        <div className="profile-actions">
          <button className="btn-primary" onClick={() => setShowDocModal(true)}>
            <FaUpload /> Upload Document
          </button>
          <button className="btn-secondary"><FaEdit /> Edit Profile</button>
        </div>
      </div>

      <div className="profile-hero">
        <div className="profile-avatar">
          {student.photo ? (
            <img src={student.photo} alt={student.firstName} />
          ) : (
            <div className="avatar-placeholder">
              {student.firstName[0]}{student.lastName[0]}
            </div>
          )}
        </div>
        <div className="profile-title">
          <h1>{student.firstName} {student.lastName}</h1>
          <div className="profile-meta">
            <span className="student-id"><FaIdCard /> {student.studentId}</span>
            <span className={`status-badge ${student.status}`}>{student.status}</span>
            <span className="class-badge">Class {student.class}-{student.section}</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        {['overview', 'academic', 'attendance', 'documents', 'fees'].map(tab => (
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
              <h3><FaUserGraduate /> Personal Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Full Name</span>
                  <span className="value">{student.firstName} {student.lastName}</span>
                </div>
                <div className="info-item">
                  <span className="label">Date of Birth</span>
                  <span className="value">{student.dateOfBirth} ({calculateAge(student.dateOfBirth)} years)</span>
                </div>
                <div className="info-item">
                  <span className="label">Gender</span>
                  <span className="value capitalize">{student.gender}</span>
                </div>
                <div className="info-item">
                  <span className="label">Blood Group</span>
                  <span className="value"><FaTint /> {student.bloodGroup}</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3><FaMapMarkerAlt /> Contact Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Email</span>
                  <span className="value"><FaEnvelope /> {student.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone</span>
                  <span className="value"><FaPhone /> {student.phone}</span>
                </div>
                <div className="info-item">
                  <span className="label">Address</span>
                  <span className="value">{student.address}</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3><FaUserGraduate /> Guardian Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Name</span>
                  <span className="value">{student.guardianName}</span>
                </div>
                <div className="info-item">
                  <span className="label">Relation</span>
                  <span className="value">{student.guardianRelation}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone</span>
                  <span className="value"><FaPhone /> {student.guardianPhone}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email</span>
                  <span className="value"><FaEnvelope /> {student.guardianEmail}</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3><FaCalendarAlt /> Academic Details</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Class</span>
                  <span className="value">{student.class}</span>
                </div>
                <div className="info-item">
                  <span className="label">Section</span>
                  <span className="value">{student.section}</span>
                </div>
                <div className="info-item">
                  <span className="label">Roll Number</span>
                  <span className="value">{student.rollNumber}</span>
                </div>
                <div className="info-item">
                  <span className="label">Admission Date</span>
                  <span className="value">{student.admissionDate}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="documents-section">
            <div className="documents-list">
              {documents.map(doc => (
                <div key={doc.id} className="document-card">
                  <div className="doc-icon"><FaFileAlt /></div>
                  <div className="doc-info">
                    <h4>{doc.name}</h4>
                    <span>{doc.type.toUpperCase()} • {doc.size} • Uploaded {doc.uploadedAt}</span>
                  </div>
                  <div className="doc-actions">
                    <button className="btn-icon"><FaDownload /></button>
                    <button className="btn-icon delete" onClick={() => handleDeleteDoc(doc.id)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

                {activeTab === 'academic' && (
          <div className="academic-section">
            <div className="performance-summary">
              <div className="performance-card">
                <h4>Current GPA</h4>
                <span className="performance-value">3.85</span>
                <span className="performance-trend">↑ 0.2 from last term</span>
              </div>
              <div className="performance-card">
                <h4>Attendance Rate</h4>
                <span className="performance-value">96.5%</span>
                <span className="performance-trend">Present: 193/200 days</span>
              </div>
              <div className="performance-card">
                <h4>Rank</h4>
                <span className="performance-value">#3</span>
                <span className="performance-trend">Out of 45 students</span>
              </div>
            </div>
            
            <h3>Subject Performance</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Mid-Term</th>
                  <th>Final</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mathematics</td>
                  <td>Mr. Smith</td>
                  <td>85</td>
                  <td>92</td>
                  <td><span className="grade-badge a">A</span></td>
                  <td><span className="status-badge pass">Pass</span></td>
                </tr>
                <tr>
                  <td>Science</td>
                  <td>Mrs. Johnson</td>
                  <td>88</td>
                  <td>90</td>
                  <td><span className="grade-badge a">A</span></td>
                  <td><span className="status-badge pass">Pass</span></td>
                </tr>
                <tr>
                  <td>English</td>
                  <td>Ms. Davis</td>
                  <td>78</td>
                  <td>82</td>
                  <td><span className="grade-badge b">B</span></td>
                  <td><span className="status-badge pass">Pass</span></td>
                </tr>
                <tr>
                  <td>History</td>
                  <td>Mr. Brown</td>
                  <td>92</td>
                  <td>95</td>
                  <td><span className="grade-badge a-plus">A+</span></td>
                  <td><span className="status-badge pass">Pass</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="attendance-section">
            <div className="attendance-calendar">
              <h3>Monthly Attendance - January 2024</h3>
              <div className="calendar-grid">
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const statuses = ['present', 'present', 'present', 'absent', 'present', 'present', 'weekend', 'present', 'present', 'late', 'present'];
                  const status = statuses[day % statuses.length];
                  return (
                    <div key={day} className={`calendar-day ${status}`}>
                      <span className="day-number">{day}</span>
                      <span className="day-status">{status === 'weekend' ? '—' : status.charAt(0).toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
              <div className="attendance-legend">
                <span><span className="dot present"></span> Present</span>
                <span><span className="dot absent"></span> Absent</span>
                <span><span className="dot late"></span> Late</span>
                <span><span className="dot weekend"></span> Weekend/Holiday</span>
              </div>
            </div>
            
            <div className="attendance-summary">
              <h3>Attendance Summary</h3>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Days</span>
                  <span className="stat-value">22</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Present</span>
                  <span className="stat-value text-success">20</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Absent</span>
                  <span className="stat-value text-danger">1</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Late</span>
                  <span className="stat-value text-warning">1</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="fees-section">
            <div className="fee-summary-cards">
              <div className="fee-card total">
                <h4>Total Fees</h4>
                <span className="fee-amount">$5,000.00</span>
              </div>
              <div className="fee-card paid">
                <h4>Paid</h4>
                <span className="fee-amount">$4,200.00</span>
              </div>
              <div className="fee-card pending">
                <h4>Pending</h4>
                <span className="fee-amount">$800.00</span>
              </div>
            </div>
            
            <h3>Payment History</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>INV-2024-001</td>
                  <td>Tuition Fee - Term 1</td>
                  <td>$2,500.00</td>
                  <td>2024-01-15</td>
                  <td>2024-01-10</td>
                  <td><span className="status-badge paid">Paid</span></td>
                </tr>
                <tr>
                  <td>INV-2024-002</td>
                  <td>Tuition Fee - Term 2</td>
                  <td>$2,500.00</td>
                  <td>2024-04-15</td>
                  <td>2024-04-12</td>
                  <td><span className="status-badge paid">Paid</span></td>
                </tr>
                <tr>
                  <td>INV-2024-003</td>
                  <td>Examination Fee</td>
                  <td>$500.00</td>
                  <td>2024-06-01</td>
                  <td>—</td>
                  <td><span className="status-badge pending">Pending</span></td>
                </tr>
                <tr>
                  <td>INV-2024-004</td>
                  <td>Library Fine</td>
                  <td>$300.00</td>
                  <td>2024-06-15</td>
                  <td>—</td>
                  <td><span className="status-badge overdue">Overdue</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDocModal && (
        <Modal title="Upload Document" onClose={() => setShowDocModal(false)}>
          <div className="upload-area">
            <input 
              type="file" 
              id="doc-upload" 
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.jpg,.png"
              hidden
            />
            <label htmlFor="doc-upload" className="upload-label">
              <FaUpload className="upload-icon" />
              <span>Click to upload or drag and drop</span>
              <small>PDF, DOC, DOCX, JPG, PNG up to 10MB</small>
            </label>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentProfile;