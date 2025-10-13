import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PharmacyBill {
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  date: string ;
}

interface PharmacyBillingState {
  bills: PharmacyBill[];
  loading: boolean;
  error: string | null;
}

const initialState: PharmacyBillingState = {
  bills: [],
  loading: false,
  error: null,
};

const pharmacyBillingSlice = createSlice({
  name: 'pharmacyBilling',
  initialState,
  reducers: {
    fetchPharmacyBillingStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPharmacyBillingSuccess(state, action: PayloadAction<PharmacyBill[]>) {
      state.loading = false;
      state.bills = action.payload;
      state.error = null;
    },
    fetchPharmacyBillingFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.bills = [];
    },
  },
});

export const {
  fetchPharmacyBillingStart,
  fetchPharmacyBillingSuccess,
  fetchPharmacyBillingFailure,
} = pharmacyBillingSlice.actions;

export default pharmacyBillingSlice.reducer;
