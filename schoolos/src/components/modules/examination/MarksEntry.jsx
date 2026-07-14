import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaSave, FaCheck, FaEdit, FaCalculator, FaChartBar,
  FaSearch, FaFilter 
} from 'react-icons/fa';
import DataTable from '../../common/DataTable';
import './MarksEntry.css';

const MarksEntry = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('midterm');
  const [selectedClass, setSelectedClass] = useState('10A');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedSubject, selectedExam]);

  const fetchStudents = () => {
    setLoading(true);
    setTimeout(() => {
      const sampleStudents = [
        { id: 1, rollNumber: '101', name: 'Alice Johnson', studentId: 'STU2024001' },
        { id: 2, rollNumber: '102', name: 'Charlie Smith', studentId: 'STU2024002' },
        { id: 3, rollNumber: '103', name: 'Eva Williams', studentId: 'STU2024003' },
        { id: 4, rollNumber: '104', name: 'David Brown', studentId: 'STU2024004' },
        { id: 5, rollNumber: '105', name: 'Fiona Green', studentId: 'STU2024005' }
      ];
      setStudents(sampleStudents);
      
      // Initialize marks
      const initialMarks = {};
      sampleStudents.forEach(s => {
        initialMarks[s.id] = {
          theory: Math.floor(Math.random() * 40) + 50,
          practical: Math.floor(Math.random() * 20) + 15,
          internal: Math.floor(Math.random() * 10) + 5,
          total: 0,
          grade: '',
          remarks: ''
        };
      });
      setMarks(initialMarks);
      setLoading(false);
    }, 600);
  };

  const calculateTotal = (studentId) => {
    const m = marks[studentId];
    if (!m) return 0;
    const theory = parseInt(m.theory) || 0;
    const practical = parseInt(m.practical) || 0;
    const internal = parseInt(m.internal) || 0;
    return theory + practical + internal;
  };

  const calculateGrade = (total) => {
    if (total >= 90) return 'A+';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B';
    if (total >= 60) return 'C';
    if (total >= 50) return 'D';
    if (total >= 40) return 'E';
    return 'F';
  };

  const handleMarkChange = (studentId, field, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      success('Marks saved successfully');
    }, 1000);
  };

  const handleCalculateAll = () => {
    setMarks(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(id => {
        const total = calculateTotal(parseInt(id));
        updated[id] = {
          ...updated[id],
          total,
          grade: calculateGrade(total)
        };
      });
      return updated;
    });
    success('Grades calculated for all students');
  };

  const columns = [
    { key: 'rollNumber', label: 'Roll No', sortable: true },
    { key: 'name', label: 'Student Name', sortable: true },
    { 
      key: 'theory', 
      label: 'Theory (80)', 
      render: (_, student) => (
        <input 
          type="number" 
          className="mark-input"
          value={marks[student.id]?.theory || ''}
          onChange={(e) => handleMarkChange(student.id, 'theory', e.target.value)}
          min="0" max="80"
          disabled={!hasPermission('examination', 'write')}
        />
      )
    },
    { 
      key: 'practical', 
      label: 'Practical (20)', 
      render: (_, student) => (
        <input 
          type="number" 
          className="mark-input"
          value={marks[student.id]?.practical || ''}
          onChange={(e) => handleMarkChange(student.id, 'practical', e.target.value)}
          min="0" max="20"
          disabled={!hasPermission('examination', 'write')}
        />
      )
    },
    { 
      key: 'internal', 
      label: 'Internal (10)', 
      render: (_, student) => (
        <input 
          type="number" 
          className="mark-input"
          value={marks[student.id]?.internal || ''}
          onChange={(e) => handleMarkChange(student.id, 'internal', e.target.value)}
          min="0" max="10"
          disabled={!hasPermission('examination', 'write')}
        />
      )
    },
    { 
      key: 'total', 
      label: 'Total', 
      render: (_, student) => (
        <span className="total-marks">{calculateTotal(student.id)}</span>
      )
    },
    { 
      key: 'grade', 
      label: 'Grade', 
      render: (_, student) => (
        <span className={`grade-badge ${calculateGrade(calculateTotal(student.id)).toLowerCase().replace('+', '-plus')}`}>
          {calculateGrade(calculateTotal(student.id))}
        </span>
      )
    },
    { 
      key: 'remarks', 
      label: 'Remarks', 
      render: (_, student) => (
        <input 
          type="text" 
          className="remark-input"
          value={marks[student.id]?.remarks || ''}
          onChange={(e) => handleMarkChange(student.id, 'remarks', e.target.value)}
          placeholder="Optional"
          disabled={!hasPermission('examination', 'write')}
        />
      )
    }
  ];

  const stats = {
    total: students.length,
    passed: students.filter(s => calculateTotal(s.id) >= 40).length,
    failed: students.filter(s => calculateTotal(s.id) < 40).length,
    highest: Math.max(...students.map(s => calculateTotal(s.id))),
    lowest: Math.min(...students.map(s => calculateTotal(s.id))),
    average: (students.reduce((a, s) => a + calculateTotal(s.id), 0) / students.length).toFixed(2)
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaEdit /> Marks Entry</h1>
        {hasPermission('examination', 'write') && (
          <div className="header-actions">
            <button className="btn-secondary" onClick={handleCalculateAll}><FaCalculator /> Calculate Grades</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              <FaSave /> {saving ? 'Saving...' : 'Save Marks'}
            </button>
          </div>
        )}
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
            <option value="midterm">Mid-Term Examination</option>
            <option value="final">Final Examination</option>
            <option value="quiz1">Quiz 1</option>
            <option value="quiz2">Quiz 2</option>
          </select>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="10A">Class 10-A</option>
            <option value="10B">Class 10-B</option>
            <option value="11A">Class 11-A</option>
            <option value="11B">Class 11-B</option>
          </select>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="mathematics">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="biology">Biology</option>
            <option value="english">English</option>
          </select>
        </div>
      </div>

      <div className="marks-stats">
        <div className="stat-card">
          <h4>Total Students</h4>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <h4>Passed</h4>
          <span className="stat-value text-success">{stats.passed}</span>
        </div>
        <div className="stat-card">
          <h4>Failed</h4>
          <span className="stat-value text-danger">{stats.failed}</span>
        </div>
        <div className="stat-card">
          <h4>Highest</h4>
          <span className="stat-value">{stats.highest}</span>
        </div>
        <div className="stat-card">
          <h4>Lowest</h4>
          <span className="stat-value">{stats.lowest}</span>
        </div>
        <div className="stat-card">
          <h4>Average</h4>
          <span className="stat-value">{stats.average}</span>
        </div>
      </div>

      <DataTable columns={columns} data={students} loading={loading} pagination={false} />
    </div>
  );
};

export default MarksEntry;