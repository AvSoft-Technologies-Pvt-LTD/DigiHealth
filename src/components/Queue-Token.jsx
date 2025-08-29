import React, { useState } from 'react';
import {
  Plus, User, Phone, Building2, AlertCircle, FileText,
  UserCheck, Stethoscope, HeartPulse, Bone, Baby, Syringe,
  ShieldAlert, Sun, Brain
} from 'lucide-react';

const TOKENS_KEY = 'hospital_tokens';
const validatePhone = p => /^\d{10}$/.test(p);

const getNextTokenNumber = () => {
  let tokens = [];
  try {
    tokens = JSON.parse(localStorage.getItem(TOKENS_KEY)) || [];
  } catch {
    tokens = [];
  }
  return tokens.length
    ? tokens.reduce((max, token) => Math.max(max, parseInt((token.tokenNumber || '').replace(/\D/g, ''))), 0) + 1
    : 1;
};

const departments = [
  {
    value: 'general',
    label: 'General Medicine',
    icon: <Stethoscope size={16} className="inline mr-1" />,
    doctors: [
      { id: 'dr1', name: 'Dr. Sarah Johnson', degree: 'MBBS, MD (Internal Medicine)', experience: '15 years' },
      { id: 'dr2', name: 'Dr. Michael Chen', degree: 'MBBS, MD (Family Medicine)', experience: '12 years' },
      { id: 'dr3', name: 'Dr. Emily Davis', degree: 'MBBS, MD (General Practice)', experience: '10 years' }
    ]
  },
  {
    value: 'cardiology',
    label: 'Cardiology',
    icon: <HeartPulse size={16} className="inline mr-1" />,
    doctors: [
      { id: 'dr4', name: 'Dr. Robert Wilson', degree: 'MBBS, MD, DM (Cardiology)', experience: '20 years' },
      { id: 'dr5', name: 'Dr. Lisa Anderson', degree: 'MBBS, MD, DNB (Cardiology)', experience: '18 years' },
      { id: 'dr6', name: 'Dr. James Miller', degree: 'MBBS, MD, FACC', experience: '22 years' }
    ]
  },
  {
    value: 'orthopedic',
    label: 'Orthopedic',
    icon: <Bone size={16} className="inline mr-1" />,
    doctors: [
      { id: 'dr7', name: 'Dr. David Brown', degree: 'MBBS, MS (Orthopedics)', experience: '16 years' },
      { id: 'dr8', name: 'Dr. Jennifer Taylor', degree: 'MBBS, DNB (Orthopedics)', experience: '14 years' },
      { id: 'dr9', name: 'Dr. Mark Thompson', degree: 'MBBS, MS, MCh (Orthopedics)', experience: '19 years' }
    ]
  },
  {
    value: 'pediatrics',
    label: 'Pediatrics',
    icon: <Baby size={16} className="inline mr-1" />,
    doctors: [
      { id: 'dr10', name: 'Dr. Amanda White', degree: 'MBBS, MD (Pediatrics)', experience: '13 years' },
      { id: 'dr11', name: 'Dr. Kevin Martinez', degree: 'MBBS, DCH, MD (Pediatrics)', experience: '17 years' },
      { id: 'dr12', name: 'Dr. Rachel Green', degree: 'MBBS, MD, IAP Fellowship', experience: '11 years' }
    ]
  },
  {
    value: 'gynecology',
    label: 'Gynecology',
    icon: <Syringe size={16} className="inline mr-1" />,
    doctors: [
      { id: 'dr13', name: 'Dr. Maria Rodriguez', degree: 'MBBS, MS (Obstetrics & Gynecology)', experience: '18 years' },
      { id: 'dr14', name: 'Dr. Susan Clark', degree: 'MBBS, MD, DGO', experience: '21 years' },
      { id: 'dr15', name: 'Dr. Patricia Lewis', degree: 'MBBS, MS, FRCOG', experience: '25 years' }
    ]
  },
  {
    value: 'emergency',
    label: 'Emergency',
    icon: <ShieldAlert size={16} className="inline mr-1" />,
    doctors: [
      { id: 'dr16', name: 'Dr. Thomas Walker', degree: 'MBBS, MD (Emergency Medicine)', experience: '12 years' },
      { id: 'dr17', name: 'Dr. Nancy Hall', degree: 'MBBS, DNB (Emergency Medicine)', experience: '9 years' },
      { id: 'dr18', name: 'Dr. Christopher Young', degree: 'MBBS, FCEM', experience: '15 years' }
    ]
  },
  {
    value: 'dermatology',
    label: 'Dermatology',
    icon: <Sun size={16} className="inline mr-1" />,
    doctors: [
      { id: 'dr19', name: 'Dr. Michelle King', degree: 'MBBS, MD (Dermatology)', experience: '14 years' },
      { id: 'dr20', name: 'Dr. Daniel Wright', degree: 'MBBS, DVD, MD (Dermatology)', experience: '16 years' },
      { id: 'dr21', name: 'Dr. Laura Scott', degree: 'MBBS, MD, FAAD', experience: '13 years' }
    ]
  },
  {
    value: 'neurology',
    label: 'Neurology',
    icon: <Brain size={16} className="inline mr-1" />,
    doctors: [
      { id: 'dr22', name: 'Dr. Richard Adams', degree: 'MBBS, MD, DM (Neurology)', experience: '20 years' },
      { id: 'dr23', name: 'Dr. Karen Baker', degree: 'MBBS, MD, DNB (Neurology)', experience: '17 years' },
      { id: 'dr24', name: 'Dr. Steven Turner', degree: 'MBBS, MD, FAAN', experience: '23 years' }
    ]
  }
];

