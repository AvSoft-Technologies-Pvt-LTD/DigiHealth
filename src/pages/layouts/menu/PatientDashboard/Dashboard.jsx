import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { CircleUser, Heart, Users, ClipboardCheck, Pencil } from 'lucide-react';
import { useSelector } from 'react-redux';
import DashboardOverview from './DashboardOverview';
import ReusableModal from '../../../../components/microcomponents/Modal';
import Healthcard from '../../../../components/Healthcard';
import {
  getFamilyMembersByPatient,
  createFamily,
  updateFamily,
  deleteFamily,
  createPersonalHealth,
  updatePersonalHealth,
  getPersonalHealthByPatientId,
} from '../../../../utils/CrudService';
import { getHealthConditions, getCoverageTypes, getRelations, getBloodGroups } from '../../../../utils/masterService';

const initialUserData = {
  name: '', email: '', gender: '', phone: '', dob: '', bloodGroup: '', height: '', weight: '',
  isAlcoholicUser: false, isSmokerUser: false, isTobaccoUser: false, smokingDuration: '', alcoholDuration: '', tobaccoDuration: '', allergies: '', surgeries: '',
  familyHistory: { diabetes: false, cancer: false, heartDisease: false, mentalHealth: false, disability: false },
  familyMembers: [], additionalDetails: { provider: '', policyNumber: '', coverageType: '', startDate: '', endDate: '', coverageAmount: '', primaryHolder: false }
};

const defaultFamilyMember = { name: '', relation: '', number: '', diseases: [], email: '' };

const getProgressColor = (completion) =>
  completion <= 33 ? '#ef4444' : completion <= 67 ? '#f59e42' : completion < 100 ? '#facc15' : '#22c55e';

