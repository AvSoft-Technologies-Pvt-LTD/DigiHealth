import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get } from "../../services/apiServices";

export const fetchPracticeTypes = createAsyncThunk(
  'practiceTypes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await get('/api/practice-types');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch practice types');
    }
  }
);

export const practiceTypeSlice = createSlice({
  name: 'practiceTypes',
  initialState: {
    data: [],
    loading: false,
    error: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPracticeTypes.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchPracticeTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPracticeTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});
