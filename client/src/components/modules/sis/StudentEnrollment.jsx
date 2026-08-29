import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaUserPlus, FaCheckCircle, FaArrowRight, FaArrowLeft,
  FaUpload, FaIdCard 
} from 'react-icons/fa';
import './StudentEnrollment.css';

const steps = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Guardian Info' },
  { id: 3, label: 'Academic Info' },
  { id: 4, label: 'Documents' },
  { id: 5, label: 'Review & Submit' }
];

const StudentEnrollment = () => {
  const navigate = useNavigate();
  const { success } = useNotification();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianOccupation: '',
    emergencyContact: '',
    emergencyPhone: '',
    previousSchool: '',
    previousGrade: '',
    admissionClass: '',
    admissionSection: '',
    admissionDate: new Date().toISOString().split('T')[0],
    documents: []
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, { type: docType, file: file.name, size: file.size }]
      }));
    }
  };

  const validateStep = () => {
    switch(currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.dateOfBirth;
      case 2:
        return formData.guardianName && formData.guardianPhone;
      case 3:
        return formData.admissionClass && formData.admissionSection;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handleSubmit = () => {
    const studentId = `STU${new Date().getFullYear()}${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
    success(`Student enrolled successfully! Student ID: ${studentId}`);
    navigate('/students');
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select value={formData.gender} onChange={(e) => updateField('gender', e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea value={formData.address} onChange={(e) => updateField('address', e.target.value)} rows="2" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input value={formData.state} onChange={(e) => updateField('state', e.target.value)} />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input value={formData.zipCode} onChange={(e) => updateField('zipCode', e.target.value)} />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Guardian Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Guardian Name *</label>
                <input value={formData.guardianName} onChange={(e) => updateField('guardianName', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Relation *</label>
                <select value={formData.guardianRelation} onChange={(e) => updateField('guardianRelation', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Grandparent">Grandparent</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Guardian Phone *</label>
                <input type="tel" value={formData.guardianPhone} onChange={(e) => updateField('guardianPhone', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Guardian Email</label>
                <input type="email" value={formData.guardianEmail} onChange={(e) => updateField('guardianEmail', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Guardian Occupation</label>
              <input value={formData.guardianOccupation} onChange={(e) => updateField('guardianOccupation', e.target.value)} />
            </div>
            <div className="form-section-divider">
              <h4>Emergency Contact</h4>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Emergency Contact Name</label>
                <input value={formData.emergencyContact} onChange={(e) => updateField('emergencyContact', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Emergency Phone</label>
                <input type="tel" value={formData.emergencyPhone} onChange={(e) => updateField('emergencyPhone', e.target.value)} />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Academic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Previous School</label>
                <input value={formData.previousSchool} onChange={(e) => updateField('previousSchool', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Previous Grade/Class</label>
                <input value={formData.previousGrade} onChange={(e) => updateField('previousGrade', e.target.value)} />
              </div>
            </div>
            <div className="form-section-divider">
              <h4>Admission Details</h4>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Class for Admission *</label>
                <select value={formData.admissionClass} onChange={(e) => updateField('admissionClass', e.target.value)} required>
                  <option value="">Select Class</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Section *</label>
                <select value={formData.admissionSection} onChange={(e) => updateField('admissionSection', e.target.value)} required>
                  <option value="">Select Section</option>
                  {['A','B','C','D'].map(s => (
                    <option key={s} value={s}>Section {s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Admission Date</label>
                <input type="date" value={formData.admissionDate} onChange={(e) => updateField('admissionDate', e.target.value)} />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3>Required Documents</h3>
            <div className="documents-upload-grid">
              {[
                { id: 'birthCertificate', label: 'Birth Certificate', required: true },
                { id: 'previousSchoolTC', label: 'Previous School TC', required: true },
                { id: 'reportCard', label: 'Previous Report Card', required: true },
                { id: 'medicalCertificate', label: 'Medical Certificate', required: false },
                { id: 'photo', label: 'Passport Size Photo', required: true },
                { id: 'addressProof', label: 'Address Proof', required: true }
              ].map(doc => (
                <div key={doc.id} className="document-upload-item">
                  <div className="doc-info">
                    <span className="doc-label">{doc.label}</span>
                    {doc.required && <span className="required-tag">Required</span>}
                  </div>
                  <input 
                    type="file" 
                    id={doc.id}
                    onChange={(e) => handleFileUpload(e, doc.label)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    hidden
                  />
                  <label htmlFor={doc.id} className="upload-btn">
                    <FaUpload /> Upload
                  </label>
                  {formData.documents.find(d => d.type === doc.label) && (
                    <span className="upload-status"><FaCheckCircle /> Uploaded</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content review">
            <h3>Review Application</h3>
            <div className="review-sections">
              <div className="review-section">
                <h4>Personal Information</h4>
                <div className="review-grid">
                  <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>DOB:</strong> {formData.dateOfBirth}</div>
                  <div><strong>Gender:</strong> {formData.gender}</div>
                  <div><strong>Email:</strong> {formData.email || 'N/A'}</div>
                  <div><strong>Phone:</strong> {formData.phone || 'N/A'}</div>
                  <div><strong>Address:</strong> {formData.address || 'N/A'}</div>
                </div>
              </div>
              <div className="review-section">
                <h4>Guardian Information</h4>
                <div className="review-grid">
                  <div><strong>Name:</strong> {formData.guardianName}</div>
                  <div><strong>Relation:</strong> {formData.guardianRelation}</div>
                  <div><strong>Phone:</strong> {formData.guardianPhone}</div>
                  <div><strong>Email:</strong> {formData.guardianEmail || 'N/A'}</div>
                </div>
              </div>
              <div className="review-section">
                <h4>Academic Information</h4>
                <div className="review-grid">
                  <div><strong>Previous School:</strong> {formData.previousSchool || 'N/A'}</div>
                  <div><strong>Admission Class:</strong> {formData.admissionClass}</div>
                  <div><strong>Section:</strong> {formData.admissionSection}</div>
                  <div><strong>Admission Date:</strong> {formData.admissionDate}</div>
                </div>
              </div>
              <div className="review-section">
                <h4>Documents</h4>
                <div className="documents-list">
                  {formData.documents.map((doc, idx) => (
                    <div key={idx} className="doc-item">
                      <FaIdCard /> {doc.type} - {doc.file}
                    </div>
                  ))}
                  {formData.documents.length === 0 && <span className="text-muted">No documents uploaded</span>}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h1><FaUserPlus /> New Student Enrollment</h1>
      </div>

      <div className="enrollment-progress">
        {steps.map((step, idx) => (
          <div 
            key={step.id} 
            className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
          >
            <div className="step-number">
              {currentStep > step.id ? <FaCheckCircle /> : step.id}
            </div>
            <span className="step-label">{step.label}</span>
            {idx < steps.length - 1 && <div className="step-connector"></div>}
          </div>
        ))}
      </div>

      <div className="enrollment-form">
        {renderStepContent()}
        
        <div className="form-navigation">
          {currentStep > 1 && (
            <button className="btn-secondary" onClick={() => setCurrentStep(prev => prev - 1)}>
              <FaArrowLeft /> Previous
            </button>
          )}
          {currentStep < steps.length ? (
            <button className="btn-primary" onClick={handleNext}>
              Next <FaArrowRight />
            </button>
          ) : (
            <button className="btn-primary btn-success" onClick={handleSubmit}>
              <FaCheckCircle /> Complete Enrollment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollment;