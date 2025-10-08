import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PatientSettingState {
  patientSettingData: any[];
  photo: string | null;
  loading: boolean;
  photoLoading: boolean;
  error: string | null;
  photoError: string | null;
}

const initialState: PatientSettingState = {
  patientSettingData: [],
  photo: null,
  loading: false,
  photoLoading: false,
  error: null,
  photoError: null,
};

const patientSettingSlice = createSlice({
  name: 'patientSetting',
  initialState,
  reducers: {
    // Patient Setting Data
    fetchPatientSettingDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientSettingDataSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.patientSettingData = action.payload;
    },
    fetchPatientSettingDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Photo Actions
    getPatientPhotoStart(state) {
      state.photoLoading = true;
      state.photoError = null;
    },
    getPatientPhotoSuccess(state, action: PayloadAction<string>) {
      state.photoLoading = false;
      state.photo = action.payload;
    },
    getPatientPhotoFailure(state, action: PayloadAction<string>) {
      state.photoLoading = false;
      state.photoError = action.payload;
    },
    clearPatientPhoto(state) {
      state.photo = null;
      state.photoError = null;
    },
  },
});

export const {
  fetchPatientSettingDataStart,
  fetchPatientSettingDataSuccess,
  fetchPatientSettingDataFailure,
  getPatientPhotoStart,
  getPatientPhotoSuccess,
  getPatientPhotoFailure,
  clearPatientPhoto,
} = patientSettingSlice.actions;

export default patientSettingSlice.reducer;