import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description?: string;
  // add other fields from API response if needed
}

interface PlansState {
  plansData: Plan[];
  loading: boolean;
  error: string | null;
}

const initialState: PlansState = {
  plansData: [],
  loading: false,
  error: null,
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    fetchPlansStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPlansSuccess(state, action: PayloadAction<Plan[]>) {
      state.loading = false;
      state.plansData = action.payload;
    },
    fetchPlansFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Optional: if you want to support creating new plans
    createPlanStart(state) {
      state.loading = true;
      state.error = null;
    },
    createPlanSuccess(state, action: PayloadAction<Plan>) {
      state.loading = false;
      state.plansData.push(action.payload);
    },
    createPlanFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPlansStart,
  fetchPlansSuccess,
  fetchPlansFailure,
  createPlanStart,
  createPlanSuccess,
  createPlanFailure,
} = plansSlice.actions;

export default plansSlice.reducer;
