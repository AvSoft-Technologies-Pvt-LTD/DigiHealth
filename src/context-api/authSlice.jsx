import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

const BASE_URL = 'http://localhost:8080/api/auth';
const MOCK_OTP = "123456";

// Helper function to simulate API delay
const mockApiDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

// Register User (unchanged)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const userType = formData.get('userType');
      if (!userType) {
        return rejectWithValue('User type is required');
      }
      const endpoint = `${BASE_URL}/${userType}/register`;
      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        ...response.data,
        userType,
        phone: formData.get('phone'),
        email: formData.get('email')
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Registration failed. Please try again.'
      );
    }
  }
);

// Login with Identifier & Password (unchanged)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/login`, {
        identifier,
        password
      });

      const userData = response.data;
      const normalizedUserType = userData.role ? userData.role.toLowerCase() : null;

      const userWithToken = {
        ...userData,
        userType: normalizedUserType,
        role: userData.role,
        identifier: userData.identifier || identifier,
        isAuthenticated: true
      };

      localStorage.setItem('user', JSON.stringify(userWithToken));
      localStorage.setItem('token', userWithToken.token);
      localStorage.setItem('identifier', identifier);

      return userWithToken;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed. Please check your credentials.'
      );
    }
  }
);

// Mock Send Registration OTP
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (identifier, { rejectWithValue }) => {
    try {
      await mockApiDelay();
      console.log(`[MOCK] OTP sent to ${identifier}. Use "${MOCK_OTP}" for verification.`);

      return {
        success: true,
        message: "OTP sent successfully",
        data: {
          sent: true,
          identifier: identifier,
          otpSentAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return rejectWithValue('Failed to send OTP');
    }
  }
);

// Mock Send Login OTP
export const sendLoginOTP = createAsyncThunk(
  'auth/sendLoginOTP',
  async (identifier, { rejectWithValue }) => {
    try {
      await mockApiDelay();
      console.log(`[MOCK] Login OTP sent to ${identifier}. Use "${MOCK_OTP}" for verification.`);

      return {
        success: true,
        message: "Login OTP sent successfully",
        data: {
          sent: true,
          identifier: identifier,
          otpSentAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return rejectWithValue('Failed to send login OTP');
    }
  }
);

// Mock Verify OTP
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ identifier, otp, type, registrationData }, { rejectWithValue }) => {
    try {
      await mockApiDelay();

      if (otp !== MOCK_OTP) {
        return rejectWithValue(`Invalid OTP. Please use "${MOCK_OTP}" for testing.`);
      }

      // Create mock user data based on registration data
      const isEmail = identifier.includes('@');
      const mockUser = {
        id: `mock-${Math.random().toString(36).substring(2, 9)}`,
        name: registrationData?.get('name') || "Test User",
        email: isEmail ? identifier : registrationData?.get('email'),
        phone: !isEmail ? identifier : registrationData?.get('phone'),
        role: registrationData?.get('userType')?.toUpperCase() || "USER",
        userType: registrationData?.get('userType')?.toLowerCase() || "user",
        token: `mock-token-${Math.random().toString(36).substring(2, 15)}`,
        isVerified: true,
        isAuthenticated: true,
        identifier: identifier
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockUser.token);
      localStorage.setItem('identifier', identifier);

      console.log('[MOCK] OTP verification successful. User data:', mockUser);
      return mockUser;
    } catch (error) {
      return rejectWithValue(
        error.message || 'OTP verification failed'
      );
    }
  }
);

// Get user profile (unchanged)
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/profile`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch user profile'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
    isOTPSent: false,
    isVerified: false,
    isAuthenticated: !!localStorage.getItem('token'),
    userType: JSON.parse(localStorage.getItem('user'))?.userType || null,
    registrationData: null,
    token: localStorage.getItem('token') || null,
    mockOTP: MOCK_OTP // Store mock OTP in state for reference
  },
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.isOTPSent = false;
      state.isVerified = false;
      state.isAuthenticated = false;
      state.user = null;
      state.registrationData = null;
      state.token = null;
      state.userType = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.userType = action.payload.userType;
      state.token = action.payload.token;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.userType = null;
      state.registrationData = null;
      state.token = null;
      state.isVerified = false;
      state.isOTPSent = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('identifier');
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      if (user && token) {
        const normalizedUserType = user.role ? user.role.toLowerCase() : user.userType;
        state.user = { ...user, userType: normalizedUserType };
        state.token = token;
        state.userType = normalizedUserType;
        state.isAuthenticated = true;
        state.isVerified = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationData = action.payload;
        state.userType = action.payload.userType;
        state.isOTPSent = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.userType = action.payload.userType;
        state.isVerified = true;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send OTP cases
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
        state.isOTPSent = true;
        state.error = null;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isOTPSent = false;
      })
      // Send Login OTP cases
      .addCase(sendLoginOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginOTP.fulfilled, (state) => {
        state.loading = false;
        state.isOTPSent = true;
        state.error = null;
      })
      .addCase(sendLoginOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isOTPSent = false;
      })
      // Verify OTP cases
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.userType = action.payload.userType;
        state.isVerified = true;
        state.isAuthenticated = true;
        state.registrationData = null;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isVerified = false;
      })
      // Get User Profile cases
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetAuthState,
  setUser,
  setUserType,
  logout,
  clearError,
  initializeAuth
} = authSlice.actions;

export default authSlice.reducer;