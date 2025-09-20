import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatItem, Feature, Benefit } from '../../constants/data';

interface HomeState {
  stats: StatItem[];
  features: Feature[];
  benefits: Benefit[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  stats: [],
  features: [],
  benefits: [],
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error message
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Set home data
    setHomeData: (state, action: PayloadAction<{
      stats: StatItem[];
      features: Feature[];
      benefits: Benefit[];
    }>) => {
      const { stats, features, benefits } = action.payload;
      state.stats = stats;
      state.features = features;
      state.benefits = benefits;
      state.loading = false;
      state.error = null;
    },
    
    // Update stats
    updateStats: (state, action: PayloadAction<StatItem[]>) => {
      state.stats = action.payload;
    },
    
    // Update features
    updateFeatures: (state, action: PayloadAction<Feature[]>) => {
      state.features = action.payload;
    },
    
    // Update benefits
    updateBenefits: (state, action: PayloadAction<Benefit[]>) => {
      state.benefits = action.payload;
    },
    
    // Reset home state
    resetHomeState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setHomeData,
  updateStats,
  updateFeatures,
  updateBenefits,
  resetHomeState,
} = homeSlice.actions;

export default homeSlice.reducer;

// Selectors
export const selectHomeLoading = (state: { home: HomeState }) => state.home.loading;
export const selectHomeError = (state: { home: HomeState }) => state.home.error;
export const selectStats = (state: { home: HomeState }) => state.home.stats;
export const selectFeatures = (state: { home: HomeState }) => state.home.features;
export const selectBenefits = (state: { home: HomeState }) => state.home.benefits;
