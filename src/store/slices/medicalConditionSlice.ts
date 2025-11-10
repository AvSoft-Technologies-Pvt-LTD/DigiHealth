import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MedicalConditionState {
  medicalConditionData: any[]; // Replace 'any' with your patient data type
  loading: boolean;
  error: string | null;
}

const initialState: MedicalConditionState = {
  medicalConditionData: [],
  loading: false,
  error: null,
};

const medicalConditionSlice = createSlice({
  name: 'medicalCondition',
  initialState,
  reducers: {
    fetchMedicalConditionDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMedicalConditionDataSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.medicalConditionData = action.payload.map(medical => ({
        label: medical.conditionName,
        value: medical.id,
      }));
    },  
    fetchMedicalConditionDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchMedicalConditionDataStart,
  fetchMedicalConditionDataSuccess,
  fetchMedicalConditionDataFailure,
} = medicalConditionSlice.actions;

export default medicalConditionSlice.reducer;