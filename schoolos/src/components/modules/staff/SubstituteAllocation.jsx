import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaCalendarAlt, FaUserClock, FaCheck, FaTimes, FaSearch,
  FaExchangeAlt, FaBell 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import './SubstituteAllocation.css';

const SubstituteAllocation = () => {
  const { success } = useNotification();
  const [absences, setAbsences] = useState([]);
  const [substitutes, setSubstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setAbsences([
        { id: 1, teacherName: 'Robert Wilson', teacherId: 'EMP2024005', department: 'Sports', date: selectedDate, periods: [1, 2, 3], reason: 'Sick Leave', status: 'unallocated' },
        { id: 2, teacherName: 'Sarah Johnson', teacherId: 'EMP2024002', department: 'Mathematics', date: selectedDate, periods: [4, 5], reason: 'Training', status: 'allocated', substituteName: 'Michael Brown', substituteId: 'EMP2024003' },
        { id: 3, teacherName: 'Emily Davis', teacherId: 'EMP2024004', department: 'Administration', date: selectedDate, periods: [6, 7, 8], reason: 'Personal', status: 'unallocated' }
      ]);
      setSubstitutes([
        { id: 3, name: 'Michael Brown', employeeId: 'EMP2024003', department: 'English', availablePeriods: [1, 2, 3, 4, 5, 6, 7, 8], load: 2 },
        { id: 6, name: 'Lisa Chen', employeeId: 'EMP2024006', department: 'Science', availablePeriods: [1, 2, 3, 4, 5], load: 0 },
        { id: 7, name: 'David Park', employeeId: 'EMP2024007', department: 'Mathematics', availablePeriods: [6, 7, 8], load: 1 }
      ]);
      setLoading(false);
    }, 600);
  };

  const handleAllocate = (absence, substitute) => {
    setAbsences(prev => prev.map(a => 
      a.id === absence.id 
        ? { ...a, status: 'allocated', substituteName: substitute.name, substituteId: substitute.employeeId }
        : a
    ));
    setSubstitutes(prev => prev.map(s => 
      s.id === substitute.id 
        ? { ...s, load: s.load + 1 }
        : s
    ));
    setShowAllocateModal(false);
    success(`Substitute allocated: ${substitute.name} for ${absence.teacherName}`);
  };

  const handleDeallocate = (absence) => {
    setAbsences(prev => prev.map(a => 
      a.id === absence.id 
        ? { ...a, status: 'unallocated', substituteName: null, substituteId: null }
        : a
    ));
    success('Substitute removed');
  };

  const openAllocateModal = (absence) => {
    setSelectedAbsence(absence);
    setShowAllocateModal(true);
  };

  const availableSubstitutes = selectedAbsence 
    ? substitutes.filter(s => 
        selectedAbsence.periods.some(p => s.availablePeriods.includes(p)) && 
        s.department !== selectedAbsence.department
      )
    : [];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaExchangeAlt /> Substitute Teacher Allocation</h1>
      </div>

      <div className="date-selector">
        <label>Select Date:</label>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="allocation-dashboard">
        <div className="absences-panel">
          <h3>Teacher Absences - {selectedDate}</h3>
          {absences.length === 0 ? (
            <p className="no-data">No absences recorded for this date</p>
          ) : (
            <div className="absence-cards">
              {absences.map(absence => (
                <div key={absence.id} className={`absence-card ${absence.status}`}>
                  <div className="absence-header">
                    <h4>{absence.teacherName}</h4>
                    <span className={`status-badge ${absence.status}`}>{absence.status}</span>
                  </div>
                  <p className="absence-dept">{absence.department}</p>
                  <div className="absence-details">
                    <span><FaCalendarAlt /> Periods: {absence.periods.join(', ')}</span>
                    <span><FaUserClock /> {absence.reason}</span>
                  </div>
                  {absence.status === 'allocated' ? (
                    <div className="substitute-info">
                      <span className="substitute-name"><FaCheck /> {absence.substituteName}</span>
                      <button className="btn-icon delete" onClick={() => handleDeallocate(absence)}>
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <button className="btn-primary btn-sm" onClick={() => openAllocateModal(absence)}>
                      <FaExchangeAlt /> Allocate Substitute
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="substitutes-panel">
          <h3>Available Substitutes</h3>
          <div className="substitute-cards">
            {substitutes.map(sub => (
              <div key={sub.id} className={`substitute-card ${sub.load > 2 ? 'high-load' : ''}`}>
                <h4>{sub.name}</h4>
                <p>{sub.department}</p>
                <div className="substitute-stats">
                  <span>Load: {sub.load} classes</span>
                  <span>Available: {sub.availablePeriods.length} periods</span>
                </div>
                <div className="availability-bar">
                  <div 
                    className="availability-fill" 
                    style={{ width: `${(sub.load / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAllocateModal && selectedAbsence && (
        <Modal title="Allocate Substitute" onClose={() => setShowAllocateModal(false)}>
          <div className="allocate-modal">
            <div className="absence-summary">
              <h4>Absence Details</h4>
              <p><strong>Teacher:</strong> {selectedAbsence.teacherName}</p>
              <p><strong>Department:</strong> {selectedAbsence.department}</p>
              <p><strong>Periods:</strong> {selectedAbsence.periods.join(', ')}</p>
              <p><strong>Reason:</strong> {selectedAbsence.reason}</p>
            </div>

            <h4>Available Substitutes</h4>
            {availableSubstitutes.length === 0 ? (
              <p className="no-data">No substitutes available for these periods</p>
            ) : (
              <div className="substitute-options">
                {availableSubstitutes.map(sub => (
                  <div key={sub.id} className="substitute-option">
                    <div className="sub-info">
                      <h5>{sub.name}</h5>
                      <p>{sub.department} • Current Load: {sub.load}</p>
                      <p>Available Periods: {sub.availablePeriods.filter(p => selectedAbsence.periods.includes(p)).join(', ')}</p>
                    </div>
                    <button 
                      className="btn-primary btn-sm"
                      onClick={() => handleAllocate(selectedAbsence, sub)}
                    >
                      <FaCheck /> Select
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SubstituteAllocation;