import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VitalData {
  temperature?: number;
  spo2?: number;
  blood_pressure?: string;
  heart_rate?: number;
  respiratory_rate?: number;
  blood_sugar?: number;
}

interface HealthSummaryState {
  healthSummaryData: VitalData | null;
  loading: boolean;
  error: string | null;
}

const initialState: HealthSummaryState = {
  healthSummaryData: null,
  loading: false,
  error: null,
};

const normalizeVitalData = (data: any): VitalData => {
  return {
    temperature: data.temperature || data.temp,
    spo2: data.spo2 || data.oxygenSaturation,
    blood_pressure: data.bloodPressure || data.bp,
    heart_rate: data.heartRate || data.pulse,
    respiratory_rate: data.respiratoryRate || data.rr,
    blood_sugar: data.bloodSugar || data.glucose,
  };
};

const healthSummarySlice = createSlice({
  name: 'healthSummaryData',
  initialState,
  reducers: {
    fetchHealthSummaryDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchHealthSummaryDataSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      const apiData = action.payload.data || action.payload;
      state.healthSummaryData = normalizeVitalData(apiData);
      state.error = null;
    },
    fetchHealthSummaryDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.healthSummaryData = null;
    },
    clearHealthSummaryData(state) {
      state.healthSummaryData = null;
      state.error = null;
    },
  },
});

export const {
  fetchHealthSummaryDataStart,
  fetchHealthSummaryDataSuccess,
  fetchHealthSummaryDataFailure,
  clearHealthSummaryData,
} = healthSummarySlice.actions;

export default healthSummarySlice.reducer;
