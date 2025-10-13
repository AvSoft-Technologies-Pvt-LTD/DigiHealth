import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LabScan {
  date: string | number[];
  testName: string;
  result: string;
  normalRange: string;
  status: string;
}

interface LabScanState {
  labScanData: LabScan[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: LabScanState = {
  labScanData: null,
  loading: false,
  error: null,
};

const labScanSlice = createSlice({
  name: 'labScan',
  initialState,
  reducers: {
    fetchLabScanStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchLabScanSuccess(state, action: PayloadAction<LabScan[]>) {
      state.loading = false;
      state.labScanData = action.payload;
      state.error = null;
    },
    fetchLabScanFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.labScanData = null;
    },
    clearLabScanData(state) {
      state.labScanData = null;
      state.error = null;
    },
  },
});

export const {
  fetchLabScanStart,
  fetchLabScanSuccess,
  fetchLabScanFailure,
  clearLabScanData,
} = labScanSlice.actions;

export default labScanSlice.reducer;
