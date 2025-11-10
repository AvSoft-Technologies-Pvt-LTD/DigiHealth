// Base URL configuration for different environments
const getBaseUrl = () => {
  // For Android emulator
  if (__DEV__) {
    // Uncomment the appropriate line based on your setup
    // return 'http://10.0.2.2:8080/api/'; // For Android emulator
    return 'http://192.168.0.121:8080/api/'; // For physical device (replace YOUR_LOCAL_IP with your computer's local IP)
  }
  return 'http://your-production-url.com/api/'; // For production
};

export const BASE_URL = getBaseUrl();

export const API = {
  LOGIN_API: `${BASE_URL}auth/login`,
  PATIENT_REGISTER_API: `${BASE_URL}auth/patient/register`,
  ALL_PATIENT_API: `${BASE_URL}auth/patient/all`,
  PATIENT_DASHBOARD_API: `${BASE_URL}auth/patient/`,
  BLOOD_GROUP_API: `${BASE_URL}auth/patient/blood-group`,
  PATIENT_PERSONAL_HEALTH_API: `${BASE_URL}patient-dashboard/personal-health/`,
  PATIENT_FAMILY_API: `${BASE_URL}auth/patient/family`,
  PATIENT_BLOOD_GROUP_API: `${BASE_URL}master/blood-group`,
  PATIENT_HEALTH_CONDITION_API: `${BASE_URL}master/healthConditions`,
  PATIENT_RELATION_API: `${BASE_URL}master/relation`,
  PATIENT_FAMILY_HEALTH_API: `${BASE_URL}patient-dashboard/family-members`,
 PATIENT_VITALS_API: `${BASE_URL}patient/vitals`,
  HOSPITAL_LIST_API: `${BASE_URL}hospitals/dropdown`, 
  AMBULANCE_TYPE: `${BASE_URL}ambulance-types/`,
  PATIENT_FAMILY_MEMBERS_API: `${BASE_URL}patient-dashboard/family-members/by-patient/`,
  PLANS: `${BASE_URL}plans/`,
   PHARMACY_LIST_API: `${BASE_URL}pharmacies`,
  PATIENT_COVERAGE_API:`${BASE_URL}master/coverage-type`,
  LABS_TESTS_API:`${BASE_URL}lab-tests`,
  LABS_SCANS_API:`${BASE_URL}lab/scans`,
  PATIENT_ADDITIONAL_DETAILS_API:`${BASE_URL}auth/patient/additional-details/`,  
// GET_PATIENT_BY_ID: (id: string) => `${BASE_URL}auth/patient/${id}`,  // GET
  UPDATE_PATIENT_BY_ID: `${BASE_URL}auth/patient/`, 
  PATIENT_PHOTO: `${BASE_URL}auth/patient/photo?path=`,
  MEDICAL_CONDITIONS_API: `${BASE_URL}master/medicalConditions`,
  IPD_RECORD_API: `${BASE_URL}ipd-records/`,
  OPD_RECORD_API: `${BASE_URL}opd-records/`,

PATIENT_MEDICAL_CONDITIONS_API: `${BASE_URL}master/medicalConditions`,
 MEDICAL_STATUS_API: '${BASE_URL}master/medicalStatus',
  PATIENT_PRESCRIPTION_API: (patientId: string) => `${BASE_URL}patient/prescriptions/${patientId}`,
 
  PATIENT_LAB_SCAN_API: (patientId: string) => `${BASE_URL}medical-record-lab-scan/${patientId}`,
 PATIENT_MEDICAL_INFO_API: (userId: string) => `${BASE_URL}patient/medical-info/${userId}`,// GET_PATIENT_BY_ID: (id: string) => `${BASE_URL}auth/patient/${id}`,  // GET

  PHARMACY_BILLING_API: (patientId: string) => `${BASE_URL}medical-record-billing/pharmacy/${patientId}`,
  LAB_BILLING_API: (patientId: string) => `${BASE_URL}medical-record-billing/labs/${patientId}`,
  HOSPITAL_BILLING_API: (patientId: string) => `${BASE_URL}medical-record-billing/hospitals/${patientId}`,
    URGENCY_LEVELS_API: `${BASE_URL}master/urgency-levels`,

};

  