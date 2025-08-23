import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar, User, Phone, MapPin, FileText, Heart, Brain, Baby,
  Bone, Eye, Stethoscope, Save, Printer as Print, Download,
  Leaf, FlaskConical, Activity, Users, PenTool, Trash2, ChevronDown,
  ChevronUp, Settings, Upload, Image as ImageIcon, AlertCircle, Loader2
} from 'lucide-react';
import { TemplateModal, prescriptionTemplates, layoutStyles } from './TemplateModal';
import {
  getPracticeTypes,
  getSpecializationsByPracticeType
} from '../utils/masterService';

// Default icon mapping for fallback
const iconMapping = {
  'ayurveda': Leaf,
  'homeopathy': FlaskConical,
  'unani': Activity,
  'siddha': Users,
  'general-medicine': Stethoscope,
  'cardiology': Heart,
  'pediatrics': Baby,
  'orthopedics': Bone,
  'ophthalmology': Eye,
  'neurology': Brain,
  'default': FileText
};

const InitialAssessment = () => {
  // State for dynamic data
  const [practiceTypes, setPracticeTypes] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [specialtyTemplates, setSpecialtyTemplates] = useState({});
  const [templateFields, setTemplateFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Existing state
  const [selectedPracticeType, setSelectedPracticeType] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [formData, setFormData] = useState({});
  const [handwrittenNotes, setHandwrittenNotes] = useState('');
  const [annotatedImages, setAnnotatedImages] = useState([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [selectedColor, setSelectedColor] = useState('#2563eb');
  const fileInputRef = useRef(null);
  const [patientInfo, setPatientInfo] = useState({
    patientId: '',
    name: '',
    age: '',
    gender: '',
    contact: '',
    address: '',
    referredBy: '',
    consultingDoctor: 'Dr. Sheetal Shelke, BHMS'
  });
  const [vitals, setVitals] = useState({
    temperature: '',
    pulse: '',
    bp: '',
    respiration: '',
    spo2: '',
    height: '',
    weight: '',
    bmi: ''
  });
  // Remove loading state for practice type/specialty switching
  const [initialLoading, setInitialLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    (async () => {
      await loadPracticeTypes();
      setInitialLoading(false);
    })();
  }, []);

  // Load specializations when practice type changes
  useEffect(() => {
    if (selectedPracticeType) {
      loadSpecializations(selectedPracticeType);
    } else {
      setSpecializations([]);
      setSelectedSpecialty('');
    }
  }, [selectedPracticeType]);

  // Load template fields when specialty changes
  useEffect(() => {
    if (selectedSpecialty) {
      loadTemplateFields(selectedSpecialty);
    } else {
      setTemplateFields([]);
    }
  }, [selectedSpecialty]);

  // Remove setLoading from loadSpecializations and loadTemplateFields
  const loadPracticeTypes = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const response = await getPracticeTypes();
      const data = response.data || [];
      setPracticeTypes(data);
      if (data.length > 0) {
        setSelectedPracticeType(data[0].id.toString());
      }
    } catch (err) {
      setError('Failed to load practice types. Please try again.');
      setPracticeTypes([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadSpecializations = async (practiceTypeId) => {
    try {
      setError(null);
      const response = await getSpecializationsByPracticeType(practiceTypeId);
      const data = response.data || [];
      const processedData = data.map(item => ({
        id: item.id,
        name: item.specializationName || item.name || 'Unknown Specialization',
        code: item.code || item.specializationName?.toLowerCase().replace(/\s+/g, '-') || 'general'
      }));
      setSpecializations(processedData);
      if (processedData.length > 0) {
        setSelectedSpecialty(processedData[0].id.toString());
      }
    } catch (err) {
      setError('Failed to load specializations. Please try again.');
      setSpecializations([]);
    }
  };

  const loadTemplateFields = async (specializationId) => {
    try {
      setError(null);
      const response = await getTemplateFields(specializationId);
      setTemplateFields(response.data || []);
      setFormData({});
    } catch (err) {
      setError('Failed to load template fields. Using default template.');
      const response = await getTemplateFields(specializationId);
      setTemplateFields(response.data || []);
      setFormData({});
    }
  };

  const handlePracticeTypeChange = (practiceTypeId) => {
    setSelectedPracticeType(practiceTypeId);
    setSelectedSpecialty('');
    setTemplateFields([]);
    setFormData({});
  };

  const handleSpecialtyChange = (specializationId) => {
    setSelectedSpecialty(specializationId);
    setFormData({});
  };

  // Get current specialty info
  const getCurrentSpecialty = () => {
    const practiceType = practiceTypes.find(pt => pt.id.toString() === selectedPracticeType);
    const specialization = specializations.find(sp => sp.id.toString() === selectedSpecialty);

    return {
      title: specialization?.name || 'Assessment',
      icon: iconMapping[specialization?.code] || iconMapping.default,
      backgroundImage: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
      category: practiceType?.name || practiceType?.practiceName || 'Medical',
      sections: templateFields
    };
  };

  const template = getCurrentSpecialty();
  const IconComponent = template.icon;

  const handleInputChange = (sectionId, value) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: value
    }));
  };

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVitalsChange = (field, value) => {
    setVitals(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1];
      try {
        const response = await fetch('https://6899921cfed141b96b9fea9a.mockapi.io/template', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64String })
        });

        if (response.ok) {
          const result = await response.json();
          setAnnotatedImages(prev => [...prev, {
            id: Date.now(),
            link: result.image || result.link || '',
            timestamp: new Date().toISOString(),
            specialty: selectedTemplate
          }]);
          alert('Image uploaded successfully!');
        } else {
          alert('Failed to upload image');
        }
      } catch (err) {
        alert('Error uploading image');
      }
    };
    reader.readAsDataURL(file);
  };

  const renderFormSection = (section) => {
    switch (section.fieldType || section.type) {
      case 'textarea':
        return (
          <div key={section.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {section.label || section.name} {section.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent min-h-24 resize-none transition-all duration-200"
              placeholder={`Enter ${(section.label || section.name).toLowerCase()}`}
              value={formData[section.id] || ''}
              onChange={(e) => handleInputChange(section.id, e.target.value)}
              required={section.required}
            />
          </div>
        );
      case 'checklist':
        return (
          <div key={section.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {section.label || section.name}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(section.options || section.fieldOptions || []).map((option) => (
                <label key={option.value || option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer border hover:border-accent">
                  <input
                    type="checkbox"
                    className="mr-3 w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-accent"
                    onChange={(e) => {
                      const currentValues = formData[section.id] || [];
                      const value = option.value || option;
                      if (e.target.checked) {
                        handleInputChange(section.id, [...currentValues, value]);
                      } else {
                        handleInputChange(section.id, currentValues.filter(v => v !== value));
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700">{option.label || option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 'radio':
        return (
          <div key={section.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {section.label || section.name}
            </label>
            <div className="space-y-2">
              {(section.options || section.fieldOptions || []).map((option) => (
                <label key={option.value || option} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer border hover:border-accent">
                  <input
                    type="radio"
                    name={section.id}
                    className="mr-3 w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-accent"
                    onChange={() => handleInputChange(section.id, option.value || option)}
                  />
                  <span className="text-sm text-gray-700">{option.label || option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 'text':
      case 'input':
        return (
          <div key={section.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {section.label || section.name} {section.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder={`Enter ${(section.label || section.name).toLowerCase()}`}
              value={formData[section.id] || ''}
              onChange={(e) => handleInputChange(section.id, e.target.value)}
              required={section.required}
            />
          </div>
        );
      case 'number':
        return (
          <div key={section.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {section.label || section.name} {section.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder={`Enter ${(section.label || section.name).toLowerCase()}`}
              value={formData[section.id] || ''}
              onChange={(e) => handleInputChange(section.id, e.target.value)}
              required={section.required}
              min={section.min}
              max={section.max}
            />
          </div>
        );
      case 'date':
        return (
          <div key={section.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {section.label || section.name} {section.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              value={formData[section.id] || ''}
              onChange={(e) => handleInputChange(section.id, e.target.value)}
              required={section.required}
            />
          </div>
        );
      case 'pain-scale':
        return (
          <div key={section.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Pain Scale (0-10)
            </label>
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4 border">
              <span className="text-xs text-gray-600 mr-2">No Pain</span>
              {[...Array(11)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                    formData[section.id] === i
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  onClick={() => handleInputChange(section.id, i)}
                >
                  {i}
                </button>
              ))}
              <span className="text-xs text-gray-600 ml-2">Severe</span>
            </div>
          </div>
        );
      default:
        return (
          <div key={section.id} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {section.label || section.name} {section.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent min-h-24 resize-none transition-all duration-200"
              placeholder={`Enter ${(section.label || section.name).toLowerCase()}`}
              value={formData[section.id] || ''}
              onChange={(e) => handleInputChange(section.id, e.target.value)}
              required={section.required}
            />
          </div>
        );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { patientInfo, vitals, formData, handwrittenNotes, annotatedImages });
    alert('Assessment form submitted successfully!');
  };

  const generatePrintTemplate = () => {
    const currentTemplate = prescriptionTemplates[selectedTemplate];
    const currentLayout = layoutStyles[currentTemplate.layout] || layoutStyles.traditional;

    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.title} - ${patientInfo.name || 'Patient'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 20px;
            font-size: 14px;
          }
          .header {
            background-color: ${selectedColor};
            color: white;
            padding: 30px;
            margin-bottom: 30px;
            text-align: center;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .hospital-name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .doctor-name { font-size: 20px; margin-bottom: 5px; }
          .hospital-address { font-size: 14px; opacity: 0.9; margin-bottom: 15px; }
          .form-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .patient-info {
            background: #f8fafc;
            border: 2px solid ${selectedColor};
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
          }
          .patient-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          .section {
            margin-bottom: 25px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          .section-header {
            background: ${selectedColor};
            color: white;
            padding: 15px 20px;
            font-weight: bold;
            font-size: 16px;
          }
          .section-content { padding: 20px; }
          .field-value {
            border: 2px solid #e5e7eb;
            padding: 12px 15px;
            border-radius: 8px;
            background: #fafafa;
            min-height: 80px;
            margin-bottom: 15px;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-name">AVSwasthya Hospital System</div>
          <div class="doctor-name">${patientInfo.consultingDoctor || 'Dr. Sample Name'}</div>
          <div class="hospital-address">123 Medical Street, Healthcare City, HC 12345</div>
          <div class="form-title">${template.title}</div>
        </div>

        <div class="patient-info">
          <h4>Patient Information</h4>
          <div class="patient-grid">
            <div><strong>Patient Name:</strong> ${patientInfo.name || ''}</div>
            <div><strong>Age:</strong> ${patientInfo.age || ''}</div>
            <div><strong>Gender:</strong> ${patientInfo.gender || ''}</div>
            <div><strong>Contact:</strong> ${patientInfo.contact || ''}</div>
            <div><strong>Address:</strong> ${patientInfo.address || ''}</div>
            <div><strong>Referred By:</strong> ${patientInfo.referredBy || ''}</div>
          </div>
        </div>
        ${templateFields.map(field => `
          <div class="section">
            <div class="section-header">${field.label || field.name}</div>
            <div class="section-content">
              <div class="field-value">${formData[field.id] || ''}</div>
            </div>
          </div>
        `).join('')}
        ${handwrittenNotes ? `
          <div class="section">
            <div class="section-header">Additional Notes</div>
            <div class="section-content">
              <div class="field-value">${handwrittenNotes}</div>
            </div>
          </div>
        ` : ''}
      </body>
      </html>
    `;

    return printContent;
  };

  const handlePrint = () => {
    const printContent = generatePrintTemplate();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const printContent = generatePrintTemplate();
    const blob = new Blob([printContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.replace(/\s+/g, '_')}_${patientInfo.name || 'Patient'}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Use initialLoading for the very first load only
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center font-sans">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Loading assessment form...</p>
        </div>
      </div>
    );
  }

  if (error && practiceTypes.length === 0) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md">
          <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
          <p className="text-red-600 text-center mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadPracticeTypes();
            }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Error Banner */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-yellow-800">{error}</p>
              <p className="text-yellow-600 text-sm mt-1">The form is using fallback data to continue working.</p>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4" style={{ borderLeftColor: selectedColor }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center mb-4 lg:mb-0">
              <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: selectedColor }}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="h3-heading">{template.title}</h1>
                <p className="paragraph">{template.category} Department - Comprehensive medical evaluation form</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowTemplateModal(true)}
                className="btn btn-secondary"
                type="button"
              >
                <Settings className="w-4 h-4 mr-2" />
                Templates
              </button>
              <button
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="btn btn-primary"
                style={{ backgroundColor: selectedColor }}
                type="button"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Template
              </button>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dynamic Practice Type & Specialty Selector */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <h4 className="h3-heading mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" style={{ color: selectedColor }} />
              Select Medical System & Specialty
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical System</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent font-semibold"
                  value={selectedPracticeType}
                  onChange={e => handlePracticeTypeChange(e.target.value)}
                >
                  <option value="">Select Medical System</option>
                  {practiceTypes.map(pt => (
                    <option key={pt.id} value={pt.id.toString()}>
                      {pt.name || pt.practiceName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent font-semibold"
                  value={selectedSpecialty}
                  onChange={e => handleSpecialtyChange(e.target.value)}
                  disabled={!selectedPracticeType || specializations.length === 0}
                >
                  <option value="">Select Specialty</option>
                  {specializations.map(spec => (
                    <option key={spec.id} value={spec.id.toString()}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedPracticeType && selectedSpecialty && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: selectedColor }}></div>
                  <span className="font-medium">Selected:</span>
                  <span className="ml-2">{template.category} → {template.title}</span>
                  <span className="ml-4 text-xs bg-gray-200 px-2 py-1 rounded">{templateFields.length} fields</span>
                </div>
              </div>
            )}
          </div>
          {/* Image Upload Section */}
          {showImageUpload && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <ImageIcon className="w-6 h-6 text-green-500 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900">Medical Images</h4>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Upload Medical Image
                </button>
                <p className="text-sm text-gray-500 mt-2">Upload X-rays, scans, or other medical images</p>
              </div>
              {annotatedImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Uploaded Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {annotatedImages.map((image) => (
                      <div key={image.id} className="border rounded-lg p-3 bg-gray-50">
                        <div className="text-sm text-gray-600">
                          <p>Uploaded: {new Date(image.timestamp).toLocaleString()}</p>
                          <p>Specialty: {image.specialty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Patient Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 mr-3" style={{ color: selectedColor }} />
              <h4 className="text-lg font-semibold text-gray-900">Patient Information</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  value={patientInfo.patientId}
                  onChange={(e) => handlePatientInfoChange('patientId', e.target.value)}
                  placeholder="Enter patient ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  value={patientInfo.name}
                  onChange={(e) => handlePatientInfoChange('name', e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  value={patientInfo.age}
                  onChange={(e) => handlePatientInfoChange('age', e.target.value)}
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  value={patientInfo.gender}
                  onChange={(e) => handlePatientInfoChange('gender', e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  value={patientInfo.contact}
                  onChange={(e) => handlePatientInfoChange('contact', e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consulting Doctor</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  value={patientInfo.consultingDoctor}
                  onChange={(e) => handlePatientInfoChange('consultingDoctor', e.target.value)}
                  placeholder="Doctor name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  value={patientInfo.address}
                  onChange={(e) => handlePatientInfoChange('address', e.target.value)}
                  placeholder="Complete address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Referred By</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  value={patientInfo.referredBy}
                  onChange={(e) => handlePatientInfoChange('referredBy', e.target.value)}
                  placeholder="Referring doctor/clinic"
                />
              </div>
            </div>
          </div>
          {/* Dynamic Assessment Sections */}
          {templateFields.length > 0 ? (
            templateFields.map((field, index) => (
              <div key={field.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-accent-100 text-primary rounded-lg flex items-center justify-center font-semibold text-sm mr-3">
                    {index + 1}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{field.label || field.name}</h4>
                  {field.required && <span className="ml-2 text-red-500 text-sm">*Required</span>}
                </div>
                {renderFormSection(field)}
              </div>
            ))
          ) : selectedSpecialty ? (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No template fields configured for this specialty</p>
            </div>
          ) : null}
          {/* Additional Notes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <PenTool className="w-6 h-6 text-purple-500 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Additional Notes</h4>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent font-mono min-h-32 resize-vertical"
              placeholder="Enter any additional observations, notes, or recommendations..."
              value={handwrittenNotes}
              onChange={(e) => setHandwrittenNotes(e.target.value)}
            />
          </div>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              type="submit"
              className="flex items-center px-6 py-3 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
              style={{ backgroundColor: selectedColor }}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Assessment
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Print className="w-5 h-5 mr-2" />
              Print Report
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </button>
          </div>
        </form>
        {/* Template Modal */}
        {showTemplateModal && (
          <TemplateModal
            isOpen={showTemplateModal}
            onClose={() => setShowTemplateModal(false)}
            onSelectTemplate={handleTemplateSelect}
            selectedTemplate={selectedTemplate}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        )}
      </div>
    </div>
  );
};

export default InitialAssessment;