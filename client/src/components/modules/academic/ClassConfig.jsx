import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaPlus, FaEdit, FaTrash, FaUsers, FaChalkboardTeacher, FaDoorOpen 
} from 'react-icons/fa';
import Modal from '../../common/Modal';
import DataTable from '../../common/DataTable';
import './ClassConfig.css';

const ClassConfig = () => {
  const { hasPermission } = useAuth();
  const { success, error } = useNotification();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    numericLevel: '',
    academicYear: '2024-2025',
    capacity: 40,
    sections: []
  });

  const [sectionForm, setSectionForm] = useState({
    name: '',
    classTeacher: '',
    roomNumber: '',
    capacity: 40
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    setLoading(true);
    setTimeout(() => {
      setClasses([
        { 
          id: 1, 
          name: 'Class 10', 
          numericLevel: 10, 
          academicYear: '2024-2025',
          capacity: 120,
          sections: [
            { id: '10A', name: 'A', classTeacher: 'John Smith', roomNumber: '101', students: 38, capacity: 40 },
            { id: '10B', name: 'B', classTeacher: 'Sarah Johnson', roomNumber: '102', students: 36, capacity: 40 }
          ]
        },
        { 
          id: 2, 
          name: 'Class 11', 
          numericLevel: 11, 
          academicYear: '2024-2025',
          capacity: 90,
          sections: [
            { id: '11A', name: 'A', classTeacher: 'Michael Brown', roomNumber: '201', students: 28, capacity: 30 },
            { id: '11B', name: 'B', classTeacher: 'Lisa Chen', roomNumber: '202', students: 25, capacity: 30 }
          ]
        },
        { 
          id: 3, 
          name: 'Class 9', 
          numericLevel: 9, 
          academicYear: '2024-2025',
          capacity: 120,
          sections: [
            { id: '9A', name: 'A', classTeacher: 'David Park', roomNumber: '301', students: 40, capacity: 40 },
            { id: '9B', name: 'B', classTeacher: 'Emily Davis', roomNumber: '302', students: 39, capacity: 40 },
            { id: '9C', name: 'C', classTeacher: 'Robert Wilson', roomNumber: '303', students: 37, capacity: 40 }
          ]
        }
      ]);
      setLoading(false);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        setClasses(prev => prev.map(c => c.id === editingClass.id ? { ...c, ...formData } : c));
        success('Class updated successfully');
      } else {
        setClasses(prev => [...prev, { ...formData, id: Date.now(), sections: [] }]);
        success('Class created successfully');
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      error('Operation failed');
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this class? All sections will be removed.')) return;
    setClasses(prev => prev.filter(c => c.id !== id));
    success('Class deleted');
  };

  const handleAddSection = () => {
    if (!sectionForm.name || !sectionForm.classTeacher) {
      error('Please fill all required fields');
      return;
    }
    const newSection = {
      id: `${selectedClass.numericLevel}${sectionForm.name}`,
      ...sectionForm,
      students: 0
    };
    setClasses(prev => prev.map(c => 
      c.id === selectedClass.id 
        ? { ...c, sections: [...c.sections, newSection] }
        : c
    ));
    setShowSectionModal(false);
    setSectionForm({ name: '', classTeacher: '', roomNumber: '', capacity: 40 });
    success('Section added successfully');
  };

  const handleDeleteSection = (classId, sectionId) => {
    if (!window.confirm('Delete this section?')) return;
    setClasses(prev => prev.map(c => 
      c.id === classId 
        ? { ...c, sections: c.sections.filter(s => s.id !== sectionId) }
        : c
    ));
    success('Section deleted');
  };

  const resetForm = () => {
    setFormData({ name: '', numericLevel: '', academicYear: '2024-2025', capacity: 40, sections: [] });
    setEditingClass(null);
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    setFormData({ ...cls });
    setShowModal(true);
  };

  const openSectionModal = (cls) => {
    setSelectedClass(cls);
    setShowSectionModal(true);
  };

  const columns = [
    { key: 'name', label: 'Class Name', sortable: true },
    { key: 'numericLevel', label: 'Level', sortable: true },
    { key: 'academicYear', label: 'Academic Year', sortable: true },
    { key: 'sections', label: 'Sections', render: (v) => v.length },
    { key: 'totalStudents', label: 'Total Students', render: (_, c) => c.sections.reduce((a, s) => a + s.students, 0) },
    { key: 'capacity', label: 'Capacity', sortable: true },
    { key: 'actions', label: 'Actions', render: (_, cls) => (
      <div className="action-buttons">
        <button onClick={() => openSectionModal(cls)} className="btn-icon" title="Manage Sections"><FaDoorOpen /></button>
        {hasPermission('academic', 'write') && (
          <>
            <button onClick={() => openEditModal(cls)} className="btn-icon edit"><FaEdit /></button>
            <button onClick={() => handleDelete(cls.id)} className="btn-icon delete"><FaTrash /></button>
          </>
        )}
      </div>
    )}
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaChalkboardTeacher /> Class & Section Configuration</h1>
        {hasPermission('academic', 'write') && (
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <FaPlus /> Add Class
          </button>
        )}
      </div>

      <DataTable columns={columns} data={classes} loading={loading} expandable={true} 
        renderExpanded={(cls) => (
          <div className="sections-detail">
            <h4>Sections</h4>
            <table className="data-table nested">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Class Teacher</th>
                  <th>Room</th>
                  <th>Students</th>
                  <th>Capacity</th>
                  <th>Utilization</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cls.sections.map(section => (
                  <tr key={section.id}>
                    <td>{section.name}</td>
                    <td>{section.classTeacher}</td>
                    <td>{section.roomNumber}</td>
                    <td>{section.students}</td>
                    <td>{section.capacity}</td>
                    <td>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(section.students / section.capacity) * 100}%` }}></div>
                        <span>{Math.round((section.students / section.capacity) * 100)}%</span>
                      </div>
                    </td>
                    <td>
                      <button className="btn-icon delete" onClick={() => handleDeleteSection(cls.id, section.id)}>
                        <FaTrash />
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
        <Modal title={editingClass ? 'Edit Class' : 'Add Class'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Class Name *</label>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Class 10" required />
              </div>
              <div className="form-group">
                <label>Numeric Level *</label>
                <input type="number" value={formData.numericLevel} onChange={(e) => setFormData({...formData, numericLevel: e.target.value})} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Academic Year *</label>
                <input value={formData.academicYear} onChange={(e) => setFormData({...formData, academicYear: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Total Capacity</label>
                                <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">{editingClass ? 'Update' : 'Create'} Class</button>
            </div>
          </form>
        </Modal>
      )}

      {showSectionModal && selectedClass && (
        <Modal title={`Add Section to ${selectedClass.name}`} onClose={() => setShowSectionModal(false)}>
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Section Name *</label>
                <input value={sectionForm.name} onChange={(e) => setSectionForm({...sectionForm, name: e.target.value})} placeholder="e.g., A, B, C" required />
              </div>
              <div className="form-group">
                <label>Class Teacher *</label>
                <input value={sectionForm.classTeacher} onChange={(e) => setSectionForm({...sectionForm, classTeacher: e.target.value})} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Room Number</label>
                <input value={sectionForm.roomNumber} onChange={(e) => setSectionForm({...sectionForm, roomNumber: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input type="number" value={sectionForm.capacity} onChange={(e) => setSectionForm({...sectionForm, capacity: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowSectionModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddSection}>Add Section</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClassConfig;