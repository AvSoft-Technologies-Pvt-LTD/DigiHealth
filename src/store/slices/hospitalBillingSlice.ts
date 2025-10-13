import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HospitalBill {
  billType: string;
  amount: number;
  paymentMode: string;
  status: string;
  billDate: string;
}

interface HospitalBillingState {
  bills: HospitalBill[];
  loading: boolean;
  error: string | null;
}

const initialState: HospitalBillingState = {
  bills: [],
  loading: false,
  error: null,
};

const hospitalBillingSlice = createSlice({
  name: 'hospitalBilling',
  initialState,
  reducers: {
    fetchHospitalBillingStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchHospitalBillingSuccess(state, action: PayloadAction<HospitalBill[]>) {
      state.loading = false;
      state.bills = action.payload;
      state.error = null;
    },
    fetchHospitalBillingFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.bills = [];
    },
    clearHospitalBillingData(state) {
      state.bills = [];
      state.error = null;
    },
  },
});

export const {
  fetchHospitalBillingStart,
  fetchHospitalBillingSuccess,
  fetchHospitalBillingFailure,
  clearHospitalBillingData,
} = hospitalBillingSlice.actions;

export default hospitalBillingSlice.reducer;
