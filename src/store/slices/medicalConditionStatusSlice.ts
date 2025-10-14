// src/store/slices/medicalConditionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MedicalCondition {
  conditionName: string;
  description: string;
  active: boolean;
  id?: string;
}

interface MedicalConditionState {
  conditions: MedicalCondition[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicalConditionState = {
  conditions: [], // Always initialized as an empty array
  loading: false,
  error: null,
};

const medicalConditionSlice = createSlice({
  name: 'medicalCondition',
  initialState,
  reducers: {
    fetchMedicalConditionsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMedicalConditionsSuccess(state, action: PayloadAction<MedicalCondition[]>) {
      state.loading = false;
      state.conditions = action.payload || []; // Fallback to empty array
      state.error = null;
    },
    fetchMedicalConditionsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.conditions = []; // Reset to empty array on failure
    },
    clearMedicalConditions(state) {
      state.conditions = [];
      state.error = null;
    },
  },
});

export const {
  fetchMedicalConditionsStart,
  fetchMedicalConditionsSuccess,
  fetchMedicalConditionsFailure,
  clearMedicalConditions,
} = medicalConditionSlice.actions;

export default medicalConditionSlice.reducer;
