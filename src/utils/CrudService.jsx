import axiosInstance from "./axiosInstance";

/* -----------------------------
   FAMILY MEMBERS (CRUD)
------------------------------ */
// Get ALL family members (for admin/super admin use)
export const getAllFamilyMembers = () => 
  axiosInstance.get('/patient-dashboard/family-members');

// Get family members by patientId
export const getFamilyMembersByPatient = (patientId) => 
  axiosInstance.get(`/patient-dashboard/family-members/by-patient/${patientId}`);

// Get family member by its id
export const getFamilyById = (id) => 
  axiosInstance.get(`/patient-dashboard/family-members/${id}`);

// Create a new family member
export const createFamily = (data) => 
  axiosInstance.post('/patient-dashboard/family-members', data);

// Update family member by id
export const updateFamily = (id, data) => 
  axiosInstance.put(`/patient-dashboard/family-members/${id}`, data);

// Delete family member by id
export const deleteFamily = (id) => 
  axiosInstance.delete(`/patient-dashboard/family-members/${id}`);

/* -----------------------------
   PERSONAL HEALTH (CRUD)
------------------------------ */
// Get all personal health records (for admin use)
export const getAllPersonalHealth = () => 
  axiosInstance.get('/patient-dashboard/personal-health');

// Get personal health by patientId (NEW - matches your API)
export const getPersonalHealthByPatientId = (patientId) => 
  axiosInstance.get(`/patient-dashboard/personal-health/${patientId}`);

// Create personal health record
export const createPersonalHealth = (data) => 
  axiosInstance.post('/patient-dashboard/personal-health', data);

// Update personal health by patientId (UPDATED - matches your API)
export const updatePersonalHealth = (patientId, data) => 
  axiosInstance.put(`/patient-dashboard/personal-health/${patientId}`, data);

// Delete personal health by patientId (UPDATED - matches your API)
export const deletePersonalHealth = (patientId) => 
  axiosInstance.delete(`/patient-dashboard/personal-health/${patientId}`);

// Legacy functions for backward compatibility (if needed elsewhere)
export const getPersonalHealthById = (id) => 
  axiosInstance.get(`/patient-dashboard/personal-health/${id}`);