import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { FaFileAlt, FaDownload, FaEye, FaGraduationCap, FaCalculator } from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './Transcripts.css';

const Transcripts = () => {
  const { success } = useNotification();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    setTimeout(() => {
      setStudents([
        { id: 1, name: 'Alice Johnson', studentId: 'STU2024001', class: '10', section: 'A', cgpa: 9.5, totalCredits: 45 },
        { id: 2, name: 'Charlie Smith', studentId: 'STU2024002', class: '10', section: 'A', cgpa: 8.8, totalCredits: 45 },
        { id: 3, name: 'Eva Williams', studentId: 'STU2024003', class: '10', section: 'A', cgpa: 8.2, totalCredits: 45 },
        { id: 4, name: 'David Brown', studentId: 'STU2024004', class: '11', section: 'A', cgpa: 7.5, totalCredits: 50 },
        { id: 5, name: 'Fiona Green', studentId: 'STU2024005', class: '11', section: 'A', cgpa: 7.0, totalCredits: 50 }
      ]);
      setLoading(false);
    }, 600);
  };

  const generateTranscript = (student) => {
    const academicHistory = [
      { 
        year: '2023-2024', 
        class: '9', 
        subjects: [
          { name: 'Mathematics', grade: 'A+', credits: 5, points: 10 },
          { name: 'Science', grade: 'A', credits: 5, points: 9 },
          { name: 'English', grade: 'A', credits: 4, points: 9 },
          { name: 'Social Studies', grade: 'B+', credits: 4, points: 8 },
          { name: 'Hindi', grade: 'A', credits: 3, points: 9 }
        ],
        gpa: 9.0,
        totalCredits: 21
      },
      { 
        year: '2024-2025', 
        class: '10', 
        subjects: [
          { name: 'Mathematics', grade: 'A+', credits: 5, points: 10 },
          { name: 'Physics', grade: 'A+', credits: 5, points: 10 },
          { name: 'Chemistry', grade: 'A', credits: 5, points: 9 },
          { name: 'Biology', grade: 'A+', credits: 5, points: 10 },
          { name: 'English', grade: 'A', credits: 4, points: 9 },
          { name: 'History', grade: 'B+', credits: 4, points: 8 }
        ],
        gpa: 9.5,
        totalCredits: 28
      }
    ];
    
    const totalCredits = academicHistory.reduce((sum, year) => sum + year.totalCredits, 0);
    const weightedPoints = academicHistory.reduce((sum, year) => 
      sum + year.subjects.reduce((sSum, sub) => sSum + (sub.points * sub.credits), 0), 0
    );
    const cgpa = (weightedPoints / totalCredits).toFixed(2);

    return { ...student, academicHistory, cgpa, totalCredits };
  };

  const openTranscriptModal = (student) => {
    setSelectedStudent(generateTranscript(student));
    setShowTranscriptModal(true);
  };

  const getGradePoints = (grade) => {
    const map = { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'D': 5, 'E': 4, 'F': 0 };
    return map[grade] || 0;
  };

  const columns = [
    { key: 'studentId', label: 'Student ID', sortable: true },
    { key: 'name', label: 'Student Name', sortable: true },
    { key: 'class', label: 'Class', render: (_, s) => `${s.class}-${s.section}` },
    { key: 'cgpa', label: 'CGPA', sortable: true },
    { key: 'totalCredits', label: 'Total Credits', sortable: true },
    { key: 'actions', label: 'Actions', render: (_, student) => (
      <div className="action-buttons">
        <button onClick={() => openTranscriptModal(student)} className="btn-icon view"><FaEye /></button>
        <button onClick={() => success('Transcript downloaded')} className="btn-icon"><FaDownload /></button>
      </div>
    )}
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaGraduationCap /> Academic Transcripts</h1>
        <button className="btn-primary" onClick={() => success('All transcripts generated')}>
          <FaFileAlt /> Generate All
        </button>
      </div>

      <DataTable columns={columns} data={students} loading={loading} pagination={true} itemsPerPage={15} />

      {showTranscriptModal && selectedStudent && (
        <Modal title={`Academic Transcript - ${selectedStudent.name}`} onClose={() => setShowTranscriptModal(false)} wide>
          <div className="transcript-document">
            <div className="transcript-header">
              <div className="school-info">
                <h2>ABC Public School</h2>
                <p>Official Academic Transcript</p>
              </div>
              <div className="transcript-meta">
                <p><strong>Student ID:</strong> {selectedStudent.studentId}</p>
                <p><strong>Name:</strong> {selectedStudent.name}</p>
                <p><strong>Date Issued:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {selectedStudent.academicHistory?.map((year, idx) => (
              <div key={idx} className="academic-year">
                <h3>Academic Year {year.year} | Class {year.class}</h3>
                <table className="transcript-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Credits</th>
                      <th>Grade</th>
                      <th>Grade Points</th>
                      <th>Credit Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {year.subjects.map((subject, sIdx) => (
                      <tr key={sIdx}>
                        <td>{subject.name}</td>
                        <td>{subject.credits}</td>
                        <td><span className={`grade-badge ${subject.grade.toLowerCase().replace('+', '-plus')}`}>{subject.grade}</span></td>
                        <td>{subject.points}</td>
                        <td>{subject.credits * subject.points}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4"><strong>Year GPA</strong></td>
                      <td><strong>{year.gpa}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}

            <div className="transcript-summary">
              <div className="summary-box">
                <h4>Cumulative GPA (CGPA)</h4>
                <span className="cgpa-value">{selectedStudent.cgpa}</span>
              </div>
              <div className="summary-box">
                <h4>Total Credits Earned</h4>
                <span className="credits-value">{selectedStudent.totalCredits}</span>
              </div>
              <div className="summary-box">
                <h4>Class Standing</h4>
                <span className="standing-value">Top 5%</span>
              </div>
            </div>

            <div className="transcript-footer">
              <p>This is an official transcript issued by ABC Public School.</p>
              <div className="signature-section">
                <div className="signature">
                  <div className="signature-line"></div>
                  <span>Registrar</span>
                </div>
                <div className="signature">
                  <div className="signature-line"></div>
                  <span>Principal</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowTranscriptModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => success('Transcript downloaded')}><FaDownload /> Download PDF</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Transcripts;