import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LabBill {
  testName: string;
  cost: number;
  date: string;
  paymentStatus: string;
}

interface LabBillingState {
  bills: LabBill[];
  loading: boolean;
  error: string | null;
}

const initialState: LabBillingState = {
  bills: [],
  loading: false,
  error: null,
};

const labBillingSlice = createSlice({
  name: 'labBilling',
  initialState,
  reducers: {
    fetchLabBillingStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchLabBillingSuccess(state, action: PayloadAction<LabBill[]>) {
      state.loading = false;
      state.bills = action.payload;
      state.error = null;
    },
    fetchLabBillingFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.bills = [];
    },
    clearLabBillingData(state) {
      state.bills = [];
      state.error = null;
    },
  },
});

export const {
  fetchLabBillingStart,
  fetchLabBillingSuccess,
  fetchLabBillingFailure,
  clearLabBillingData,
} = labBillingSlice.actions;

export default labBillingSlice.reducer;
