import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HospitalListState {
  hospitalListData: any[]; // Replace `any` with your hospital data type
  loading: boolean;
  error: string | null;
}

const initialState: HospitalListState = {
  hospitalListData: [],
  loading: false,
  error: null,
};

const hospitalListSlice = createSlice({
  name: 'hospitalList',
  initialState,
  reducers: {
    fetchHospitalListStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchHospitalListSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.hospitalListData = action.payload.map(hospital => ({
        label: hospital.hospitalName,
        value: hospital.id
      }));
    },

    fetchHospitalListFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchHospitalListStart,
  fetchHospitalListSuccess,
  fetchHospitalListFailure,
} = hospitalListSlice.actions;

export default hospitalListSlice.reducer;
