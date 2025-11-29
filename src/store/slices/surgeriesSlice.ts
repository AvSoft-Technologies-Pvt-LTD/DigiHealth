import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SurgeriesState {
  surgeriesData: any[]; // Replace `any` with your hospital data type
  loading: boolean;
  error: string | null;
}

const initialState: SurgeriesState = {
  surgeriesData: [],
  loading: false,
  error: null,
};

const surgeriesSlice = createSlice({
  name: 'surgeries',
  initialState,
  reducers: {
    fetchSurgeriesDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSurgeriesDataSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.surgeriesData = action.payload;
    },

    fetchSurgeriesDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSurgeriesDataStart,
  fetchSurgeriesDataSuccess,
  fetchSurgeriesDataFailure,
} = surgeriesSlice.actions;

export default surgeriesSlice.reducer;
