import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaClock, FaMapMarkerAlt,
  FaPrint, FaChair, FaUserFriends 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './ExamSchedule.css';

const ExamSchedule = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSeatingModal, setShowSeatingModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'midterm',
    class: '',
    startDate: '',
    endDate: '',
    status: 'upcoming'
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = () => {
    setLoading(true);
    setTimeout(() => {
      setExams([
        { 
          id: 1, 
          name: 'Mid-Term Examination 2024', 
          type: 'midterm',
          class: '10',
          startDate: '2024-03-15',
          endDate: '2024-03-25',
          status: 'upcoming',
          schedule: [
            { date: '2024-03-15', subject: 'Mathematics', time: '09:00 - 12:00', room: 'Hall A', invigilator: 'John Smith' },
            { date: '2024-03-16', subject: 'Physics', time: '09:00 - 12:00', room: 'Hall A', invigilator: 'Sarah Johnson' },
            { date: '2024-03-17', subject: 'Chemistry', time: '09:00 - 12:00', room: 'Hall B', invigilator: 'Michael Brown' }
          ]
        },
        { 
          id: 2, 
          name: 'Final Examination 2024', 
          type: 'final',
          class: '10',
          startDate: '2024-06-01',
          endDate: '2024-06-15',
          status: 'upcoming',
          schedule: []
        }
      ]);
      setLoading(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingExam) {
        setExams(prev => prev.map(e => e.id === editingExam.id ? { ...e, ...formData } : e));
        success('Exam updated');
      } else {
        setExams(prev => [...prev, { ...formData, id: Date.now(), schedule: [] }]);
        success('Exam scheduled');
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      error('Operation failed');
    }
  };

  const generateSeating = (exam) => {
    const rooms = ['Hall A', 'Hall B', 'Hall C'];
    const rows = 10;
    const cols = 6;
    const seating = [];
    
    rooms.forEach(room => {
      const roomSeating = [];
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          roomSeating.push({
            row: r,
            col: c,
            rollNumber: `10${String(Math.floor(Math.random() * 99) + 1).padStart(3, '0')}`,
            studentName: `Student ${Math.floor(Math.random() * 100)}`
          });
        }
      }
      seating.push({ room, seats: roomSeating });
    });
    
    return seating;
  };

  const openSeatingModal = (exam) => {
    setSelectedExam({ ...exam, seating: generateSeating(exam) });
    setShowSeatingModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this exam?')) return;
    setExams(prev => prev.filter(e => e.id !== id));
    success('Exam deleted');
  };

  const resetForm = () => {
    setFormData({ name: '', type: 'midterm', class: '', startDate: '', endDate: '', status: 'upcoming' });
    setEditingExam(null);
  };

  const columns = [
    { key: 'name', label: 'Exam Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true, render: (v) => <span className={`type-badge ${v}`}>{v}</span> },
    { key: 'class', label: 'Class', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
    { key: 'status', label: 'Status', render: (v) => <span className={`status-badge ${v}`}>{v}</span> },
    { key: 'actions', label: 'Actions', render: (_, exam) => (
      <div className="action-buttons">
        <button onClick={() => openSeatingModal(exam)} className="btn-icon" title="Seating Arrangement"><FaChair /></button>
        {hasPermission('examination', 'write') && (
          <>
            <button onClick={() => { setEditingExam(exam); setFormData({...exam}); setShowModal(true); }} className="btn-icon edit"><FaEdit /></button>
            <button onClick={() => handleDelete(exam.id)} className="btn-icon delete"><FaTrash /></button>
          </>
        )}
      </div>
    )}
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaCalendarAlt /> Exam Schedule</h1>
        {hasPermission('examination', 'write') && (
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <FaPlus /> Schedule Exam
          </button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={exams} 
        loading={loading} 
        pagination={true} 
        itemsPerPage={10}
        expandable={true}
        renderExpanded={(exam) => (
          <div className="exam-schedule-detail">
            <h4>Exam Schedule - {exam.name}</h4>
            <table className="data-table nested">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Invigilator</th>
                </tr>
              </thead>
              <tbody>
                {exam.schedule?.map((slot, idx) => (
                  <tr key={idx}>
                    <td>{slot.date}</td>
                    <td>{slot.subject}</td>
                    <td><FaClock /> {slot.time}</td>
                    <td><FaMapMarkerAlt /> {slot.room}</td>
                    <td>{slot.invigilator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      />

      {showModal && (
        <Modal title={editingExam ? 'Edit Exam' : 'Schedule Exam'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Exam Name *</label>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Exam Type *</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} required>
                  <option value="midterm">Mid-Term</option>
                  <option value="final">Final</option>
                  <option value="quiz">Quiz</option>
                  <option value="practical">Practical</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Class *</label>
                <select value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} required>
                  <option value="">Select Class</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">{editingExam ? 'Update' : 'Schedule'} Exam</button>
            </div>
          </form>
        </Modal>
      )}

      {showSeatingModal && selectedExam && (
        <Modal title={`Seating Arrangement - ${selectedExam.name}`} onClose={() => setShowSeatingModal(false)} wide>
          <div className="seating-arrangement">
            <div className="seating-tabs">
              {selectedExam.seating?.map((room, idx) => (
                <button key={idx} className={idx === 0 ? 'active' : ''}>{room.room}</button>
              ))}
            </div>
            {selectedExam.seating?.map((room, idx) => (
              <div key={idx} className={`room-layout ${idx === 0 ? 'active' : ''}`}>
                <div className="teacher-desk">Teacher's Desk</div>
                <div className="seats-grid">
                  {Array.from({ length: 10 }, (_, row) => (
                    <div key={row} className="seat-row">
                      {Array.from({ length: 6 }, (_, col) => {
                        const seat = room.seats?.find(s => s.row === row + 1 && s.col === col + 1);
                        return (
                          <div key={col} className="seat">
                            <span className="seat-number">{String.fromCharCode(65 + row)}{col + 1}</span>
                            {seat && (
                              <>
                                <span className="seat-roll">{seat.rollNumber}</span>
                                <span className="seat-name">{seat.studentName}</span>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowSeatingModal(false)}>Close</button>
              <button className="btn-primary"><FaPrint /> Print Seating</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExamSchedule;