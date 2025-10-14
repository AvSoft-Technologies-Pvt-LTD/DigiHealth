import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FamilyMemberSlice {
  familyMemberData: any[]; // Replace 'any' with your patient data type
  loading: boolean;
  error: string | null;
}

const initialState: FamilyMemberSlice = {
  familyMemberData: [],
  loading: false,
  error: null,
};

const familyMemberSlice = createSlice({
  name: 'familyMembers',
  initialState,
  reducers: {
    fetchFamilyMemberDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchFamilyMemberDataSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.familyMemberData = action.payload;
    },
    fetchFamilyMemberDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchFamilyMemberDataStart,
  fetchFamilyMemberDataSuccess,
  fetchFamilyMemberDataFailure,
} = familyMemberSlice.actions;

export default familyMemberSlice.reducer;