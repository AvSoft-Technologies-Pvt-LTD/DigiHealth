import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RelationState {
  relationData: any[]; // Replace 'any' with your patient data type
  loading: boolean;
  error: string | null;
}

const initialState: RelationState = {
  relationData: [],
  loading: false,
  error: null,
};

const relationSlice = createSlice({
  name: 'relations',
  initialState,
  reducers: {
    fetchRelationDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRelationDataSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.relationData = action.payload;
    },
    fetchRelationDataFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchRelationDataStart,
  fetchRelationDataSuccess,
  fetchRelationDataFailure,
} = relationSlice.actions;

export default relationSlice.reducer;