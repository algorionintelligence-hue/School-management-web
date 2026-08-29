import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaCopy, FaPrint,
  FaRandom, FaSave 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import './Timetable.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [
  { id: 1, time: '08:00 - 08:45', label: 'Period 1' },
  { id: 2, time: '08:45 - 09:30', label: 'Period 2' },
  { id: 3, time: '09:30 - 10:15', label: 'Period 3' },
  { id: 4, time: '10:15 - 10:30', label: 'Break' },
  { id: 5, time: '10:30 - 11:15', label: 'Period 4' },
  { id: 6, time: '11:15 - 12:00', label: 'Period 5' },
  { id: 7, time: '12:00 - 12:45', label: 'Period 6' },
  { id: 8, time: '12:45 - 13:30', label: 'Lunch' },
  { id: 9, time: '13:30 - 14:15', label: 'Period 7' },
  { id: 10, time: '14:15 - 15:00', label: 'Period 8' }
];

const Timetable = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [selectedClass, setSelectedClass] = useState('10A');
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [viewMode, setViewMode] = useState('class'); // 'class', 'teacher', 'room'

  const [slotForm, setSlotForm] = useState({
    subject: '',
    teacher: '',
    room: ''
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Art', 'PE', 'Library'];
  const teachers = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Lisa Chen', 'David Park', 'Emily Davis'];
  const rooms = ['101', '102', '103', '201', '202', '203', 'Lab 1', 'Lab 2', 'Library'];

  useEffect(() => {
    fetchTimetable();
  }, [selectedClass]);

  const fetchTimetable = () => {
    setLoading(true);
    setTimeout(() => {
      // Generate sample timetable
      const sampleTimetable = {};
      days.forEach(day => {
        sampleTimetable[day] = {};
        periods.forEach(period => {
          if (period.label === 'Break' || period.label === 'Lunch') {
            sampleTimetable[day][period.id] = { type: 'break', label: period.label };
          } else {
            const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
            const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
            const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
            sampleTimetable[day][period.id] = {
              type: 'class',
              subject: randomSubject,
              teacher: randomTeacher,
              room: randomRoom
            };
          }
        });
      });
      setTimetable(sampleTimetable);
      setLoading(false);
    }, 600);
  };

  const handleSlotClick = (day, periodId) => {
    if (!hasPermission('academic', 'write')) return;
    const slot = timetable[day]?.[periodId];
    if (slot?.type === 'break') return;
    
    setSelectedSlot({ day, periodId });
    setSlotForm({
      subject: slot?.subject || '',
      teacher: slot?.teacher || '',
      room: slot?.room || ''
    });
    setShowSlotModal(true);
  };

  const handleSaveSlot = () => {
    if (!slotForm.subject || !slotForm.teacher) {
      error('Please fill subject and teacher');
      return;
    }
    setTimetable(prev => ({
      ...prev,
      [selectedSlot.day]: {
        ...prev[selectedSlot.day],
        [selectedSlot.periodId]: {
          type: 'class',
          ...slotForm
        }
      }
    }));
    setShowSlotModal(false);
    success('Timetable updated');
  };

  const handleAutoGenerate = () => {
    if (!window.confirm('This will overwrite the current timetable. Continue?')) return;
    fetchTimetable();
    success('Timetable auto-generated');
  };

  const handleCopyTimetable = () => {
    const classList = ['10A', '10B', '11A', '11B'];
    success(`Timetable copied to ${classList.filter(c => c !== selectedClass).join(', ')}`);
  };

  const getSlotContent = (day, periodId) => {
    const slot = timetable[day]?.[periodId];
    if (!slot) return null;
    
    if (slot.type === 'break') {
      return <div className="slot-break">{slot.label}</div>;
    }
    
    return (
      <div className="slot-class">
        <span className="slot-subject">{slot.subject}</span>
        <span className="slot-teacher">{slot.teacher}</span>
        <span className="slot-room">Room {slot.room}</span>
      </div>
    );
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaCalendarAlt /> Timetable Management</h1>
        <div className="header-actions">
          <div className="view-toggle">
            <button className={viewMode === 'class' ? 'active' : ''} onClick={() => setViewMode('class')}>By Class</button>
            <button className={viewMode === 'teacher' ? 'active' : ''} onClick={() => setViewMode('teacher')}>By Teacher</button>
            <button className={viewMode === 'room' ? 'active' : ''} onClick={() => setViewMode('room')}>By Room</button>
          </div>
          {hasPermission('academic', 'write') && (
            <>
              <button className="btn-secondary" onClick={handleAutoGenerate}><FaRandom /> Auto Generate</button>
              <button className="btn-secondary" onClick={handleCopyTimetable}><FaCopy /> Copy</button>
            </>
          )}
          <button className="btn-secondary"><FaPrint /> Print</button>
        </div>
      </div>

      <div className="timetable-controls">
        <div className="class-selector">
          <label>Class:</label>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="10A">Class 10-A</option>
            <option value="10B">Class 10-B</option>
            <option value="11A">Class 11-A</option>
            <option value="11B">Class 11-B</option>
            <option value="9A">Class 9-A</option>
            <option value="9B">Class 9-B</option>
            <option value="9C">Class 9-C</option>
          </select>
        </div>
        <div className="timetable-info">
          <span>Academic Year: 2024-2025</span>
          <span>Total Periods: {periods.filter(p => p.label !== 'Break' && p.label !== 'Lunch').length}/day</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading timetable...</div>
      ) : (
        <div className="timetable-grid-container">
          <table className="timetable-grid">
            <thead>
              <tr>
                <th className="time-header">Time / Day</th>
                {days.map(day => (
                  <th key={day} className="day-header">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map(period => (
                <tr key={period.id}>
                  <td className="time-cell">
                    <span className="period-label">{period.label}</span>
                    <span className="period-time">{period.time}</span>
                  </td>
                  {days.map(day => (
                    <td 
                      key={`${day}-${period.id}`} 
                      className={`slot-cell ${timetable[day]?.[period.id]?.type === 'break' ? 'break' : ''}`}
                      onClick={() => handleSlotClick(day, period.id)}
                    >
                      {getSlotContent(day, period.id)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showSlotModal && (
        <Modal title={`Edit Slot - ${selectedSlot.day}, Period ${selectedSlot.periodId}`} onClose={() => setShowSlotModal(false)}>
          <div className="modal-form">
            <div className="form-group">
              <label>Subject *</label>
              <select value={slotForm.subject} onChange={(e) => setSlotForm({...slotForm, subject: e.target.value})} required>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Teacher *</label>
              <select value={slotForm.teacher} onChange={(e) => setSlotForm({...slotForm, teacher: e.target.value})} required>
                <option value="">Select Teacher</option>
                {teachers.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Room</label>
              <select value={slotForm.room} onChange={(e) => setSlotForm({...slotForm, room: e.target.value})}>
                <option value="">Select Room</option>
                {rooms.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowSlotModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveSlot}><FaSave /> Save Slot</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Timetable;