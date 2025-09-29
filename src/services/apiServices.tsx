import axios from "axios";
import {  BASE_URL } from "../config/api";
import StorageService from "./storageService";

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
export const get = async (url: string, params?: object) => {
  const token = await getAccessJwtToken();
  try {
    const response = await apiClient.get(url, { params ,headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.error("GET request error:", error);
    throw error;
  }
};

export const post = async <T = any>(url: string, data: object): Promise<T> => {
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
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
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