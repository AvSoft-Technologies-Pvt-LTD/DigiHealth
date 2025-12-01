import axios from "axios";
import {  BASE_URL } from "../config/api";
import StorageService from "./storageService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from "../types/navigation";
import { PAGES } from "../constants/pages";
// Add this type for navigation reference
let navigationRef: NavigationContainerRef<RootStackParamList> | null = null;

// Function to set the navigation reference
export const setNavigationReference = (ref: NavigationContainerRef<RootStackParamList>) => {
  navigationRef = ref;
};

// Handle server errors (401 unauthorized, etc.)
const handleServerError = async () => {
  try {
    console.log("CLEAR TOKEN AND NAVIGATE TO LOGIN")
    // Clear user token and navigate to login
    // await StorageService.remove('userToken');
    // Alert.alert('Session expired', 'Please login again.');
    // if (navigationRef) {
    //   navigationRef.navigate(PAGES.LOGIN);
    // }
  } catch (error) {
    console.error('Error handling server error:', error);
  }
};

// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100000000, // Set timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach the JWT token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessJwtToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (token expired, etc.)
      handleServerError();
    }
    return Promise.reject(error);
  }
);

// Fetching Refresh Token
export const getAccessJwtToken = async (): Promise<string | null> => {
  try {
    // Replace this with actual logic to retrieve the token, e.g., from AsyncStorage
    // For now, returning null as placeholder - you'll need to implement actual token retrieval
    const token = await StorageService.get("userToken");
    return token;
  } catch (error) {
    console.error("Error fetching JWT token:", error);
    return null;
  }
};

// Utility functions for API calls
export const get = async (
  url: string,
  params?: object,
  responseType: 'json' | 'blob' | 'arraybuffer' = 'json'
) => {
  const token = await getAccessJwtToken();
  try {
    const response = await apiClient.get(url, {
      params,
      responseType, // 👈 allows binary data for images
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error handling server error:', error);
    
    // Logout user and prompt them to login again
    // await StorageService.remove('userToken');
    // Alert.alert('Session expired', 'Please login again.');
    // navigationRef?.navigate(PAGES.LOGIN);

    throw error;
  }
};
export const post = async <T = any>(url: string, data: object): Promise<T> => {
  console.log("url",url,"data",data)
  try {
    const token = await getAccessJwtToken();

    const response = await apiClient.post(url, data,{headers: { Authorization: `Bearer ${token}` }});
    return response.data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

export const put = async (url: string, data: object) => {
  try {
    const token = await getAccessJwtToken();
    const response = await apiClient.put(url, data,{headers: { Authorization: `Bearer ${token}` }});
    console.log("RESPONSE of PUT",response)
    return response.data;
  } catch (error) {
    console.error("PUT request error:", error);
    throw error;
  }
};

export const plainDelete = async (url: string) => {
  try {
    const token = await getAccessJwtToken();
    const response = await apiClient.delete(url,{headers: { Authorization: `Bearer ${token}` }});
    return response.data;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error;
  }
};

export const patch = async (url: string, data: object) => {
  try {
    const token = await getAccessJwtToken();
    const response = await apiClient.patch(url, data,{headers: { Authorization: `Bearer ${token}` }});
    return response.data;
  } catch (error) {
    console.error("PATCH request error:", error);
    throw error;
  }
};

export const postFormData = async (url: string, formData: FormData) => {
  try {
    // Create a new instance of axios for this request to avoid header conflicts
    const instance = axios.create({
      baseURL: BASE_URL,
      timeout: 30000, // Increased timeout for file uploads
    });
    // Add auth token if available
    const token = await getAccessJwtToken();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await instance.post(url, formData, { headers });
    return response.data;
  } catch (error: any) {
    console.error("POST FormData request error:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response data HEre:', error.response.data.error);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      throw error;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
    }
    throw error;
  }
};
export const mediaUpload = async (url: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await postFormData(url, formData);
    return response;
  } catch (error) {
    console.error("Media upload error:", error);
    throw error;
  }
};

// Export the apiClient for use in Redux slices
export { apiClient };