import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AllPatientState {
  allPatients: any[]; // Replace 'any' with your patient data type
  loading: boolean;
  error: string | null;
}

const initialState: AllPatientState = {
  allPatients: [],
  loading: false,
  error: null,
};

const allPatientSlice = createSlice({
  name: 'allPatient',
  initialState,
  reducers: {
    fetchPatientsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientsSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.allPatients = action.payload;
    },
    fetchPatientsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPatientsStart,
  fetchPatientsSuccess,
  fetchPatientsFailure,
} = allPatientSlice.actions;

export default allPatientSlice.reducer;