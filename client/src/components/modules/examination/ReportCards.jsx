import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaPrint, FaDownload, FaEye, FaFileAlt, FaCheckCircle,
  FaTimesCircle, FaChartLine 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './ReportCards.css';

const ReportCards = () => {
  const { success } = useNotification();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedExam, setSelectedExam] = useState('midterm');

  useEffect(() => {
    fetchStudents();
  }, [selectedExam]);

  const fetchStudents = () => {
    setLoading(true);
    setTimeout(() => {
      setStudents([
        { id: 1, rollNumber: '101', name: 'Alice Johnson', class: '10', section: 'A', totalMarks: 485, percentage: 97, grade: 'A+', rank: 1, status: 'pass' },
        { id: 2, rollNumber: '102', name: 'Charlie Smith', class: '10', section: 'A', totalMarks: 452, percentage: 90.4, grade: 'A', rank: 2, status: 'pass' },
        { id: 3, rollNumber: '103', name: 'Eva Williams', class: '10', section: 'A', totalMarks: 420, percentage: 84, grade: 'B', rank: 3, status: 'pass' },
        { id: 4, rollNumber: '104', name: 'David Brown', class: '10', section: 'A', totalMarks: 380, percentage: 76, grade: 'C', rank: 4, status: 'pass' },
        { id: 5, rollNumber: '105', name: 'Fiona Green', class: '10', section: 'A', totalMarks: 320, percentage: 64, grade: 'D', rank: 5, status: 'pass' }
      ]);
      setLoading(false);
    }, 600);
  };

  const generateReportCard = (student) => {
    const subjects = [
      { name: 'Mathematics', theory: 78, practical: 18, internal: 9, total: 95, grade: 'A+', remarks: 'Excellent' },
      { name: 'Physics', theory: 72, practical: 16, internal: 8, total: 96, grade: 'A+', remarks: 'Outstanding' },
      { name: 'Chemistry', theory: 68, practical: 15, internal: 7, total: 90, grade: 'A', remarks: 'Very Good' },
      { name: 'Biology', theory: 70, practical: 17, internal: 8, total: 95, grade: 'A+', remarks: 'Excellent' },
      { name: 'English', theory: 75, practical: 0, internal: 9, total: 84, grade: 'B', remarks: 'Good' },
      { name: 'History', theory: 72, practical: 0, internal: 8, total: 80, grade: 'B', remarks: 'Good' }
    ];
    return { ...student, subjects };
  };

  const openReportModal = (student) => {
    setSelectedStudent(generateReportCard(student));
    setShowReportModal(true);
  };

  const handlePrint = () => {
    success('Report card sent to printer');
  };

  const handleDownload = () => {
    success('Report card downloaded as PDF');
  };

  const columns = [
    { key: 'rollNumber', label: 'Roll No', sortable: true },
    { key: 'name', label: 'Student Name', sortable: true },
    { key: 'class', label: 'Class', render: (_, s) => `${s.class}-${s.section}` },
    { key: 'totalMarks', label: 'Total Marks', sortable: true },
    { key: 'percentage', label: 'Percentage', sortable: true, render: (v) => `${v}%` },
    { key: 'grade', label: 'Grade', render: (v) => <span className={`grade-badge ${v.toLowerCase().replace('+', '-plus')}`}>{v}</span> },
    { key: 'rank', label: 'Rank', sortable: true },
    { key: 'status', label: 'Status', render: (v) => (
      <span className={`status-badge ${v}`}>
        {v === 'pass' ? <FaCheckCircle /> : <FaTimesCircle />} {v}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: (_, student) => (
      <div className="action-buttons">
        <button onClick={() => openReportModal(student)} className="btn-icon view"><FaEye /></button>
        <button onClick={handlePrint} className="btn-icon"><FaPrint /></button>
        <button onClick={handleDownload} className="btn-icon"><FaDownload /></button>
      </div>
    )}
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaFileAlt /> Report Cards</h1>
        <div className="header-actions">
          <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
            <option value="midterm">Mid-Term 2024</option>
            <option value="final">Final 2024</option>
          </select>
          <button className="btn-primary" onClick={() => success('All report cards generated')}>
            <FaFileAlt /> Generate All
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={students} loading={loading} pagination={true} itemsPerPage={15} />

      {showReportModal && selectedStudent && (
        <Modal title={`Report Card - ${selectedStudent.name}`} onClose={() => setShowReportModal(false)} wide>
          <div className="report-card">
            <div className="report-header">
              <div className="school-info">
                <h2>ABC Public School</h2>
                <p>123 Education Street, Cityville</p>
                <p>Affiliated to CBSE | Affiliation No: 123456</p>
              </div>
              <div className="report-meta">
                <p><strong>Academic Year:</strong> 2024-2025</p>
                <p><strong>Examination:</strong> {selectedExam === 'midterm' ? 'Mid-Term' : 'Final'} Examination</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="student-info-bar">
              <div><strong>Name:</strong> {selectedStudent.name}</div>
              <div><strong>Class:</strong> {selectedStudent.class}-{selectedStudent.section}</div>
              <div><strong>Roll No:</strong> {selectedStudent.rollNumber}</div>
              <div><strong>Student ID:</strong> {selectedStudent.studentId}</div>
            </div>

            <table className="report-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Theory</th>
                  <th>Practical</th>
                  <th>Internal</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.subjects?.map((subject, idx) => (
                  <tr key={idx}>
                    <td>{subject.name}</td>
                    <td>{subject.theory}</td>
                    <td>{subject.practical}</td>
                    <td>{subject.internal}</td>
                    <td><strong>{subject.total}</strong></td>
                    <td><span className={`grade-badge ${subject.grade.toLowerCase().replace('+', '-plus')}`}>{subject.grade}</span></td>
                    <td>{subject.remarks}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>GRAND TOTAL</strong></td>
                  <td colSpan="3"></td>
                  <td><strong>{selectedStudent.totalMarks}</strong></td>
                  <td><strong>{selectedStudent.grade}</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>

            <div className="report-summary">
              <div className="summary-item">
                <span>Percentage</span>
                <strong>{selectedStudent.percentage}%</strong>
              </div>
              <div className="summary-item">
                <span>Rank</span>
                <strong>#{selectedStudent.rank}</strong>
              </div>
              <div className="summary-item">
                <span>Result</span>
                <strong className={selectedStudent.status === 'pass' ? 'text-success' : 'text-danger'}>
                  {selectedStudent.status === 'pass' ? 'PASS' : 'FAIL'}
                </strong>
              </div>
            </div>

            <div className="report-signatures">
              <div className="signature">
                <div className="signature-line"></div>
                <span>Class Teacher</span>
              </div>
              <div className="signature">
                <div className="signature-line"></div>
                <span>Principal</span>
              </div>
              <div className="signature">
                <div className="signature-line"></div>
                <span>Parent</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowReportModal(false)}>Close</button>
              <button className="btn-primary" onClick={handlePrint}><FaPrint /> Print</button>
              <button className="btn-primary" onClick={handleDownload}><FaDownload /> Download PDF</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReportCards;