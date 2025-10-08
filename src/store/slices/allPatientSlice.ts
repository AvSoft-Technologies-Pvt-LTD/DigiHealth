import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Patient {
  id: string;
  email: string;
  // Add other patient properties here as needed
  [key: string]: any; // Temporary, replace with actual patient properties
}

// All Patients Slice
interface AllPatientState {
  allPatients: Patient[];
  loading: boolean;
  error: string | null;
}

const allPatientInitialState: AllPatientState = {
  allPatients: [],
  loading: false,
  error: null,
};

const allPatientSlice = createSlice({
  name: 'allPatient',
  initialState: allPatientInitialState,
  reducers: {
    fetchPatientsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientsSuccess(state, action: PayloadAction<Patient[]>) {
      state.loading = false;
      state.allPatients = action.payload;
    },
    fetchPatientsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Current Patient Slice
interface CurrentPatientState {
  currentPatient: Patient | null;
  loading: boolean;
  error: string | null;
}

const currentPatientInitialState: CurrentPatientState = {
  currentPatient: null,
  loading: false,
  error: null,
};

const currentPatientSlice = createSlice({
  name: 'currentPatient',
  initialState: currentPatientInitialState,
  reducers: {
    setCurrentPatient: (state, action: PayloadAction<Patient | null>) => {
      state.currentPatient = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentPatientLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCurrentPatientError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export all actions
export const {
  fetchPatientsStart,
  fetchPatientsSuccess,
  fetchPatientsFailure,
} = allPatientSlice.actions;

export const {
  setCurrentPatient,
  setCurrentPatientLoading,
  setCurrentPatientError,
  clearCurrentPatient,
} = currentPatientSlice.actions;

// Export the currentPatient reducer separately
export const currentPatientReducer = currentPatientSlice.reducer;

export default allPatientSlice.reducer;