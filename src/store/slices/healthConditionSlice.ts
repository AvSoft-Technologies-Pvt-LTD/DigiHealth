import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HealthConditionState {
  healthConditionData: any[]; // Replace 'any' with your patient data type
  loading: boolean;
  error: string | null;
}

const initialState: HealthConditionState = {
  healthConditionData: [],
  loading: false,
  error: null,
};

const healthConditionSlice = createSlice({
  name: 'healthConditions',
  initialState,
  reducers: {
    fetchHealthConditionDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchHealthConditionDataSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.healthConditionData = action.payload;
    },
    fetchHealthConditionDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchHealthConditionDataStart,
  fetchHealthConditionDataSuccess,
  fetchHealthConditionDataFailure,
} = healthConditionSlice.actions;

export default healthConditionSlice.reducer;