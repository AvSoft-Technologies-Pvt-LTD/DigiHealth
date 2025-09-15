import axios from "axios";
import { API, BASE_URL } from "../config/api";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Set timeout for requests
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
    return null;
  } catch (error) {
    console.error("Error fetching JWT token:", error);
    return null;
  }
};

// Utility functions for API calls
export const get = async (url: string, params?: object) => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("GET request error:", error);
    throw error;
  }
};

export const post = async (url: string, data: object) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

export const put = async (url: string, data: object) => {
  try {
    const response = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    console.error("PUT request error:", error);
    throw error;
  }
};

export const plainDelete = async (url: string) => {
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error;
  }
};

export const patch = async (url: string, data: object) => {
  try {
    const response = await apiClient.patch(url, data);
    return response.data;
  } catch (error) {
    console.error("PATCH request error:", error);
    throw error;
  }
};

export const postFormData = async (url: string, formData: FormData) => {
  try {
    const response = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("POST FormData request error:", error);
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