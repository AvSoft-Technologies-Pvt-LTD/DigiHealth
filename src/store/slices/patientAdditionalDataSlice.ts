// src/store/slices/patientAdditionalDataSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Additional Details interface
export interface AdditionalDetails {
  id?: string;
  patientId: string;
  insuranceProvider?: string;
  policyNumber?: string;
  coverageAmount?: number;
  coverageType?: string;
  isPrimaryHolder?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
}

// Slice state interface
interface PatientAdditionalDataState {
  additionalDetails: AdditionalDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: PatientAdditionalDataState = {
  additionalDetails: null,
  loading: false,
  error: null,
};

const patientAdditionalDataSlice = createSlice({
  name: "patientAdditionalData",
  initialState,
  reducers: {
    // Fetch
    fetchPatientAdditionalDetailsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientAdditionalDetailsSuccess(
      state,
      action: PayloadAction<AdditionalDetails>
    ) {
      state.loading = false;
      state.additionalDetails = action.payload;
    },
    fetchPatientAdditionalDetailsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Save / Update
    savePatientAdditionalDetailsStart(state) {
      state.loading = true;
      state.error = null;
    },
    savePatientAdditionalDetailsSuccess(
      state,
      action: PayloadAction<AdditionalDetails>
    ) {
      state.loading = false;
      state.additionalDetails = action.payload;
    },
    savePatientAdditionalDetailsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Reset
    resetPatientAdditionalDetails(state) {
      state.additionalDetails = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchPatientAdditionalDetailsStart,
  fetchPatientAdditionalDetailsSuccess,
  fetchPatientAdditionalDetailsFailure,
  savePatientAdditionalDetailsStart,
  savePatientAdditionalDetailsSuccess,
  savePatientAdditionalDetailsFailure,
  resetPatientAdditionalDetails,
} = patientAdditionalDataSlice.actions;

export default patientAdditionalDataSlice.reducer;
