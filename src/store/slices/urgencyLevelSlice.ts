import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UrgencyLevel {
  urgencyTiming: string;
  description: string;
}

interface UrgencyLevelState {
  urgencyLevels: UrgencyLevel[];
  loading: boolean;
  error: string | null;
}

const initialState: UrgencyLevelState = {
  urgencyLevels: [],
  loading: false,
  error: null,
};

const urgencyLevelSlice = createSlice({
  name: 'urgencyLevel',
  initialState,
  reducers: {
    fetchUrgencyLevelsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUrgencyLevelsSuccess(state, action: PayloadAction<UrgencyLevel[]>) {
      state.loading = false;
      state.urgencyLevels = action.payload;
      state.error = null;
    },
    fetchUrgencyLevelsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.urgencyLevels = [];
    },
    clearUrgencyLevels(state) {
      state.urgencyLevels = [];
      state.error = null;
    },
  },
});

export const {
  fetchUrgencyLevelsStart,
  fetchUrgencyLevelsSuccess,
  fetchUrgencyLevelsFailure,
  clearUrgencyLevels,
} = urgencyLevelSlice.actions;

export default urgencyLevelSlice.reducer;
