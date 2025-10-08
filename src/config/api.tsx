// Base URL configuration for different environments
const getBaseUrl = () => {
  // For Android emulator
  if (__DEV__) {
    // Uncomment the appropriate line based on your setup
    // return 'http://10.0.2.2:8080/api/'; // For Android emulator
    return 'http://192.168.0.169:8080/api/'; // For physical device (replace YOUR_LOCAL_IP with your computer's local IP)
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
  PATIENT_ADDITIONAL_DETAILS_API: `${BASE_URL}auth/patient/additional-details`,
  PATIENT_BLOOD_GROUP_API: `${BASE_URL}master/blood-group`,
  PATIENT_HEALTH_CONDITION_API: `${BASE_URL}master/healthConditions`,
  PATIENT_RELATION_API: `${BASE_URL}master/relation`,
  PATIENT_FAMILY_HEALTH_API: `${BASE_URL}patient-dashboard/family-members`,
  PATIENT_COVERAGE_API:`${BASE_URL}master/coverage-type`,
  PATIENT_ADDITIONAL_DETAILS_API: (patientId: string) =>
    `${BASE_URL}auth/patient/additional-details/${patientId}`,  
// GET_PATIENT_BY_ID: (id: string) => `${BASE_URL}auth/patient/${id}`,  // GET
//   UPDATE_PATIENT_BY_ID: (id: string) => `${BASE_URL}auth/patient/${id}`, // PUT
  PATIENT_PHOTO: `${BASE_URL}auth/patient/photo?path=`,
};

  