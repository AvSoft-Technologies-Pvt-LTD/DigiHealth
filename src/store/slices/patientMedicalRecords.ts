import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PatientMedicalRecords {
  id?: string;
  name: string;
  type: string;
  description?: string;
  status?: string;
}

interface PatientMedicalRecordsState {
  patientMedicalRecordsData: PatientMedicalRecords[];
  loading: boolean;
  error: string | null;
}

const initialState: PatientMedicalRecordsState = {
  patientMedicalRecordsData: [],
  loading: false,
  error: null,
};

const coverageSlice = createSlice({
  name: 'patientMedicalRecords',
  initialState,
  reducers: {
    // === SAVE ===
    savePatientMedicalRecordsDataStart(state) {
      state.loading = true;
      state.error = null;
     },
    savePatientMedicalRecordsDataSuccess(state, action: PayloadAction<PatientMedicalRecords[]>) {
      state.loading = false;
      state.patientMedicalRecordsData = action.payload;
    },
    savePatientMedicalRecordsDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // === FETCH ===
    fetchPatientMedicalRecordsDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientMedicalRecordsDataSuccess(state, action: PayloadAction<PatientMedicalRecords[]>) {
      state.loading = false;
      state.patientMedicalRecordsData = action.payload;
    },
    fetchPatientMedicalRecordsDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  savePatientMedicalRecordsDataStart,
  savePatientMedicalRecordsDataSuccess,
  savePatientMedicalRecordsDataFailure,
  fetchPatientMedicalRecordsDataStart,
  fetchPatientMedicalRecordsDataSuccess,
  fetchPatientMedicalRecordsDataFailure,
} = coverageSlice.actions;

export default coverageSlice.reducer;
