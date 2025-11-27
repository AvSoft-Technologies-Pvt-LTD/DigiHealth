// store/slices/doctorSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient, get } from '../../services/apiServices';
import { API } from '../../config/api';

// Doctor data interface
export interface DoctorData {
  firstName: string;
  lastName: string;
  specialization: string;
  qualification: string;
  email: string;
  registrationNumber: string;
  totalPatients: number;
  opdPatients: number;
  ipdPatients: number;
  virtualPatients: number;
  totalRevenue: string;
}

interface DoctorState {
  doctorData: DoctorData | null;
  filteredDoctors: Doctor[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  doctorData: null,
  filteredDoctors: [],
  loading: false,
  error: null,
};

// Async thunk for fetching doctor data
export const fetchDoctorData = createAsyncThunk(
  'doctor/fetchDoctorData',
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await get(API.FETCH_DOCTOR_API + doctorId);
      console.log("DOCTOR RESPONSE",response)
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch doctor data'
      );
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setFilteredDoctors(state, action: PayloadAction<Doctor[]>) {
      state.filteredDoctors = action.payload;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch doctor data
      .addCase(fetchDoctorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorData.fulfilled, (state, action: PayloadAction<DoctorData>) => {
        state.loading = false;
        state.doctorData = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilteredDoctors, setLoading, setError } = doctorSlice.actions;
export default doctorSlice.reducer;
