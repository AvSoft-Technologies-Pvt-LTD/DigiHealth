import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PatientDashboardState {
  patientDashboardData: any[]; // Replace 'any' with your patient data type
  loading: boolean;
  error: string | null;
}

const initialState: PatientDashboardState = {
  patientDashboardData: [],
  loading: false,
  error: null,
};

const patientDashboardSlice = createSlice({
  name: 'patientDashboard',
  initialState,
  reducers: {
    fetchPatientDashboardDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientDashboardDataSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.patientDashboardData = action.payload;
    },
    fetchPatientDashboardDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPatientDashboardDataStart,
  fetchPatientDashboardDataSuccess,
  fetchPatientDashboardDataFailure,
} = patientDashboardSlice.actions;

export default patientDashboardSlice.reducer;