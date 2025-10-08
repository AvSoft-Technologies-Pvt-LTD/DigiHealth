import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CoverageItem {
  id?: string;
  name: string;
  type: string;
  description?: string;
  status?: string;
}

interface CoverageState {
  coverageData: CoverageItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CoverageState = {
  coverageData: [],
  loading: false,
  error: null,
};

const coverageSlice = createSlice({
  name: 'coverage',
  initialState,
  reducers: {
    // === SAVE ===
    saveCoverageDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    saveCoverageDataSuccess(state, action: PayloadAction<CoverageItem[]>) {
      state.loading = false;
      state.coverageData = action.payload;
    },
    saveCoverageDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // === FETCH ===
    fetchCoverageDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCoverageDataSuccess(state, action: PayloadAction<CoverageItem[]>) {
      state.loading = false;
      state.coverageData = action.payload;
    },
    fetchCoverageDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  saveCoverageDataStart,
  saveCoverageDataSuccess,
  saveCoverageDataFailure,
  fetchCoverageDataStart,
  fetchCoverageDataSuccess,
  fetchCoverageDataFailure,
} = coverageSlice.actions;

export default coverageSlice.reducer;
