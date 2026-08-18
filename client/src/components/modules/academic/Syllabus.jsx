import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaPlus, FaEdit, FaTrash, FaBookOpen, FaCalendarCheck,
  FaCheckCircle, FaClock, FaListOl 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './Syllabus.css';

const Syllabus = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);

  const [formData, setFormData] = useState({
    subject: '',
    class: '',
    academicYear: '2024-2025',
    totalUnits: 0,
    estimatedHours: 0,
    status: 'draft'
  });

  const [lessonForm, setLessonForm] = useState({
    unitNumber: 1,
    title: '',
    description: '',
    duration: 1,
    resources: ''
  });

  useEffect(() => {
    fetchSyllabi();
  }, []);

  const fetchSyllabi = () => {
    setLoading(true);
    setTimeout(() => {
      setSyllabi([
        { 
          id: 1, 
          subject: 'Mathematics', 
          class: '10', 
          academicYear: '2024-2025',
          totalUnits: 12,
          estimatedHours: 120,
          status: 'active',
          lessons: [
            { id: 1, unitNumber: 1, title: 'Real Numbers', description: 'Euclid\'s division lemma, Fundamental Theorem of Arithmetic', duration: 8, completed: true },
            { id: 2, unitNumber: 2, title: 'Polynomials', description: 'Zeros of polynomial, Relationship between zeros and coefficients', duration: 7, completed: true },
            { id: 3, unitNumber: 3, title: 'Pair of Linear Equations', description: 'Graphical method, Substitution method, Elimination method', duration: 10, completed: false }
          ]
        },
        { 
          id: 2, 
          subject: 'Physics', 
          class: '11', 
          academicYear: '2024-2025',
          totalUnits: 10,
          estimatedHours: 100,
          status: 'active',
          lessons: [
            { id: 1, unitNumber: 1, title: 'Physical World', description: 'Scope and excitement of physics', duration: 4, completed: true },
            { id: 2, unitNumber: 2, title: 'Units and Measurements', description: 'SI units, Significant figures, Dimensional analysis', duration: 8, completed: false }
          ]
        }
      ]);
      setLoading(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingSyllabus) {
        setSyllabi(prev => prev.map(s => s.id === editingSyllabus.id ? { ...s, ...formData } : s));
        success('Syllabus updated');
      } else {
        setSyllabi(prev => [...prev, { ...formData, id: Date.now(), lessons: [] }]);
        success('Syllabus created');
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      error('Operation failed');
    }
  };

  const handleAddLesson = () => {
    if (!lessonForm.title) {
      error('Lesson title is required');
      return;
    }
    setSyllabi(prev => prev.map(s => 
      s.id === selectedSyllabus.id 
        ? { ...s, lessons: [...s.lessons, { ...lessonForm, id: Date.now(), completed: false }] }
        : s
    ));
    setShowLessonModal(false);
    setLessonForm({ unitNumber: 1, title: '', description: '', duration: 1, resources: '' });
    success('Lesson added');
  };

  const toggleLessonComplete = (syllabusId, lessonId) => {
    setSyllabi(prev => prev.map(s => 
      s.id === syllabusId 
        ? { ...s, lessons: s.lessons.map(l => l.id === lessonId ? { ...l, completed: !l.completed } : l) }
        : s
    ));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this syllabus?')) return;
    setSyllabi(prev => prev.filter(s => s.id !== id));
    success('Syllabus deleted');
  };

  const resetForm = () => {
    setFormData({ subject: '', class: '', academicYear: '2024-2025', totalUnits: 0, estimatedHours: 0, status: 'draft' });
    setEditingSyllabus(null);
  };

  const openEditModal = (syllabus) => {
    setEditingSyllabus(syllabus);
    setFormData({ ...syllabus });
    setShowModal(true);
  };

  const openLessonModal = (syllabus) => {
    setSelectedSyllabus(syllabus);
    setLessonForm({ unitNumber: (syllabus.lessons?.length || 0) + 1, title: '', description: '', duration: 1, resources: '' });
    setShowLessonModal(true);
  };

  const columns = [
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'class', label: 'Class', sortable: true },
    { key: 'academicYear', label: 'Academic Year', sortable: true },
    { key: 'totalUnits', label: 'Units', sortable: true },
    { key: 'estimatedHours', label: 'Hours', sortable: true },
    { key: 'progress', label: 'Progress', render: (_, s) => {
      const completed = s.lessons?.filter(l => l.completed).length || 0;
      const total = s.lessons?.length || 1;
      const percent = Math.round((completed / total) * 100);
      return (
        <div className="progress-bar small">
          <div className="progress-fill" style={{ width: `${percent}%` }}></div>
          <span>{percent}%</span>
        </div>
      );
    }},
    { key: 'status', label: 'Status', render: (v) => <span className={`status-badge ${v}`}>{v}</span> },
    { key: 'actions', label: 'Actions', render: (_, syllabus) => (
      <div className="action-buttons">
        <button onClick={() => openLessonModal(syllabus)} className="btn-icon" title="Manage Lessons"><FaListOl /></button>
        {hasPermission('academic', 'write') && (
          <>
            <button onClick={() => openEditModal(syllabus)} className="btn-icon edit"><FaEdit /></button>
            <button onClick={() => handleDelete(syllabus.id)} className="btn-icon delete"><FaTrash /></button>
          </>
        )}
      </div>
    )}
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaBookOpen /> Syllabus & Lesson Planning</h1>
        {hasPermission('academic', 'write') && (
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <FaPlus /> Create Syllabus
          </button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={syllabi} 
        loading={loading} 
        pagination={true} 
        itemsPerPage={10}
        expandable={true}
        renderExpanded={(syllabus) => (
          <div className="lessons-detail">
            <h4>Lesson Plan - {syllabus.subject} (Class {syllabus.class})</h4>
            <table className="data-table nested">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {syllabus.lessons?.map(lesson => (
                  <tr key={lesson.id} className={lesson.completed ? 'completed' : ''}>
                    <td>{lesson.unitNumber}</td>
                    <td>{lesson.title}</td>
                    <td>{lesson.description}</td>
                    <td>{lesson.duration} hrs</td>
                    <td>
                      {lesson.completed ? (
                        <span className="status-badge completed"><FaCheckCircle /> Completed</span>
                      ) : (
                        <span className="status-badge pending">Pending</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className={`btn-icon ${lesson.completed ? 'completed' : ''}`}
                        onClick={() => toggleLessonComplete(syllabus.id, lesson.id)}
                      >
                        <FaCheckCircle />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      />

      {showModal && (
        <Modal title={editingSyllabus ? 'Edit Syllabus' : 'Create Syllabus'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Subject *</label>
                <input value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Class *</label>
                <select value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} required>
                  <option value="">Select Class</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Academic Year</label>
                <input value={formData.academicYear} onChange={(e) => setFormData({...formData, academicYear: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Total Units</label>
                <input type="number" value={formData.totalUnits} onChange={(e) => setFormData({...formData, totalUnits: parseInt(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>Estimated Hours</label>
                <input type="number" value={formData.estimatedHours} onChange={(e) => setFormData({...formData, estimatedHours: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">{editingSyllabus ? 'Update' : 'Create'} Syllabus</button>
            </div>
          </form>
        </Modal>
      )}

      {showLessonModal && selectedSyllabus && (
        <Modal title={`Add Lesson - ${selectedSyllabus.subject}`} onClose={() => setShowLessonModal(false)}>
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Unit Number</label>
                <input type="number" value={lessonForm.unitNumber} onChange={(e) => setLessonForm({...lessonForm, unitNumber: parseInt(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input value={lessonForm.title} onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={lessonForm.description} onChange={(e) => setLessonForm({...lessonForm, description: e.target.value})} rows="2" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Duration (hours)</label>
                <input type="number" value={lessonForm.duration} onChange={(e) => setLessonForm({...lessonForm, duration: parseInt(e.target.value)})} min="1" />
              </div>
              <div className="form-group">
                <label>Resources</label>
                <input value={lessonForm.resources} onChange={(e) => setLessonForm({...lessonForm, resources: e.target.value})} placeholder="Books, links, etc." />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowLessonModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddLesson}>Add Lesson</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Syllabus;