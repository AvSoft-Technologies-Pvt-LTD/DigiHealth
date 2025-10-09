// store/slices/ambulanceTypeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AmbulanceTypeState {
  ambulanceTypeData: any[]; // You can replace 'any' with a specific type if available
  loading: boolean;
  error: string | null;
}

const initialState: AmbulanceTypeState = {
  ambulanceTypeData: [],
  loading: false,
  error: null,
};

const ambulanceTypeSlice = createSlice({
  name: 'ambulanceType',
  initialState,
  reducers: {
    fetchAmbulanceTypeStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAmbulanceTypeSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.ambulanceTypeData = action.payload;
    },
    fetchAmbulanceTypeFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAmbulanceTypeStart,
  fetchAmbulanceTypeSuccess,
  fetchAmbulanceTypeFailure,
} = ambulanceTypeSlice.actions;

export default ambulanceTypeSlice.reducer;