const priorities = [
  { value: 'normal', label: 'Normal', color: 'text-green-600', bg: 'bg-green-100' },
  { value: 'emergency', label: 'Emergency', color: 'text-red-600', bg: 'bg-red-100' }
];

const TokenGenerator = ({ onTokenGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    department: '',
    doctorId: '',
    reason: '',
    priority: 'normal'
  });
  const [errors, setErrors] = useState({});
  const [nextTokenNumber, setNextTokenNumber] = useState(getNextTokenNumber());

  const selectedDepartment = departments.find(d => d.value === formData.department);
  const availableDoctors = selectedDepartment ? selectedDepartment.doctors : [];
  const selectedDoctor = availableDoctors.find(doc => doc.id === formData.doctorId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!validatePhone(formData.phoneNumber.trim())) newErrors.phoneNumber = 'Enter a valid phone number';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.doctorId) newErrors.doctorId = 'Doctor selection is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const tokenNum = getNextTokenNumber();
    const departmentInfo = departments.find(d => d.value === formData.department);
    const doctorInfo = availableDoctors.find(d => d.id === formData.doctorId);

    const newToken = {
      id: `token-${Date.now()}`,
      tokenNumber: `T${tokenNum.toString().padStart(3, '0')}`,
      ...formData,
      departmentLabel: departmentInfo?.label,
      departmentIcon: departmentInfo?.icon,
      doctorName: doctorInfo?.name,
      doctorDegree: doctorInfo?.degree,
      doctorExperience: doctorInfo?.experience,
      status: 'waiting',
      generatedAt: new Date(),
      estimatedTime: (() => {
        const base = new Date();
        base.setMinutes(base.getMinutes() + (formData.priority === 'emergency' ? 5 : 30));
        return base.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      })()
    };

    let tokens = [];
    try {
      tokens = JSON.parse(localStorage.getItem(TOKENS_KEY)) || [];
    } catch {
      tokens = [];
    }
    tokens.push({ ...newToken });
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));

    onTokenGenerated?.(newToken);
    setFormData({
      patientName: '',
      phoneNumber: '',
      department: '',
      doctorId: '',
      reason: '',
      priority: 'normal'
    });
    setErrors({});
    setNextTokenNumber(getNextTokenNumber());
    setIsGenerating(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value };
      if (field === 'department') updatedData.doctorId = '';
      return updatedData;
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-8 pt-2 sm:pt-4 md:pt-6">
        {/* Patient Information Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-2 sm:p-4 md:p-6 border-l-4 border-[var(--accent-color)]">
            <div className="flex items-center mb-2 sm:mb-4 md:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--accent-color)] rounded-full flex items-center justify-center text-white mr-2 sm:mr-4">
                <Plus size={16} className="sm:size-[20px]" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-[var(--primary-color)]">
                Patient Information
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                {/* Patient Name */}
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-[var(--primary-color)] flex items-center">
                    <User size={14} className="mr-1" />
                    Patient Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      className={`w-full text-xs sm:text-sm md:text-base p-2 border rounded-lg ${errors.patientName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter patient name"
                    />
                    {errors.patientName && (
                      <span className="text-red-500 text-xs">{errors.patientName}</span>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-[var(--primary-color)] flex items-center">
                    <Phone size={14} className="mr-1" />
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                      className={`w-full text-xs sm:text-sm md:text-base p-2 border rounded-lg ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter 10-digit phone number"
                    />
                    {errors.phoneNumber && (
                      <span className="text-red-500 text-xs">{errors.phoneNumber}</span>
                    )}
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-[var(--primary-color)] flex items-center">
                    <Building2 size={14} className="mr-1" />
                    Department *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className={`w-full text-xs sm:text-sm md:text-base p-2 border rounded-lg ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <span className="text-red-500 text-xs">{errors.department}</span>
                    )}
                  </div>
                </div>

                {/* Doctor */}
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-[var(--primary-color)] flex items-center">
                    <Stethoscope size={14} className="mr-1" />
                    Select Doctor *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.doctorId}
                      onChange={(e) => handleInputChange('doctorId', e.target.value)}
                      disabled={!formData.department}
                      className={`w-full text-xs sm:text-sm md:text-base p-2 border rounded-lg ${errors.doctorId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">
                        {formData.department ? 'Select Doctor' : 'First select department'}
                      </option>
                      {availableDoctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.degree}
                        </option>
                      ))}
                    </select>
                    {errors.doctorId && (
                      <span className="text-red-500 text-xs">{errors.doctorId}</span>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-[var(--primary-color)] flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    Priority Level
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2">
                    {priorities.map((priority) => (
                      <label key={priority.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value={priority.value}
                          checked={formData.priority === priority.value}
                          onChange={(e) => handleInputChange('priority', e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`p-1 sm:p-2 rounded-lg border transition-all text-xs sm:text-sm ${
                            formData.priority === priority.value
                              ? `${priority.bg} border-current ${priority.color}`
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="text-center">
                            <div
                              className={`font-medium ${
                                formData.priority === priority.value ? priority.color : 'text-gray-700'
                              }`}
                            >
                              {priority.label}
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                              ~{priority.value === 'emergency' ? '5' : '30'} min
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Doctor Info */}
              {selectedDoctor && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 sm:p-3 border border-blue-200 my-2 sm:my-4">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[var(--primary-color)] rounded-full flex items-center justify-center text-white">
                      <UserCheck size={12} className="sm:size-[16px]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[var(--primary-color)] text-xs sm:text-sm">
                        {selectedDoctor.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-600">
                        {selectedDoctor.degree}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Exp: {selectedDoctor.experience}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reason for Visit */}
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-[var(--primary-color)] flex items-center">
                  <FileText size={14} className="mr-1" />
                  Reason for Visit *
                </label>
                <div className="relative">
                  <textarea
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    className={`w-full text-xs sm:text-sm md:text-base p-2 border rounded-lg ${errors.reason ? 'border-red-500' : 'border-gray-300'}`}
                    rows={2}
                    placeholder="Describe the reason for visit"
                  />
                  {errors.reason && (
                    <span className="text-red-500 text-xs">{errors.reason}</span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className={`w-full btn btn-primary text-xs sm:text-sm ${isGenerating ? 'animate-pulse' : ''}`}
              >
                {isGenerating ? (
                  <>
                    <div className="loader-spinner mr-1 sm:mr-2 inline-block"></div>
                    Generating Token...
                  </>
                ) : (
                  <>
                    <Plus size={14} className="mr-1" />
                    Generate Token
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-2 sm:space-y-4">
          {/* Next Token */}
          <div className="bg-white rounded-lg shadow-md p-2 sm:p-4 border-l-4 border-[var(--primary-color)]">
            <h3 className="text-xs sm:text-sm md:text-base font-bold mb-1 sm:mb-2 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              Next Token
            </h3>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--primary-color)] mb-0.5">
                T{nextTokenNumber.toString().padStart(3, '0')}
              </div>
              <p className="text-[10px] sm:text-xs text-gray-600">Token Number</p>
            </div>
          </div>

          {/* Available Doctors */}
          {formData.department && (
            <div className="bg-white rounded-lg shadow-md p-2 sm:p-4">
              <h3 className="text-xs sm:text-sm md:text-base font-bold mb-1 sm:mb-2 flex items-center">
                <Stethoscope size={14} className="mr-1" />
                Available Doctors
              </h3>
              <div className="space-y-1 sm:space-y-2 max-h-40 sm:max-h-64 overflow-y-auto">
                {availableDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`p-1 sm:p-2 rounded-lg border transition-all cursor-pointer text-xs sm:text-sm ${
                      formData.doctorId === doctor.id
                        ? 'border-[var(--accent-color)] bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleInputChange('doctorId', doctor.id)}
                  >
                    <div className="font-medium text-[var(--primary-color)]">
                      {doctor.name}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 mt-0.5">
                      {doctor.degree}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Exp: {doctor.experience}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Departments */}
          <div className="bg-white rounded-lg shadow-md p-2 sm:p-4">
            <h3 className="text-xs sm:text-sm md:text-base font-bold mb-1 sm:mb-2 flex items-center">
              <Building2 size={14} className="mr-1" />
              Departments
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-[10px] sm:text-xs">
              {departments.slice(0, 8).map((dept) => (
                <div
                  key={dept.value}
                  className={`flex items-center gap-1 p-1 rounded transition-all cursor-pointer text-xs ${
                    formData.department === dept.value
                      ? 'bg-[var(--accent-color)] text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handleInputChange('department', dept.value)}
                >
                  <span>{dept.icon}</span>
                  <span>{dept.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenGenerator;
