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
//   REGISTER: `${BASE_URL}auth/register`,
//   PROFILE: `${BASE_URL}user/profile`,
};