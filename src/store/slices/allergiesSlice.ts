import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AllergiesState {
  allergiesData: any[]; // Replace `any` with your hospital data type
  loading: boolean;
  error: string | null;
}

const initialState: AllergiesState = {
  allergiesData: [],
  loading: false,
  error: null,
};

const allergiesSlice = createSlice({
  name: 'allergies',
  initialState,
  reducers: {
    fetchAllergiesDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAllergiesDataSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.allergiesData = action.payload;
    },

    fetchAllergiesDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAllergiesDataStart,
  fetchAllergiesDataSuccess,
  fetchAllergiesDataFailure,
} = allergiesSlice.actions;

export default allergiesSlice.reducer;
