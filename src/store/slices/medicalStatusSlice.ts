// src/store/slices/medicalStatusSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MedicalStatus {
  statusName: string;
  description: string;
  active: boolean;
  id?: string; // Optional, for existing statuses
}

interface MedicalStatusState {
  statuses: MedicalStatus[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicalStatusState = {
  statuses: [],
  loading: false,
  error: null,
};

const medicalStatusSlice = createSlice({
  name: 'medicalStatus',
  initialState,
  reducers: {
    /**
     * Starts the fetch process for medical statuses.
     */
    fetchMedicalStatusStart(state) {
      state.loading = true;
      state.error = null;
    },
    /**
     * Handles a successful fetch of medical statuses.
     */
    fetchMedicalStatusSuccess(state, action: PayloadAction<MedicalStatus[]>) {
      state.loading = false;
      state.statuses = action.payload;
      state.error = null;
    },
    /**
     * Handles a failed fetch of medical statuses.
     */
    fetchMedicalStatusFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.statuses = [];
    },
    /**
     * Clears the medical statuses from the state.
     */
    clearMedicalStatus(state) {
      state.statuses = [];
      state.error = null;
    },
  },
});

// Export the actions
export const {
  fetchMedicalStatusStart,
  fetchMedicalStatusSuccess,
  fetchMedicalStatusFailure,
  clearMedicalStatus,
} = medicalStatusSlice.actions;

// Export the reducer
export default medicalStatusSlice.reducer;
