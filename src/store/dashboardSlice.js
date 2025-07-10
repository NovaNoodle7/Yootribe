import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiAxios } from '../api/Api';

export const getInitialCounts = createAsyncThunk(
  'dashboard/counts',
  async ({}, { getState, rejectWithValue }) => {
    const { auth } = getState();

    try {
      const { data } = await ApiAxios.get(`/dashboard/counts`, {
        params: {
          user_id: auth.value.user._id
        }
      });

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  counts: {
    campaigns: {
      draft: 0,
      live: 0,
      whitelisted: 0,
      total: 0
    },
    nfts: {
      draft: 0,
      live: 0,
      total: 0
    }
  }
};

const DashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getInitialCounts.fulfilled, (state, { payload }) => {
      state.counts = payload;
    });
  }
});

export default DashboardSlice.reducer;
