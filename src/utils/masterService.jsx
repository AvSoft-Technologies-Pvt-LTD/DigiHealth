import axiosInstance from "./axiosInstance";

/* -----------------------------
   MASTER DATA APIs (Dropdowns for all users)
------------------------------ */
// Fetch all patients
export const getAllPatients = () => axiosInstance.get('/auth/patient/all');

// Get patient by ID (if needed)
export const getPatientById = (id) => axiosInstance.get(`/auth/patient/${id}`);
export const getPatientPhoto = (path) => axiosInstance.get(`/auth/patient/photo`, { params: { path }, responseType: 'blob',});
export const getCoverageTypes = () => axiosInstance.get('/master/coverage-type');
export const getHealthConditions = () => axiosInstance.get('/master/healthConditions');
export const getGenders = () => axiosInstance.get('/master/gender');
export const getBloodGroups = () => axiosInstance.get('/master/blood-group');
export const getRelations = () => axiosInstance.get('/master/relation');
export const getPracticeTypes = () => axiosInstance.get('/master/practiceType');
export const getScanServices = () => axiosInstance.get('/master/scanServices');
export const getSpecialServices = () => axiosInstance.get('/master/specialServices');

// Enhanced specializations API call with better error handling
export const getSpecializationsByPracticeType = (practiceTypeId) =>
  axiosInstance.get('/master/specializations/by-practice-type', {
    params: { practiceTypeId },
  });;


  export const getAllSpecializations = () =>
  axiosInstance.get('/master/specializations');

export const getAvailableTests = () => axiosInstance.get('/master/available-tests');
export const getCenterTypes = () => axiosInstance.get('/master/center-type');
export const getHospitalTypes = () => axiosInstance.get('/master/hospitalType');
export const getAllHospitals = () => axiosInstance.get('/hospitals');
export const getHospitalDropdown = () => axiosInstance.get('/hospitals/dropdown');
export const getAllMedicalConditions = () => axiosInstance.get('/master/medicalConditions');
export const getAllMedicalStatus = () => axiosInstance.get('/master/medicalStatus');


// COVERAGE TYPES
export const createCoverageType = (data) => axiosInstance.post('/master/coverage-type', data);
export const updateCoverageType = (id, data) => axiosInstance.put(`/master/coverage-type/${id}`, data);
export const deleteCoverageType = (id) => axiosInstance.delete(`/master/coverage-type/${id}`);

// HEALTH CONDITIONS
export const createHealthCondition = (data) => axiosInstance.post('/master/healthConditions', data);
export const updateHealthCondition = (id, data) => axiosInstance.put(`/master/healthConditions/${id}`, data);
export const deleteHealthCondition = (id) => axiosInstance.delete(`/master/healthConditions/${id}`);

// GENDERS
export const createGender = (data) => axiosInstance.post('/master/gender', data);
export const updateGender = (id, data) => axiosInstance.put(`/master/gender/${id}`, data);
export const deleteGender = (id) => axiosInstance.delete(`/master/gender/${id}`);

// BLOOD GROUPS
export const createBloodGroup = (data) => axiosInstance.post('/master/blood-group', data);
export const updateBloodGroup = (id, data) => axiosInstance.put(`/master/blood-group/${id}`, data);
export const deleteBloodGroup = (id) => axiosInstance.delete(`/master/blood-group/${id}`);

// AVAILABLE TESTS
export const createAvailableTest = (data) => axiosInstance.post('/master/available-tests', data);
export const updateAvailableTest = (id, data) => axiosInstance.put(`/master/available-tests/${id}`, data);
export const deleteAvailableTest = (id) => axiosInstance.delete(`/master/available-tests/${id}`);

// CENTER TYPES
export const createCenterType = (data) => axiosInstance.post('/master/center-type', data);
export const updateCenterType = (id, data) => axiosInstance.put(`/master/center-type/${id}`, data);
export const deleteCenterType = (id) => axiosInstance.delete(`/master/center-type/${id}`);

// HOSPITAL TYPES
export const createHospitalType = (data) => axiosInstance.post('/master/hospitalType', data);
export const updateHospitalType = (id, data) => axiosInstance.put(`/master/hospitalType/${id}`, data);
export const deleteHospitalType = (id) => axiosInstance.delete(`/master/hospitalType/${id}`);

// HOSPITAL LISTS
export const createHospital = (data) => axiosInstance.post('/hospitals', data);
export const getHospitalById = (id) => axiosInstance.get(`/hospitals/${id}`);
export const deleteHospital = (id) => axiosInstance.delete(`/hospitals/${id}`);

  // MEDICAL CONDITION 
export const getMedicalConditionById = (id) => axiosInstance.get(`/master/medicalConditions/${id}`);
export const updateMedicalCondition = (id, data) => axiosInstance.put(`/master/medicalConditions/${id}`, data);
export const deleteMedicalCondition = (id) => axiosInstance.delete(`/master/medicalConditions/${id}`);
export const createMedicalCondition = (data) => axiosInstance.post('/master/medicalConditions', data);

// MEDICAL STATUS 
export const getMedicalStatusById = (id) => axiosInstance.get(`/master/medicalStatus/${id}`);
export const updateMedicalStatus = (id, data) => axiosInstance.put(`/master/medicalStatus/${id}`, data);
export const deleteMedicalStatus = (id) => axiosInstance.delete(`/master/medicalStatus/${id}`);
export const createMedicalStatus = (data) => axiosInstance.post('/master/medicalStatus', data);



//dosage unit api 

export const getDosageUnits = () => axiosInstance.get("/dosage-units");
export const createDosageUnit = data => axiosInstance.post("/dosage-units", data);
export const updateDosageUnit = (id, data) => axiosInstance.put(`/dosage-units/${id}`, data);
export const deleteDosageUnit = id => axiosInstance.delete(`/dosage-units/${id}`);

// frequencies api
export const getFrequencies = () => axiosInstance.get("/frequency");
export const createFrequency = data => axiosInstance.post("/frequency", data);
export const updateFrequency = (id, data) => axiosInstance.put(`/frequency/${id}`, data);
export const deleteFrequency = id => axiosInstance.delete(`/frequency/${id}`);

// intakes api
export const getIntakes = () => axiosInstance.get("/intake");
export const createIntake = data => axiosInstance.post("/intake", data);
export const updateIntake = (id, data) => axiosInstance.put(`/intake/${id}`, data);
export const deleteIntake = id => axiosInstance.delete(`/intake/${id}`);


// eye-test
// vision-type api
export const getVisionTypes = () => axiosInstance.get("/vision-types");
export const createVisionType = data => axiosInstance.post("/vision-types", data);
export const updateVisionType = (id, data) => axiosInstance.put(`/vision-types/${id}`, data);
export const deleteVisionType = id => axiosInstance.delete(`/vision-types/${id}`);


// EyeTest api

export const getAllEyeTests = () => axiosInstance.get("/eye-tests");
export const getEyeTestById = id => axiosInstance.get(`/eye-tests/${id}`);
export const createEyeTest = data => axiosInstance.post("/eye-tests", data);
export const createBulkEyeTests = data => axiosInstance.post("/eye-tests/bulk", data);
export const updateEyeTest = (id, data) => axiosInstance.put(`/eye-tests/${id}`, data);
export const updateBulkEyeTests = data => axiosInstance.put("/eye-tests/bulk", data);
export const deleteEyeTest = id => axiosInstance.delete(`/eye-tests/${id}`);



