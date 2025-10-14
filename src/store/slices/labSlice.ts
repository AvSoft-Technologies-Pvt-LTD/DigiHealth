import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LabItem {
  id: string;
  title: string;
  code?: string;
  description?: string;
  price?: number;
  type: "test" | "scan";
}

interface LabsState {
  labTestsData: LabItem[];
  labScansData: LabItem[];
  loadingTests: boolean;
  loadingScans: boolean;
  errorTests: string | null;
  errorScans: string | null;
}

const initialState: LabsState = {
  labTestsData: [],
  labScansData: [],
  loadingTests: false,
  loadingScans: false,
  errorTests: null,
  errorScans: null,
};

const labsSlice = createSlice({
  name: "labs",
  initialState,
  reducers: {
    // === LAB TESTS ===
    fetchLabTestsStart(state) {
      state.loadingTests = true;
      state.errorTests = null;
    },
    fetchLabTestsSuccess(state, action: PayloadAction<LabItem[]>) {
      state.loadingTests = false;
      state.labTestsData = action.payload;
    },
    fetchLabTestsFailure(state, action: PayloadAction<string>) {
      state.loadingTests = false;
      state.errorTests = action.payload;
    },
    // === LAB SCANS ===
    fetchLabScansStart(state) {
      state.loadingScans = true;
      state.errorScans = null;
    },
    fetchLabScansSuccess(state, action: PayloadAction<LabItem[]>) {
      state.loadingScans = false;
      state.labScansData = action.payload;
    },
    fetchLabScansFailure(state, action: PayloadAction<string>) {
      state.loadingScans = false;
      state.errorScans = action.payload;
    },
  },
});

export const {
  fetchLabTestsStart,
  fetchLabTestsSuccess,
  fetchLabTestsFailure,
  fetchLabScansStart,
  fetchLabScansSuccess,
  fetchLabScansFailure,
} = labsSlice.actions;

export default labsSlice.reducer;
