// src/redux/slices/updatePatientSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UpdatePatientState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UpdatePatientState = {
  loading: false,
  error: null,
  success: false,
};

const updatePatientSlice = createSlice({
  name: "updatePatient",
  initialState,
  reducers: {
    updatePatientStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    updatePatientSuccess(state) {
      state.loading = false;
      state.success = true;
    },
    updatePatientFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetUpdateState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
});

export const {
  updatePatientStart,
  updatePatientSuccess,
  updatePatientFailure,
  resetUpdateState,
} = updatePatientSlice.actions;

export default updatePatientSlice.reducer;
