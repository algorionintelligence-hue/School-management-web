import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { FaPlus, FaEdit, FaTrash, FaBook, FaUserTie, FaLink } from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './SubjectAssignment.css';

const SubjectAssignment = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [subjectForm, setSubjectForm] = useState({
    code: '',
    name: '',
    category: 'core',
    description: '',
    maxMarks: 100,
    passingMarks: 40
  });

  const [assignForm, setAssignForm] = useState({
    subjectId: '',
    teacherId: '',
    classId: '',
    sectionId: '',
    periodsPerWeek: 5
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setSubjects([
        { id: 1, code: 'MAT101', name: 'Mathematics', category: 'core', description: 'Algebra, Geometry, Trigonometry', maxMarks: 100, passingMarks: 40 },
        { id: 2, code: 'PHY101', name: 'Physics', category: 'core', description: 'Mechanics, Thermodynamics, Optics', maxMarks: 100, passingMarks: 40 },
        { id: 3, code: 'CHE101', name: 'Chemistry', category: 'core', description: 'Organic, Inorganic, Physical', maxMarks: 100, passingMarks: 40 },
        { id: 4, code: 'BIO101', name: 'Biology', category: 'core', description: 'Zoology, Botany, Ecology', maxMarks: 100, passingMarks: 40 },
        { id: 5, code: 'ENG101', name: 'English', category: 'core', description: 'Literature, Grammar, Writing', maxMarks: 100, passingMarks: 40 },
        { id: 6, code: 'HIS101', name: 'History', category: 'elective', description: 'World History, Indian History', maxMarks: 100, passingMarks: 40 },
        { id: 7, code: 'ART101', name: 'Art', category: 'elective', description: 'Drawing, Painting, Sculpture', maxMarks: 100, passingMarks: 40 }
      ]);
      setTeachers([
        { id: 1, name: 'John Smith', department: 'Science' },
        { id: 2, name: 'Sarah Johnson', department: 'Mathematics' },
        { id: 3, name: 'Michael Brown', department: 'English' },
        { id: 4, name: 'Lisa Chen', department: 'Science' }
      ]);
      setClasses([
        { id: 1, name: 'Class 10', sections: ['A', 'B'] },
        { id: 2, name: 'Class 11', sections: ['A', 'B'] },
        { id: 3, name: 'Class 9', sections: ['A', 'B', 'C'] }
      ]);
      setAssignments([
        { id: 1, subjectId: 1, teacherId: 2, classId: 1, sectionId: '10A', periodsPerWeek: 6 },
        { id: 2, subjectId: 2, teacherId: 1, classId: 1, sectionId: '10A', periodsPerWeek: 5 },
        { id: 3, subjectId: 5, teacherId: 3, classId: 1, sectionId: '10A', periodsPerWeek: 6 },
        { id: 4, subjectId: 1, teacherId: 2, classId: 1, sectionId: '10B', periodsPerWeek: 6 }
      ]);
      setLoading(false);
    }, 800);
  };

  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        setSubjects(prev => prev.map(s => s.id === editingSubject.id ? { ...s, ...subjectForm } : s));
        success('Subject updated successfully');
      } else {
        setSubjects(prev => [...prev, { ...subjectForm, id: Date.now() }]);
        success('Subject created successfully');
      }
      setShowSubjectModal(false);
      setSubjectForm({ code: '', name: '', category: 'core', description: '', maxMarks: 100, passingMarks: 40 });
      setEditingSubject(null);
    } catch (err) {
      error('Operation failed');
    }
  };

  const handleAssignSubmit = () => {
    if (!assignForm.subjectId || !assignForm.teacherId || !assignForm.classId || !assignForm.sectionId) {
      error('Please fill all required fields');
      return;
    }
    setAssignments(prev => [...prev, { ...assignForm, id: Date.now() }]);
    setShowAssignModal(false);
    setAssignForm({ subjectId: '', teacherId: '', classId: '', sectionId: '', periodsPerWeek: 5 });
    success('Subject assigned successfully');
  };

  const handleDeleteSubject = (id) => {
    if (!window.confirm('Delete this subject?')) return;
    setSubjects(prev => prev.filter(s => s.id !== id));
    success('Subject deleted');
  };

  const handleDeleteAssignment = (id) => {
    if (!window.confirm('Remove this assignment?')) return;
    setAssignments(prev => prev.filter(a => a.id !== id));
    success('Assignment removed');
  };

  const getSubjectName = (id) => subjects.find(s => s.id === parseInt(id))?.name || '';
  const getTeacherName = (id) => teachers.find(t => t.id === parseInt(id))?.name || '';
  const getClassName = (id) => classes.find(c => c.id === parseInt(id))?.name || '';

  const subjectColumns = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Subject Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true, render: (v) => <span className={`category-badge ${v}`}>{v}</span> },
    { key: 'maxMarks', label: 'Max Marks', sortable: true },
    { key: 'passingMarks', label: 'Passing Marks', sortable: true },
    { key: 'actions', label: 'Actions', render: (_, subject) => (
      <div className="action-buttons">
        <button onClick={() => { setEditingSubject(subject); setSubjectForm({...subject}); setShowSubjectModal(true); }} className="btn-icon edit"><FaEdit /></button>
        <button onClick={() => handleDeleteSubject(subject.id)} className="btn-icon delete"><FaTrash /></button>
      </div>
    )}
  ];

  const assignmentColumns = [
    { key: 'subject', label: 'Subject', render: (_, a) => getSubjectName(a.subjectId) },
    { key: 'teacher', label: 'Teacher', render: (_, a) => getTeacherName(a.teacherId) },
    { key: 'class', label: 'Class', render: (_, a) => `${getClassName(a.classId)}-${a.sectionId}` },
    { key: 'periodsPerWeek', label: 'Periods/Week', sortable: true },
    { key: 'actions', label: 'Actions', render: (_, assignment) => (
      <div className="action-buttons">
        <button onClick={() => handleDeleteAssignment(assignment.id)} className="btn-icon delete"><FaTrash /></button>
      </div>
    )}
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaBook /> Subject Assignment</h1>
        <div className="header-actions">
          {hasPermission('academic', 'write') && (
            <>
              <button className="btn-secondary" onClick={() => setShowAssignModal(true)}>
                <FaLink /> Assign Subject
              </button>
              <button className="btn-primary" onClick={() => { setEditingSubject(null); setSubjectForm({ code: '', name: '', category: 'core', description: '', maxMarks: 100, passingMarks: 40 }); setShowSubjectModal(true); }}>
                <FaPlus /> Add Subject
              </button>
            </>
          )}
        </div>
      </div>

      <div className="subjects-section">
        <h3>Subjects</h3>
        <DataTable columns={subjectColumns} data={subjects} loading={loading} pagination={true} itemsPerPage={10} />
      </div>

      <div className="assignments-section">
        <h3>Current Assignments</h3>
        <DataTable columns={assignmentColumns} data={assignments} pagination={true} itemsPerPage={10} />
      </div>

      {showSubjectModal && (
        <Modal title={editingSubject ? 'Edit Subject' : 'Add Subject'} onClose={() => setShowSubjectModal(false)}>
          <form onSubmit={handleSubjectSubmit} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Subject Code *</label>
                <input value={subjectForm.code} onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Subject Name *</label>
                <input value={subjectForm.name} onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={subjectForm.category} onChange={(e) => setSubjectForm({...subjectForm, category: e.target.value})}>
                  <option value="core">Core</option>
                  <option value="elective">Elective</option>
                  <option value="co-curricular">Co-Curricular</option>
                </select>
              </div>
              <div className="form-group">
                <label>Max Marks</label>
                <input type="number" value={subjectForm.maxMarks} onChange={(e) => setSubjectForm({...subjectForm, maxMarks: parseInt(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>Passing Marks</label>
                <input type="number" value={subjectForm.passingMarks} onChange={(e) => setSubjectForm({...subjectForm, passingMarks: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={subjectForm.description} onChange={(e) => setSubjectForm({...subjectForm, description: e.target.value})} rows="2" />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowSubjectModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">{editingSubject ? 'Update' : 'Create'} Subject</button>
            </div>
          </form>
        </Modal>
      )}

      {showAssignModal && (
        <Modal title="Assign Subject to Teacher" onClose={() => setShowAssignModal(false)}>
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Subject *</label>
                <select value={assignForm.subjectId} onChange={(e) => setAssignForm({...assignForm, subjectId: e.target.value})} required>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Teacher *</label>
                <select value={assignForm.teacherId} onChange={(e) => setAssignForm({...assignForm, teacherId: e.target.value})} required>
                  <option value="">Select Teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.department})</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Class *</label>
                <select value={assignForm.classId} onChange={(e) => setAssignForm({...assignForm, classId: e.target.value, sectionId: ''})} required>
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Section *</label>
                <select value={assignForm.sectionId} onChange={(e) => setAssignForm({...assignForm, sectionId: e.target.value})} required disabled={!assignForm.classId}>
                  <option value="">Select Section</option>
                  {assignForm.classId && classes.find(c => c.id === parseInt(assignForm.classId))?.sections.map(s => (
                    <option key={s} value={s}>Section {s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Periods/Week</label>
                <input type="number" value={assignForm.periodsPerWeek} onChange={(e) => setAssignForm({...assignForm, periodsPerWeek: parseInt(e.target.value)})} min="1" max="10" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAssignSubmit}>Assign Subject</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SubjectAssignment;