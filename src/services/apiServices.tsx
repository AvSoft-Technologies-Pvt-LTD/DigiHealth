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
    console.log("Sending FormData request to:", url);
    
    // Create a new instance of axios for this request to avoid header conflicts
    const instance = axios.create({
      baseURL: BASE_URL,
      timeout: 30000, // Increased timeout for file uploads
    });
    
    // Add auth token if available
    const token = await getAccessJwtToken();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    
    // Note: Don't set Content-Type for FormData, axios will set it automatically
    // with the correct boundary for multipart/form-data
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await instance.post(url, formData, { headers });
    
    console.log("FormData request successful:", {
      status: response.status,
      data: response.data
    });
    
    return response.data;
  } catch (error: any) {
    console.error("POST FormData request error:", error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
      
      // Create a more informative error object
      const apiError = new Error(
        error.response.data?.message || 
        error.response.data?.error || 
        `HTTP Error ${error.response.status}`
      ) as any;
      
      apiError.response = {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers,
      };
      
      throw apiError;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response received from server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

export const mediaUpload = async (url: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log("Uploading media file:", {
      name: file.name,
      type: file.type,
      size: `${Math.round(file.size / 1024)}KB`
    });
    
    const response = await postFormData(url, formData);
    console.log("Media upload successful:", response);
    return response;
  } catch (error) {
    console.error("Media upload error:", error);
    throw error;
  }
};


// Optional: Helper function to handle base64 image uploads
export const uploadBase64Image = async (url: string, base64Image: string, fileName: string = 'image.jpg') => {
  try {
    console.log("Uploading base64 image:", {
      fileName,
      size: `${Math.round(base64Image.length / 1024)}KB`
    });
    
    // Convert base64 to blob if you need to use FormData
    const response = await fetch(`data:image/jpeg;base64,${base64Image}`);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: 'image/jpeg' });
    
    return await mediaUpload(url, file);
  } catch (error) {
    console.error("Base64 image upload error:", error);
    throw error;
  }
};

export const postJson = async (url: string, data: any) => {
  try {
    console.log("Sending JSON request to:", url);
    console.log("Request data:", { 
      ...data, 
      photo: data.photo ? `[Base64 Image - ${data.photo.length} characters]` : 'No photo' 
    });
    
    // Create a new instance of axios for this request
    const instance = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
    });
    
    // Add auth token if available
    const token = await getAccessJwtToken();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await instance.post(url, data, { headers });
    
    console.log("JSON request successful:", {
      status: response.status,
      data: response.data
    });
    
    return response.data;
  } catch (error: any) {
    console.error("POST JSON request error:", error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
      
      // Create a more informative error object
      const apiError = new Error(
        error.response.data?.message || 
        error.response.data?.error || 
        `HTTP Error ${error.response.status}`
      ) as any;
      
      apiError.response = {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers,
      };
      
      // Include validation errors if available
      if (error.response.data?.errors) {
        apiError.validationErrors = error.response.data.errors;
      }
      
      throw apiError;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response received from server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

export const putJson = async (url: string, data: any) => {
  try {
    console.log("Sending PUT JSON request to:", url);
    console.log("Request data:", { 
      ...data, 
      photo: data.photo ? `[Base64 Image - ${data.photo.length} characters]` : 'No photo' 
    });
    
    // Create a new instance of axios for this request
    const instance = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
    });
    
    // Add auth token if available
    const token = await getAccessJwtToken();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await instance.put(url, data, { headers });
    
    console.log("PUT request successful:", {
      status: response.status,
      data: response.data
    });
    
    return response.data;
  } catch (error: any) {
    console.error("PUT request error:", error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
      
      // Create a more informative error object
      const apiError = new Error(
        error.response.data?.message || 
        error.response.data?.error || 
        `HTTP Error ${error.response.status}`
      ) as any;
      
      apiError.response = {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers,
      };
      
      // Include validation errors if available
      if (error.response.data?.errors) {
        apiError.validationErrors = error.response.data.errors;
      }
      
      throw apiError;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response received from server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

// Export the apiClient for use in Redux slices
export { apiClient };