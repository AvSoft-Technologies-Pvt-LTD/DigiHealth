// store/slices/doctorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DoctorState {
  filteredDoctors: Doctor[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  filteredDoctors: [],
  loading: false,
  error: null,
};

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
});

export const { setFilteredDoctors, setLoading, setError } = doctorSlice.actions;
export default doctorSlice.reducer;