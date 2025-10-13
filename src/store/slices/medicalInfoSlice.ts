import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MedicalInfo {
  userId: number;
  chiefComplaint: string;
  pastHistory: string;
  advice: string;
  plan: string;
  uploadedBy: string;
  documentUrl: string;
  diagnosis: string;
  treatmentGiven: string;
  doctorNotes: string;
  initialAssessment: string;
  systematicExamination: string;
  investigations: string;
  treatmentAdvice: string;
  dischargeSummary: string;
}

interface MedicalInfoState {
  medicalInfoData: MedicalInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: MedicalInfoState = {
  medicalInfoData: null,
  loading: false,
  error: null,
};

const medicalInfoSlice = createSlice({
  name: 'medicalInfo',
  initialState,
  reducers: {
    fetchMedicalInfoStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMedicalInfoSuccess(state, action: PayloadAction<MedicalInfo>) {
      state.loading = false;
      state.medicalInfoData = action.payload;
      state.error = null;
    },
    fetchMedicalInfoFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.medicalInfoData = null;
    },
    clearMedicalInfoData(state) {
      state.medicalInfoData = null;
      state.error = null;
    },
  },
});

export const {
  fetchMedicalInfoStart,
  fetchMedicalInfoSuccess,
  fetchMedicalInfoFailure,
  clearMedicalInfoData,
} = medicalInfoSlice.actions;

export default medicalInfoSlice.reducer;











