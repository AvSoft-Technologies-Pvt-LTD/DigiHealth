import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { CircleUser, Heart, Users, ClipboardCheck, Pencil, Phone, Calendar, Droplet } from 'lucide-react';
import { FaRegEdit } from "react-icons/fa";
import { GiMale, GiFemale } from "react-icons/gi";
import { useSelector } from 'react-redux';
import DashboardOverview from './DashboardOverview';
import ReusableModal from '../../../../components/microcomponents/Modal';
import Healthcard from '../../../../components/Healthcard';
import {
  getFamilyMembersByPatient, createFamily, updateFamily, deleteFamily,
  createPersonalHealth, updatePersonalHealth, getPersonalHealthByPatientId,
} from '../../../../utils/CrudService';
import { getHealthConditions, getCoverageTypes, getRelations, getBloodGroups } from '../../../../utils/masterService';

const initialUserData = {
  name: '', email: '', gender: '', phone: '', dob: '', bloodGroup: '', height: '', weight: '',
  isAlcoholicUser: false, isSmokerUser: false, isTobaccoUser: false, smokingDuration: '', alcoholDuration: '', tobaccoDuration: '', allergies: '', surgeries: '',
  familyHistory: { diabetes: false, cancer: false, heartDisease: false, mentalHealth: false, disability: false },
  familyMembers: [], additionalDetails: { provider: '', policyNumber: '', coverageType: '', startDate: '', endDate: '', coverageAmount: '', primaryHolder: false }
};

const defaultFamilyMember = { name: '', relation: '', number: '', diseases: [], email: '' };

const ProfileDetail = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="w-12 h-12 rounded-xl flex items-center justify-center">
      <Icon className="w-6 h-6 text-[var(--primary-color)]" />
    </div>
    <div className="flex-1 text-left">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value || "NA"}</p>
    </div>
  </div>
);

const SECTIONS = [
  { id: 'basic', name: 'Basic Details', icon: CircleUser },
  { id: 'personal', name: 'Personal Health', icon: Heart },
  { id: 'family', name: 'Family Details', icon: Users },
  { id: 'additional', name: 'Additional Details', icon: ClipboardCheck }
];

