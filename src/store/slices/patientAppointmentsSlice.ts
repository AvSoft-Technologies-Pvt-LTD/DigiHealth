// store/slices/ambulanceTypeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PateintAppointmentsState {
  appointmentsData: any[]; // You can replace 'any' with a specific type if available
  loading: boolean;
  error: string | null;
}

const initialState: PateintAppointmentsState = {
  appointmentsData: [],
  loading: false,
  error: null,
};

const appointmentsSlice = createSlice({
  name: 'patientAppointments',
  initialState,
  reducers: {
    fetchPatientAppointmentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientAppointmentsSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.appointmentsData = action.payload;
    },
    fetchPatientAppointmentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPatientAppointmentsStart,
  fetchPatientAppointmentsSuccess,
  fetchPatientAppointmentsFailure,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
