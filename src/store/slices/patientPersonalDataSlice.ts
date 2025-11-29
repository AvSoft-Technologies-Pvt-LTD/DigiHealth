import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PatientPersonalData {
  bloodGroupId?: number;
  bloodGroupName?: string;
  height?: number;
  weight?: number;
  surgeries?: string;
  allergies?: string;
  allergyIds?: number[];
  surgeryIds?: number[];
  allergyNames?: string[];
  surgeryNames?: string[];
  allergySinceYears?: number;
  surgerySinceYears?: number;
  isAlcoholic?: boolean;
  isSmoker?: boolean;
  isTobacco?: boolean;
  yearsAlcoholic?: number;
  yearsSmoking?: number;
  yearsTobacco?: number;
  // ... other fields
}

interface PatientPersonalDataState {
  patientPersonalData: PatientPersonalData[]; // Replace 'any' with your patient data type
  loading: boolean;
  error: string | null;
}


const initialState: PatientPersonalDataState = {
  patientPersonalData: [],
  loading: false,
  error: null,
};

const patientPersonalDataSlice = createSlice({
  name: 'patientPersonalData',
  initialState,
  reducers: {
    fetchPatientPersonalDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientPersonalDataSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.patientPersonalData = action.payload;
    },
    fetchPatientPersonalDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPatientPersonalDataStart,
  fetchPatientPersonalDataSuccess,
  fetchPatientPersonalDataFailure,
} = patientPersonalDataSlice.actions;

export default patientPersonalDataSlice.reducer;