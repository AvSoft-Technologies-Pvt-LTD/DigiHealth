import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PatientBloodGroupState {
  patientBloodGroupData: any[]; // Replace 'any' with your patient data type
  loading: boolean;
  error: string | null;
}

const initialState: PatientBloodGroupState = {
  patientBloodGroupData: [],
  loading: false,
  error: null,
};

const patientBloodGroupSlice = createSlice({
  name: 'patientBloodGroup',
  initialState,
  reducers: {
    fetchPatientBloodGroupDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientBloodGroupDataSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.patientBloodGroupData = action.payload;
    },
    fetchPatientBloodGroupDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPatientBloodGroupDataStart,
  fetchPatientBloodGroupDataSuccess,
  fetchPatientBloodGroupDataFailure,
} = patientBloodGroupSlice.actions;

export default patientBloodGroupSlice.reducer;