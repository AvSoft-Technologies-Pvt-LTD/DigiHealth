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



/* -----------------------------
   WARD TYPES (CRUD)
------------------------------ */
export const getAllWardTypes = () =>
  axiosInstance.get('/ward-types');

export const getWardTypeById = (id) =>
  axiosInstance.get(`/ward-types/${id}`);

export const createWardType = (data) =>
  axiosInstance.post('/ward-types', data);

export const updateWardType = (id, data) =>
  axiosInstance.put(`/ward-types/${id}`, data);

export const deleteWardType = (id) =>
  axiosInstance.delete(`/ward-types/${id}`);


/* -----------------------------
   ROOM AMENITIES (CRUD)
------------------------------ */
// Get all room amenities
export const getAllRoomAmenities = () =>
  axiosInstance.get('/room-amenities');

// Get room amenity by id
export const getRoomAmenityById = (id) =>
  axiosInstance.get(`/room-amenities/${id}`);

// Create a new room amenity
export const createRoomAmenity = (data) =>
  axiosInstance.post('/room-amenities', data);

// Update room amenity by id
export const updateRoomAmenity = (id, data) =>
  axiosInstance.put(`/room-amenities/${id}`, data);

// Delete room amenity by id
export const deleteRoomAmenity = (id) =>
  axiosInstance.delete(`/room-amenities/${id}`);

/* -----------------------------
   BED AMENITIES (CRUD)  <-- ADDED
   Endpoint base: /bed-amenities
------------------------------ */
// Get all bed amenities
export const getAllBedAmenities = () =>
  axiosInstance.get('/bed-amenities');

// Get bed amenity by id
export const getBedAmenityById = (id) =>
  axiosInstance.get(`/bed-amenities/${id}`);

// Create a new bed amenity
export const createBedAmenity = (data) =>
  axiosInstance.post('/bed-amenities', data);

// Update bed amenity by id
export const updateBedAmenity = (id, data) =>
  axiosInstance.put(`/bed-amenities/${id}`, data);

// Delete bed amenity by id
export const deleteBedAmenity = (id) =>
  axiosInstance.delete(`/bed-amenities/${id}`);

export const getAllBedStatuses = () =>
  axiosInstance.get('/bed-statuses');

export const getBedStatusById = (id) =>
  axiosInstance.get(`/bed-statuses/${id}`);

export const createBedStatus = (data) =>
  axiosInstance.post('/bed-statuses', data);

export const updateBedStatus = (id, data) =>
  axiosInstance.put(`/bed-statuses/${id}`, data);

export const deleteBedStatus = (id) =>
  axiosInstance.delete(`/bed-statuses/${id}`);

export const getSpecializationsWithWards = () =>
  axiosInstance.get("/specializations/wards");

export const createSpecializationWards = (data) =>
  axiosInstance.post(
    '/specializations/wards',
    Array.isArray(data) ? data : [data]
  );


// PUT: Update ward hierarchy for a specific specialization
export const updateSpecializationWards = (specializationId, data) =>
  axiosInstance.put(
    `/specializations/wards/specializations/${specializationId}/wards`,
    Array.isArray(data) ? data : (data?.wards ?? [data])
  );


// DELETE: Delete a specific ward by wardId
export const deleteWard = (wardId) =>
  axiosInstance.delete(`/specializations/wards/wards/${wardId}`);

// Get summary of specializations with wards (new)
export const getSpecializationsWardsSummary = () =>
  axiosInstance.get('/specializations/wards/summary');

// Get a single ward by id
export const getWardById = (wardId) =>
  axiosInstance.get(`/specializations/wards/ward/${wardId}`);



/* -----------------------------
   🚑 AMBULANCE (PUBLIC APIs)
------------------------------ */

export const getAllAmbulanceTypes = () =>
  axiosInstance.get('/ambulance/public/types');

export const getAllAmbulanceEquipments = () =>
  axiosInstance.get('/ambulance/public/equipments');

export const getAllAmbulanceCategories = () =>
  axiosInstance.get('/ambulance/public/categories');

// ✅ NEW: Get all hospitals (public)
export const getAllHospitals = () =>
  axiosInstance.get('/ambulance/public/hospitals');

// Add this to your existing CrudService.js
export const getSpecializationsWardsSummaryForIpdAdmission = () =>
  axiosInstance.get('/specializations/wards/summary/ipd-admission');
