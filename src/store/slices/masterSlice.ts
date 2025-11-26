import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';

import { get } from '../../services/apiServices';
import { API } from '../../config/api';

// Input selectors - these just select the raw data
const selectGendersData = (state: { master: MasterState }) =>
  state.master.genders.data || [];
const selectPracticeTypesData = (state: { master: MasterState }) =>
  state.master.practiceTypes.data || [];
const selectHospitalsData = (state: { master: MasterState }) =>
  state.master.hospitals.data || [];
const selectSpecializationsData = (state: { master: MasterState }) =>
  state.master.specializations.data || [];

export interface MasterItem {
  id: number;
  practiceName: string;
  name: string;
  specializationName: string;
  hospitalName: string;
}

interface MasterState {
  genders: {
    data: MasterItem[];
    loading: boolean;
    error: string | null;
  };
  practiceTypes: {
    data: MasterItem[];
    loading: boolean;
    error: string | null;
  };
  specializations: {
    data: MasterItem[];
    loading: boolean;
    error: string | null;
  };
  hospitals: {
    data: MasterItem[];
    loading: boolean;
    error: string | null;
  };
}

const initialState: MasterState = {
  genders: {
    data: [],
    loading: false,
    error: null,
  },
  practiceTypes: {
    data: [],
    loading: false,
    error: null,
  },
  specializations: {
    data: [],
    loading: false,
    error: null,
  },
  hospitals: {
    data: [],
    loading: false,
    error: null,
  },
};

export const fetchGenders = createAsyncThunk(
  'master/fetchGenders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await get('/master/gender');
      return response || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch genders',
      );
    }
  },
);

export const fetchPracticeTypes = createAsyncThunk(
  'master/fetchPracticeTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await get('/master/practiceType');
      return response || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch practice types',
      );
    }
  },
);

export const fetchSpecializations = createAsyncThunk(
  'master/fetchSpecializations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await get(API.SPECIALIZATIONS_API);
      return response || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch Specializations',
      );
    }
  },
);

export const fetchHospitals = createAsyncThunk(
  'master/fetchHospitals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await get(API.HOSPITALS_API);
      return response || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch Hospitals',
      );
    }
  },
);

const masterSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Genders
    builder
      .addCase(fetchGenders.pending, state => {
        state.genders.loading = true;
        state.genders.error = null;
      })
      .addCase(fetchGenders.fulfilled, (state, action) => {
        state.genders.loading = false;
        state.genders.data = action.payload;
      })
      .addCase(fetchGenders.rejected, (state, action) => {
        state.genders.loading = false;
        state.genders.error = action.payload as string;
      })

      // Practice Types
      .addCase(fetchPracticeTypes.pending, state => {
        state.practiceTypes.loading = true;
        state.practiceTypes.error = null;
      })
      .addCase(fetchPracticeTypes.fulfilled, (state, action) => {
        state.practiceTypes.loading = false;
        state.practiceTypes.data = action.payload;
      })
      .addCase(fetchPracticeTypes.rejected, (state, action) => {
        state.practiceTypes.loading = false;
        state.practiceTypes.error = action.payload as string;
      })

      // Specializations
      .addCase(fetchSpecializations.pending, state => {
        state.specializations.loading = true;
        state.specializations.error = null;
      })
      .addCase(fetchSpecializations.fulfilled, (state, action) => {
        state.specializations.loading = false;
        state.specializations.data = action.payload;
      })
      .addCase(fetchSpecializations.rejected, (state, action) => {
        state.specializations.loading = false;
        state.specializations.error = action.payload as string;
      })

      // Hospitals
      .addCase(fetchHospitals.pending, state => {
        state.hospitals.loading = true;
        state.hospitals.error = null;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.hospitals.loading = false;
        state.hospitals.data = action.payload;
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.hospitals.loading = false;
        state.hospitals.error = action.payload as string;
      });
  },
});

export const selectFormattedGenders = createSelector(
  [selectGendersData],
  genders =>
    genders.map(item => ({
      label: item.name,
      value: item.id,
    })),
);

export const selectFormattedPracticeTypes = createSelector(
  [selectPracticeTypesData],
  practiceTypes =>
    practiceTypes.map(item => ({
      label: item.practiceName,
      value: item.id,
    })),
);

export const selectHospitals = createSelector(
  [selectHospitalsData],
  hospitals =>
    hospitals.map(item => ({
      label: item.hospitalName,
      value: item.id,
    })),
);

export const selectFormattedSpecializations = createSelector(
  [selectSpecializationsData],
  specializations =>
    specializations.map(item => ({
      label: item.specializationName,
      value: item.id,
    })),
);
export default masterSlice.reducer;
