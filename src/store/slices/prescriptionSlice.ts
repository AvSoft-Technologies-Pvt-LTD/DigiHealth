import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// API returns date as an array like [2025, 10, 12]
export interface Prescription {
  id: number;
  date: string | number[]; // <-- changed from string to string | number[]
  doctorName: string;
  medicines: string;
  instructions: string;
  patientId: number;
}

interface PrescriptionState {
  prescriptionData: Prescription[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: PrescriptionState = {
  prescriptionData: null,
  loading: false,
  error: null,
};

const prescriptionSlice = createSlice({
  name: 'prescription',
  initialState,
  reducers: {
    fetchPrescriptionStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPrescriptionSuccess(state, action: PayloadAction<Prescription[]>) {
      state.loading = false;
      state.prescriptionData = action.payload;
      state.error = null;
    },
    fetchPrescriptionFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.prescriptionData = null;
      state.error = action.payload;
    },
    clearPrescriptionData(state) {
      state.prescriptionData = null;
      state.error = null;
    },
  },
});

export const {
  fetchPrescriptionStart,
  fetchPrescriptionSuccess,
  fetchPrescriptionFailure,
  clearPrescriptionData,
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;