function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(initialUserData);
  const [activeSection, setActiveSection] = useState('basic');
  const [showModal, setShowModal] = useState(false);
  const [modalFields, setModalFields] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMode, setModalMode] = useState('edit');
  const [modalData, setModalData] = useState({});
  const [showHealthCardModal, setShowHealthCardModal] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(33);
  const [feedbackMessage, setFeedbackMessage] = useState({ show: false, message: '', type: '' });
  const [editFamilyMember, setEditFamilyMember] = useState(null);
  const [profileData, setProfileData] = useState({ name: '', firstName: '', lastName: '', gender: '', dob: '', phone: '', photo: '' });
  const [loading, setLoading] = useState(true);
  const [coverageTypes, setCoverageTypes] = useState([]);
  const [healthConditions, setHealthConditions] = useState([]);
  const [familyRelations, setFamilyRelations] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [hasPersonalHealthData, setHasPersonalHealthData] = useState(false);

  const basePersonalFields = [
    { name: 'height', label: 'Height (cm)', type: 'number', colSpan: 1 },
    { name: 'weight', label: 'Weight (kg)', type: 'number', colSpan: 1 },
    { name: 'bloodGroup', label: 'Blood Group', type: 'select', colSpan: 1, options: bloodGroups },
    { name: 'surgeries', label: 'Surgeries', type: 'textarea', colSpan: 1 },
    { name: 'allergies', label: 'Allergies', type: 'textarea', colSpan: 2 },
    {
      name: 'isAlcoholicUser',
      label: 'Drink alcohol?',
      type: 'checkboxWithInput',
      colSpan: 1,
      inputName: 'alcoholDuration',
      inputLabel: 'Since (yrs)',
      inputType: 'number',
    },
    {
      name: 'isSmokerUser',
      label: 'Do you smoke?',
      type: 'checkboxWithInput',
      colSpan: 1,
      inputName: 'smokingDuration',
      inputLabel: 'Since (yrs)',
      inputType: 'number',
    },
    {
      name: 'isTobaccoUser',
      label: 'Tobacco Use?',
      type: 'checkboxWithInput',
      colSpan: 1,
      inputName: 'tobaccoDuration',
      inputLabel: 'Since (yrs)',
      inputType: 'number',
    }
  ];

  const familyFields = [
    { name: 'relation', label: 'Relation', type: 'select', colSpan: 1, options: familyRelations },
    { name: 'name', label: 'Name', type: 'text', colSpan: 2 },
    { name: 'number', label: 'Phone Number', type: 'text', colSpan: 1 },
    {
      name: 'diseases', label: 'Health Conditions', type: 'multiselect', colSpan: 2, options: healthConditions
    }
  ];

  const additionalFields = [
    { name: 'provider', label: 'Insurance Provider', type: 'text', colSpan: 2 },
    { name: 'policyNumber', label: 'Policy Number', type: 'text', colSpan: 1 },
    { name: 'coverageType', label: 'Coverage Type', type: 'select', colSpan: 1, options: coverageTypes },
    { name: 'coverageAmount', label: 'Coverage Amount', type: 'number', colSpan: 1 },
    { name: 'primaryHolder', label: 'Primary Holder', type: 'radio', colSpan: 1, options: [{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }] },
    { name: 'startDate', label: 'Start Date', type: 'date', colSpan: 1.5 },
    { name: 'endDate', label: 'End Date', type: 'date', colSpan: 1.5 },
  ];

  // Fetch master data options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [coverageRes, healthConditionsRes, familyRelationsRes, bloodGroupsRes] = await Promise.all([
          getCoverageTypes(),
          getHealthConditions(),
          getRelations(),
          getBloodGroups()
        ]);

        // Map blood groups with ID as value
        setBloodGroups(
          bloodGroupsRes.data.map(item => ({
            label: item.bloodGroupName,
            value: item.id
          }))
        );

        // Map family relations with ID as value
        setFamilyRelations(
          familyRelationsRes.data.map(item => ({
            label: item.relationName,
            value: item.id
          }))
        );

        // Map health conditions with ID as value for proper backend mapping
        setHealthConditions(
          healthConditionsRes.data.map(item => ({
            label: item.healthConditionName,
            value: item.id // Use ID instead of name for proper backend mapping
          }))
        );

        // Map coverage types
        setCoverageTypes(
          coverageRes.data.map(item => ({
            label: item.coverageTypeName,
            value: item.coverageTypeName
          }))
        );

      } catch (err) {
        console.error('Failed to fetch options:', err.response?.data || err.message);
        showFeedback(`Failed to fetch options: ${err.response?.data?.message || err.message}`, 'error');
      }
    };

    fetchOptions();
  }, []);

  // Set profile data from user
  useEffect(() => {
    if (!user?.email) return;

    setProfileData({
      name: `${user?.firstName || 'Guest'} ${user?.lastName || ''}`.trim(),
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      dob: user?.dob || '',
      gender: user?.gender || '',
      phone: user?.phone || '',
      photo: user?.photo || null
    });
  }, [user]);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);

      try {
        // Fetch family members and personal health data
        const [familyRes, healthRes] = await Promise.all([
          getFamilyMembersByPatient(user.id).catch(() => ({ data: [] })),
          getPersonalHealthByPatientId(user.id).catch(() => null)
        ]);

        // Map backend family member fields to frontend format
        const mappedFamilyMembers = familyRes.data.map(member => ({
          id: member.id,
          name: member.memberName,
          relation: member.relationName,
          relationId: member.relationId,
          number: member.phoneNumber,
          diseases: member.healthConditions?.map(hc => hc.healthConditionName) || [],
          healthConditionIds: member.healthConditions?.map(hc => hc.id) || [],
        }));

        // Handle personal health data
        let personalHealthData = {};
        let hasHealthData = false;

        if (healthRes && healthRes.data) {
          const userHealthData = healthRes.data;
          hasHealthData = true;
          
          personalHealthData = {
            id: userHealthData.id,
            height: userHealthData.height || '',
            weight: userHealthData.weight || '',
            bloodGroupId: userHealthData.bloodGroupId,
            bloodGroupName: userHealthData.bloodGroupName,
            surgeries: userHealthData.surgeries || '',
            allergies: userHealthData.allergies || '',
            isSmokerUser: userHealthData.isSmoker || false,
            smokingDuration: userHealthData.yearsSmoking || '',
            isAlcoholicUser: userHealthData.isAlcoholic || false,
            alcoholDuration: userHealthData.yearsAlcoholic || '',
            isTobaccoUser: userHealthData.isTobacco || false,
            tobaccoDuration: userHealthData.yearsTobacco || '',
          };
        }

        // Set user data with proper mapping
        setUserData(prev => ({
          ...prev,
          ...personalHealthData,
          familyMembers: mappedFamilyMembers,
        }));

        setHasPersonalHealthData(hasHealthData);

      } catch (err) {
        console.error('Failed to fetch data:', err);
        showFeedback('Failed to fetch some data. You can still add new information.', 'warning');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const showFeedback = (message, type = 'success') => {
    setFeedbackMessage({ show: true, message, type });
    setTimeout(() => setFeedbackMessage({ show: false, message: '', type: '' }), 3000);
  };

  const handleEditClick = () => navigate('/patientdashboard/settings');
  const handleGenerateCard = () => setShowHealthCardModal(true);

 const getSectionCompletionStatus = () => {
  // Basic Details Completion
  const basicComplete = Boolean(
    user?.firstName &&
    user?.lastName &&
    user?.dob &&
    user?.gender &&
    user?.phone
  );

  // Personal Health Completion
  const personalComplete = Boolean(
    userData.height &&
    userData.weight &&
    userData.bloodGroupId
  );

  // Family Details Completion
  const familyComplete = Array.isArray(userData.familyMembers) && userData.familyMembers.length > 0;

  return {
    basic: basicComplete,
    personal: personalComplete,
    family: familyComplete,
  };
};

useEffect(() => {
  const completionStatus = getSectionCompletionStatus();
  const completedSections = Object.values(completionStatus).filter(Boolean).length;
  const totalSections = Object.keys(completionStatus).length;
  const completion = Math.round((completedSections / totalSections) * 100);
  setProfileCompletion(completion);
}, [userData, user]);


  const saveUserData = async (updatedData) => {
    if (!user?.id) return showFeedback('Please login to save data', 'error');

    // Validate required fields
    if (!updatedData.height || !updatedData.weight) {
      return showFeedback('Height and weight are required', 'error');
    }

    // Validate blood group selection
    const bloodGroupId = Number(updatedData.bloodGroup?.value || updatedData.bloodGroup || updatedData.bloodGroupId);
    if (!bloodGroupId || isNaN(bloodGroupId)) {
      return showFeedback('Please select a blood group', 'error');
    }

    try {
      const personalHealthData = {
        height: Number(updatedData.height) || 0,
        weight: Number(updatedData.weight) || 0,
        bloodGroupId: bloodGroupId,
        surgeries: updatedData.surgeries || '',
        allergies: updatedData.allergies || '',
        isSmoker: Boolean(updatedData.isSmokerUser),
        yearsSmoking: updatedData.isSmokerUser ? Number(updatedData.smokingDuration) || 0 : 0,
        isAlcoholic: Boolean(updatedData.isAlcoholicUser),
        yearsAlcoholic: updatedData.isAlcoholicUser ? Number(updatedData.alcoholDuration) || 0 : 0,
        isTobacco: Boolean(updatedData.isTobaccoUser),
        yearsTobacco: updatedData.isTobaccoUser ? Number(updatedData.tobaccoDuration) || 0 : 0,
        patientId: Number(user.id),
      };

      let savedData;
      
      if (hasPersonalHealthData) {
        // Update existing record using patientId
        const updateRes = await updatePersonalHealth(user.id, personalHealthData);
        savedData = updateRes.data;
        showFeedback('Personal health data updated successfully');
      } else {
        // Create new record
        try {
          const createRes = await createPersonalHealth(personalHealthData);
          savedData = createRes.data;
          setHasPersonalHealthData(true); // Mark as having data now
          showFeedback('Personal health data saved successfully');
        } catch (createErr) {
          // If creation fails because record exists, try to update
          if (createErr.response?.status === 409 || createErr.response?.data?.error?.includes('already exists')) {
            const updateRes = await updatePersonalHealth(user.id, personalHealthData);
            savedData = updateRes.data;
            setHasPersonalHealthData(true);
            showFeedback('Personal health data updated successfully');
          } else {
            throw createErr;
          }
        }
      }

      // Update local state with saved data
      setUserData(prev => ({
        ...prev,
        id: savedData?.id || prev.id,
        height: savedData?.height || personalHealthData.height,
        weight: savedData?.weight || personalHealthData.weight,
        bloodGroupId: savedData?.bloodGroupId || personalHealthData.bloodGroupId,
        bloodGroupName: savedData?.bloodGroupName || bloodGroups.find(bg => bg.value === personalHealthData.bloodGroupId)?.label,
        surgeries: savedData?.surgeries || personalHealthData.surgeries,
        allergies: savedData?.allergies || personalHealthData.allergies,
        isSmokerUser: savedData?.isSmoker !== undefined ? savedData.isSmoker : personalHealthData.isSmoker,
        smokingDuration: savedData?.yearsSmoking !== undefined ? savedData.yearsSmoking : personalHealthData.yearsSmoking,
        isAlcoholicUser: savedData?.isAlcoholic !== undefined ? savedData.isAlcoholic : personalHealthData.isAlcoholic,
        alcoholDuration: savedData?.yearsAlcoholic !== undefined ? savedData.yearsAlcoholic : personalHealthData.yearsAlcoholic,
        isTobaccoUser: savedData?.isTobacco !== undefined ? savedData.isTobacco : personalHealthData.isTobacco,
        tobaccoDuration: savedData?.yearsTobacco !== undefined ? savedData.yearsTobacco : personalHealthData.yearsTobacco,
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
    setShowModal(true);
    setModalMode(data && section === 'family' ? 'edit' : 'edit');

    if (section === 'personal') {
      setModalFields(
        basePersonalFields.map((field) =>
          field.name === 'bloodGroup'
            ? { ...field, options: bloodGroups }
            : field
        )
      );
      setModalData({
        height: userData.height || '',
        weight: userData.weight || '',
        bloodGroup: userData.bloodGroupId ? bloodGroups.find(bg => bg.value === userData.bloodGroupId) : null,
        surgeries: userData.surgeries || '',
        allergies: userData.allergies || '',
        isAlcoholicUser: userData.isAlcoholicUser || false,
        alcoholDuration: userData.alcoholDuration || '',
        isSmokerUser: userData.isSmokerUser || false,
        smokingDuration: userData.smokingDuration || '',
        isTobaccoUser: userData.isTobaccoUser || false,
        tobaccoDuration: userData.tobaccoDuration || '',
      });
    } else if (section === 'family') {
      setModalFields(
        familyFields.map((field) =>
          field.name === 'relation'
            ? { ...field, options: familyRelations }
            : field.name === 'diseases'
              ? { ...field, options: healthConditions }
              : field
        )
      );

      // Setup modal data for editing
      if (data) {
        console.log('Setting up edit modal for family member:', data);
        setModalData({
          name: data.name,
          relation: data.relationId, // Use relationId for dropdown
          number: data.number,
          diseases: data.diseases?.map(diseaseName => {
            // Find the health condition by name and return proper format
            const condition = healthConditions.find(hc => hc.label === diseaseName);
            return condition ? { value: condition.value, label: condition.label } : { value: diseaseName, label: diseaseName };
          }) || [],
        });
        setEditFamilyMember(data); // Set this before opening modal
      } else {
        setModalData({
          ...defaultFamilyMember,
          relation: familyRelations[0]?.value || '',
          diseases: [],
        });
        setEditFamilyMember(null); // Clear for new member
      }
    } else if (section === 'additional') {
      setModalFields(
        additionalFields.map((field) =>
          field.name === 'coverageType'
            ? { ...field, options: coverageTypes }
            : field
        )
      );
      setModalData(userData.additionalDetails || {});
    }

    setModalTitle(
      section === 'personal'
        ? 'Personal Health Details'
        : section === 'family'
          ? data
            ? 'Edit Family Member'
            : 'Add Family Member'
          : 'Additional Details'
    );
  };

  const handleModalSave = async (formValues) => {
    if (activeSection === 'personal') {
      const cleanedValues = { ...formValues };
      if (!formValues.isSmokerUser) cleanedValues.smokingDuration = '';
      if (!formValues.isAlcoholicUser) cleanedValues.alcoholDuration = '';
      if (!formValues.isTobaccoUser) cleanedValues.tobaccoDuration = '';
      await saveUserData({ ...userData, ...cleanedValues });
    } else if (activeSection === 'family') {
      // Validate required fields
      if (!formValues.name || !formValues.relation) {
        return showFeedback('Name and relation are required', 'error');
      }

      // Map health condition selections to IDs
      const healthConditionIds = formValues.diseases?.map(disease => {
        if (typeof disease === 'object' && disease.value) {
          return Number(disease.value);
        }
        // If it's a string, find the corresponding ID
        const found = healthConditions.find(hc => hc.label === disease || hc.value === disease);
        return found ? Number(found.value) : null;
      }).filter(id => id !== null) || [];

      const memberData = {
        patientId: Number(user.id),
        relationId: Number(formValues.relation),
        memberName: formValues.name.trim(),
        phoneNumber: formValues.number || '',
        healthConditionIds: healthConditionIds,
      };

      try {
        if (editFamilyMember?.id) {
          console.log('Updating family member with ID:', editFamilyMember.id, 'Data:', memberData);
          await updateFamily(editFamilyMember.id, memberData);
          showFeedback('Family member updated successfully');
        } else {
          console.log('Creating new family member:', memberData);
          await createFamily(memberData);
          showFeedback('Family member saved successfully');
        }

        // Refresh family members data
        const familyRes = await getFamilyMembersByPatient(user.id);
        const mappedFamilyMembers = familyRes.data.map(member => ({
          id: member.id,
          name: member.memberName,
          relation: member.relationName,
          relationId: member.relationId,
          number: member.phoneNumber,
          diseases: member.healthConditions?.map(hc => hc.healthConditionName) || [],
          healthConditionIds: member.healthConditions?.map(hc => hc.id) || [],
        }));

        setUserData(prev => ({
          ...prev,
          familyMembers: mappedFamilyMembers,
        }));
      } catch (err) {
        console.error('Error:', err.response?.data || err.message);
        showFeedback(`Failed to save family member: ${err.response?.data?.message || err.message}`, 'error');
      }
      setEditFamilyMember(null);
    } else if (activeSection === 'additional') {
      setUserData(prev => ({
        ...prev,
        additionalDetails: formValues
      }));
      showFeedback('Additional details saved successfully');
    }
    setShowModal(false);
    setModalData({});
  };

  const handleModalDelete = async (formValues) => {
    if (activeSection === 'family' && (formValues?.id || editFamilyMember?.id)) {
      const deleteId = formValues?.id || editFamilyMember?.id;
      try {
        await deleteFamily(deleteId);

        // Refresh family members after deletion
        const familyRes = await getFamilyMembersByPatient(user.id);
        const mappedFamilyMembers = familyRes.data.map(member => ({
          id: member.id,
          name: member.memberName,
          relation: member.relationName,
          relationId: member.relationId,
          number: member.phoneNumber,
          diseases: member.healthConditions?.map(hc => hc.healthConditionName) || [],
          healthConditionIds: member.healthConditions?.map(hc => hc.id) || [],
        }));

        setUserData(prev => ({ ...prev, familyMembers: mappedFamilyMembers }));
        showFeedback('Family member deleted successfully');
      } catch (err) {
        console.error("Delete failed", err);
        showFeedback('Failed to delete family member', 'error');
      }
    } else {
      showFeedback('Invalid data for delete', 'error');
    }
    setShowModal(false);
    setEditFamilyMember(null);
  };

  // Calculate profile completion
  useEffect(() => {
    const completionStatus = getSectionCompletionStatus();
    const completedSections = Object.values(completionStatus).filter(Boolean).length;
    const totalSections = Object.keys(completionStatus).length;
    const completion = Math.round((completedSections / totalSections) * 100);
    setProfileCompletion(completion);
  }, [userData, user]);

  const sections = [
    { id: 'basic', name: 'Basic Details', icon: 'user' },
    { id: 'personal', name: 'Personal Health', icon: 'heart' },
    { id: 'family', name: 'Family Details', icon: 'users' },
    { id: 'additional', name: 'Additional Details', icon: 'clipboard' }
  ];

  const completionStatus = getSectionCompletionStatus();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-[#0e1630] via-[#1b2545] to-[#038358] text-white p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 shadow-lg w-full">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36">
    <circle className="text-gray-300" stroke="currentColor" strokeWidth="2" fill="none" r="16" cx="18" cy="18" />
    <circle
      stroke={getProgressColor(profileCompletion || 0)}
      strokeWidth="2"
      strokeDasharray="100"
      strokeDashoffset={100 - (profileCompletion || 0)}
      strokeLinecap="round"
      fill="none"
      r="16"
      cx="18"
      cy="18"
    />
  </svg>
  <div className="absolute inset-2 flex items-center justify-center">
    {profileData?.photo ? (
      <img src={profileData.photo} alt="Profile" className="w-full h-full object-cover rounded-full" />
    ) : (
      <CircleUser className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500" />
    )}
  </div>
  <div className="absolute bottom-0 right-0 bg-yellow-400 text-black px-1.5 py-0.5 text-xs font-bold rounded-full">
    {profileCompletion}%
  </div>
</div>

        <div className="flex flex-row flex-wrap gap-1 sm:gap-2 items-center flex-1 min-w-0">
          {[
            { label: "Name", value: `${profileData.firstName || "Guest"} ${profileData.lastName || ""}`.trim() },
            { label: "Date of Birth", value: profileData.dob || "N/A" },
            { label: "Gender", value: profileData.gender || "N/A" },
            { label: "Phone No.", value: profileData.phone || "N/A" },
            { label: "Blood Group", value: userData.bloodGroupName || "N/A" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col whitespace-nowrap text-xs sm:text-sm">
              <span className="text-[#01D48C] truncate">{item.label}</span>
              <span className="text-gray-200 truncate">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-center justify-center sm:justify-end flex-shrink-0">
          <button
            className="px-2 py-1 sm:px-3 sm:py-2 rounded-full border-[var(--accent-color)] text-[var(--accent-color)] bg-white hover:bg-[var(--accent-color)] hover:text-[var(--surface-color)] transition-all duration-300 whitespace-nowrap text-xs sm:text-sm"
            onClick={handleGenerateCard}
          >
            View Health Card
          </button>
          <div className="relative group">
            <Pencil onClick={handleEditClick} className="w-5 h-5 sm:w-6 sm:h-6 p-1 rounded-full bg-white text-black cursor-pointer hover:scale-110 transition-transform duration-200" />
            <span className="absolute -top-7 sm:-top-10 left-1/2 -translate-x-1/2 text-[10px] sm:text-[11px] bg-white text-black rounded-md px-1.5 py-0.5 opacity-0 scale-90 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg z-10">
              Edit
            </span>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="mt-4 sm:mt-6 overflow-x-auto custom-scrollbar pb-2">
        <div className="flex gap-2 sm:gap-4 min-w-max">
          {sections.map(({ id, name, icon }) => {
            const Icon = icon === 'user' ? CircleUser : icon === 'heart' ? Heart : icon === 'users' ? Users : ClipboardCheck;
            return (
              <button
                key={id}
                onClick={() => id !== 'basic' && openModal(id)}
                className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg flex items-center gap-1 text-white text-xs sm:text-sm whitespace-nowrap ${
                  activeSection === id ? 'bg-[#0e1630]' : 'bg-[#1f2a4d] hover:bg-[#1b264a]'
                } transition-all duration-300`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="truncate">{name}</span>
                {completionStatus[id] && <ClipboardCheck className="text-green-400 ml-1 animate-pulse" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Message */}
      {feedbackMessage.show && (
        <div className={`fixed top-4 right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg ${
          feedbackMessage.type === 'success' ? 'bg-green-100 text-green-800' : 
          feedbackMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        } transition-all duration-300`}>
          {feedbackMessage.message}
        </div>
      )}

      {/* Modals */}
      <ReusableModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditFamilyMember(null); }}
        mode={modalMode}
        title={modalTitle}
        data={modalData}
        fields={modalFields}
        onSave={handleModalSave}
        onChange={(updated) => setModalData(updated)}
        onDelete={handleModalDelete}
        saveLabel={
          activeSection === 'personal' 
            ? hasPersonalHealthData ? 'Update' : 'Save'
            : activeSection === 'family' && editFamilyMember?.id 
              ? 'Update' 
              : 'Save'
        }
        cancelLabel="Cancel"
        deleteLabel="Delete"
        size="md"
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
            <button
              className="absolute -top-8 sm:-top-10 right-0 text-[var(--color-surface)] border border-[var(--color-surface)] text-xl sm:text-2xl rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
              onClick={() => setShowHealthCardModal(false)}
            >
              &times;
            </button>
            <div className="rounded-lg overflow-hidden">
              <Healthcard hideLogin isOpen onClose={() => setShowHealthCardModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Overview */}
      <div className="mt-6 sm:mt-8">
        <DashboardOverview />
      </div>
    </div>
  );
}

export default Dashboard;