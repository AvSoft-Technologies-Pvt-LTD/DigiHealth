import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Pharmacy {
  id: string | number;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  hours?: string;
}

interface PharmacyState {
  pharmacyListData: Pharmacy[];
  pharmacyDetails: Pharmacy | null;
  loading: boolean;
  error: string | null;
}

const initialState: PharmacyState = {
  pharmacyListData: [],
  pharmacyDetails: null,
  loading: false,
  error: null,
};

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {
    fetchPharmacyListStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPharmacyListSuccess(state, action: PayloadAction<Pharmacy[]>) {
      state.loading = false;
      state.pharmacyListData = action.payload;
    },
    fetchPharmacyListFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createPharmacyStart(state) {
      state.loading = true;
      state.error = null;
    },
    createPharmacySuccess(state, action: PayloadAction<Pharmacy>) {
      state.loading = false;
      state.pharmacyListData.push(action.payload);
    },
    createPharmacyFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPharmacyListStart,
  fetchPharmacyListSuccess,
  fetchPharmacyListFailure,
  createPharmacyStart,
  createPharmacySuccess,
  createPharmacyFailure,
} = pharmacySlice.actions;

export default pharmacySlice.reducer;