function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(initialUserData);
  const [activeSection, setActiveSection] = useState('basic');
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ fields: [], title: '', mode: 'edit', data: {} });
  const [showHealthCardModal, setShowHealthCardModal] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState({ show: false, message: '', type: '' });
  const [editFamilyMember, setEditFamilyMember] = useState(null);
  const [profileData, setProfileData] = useState({ name: '', firstName: '', lastName: '', gender: '', dob: '', phone: '', photo: '' });
  const [loading, setLoading] = useState(true);
  const [masterData, setMasterData] = useState({ coverageTypes: [], healthConditions: [], familyRelations: [], bloodGroups: [] });
  const [hasPersonalHealthData, setHasPersonalHealthData] = useState(false);

  const getModalFields = (section) => {
    const { bloodGroups, familyRelations, healthConditions, coverageTypes } = masterData;
    const fieldConfigs = {
      personal: [
        { name: 'height', label: 'Height (cm)', type: 'number', colSpan: 1 },
        { name: 'weight', label: 'Weight (kg)', type: 'number', colSpan: 1 },
        { name: 'bloodGroup', label: 'Blood Group', type: 'select', colSpan: 1, options: bloodGroups },
        { name: 'surgeries', label: 'Surgeries', type: 'textarea', colSpan: 1 },
        { name: 'allergies', label: 'Allergies', type: 'textarea', colSpan: 2 },
        { name: 'isAlcoholicUser', label: 'Drink alcohol?', type: 'checkboxWithInput', colSpan: 1, inputName: 'alcoholDuration', inputLabel: 'Since (yrs)', inputType: 'number' },
        { name: 'isSmokerUser', label: 'Do you smoke?', type: 'checkboxWithInput', colSpan: 1, inputName: 'smokingDuration', inputLabel: 'Since (yrs)', inputType: 'number' },
        { name: 'isTobaccoUser', label: 'Tobacco Use?', type: 'checkboxWithInput', colSpan: 1, inputName: 'tobaccoDuration', inputLabel: 'Since (yrs)', inputType: 'number' }
      ],
      family: [
        { name: 'relation', label: 'Relation', type: 'select', colSpan: 1, options: familyRelations },
        { name: 'name', label: 'Name', type: 'text', colSpan: 2 },
        { name: 'number', label: 'Phone Number', type: 'text', colSpan: 1 },
        { name: 'diseases', label: 'Health Conditions', type: 'multiselect', colSpan: 2, options: healthConditions }
      ],
      additional: [
        { name: 'provider', label: 'Insurance Provider', type: 'text', colSpan: 2 },
        { name: 'policyNumber', label: 'Policy Number', type: 'text', colSpan: 1 },
        { name: 'coverageType', label: 'Coverage Type', type: 'select', colSpan: 1, options: coverageTypes },
        { name: 'coverageAmount', label: 'Coverage Amount', type: 'number', colSpan: 1 },
        { name: 'primaryHolder', label: 'Primary Holder', type: 'radio', colSpan: 1, options: [{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }] },
        { name: 'startDate', label: 'Start Date', type: 'date', colSpan: 1.5 },
        { name: 'endDate', label: 'End Date', type: 'date', colSpan: 1.5 },
      ]
    };
    return fieldConfigs[section] || [];
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const [coverageRes, healthConditionsRes, familyRelationsRes, bloodGroupsRes] = await Promise.all([
          getCoverageTypes().catch(() => ({ data: [] })),
          getHealthConditions().catch(() => ({ data: [] })),
          getRelations().catch(() => ({ data: [] })),
          getBloodGroups().catch(() => ({ data: [] })),
        ]);
        const newMasterData = {
          bloodGroups: bloodGroupsRes.data?.map((item) => ({ label: item.bloodGroupName || 'Unknown', value: item.id })) || [],
          familyRelations: familyRelationsRes.data?.map((item) => ({ label: item.relationName || 'Unknown', value: item.relationName })) || [],
          healthConditions: healthConditionsRes.data?.map((item) => ({ label: item.healthConditionName || 'Unknown', value: item.id })) || [],
          coverageTypes: coverageRes.data?.map((item) => ({ label: item.coverageTypeName || 'Unknown', value: item.coverageTypeName })) || []
        };
        setMasterData(newMasterData);
        if (user?.id) {
          const [familyRes, healthRes] = await Promise.all([
            getFamilyMembersByPatient(user.id).catch(() => ({ data: [] })),
            getPersonalHealthByPatientId(user.id).catch(() => ({ data: null })),
          ]);
          const mappedFamilyMembers = familyRes.data?.map((member) => ({
            id: member.id, name: member.memberName || 'Unknown', relation: member.relationName || 'Unknown',
            relationId: member.relationId, number: member.phoneNumber || '',
            diseases: member.healthConditions?.map((hc) => hc.healthConditionName) || [],
            healthConditionIds: member.healthConditions?.map((hc) => hc.id) || [],
          })) || [];
          let personalHealthData = {};
          if (healthRes.data) {
            personalHealthData = {
              id: healthRes.data.id, height: healthRes.data.height || '', weight: healthRes.data.weight || '',
              bloodGroupId: healthRes.data.bloodGroupId, bloodGroupName: healthRes.data.bloodGroupName || '',
              surgeries: healthRes.data.surgeries || '', allergies: healthRes.data.allergies || '',
              isSmokerUser: healthRes.data.isSmoker || false, smokingDuration: healthRes.data.yearsSmoking || '',
              isAlcoholicUser: healthRes.data.isAlcoholic || false, alcoholDuration: healthRes.data.yearsAlcoholic || '',
              isTobaccoUser: healthRes.data.isTobacco || false, tobaccoDuration: healthRes.data.yearsTobacco || '',
            };
            setHasPersonalHealthData(true);
          }
          setUserData(prev => ({ ...prev, ...personalHealthData, familyMembers: mappedFamilyMembers }));
        }
        setProfileData({
          name: `${user?.firstName || 'Guest'} ${user?.lastName || ''}`.trim(),
          firstName: user?.firstName || '', lastName: user?.lastName || '',
          dob: user?.dob || '', gender: user?.gender || '', phone: user?.phone || '', photo: user?.photo || null
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        showFeedback('Failed to load data. Some features may be limited.', 'warning');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [user]);

  useEffect(() => {
    const basicComplete = Boolean(user?.firstName && user?.lastName && user?.dob && user?.gender && user?.phone);
    const personalComplete = Boolean(userData.height && userData.weight && userData.bloodGroupId);
    const familyComplete = Array.isArray(userData.familyMembers) && userData.familyMembers.length > 0;
    const completedSections = [basicComplete, personalComplete, familyComplete].filter(Boolean).length;
    setProfileCompletion(Math.round((completedSections / 3) * 100));
  }, [userData, user]);

  const showFeedback = (message, type = 'success') => {
    setFeedbackMessage({ show: true, message, type });
    setTimeout(() => setFeedbackMessage({ show: false, message: '', type: '' }), 3000);
  };

  const saveUserData = async (updatedData) => {
    if (!user?.id) return showFeedback('Please login to save data', 'error');
    if (!updatedData.height || !updatedData.weight) return showFeedback('Height and weight are required', 'error');
    const bloodGroupId = Number(updatedData.bloodGroup?.value || updatedData.bloodGroup || updatedData.bloodGroupId);
    if (!bloodGroupId || isNaN(bloodGroupId)) return showFeedback('Please select a blood group', 'error');
    try {
      const personalHealthData = {
        height: Number(updatedData.height) || 0, weight: Number(updatedData.weight) || 0, bloodGroupId,
        surgeries: updatedData.surgeries || '', allergies: updatedData.allergies || '',
        isSmoker: Boolean(updatedData.isSmokerUser), yearsSmoking: updatedData.isSmokerUser ? Number(updatedData.smokingDuration) || 0 : 0,
        isAlcoholic: Boolean(updatedData.isAlcoholicUser), yearsAlcoholic: updatedData.isAlcoholicUser ? Number(updatedData.alcoholDuration) || 0 : 0,
        isTobacco: Boolean(updatedData.isTobaccoUser), yearsTobacco: updatedData.isTobaccoUser ? Number(updatedData.tobaccoDuration) || 0 : 0,
        patientId: Number(user.id),
      };
      let savedData;
      try {
        if (hasPersonalHealthData) {
          const updateRes = await updatePersonalHealth(user.id, personalHealthData);
          savedData = updateRes.data;
          showFeedback('Personal health data updated successfully');
        } else {
          const createRes = await createPersonalHealth(personalHealthData);
          savedData = createRes.data;
          setHasPersonalHealthData(true);
          showFeedback('Personal health data saved successfully');
        }
      } catch (createErr) {
        if (createErr.response?.status === 409 || createErr.response?.data?.error?.includes('already exists')) {
          const updateRes = await updatePersonalHealth(user.id, personalHealthData);
          savedData = updateRes.data;
          setHasPersonalHealthData(true);
          showFeedback('Personal health data updated successfully');
        } else throw createErr;
      }
      setUserData(prev => ({
        ...prev, id: savedData?.id || prev.id, ...personalHealthData,
        bloodGroupName: savedData?.bloodGroupName || masterData.bloodGroups.find(bg => bg.value === personalHealthData.bloodGroupId)?.label,
      }));
      return true;
    } catch (err) {
      console.error('Failed to save:', err.response?.data || err.message);
      showFeedback(`Failed to save data: ${err.response?.data?.message || err.message}`, 'error');
      return false;
    }
  };

  const openModal = (section, data = null) => {
    setActiveSection(section);
    const fields = getModalFields(section);
    let modalData = {};
    let title = '';
    if (section === 'personal') {
      title = 'Personal Health Details';
      modalData = {
        height: userData.height || '', weight: userData.weight || '', bloodGroup: userData.bloodGroupId || '',
        surgeries: userData.surgeries || '', allergies: userData.allergies || '',
        isAlcoholicUser: userData.isAlcoholicUser || false, alcoholDuration: userData.alcoholDuration || '',
        isSmokerUser: userData.isSmokerUser || false, smokingDuration: userData.smokingDuration || '',
        isTobaccoUser: userData.isTobaccoUser || false, tobaccoDuration: userData.tobaccoDuration || '',
      };
    } else if (section === 'family') {
      title = data ? 'Edit Family Member' : 'Add Family Member';
      if (data) {
        modalData = {
          name: data.name, relation: data.relationId, number: data.number,
          diseases: data.diseases?.map(diseaseName => {
            const condition = masterData.healthConditions.find(hc => hc.label === diseaseName);
            return condition ? { value: condition.value, label: condition.label } : { value: diseaseName, label: diseaseName };
          }) || [],
        };
        setEditFamilyMember(data);
      } else {
        modalData = { ...defaultFamilyMember, relation: masterData.familyRelations[0]?.value || '', diseases: [] };
        setEditFamilyMember(null);
      }
    } else if (section === 'additional') {
      title = 'Additional Details';
      modalData = userData.additionalDetails || {};
    }
    setModalConfig({ fields, title, mode: 'edit', data: modalData });
    setShowModal(true);
  };

  const handleModalSave = async (formValues) => {
    if (activeSection === 'personal') {
      const cleanedValues = { ...formValues };
      if (!formValues.isSmokerUser) cleanedValues.smokingDuration = '';
      if (!formValues.isAlcoholicUser) cleanedValues.alcoholDuration = '';
      if (!formValues.isTobaccoUser) cleanedValues.tobaccoDuration = '';
      await saveUserData({ ...userData, ...cleanedValues });
    } else if (activeSection === 'family') {
      if (!formValues.name || !formValues.relation) return showFeedback('Name and relation are required', 'error');
      const healthConditionIds = formValues.diseases?.map(disease => {
        if (typeof disease === 'object' && disease.value) return Number(disease.value);
        const found = masterData.healthConditions.find(hc => hc.label === disease || hc.value === disease);
        return found ? Number(found.value) : null;
      }).filter(id => id !== null) || [];
      const memberData = {
        patientId: Number(user.id), relationId: Number(formValues.relation),
        memberName: formValues.name.trim(), phoneNumber: formValues.number || '', healthConditionIds,
      };
      try {
        if (editFamilyMember?.id) {
          await updateFamily(editFamilyMember.id, memberData);
          showFeedback('Family member updated successfully');
        } else {
          await createFamily(memberData);
          showFeedback('Family member saved successfully');
        }
        const familyRes = await getFamilyMembersByPatient(user.id);
        const mappedFamilyMembers = familyRes.data.map(member => ({
          id: member.id, name: member.memberName, relation: member.relationName, relationId: member.relationId,
          number: member.phoneNumber, diseases: member.healthConditions?.map(hc => hc.healthConditionName) || [],
          healthConditionIds: member.healthConditions?.map(hc => hc.id) || [],
        }));
        setUserData(prev => ({ ...prev, familyMembers: mappedFamilyMembers }));
      } catch (err) {
        console.error('Error:', err.response?.data || err.message);
        showFeedback(`Failed to save family member: ${err.response?.data?.message || err.message}`, 'error');
      }
      setEditFamilyMember(null);
    } else if (activeSection === 'additional') {
      setUserData(prev => ({ ...prev, additionalDetails: formValues }));
      showFeedback('Additional details saved successfully');
    }
    setShowModal(false);
  };

  const handleModalDelete = async (formValues) => {
    if (activeSection === 'family' && (formValues?.id || editFamilyMember?.id)) {
      try {
        await deleteFamily(formValues?.id || editFamilyMember?.id);
        const familyRes = await getFamilyMembersByPatient(user.id);
        const mappedFamilyMembers = familyRes.data.map(member => ({
          id: member.id, name: member.memberName, relation: member.relationName, relationId: member.relationId,
          number: member.phoneNumber, diseases: member.healthConditions?.map(hc => hc.healthConditionName) || [],
          healthConditionIds: member.healthConditions?.map(hc => hc.id) || [],
        }));
        setUserData(prev => ({ ...prev, familyMembers: mappedFamilyMembers }));
        showFeedback('Family member deleted successfully');
      } catch (err) {
        showFeedback('Failed to delete family member', 'error');
      }
    }
    setShowModal(false);
    setEditFamilyMember(null);
  };

  const completionStatus = {
    basic: Boolean(user?.firstName && user?.lastName && user?.dob && user?.gender && user?.phone),
    personal: Boolean(userData.height && userData.weight && userData.bloodGroupId),
    family: Array.isArray(userData.familyMembers) && userData.familyMembers.length > 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
      </div>
    );
  }

  const profileDetails = [
    { icon: profileData.gender?.toLowerCase() === 'female' ? GiFemale : GiMale, label: 'Gender', value: profileData.gender },
    { icon: Phone, label: 'Phone No.', value: profileData.phone },
    { icon: Calendar, label: 'Date Of Birth', value: profileData.dob },
    { icon: Droplet, label: 'Blood Group', value: userData.bloodGroupName }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h1 className="text-l sm:text-2xl lg:text-2xl font-bold text-gray-900 m-0">Patient Information</h1>
        <div className="flex gap-3">
          <button onClick={() => setShowHealthCardModal(true)} className="px-2 py-1 sm:px-6 sm:py-3 bg-[var(--accent-color)] hover:bg-green-600 text-white font-medium rounded-xl transition-colors duration-200 text-sm sm:text-base">
            View Health Card
          </button>
          <button onClick={() => navigate('/patientdashboard/settings')} className="p-2 sm:p-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-colors duration-200">
            <FaRegEdit className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
      {/* Unified Profile Card - Responsive */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Profile Image and Name */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-start">
            <div className="w-24 h-24 md:w-24 md:h-24 rounded-full overflow-hidden mb-3">
              {profileData?.photo ? (
                <img src={profileData.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[var(--primary-color)] flex items-center justify-center">
                  <CircleUser className="w-12 h-12 md:w-16 md:h-16 text-gray-500" />
                </div>
              )}
            </div>
            <h2 className="text-l md:text-l font-bold text-gray-900 text-center md:text-left">
              {`${profileData.firstName || "NA"} ${profileData.lastName || "NA"}`.trim()}
            </h2>
          </div>
          {/* Details and Progress */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 mt-6">
              {profileDetails.map((detail, index) => (
                <ProfileDetail key={index} {...detail} />
              ))}
            </div>
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="relative w-full h-2 bg-[var(--primary-color)] rounded-full">
                <div className="absolute top-0 left-0 h-2 bg-[var(--accent-color)] rounded-full" style={{ width: `${profileCompletion}%` }} />
              </div>
              <span className="text-sm font-semibold px-3 py-1 bg-[var(--accent-color)] text-white rounded">{profileCompletion}%</span>
            </div>
          </div>
        </div>
      </div>
      {/* Section Tabs */}
      <div className="overflow-x-auto custom-scrollbar pb-2 mb-6">
        <div className="flex gap-2 sm:gap-4 min-w-max">
          {SECTIONS.map(({ id, name, icon: Icon }) => (
            <button key={id} onClick={() => id !== 'basic' && openModal(id)}
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg flex items-center gap-1 text-white text-xs sm:text-sm whitespace-nowrap ${activeSection === id ? 'bg-[#0e1630]' : 'bg-[#1f2a4d] hover:bg-[#1b264a]'} transition-all duration-300`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">{name}</span>
              {completionStatus[id] && <ClipboardCheck className="text-green-400 ml-1 animate-pulse" />}
            </button>
          ))}
        </div>
      </div>
      {/* Feedback Message */}
      {feedbackMessage.show && (
        <div className={`fixed top-4 right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg ${
          feedbackMessage.type === 'success' ? 'bg-green-100 text-green-800' :
          feedbackMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
        } transition-all duration-300`}>
          {feedbackMessage.message}
        </div>
      )}
      {/* Modals */}
      <ReusableModal isOpen={showModal} onClose={() => { setShowModal(false); setEditFamilyMember(null); }}
        mode={modalConfig.mode} title={modalConfig.title} data={modalConfig.data} fields={modalConfig.fields}
        onSave={handleModalSave} onChange={(updated) => setModalConfig(prev => ({ ...prev, data: updated }))}
        onDelete={handleModalDelete} saveLabel={activeSection === 'personal' ? (hasPersonalHealthData ? 'Update' : 'Save') : (activeSection === 'family' && editFamilyMember?.id ? 'Update' : 'Save')}
        cancelLabel="Cancel" deleteLabel="Delete" size="md"
        extraContent={activeSection === 'family' && Array.isArray(userData.familyMembers) && userData.familyMembers.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-md font-semibold">Saved Family Members</h3>
            {userData.familyMembers.map((m, index) => (
              <div key={`${m.id}-${index}`} className="p-2 sm:p-3 bg-gray-100 rounded-md flex flex-col sm:flex-row justify-between items-start">
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-gray-700"><strong>Relation:</strong> {m.relation}</p>
                  {m.number && <p className="text-sm text-gray-700"><strong>Phone:</strong> {m.number}</p>}
                  {m.diseases.length > 0 && <p className="text-sm text-gray-700 mt-1"><strong>Conditions:</strong> {m.diseases.join(', ')}</p>}
                </div>
                <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-0">
                  <button className="text-blue-600 hover:underline text-xs sm:text-sm" onClick={() => openModal('family', m)}>Edit</button>
                  <button className="text-red-600 hover:underline text-xs sm:text-sm" onClick={() => handleModalDelete(m)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      />
      {/* Health Card Modal */}
      {showHealthCardModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-lg mx-auto">
            <button className="absolute -top-8 sm:-top-10 right-0 text-[var(--color-surface)] border border-[var(--color-surface)] text-xl sm:text-2xl rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
              onClick={() => setShowHealthCardModal(false)}>
              &times;
            </button>
            <div className="rounded-lg overflow-hidden">
              <Healthcard hideLogin isOpen onClose={() => setShowHealthCardModal(false)} />
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 sm:mt-8">
        <DashboardOverview />
      </div>
    </div>
  );
}

export default Dashboard;
