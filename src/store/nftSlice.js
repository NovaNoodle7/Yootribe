import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInitialCampaigns } from './campaignSlice';
import { toast } from 'react-toastify';
import { getInitialCounts } from './dashboardSlice';
import { ApiAxios } from '../api/Api';

export const getInitialNft = createAsyncThunk(
  'nft/get',
  async ({}, { getState, rejectWithValue }) => {
    try {
      const { data } = await ApiAxios.get('/nfts');
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateFreshNft = createAsyncThunk('nft/updateFreshNft', async (nfts, { dispatch }) => {
  await dispatch(getInitialCounts({}));

  return nfts;
});

export const deleteNFT = createAsyncThunk(
  'nft/delete',
  async (id, { getState, rejectWithValue, dispatch }) => {
    const { auth } = getState();
    try {
      const { data } = await ApiAxios.delete(`/nfts/${id}`);

      await dispatch(updateFreshNft(data.nfts));

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateNFT = createAsyncThunk(
  'nft/update',
  async (nft, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await ApiAxios.patch(`/nfts/${nft._id}`, nft, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createNFT = createAsyncThunk(
  'nft/create',
  async (nft, { rejectWithValue, getState, dispatch }) => {
    const { auth } = getState();
    try {
      const { data } = await ApiAxios.post(
        `/nfts`,
        {
          ...nft
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      await dispatch(updateFreshNft(data.nfts));

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addToCampaign = createAsyncThunk(
  'nft/add-to-campaign',
  async ({ campaignId, nftId }, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await ApiAxios.patch(`/nfts/${nftId}`, {
        status: 'ready',
        campaign_id: campaignId
      });
      await dispatch(updateFreshNft(data.nfts));
      await dispatch(getInitialCampaigns({}));
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeFromCampaign = createAsyncThunk(
  'nft/remove-from-campaign',
  async ({ campaignId, nftId }, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await ApiAxios.patch(`/nfts/${nftId}`, {
        status: 'ready',
        campaign_id: null
      });
      await dispatch(updateFreshNft(data.nfts));
      await dispatch(getInitialCampaigns({}));
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const NFTSlice = createSlice({
  name: 'nft',
  initialState: {
    nfts: [],
    totalCount: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getInitialNft.fulfilled, (state, { payload }) => {
      state.nfts = payload;
      state.totalCount = payload.length;
    });
    builder.addCase(updateFreshNft.fulfilled, (state, { payload }) => {
      state.nfts = payload;
      state.totalCount = payload.length;
    });
    builder.addCase(getInitialNft.rejected, ({ payload }) => {
      toast.error(payload?.error, {
        position: toast.POSITION.TOP_RIGHT
      });
    });
    builder.addCase(deleteNFT.fulfilled, (state, { payload }) => {
      toast.success(`Successfully deleted`, {
        position: toast.POSITION.TOP_RIGHT
      });
    });
    builder.addCase(deleteNFT.rejected, ({ payload }) => {
      toast.error(payload.error, {
        position: toast.POSITION.TOP_RIGHT
      });
    });
    builder.addCase(updateNFT.rejected, ({ payload }) => {
      toast.error(payload.error, {
        position: toast.POSITION.TOP_RIGHT
      });
    });
    builder.addCase(createNFT.rejected, ({ payload }) => {
      toast.error(payload.error, {
        position: toast.POSITION.TOP_RIGHT
      });
    });
    builder.addCase(addToCampaign.fulfilled, (state, { payload }) => {
      toast.success(`Successfully added to campaign`, {
        position: toast.POSITION.TOP_RIGHT
      });
    });
    builder.addCase(removeFromCampaign.fulfilled, (state, { payload }) => {
      toast.success(`Successfully removed from campaign`, {
        position: toast.POSITION.TOP_RIGHT
      });
    });
  }
});

export default NFTSlice.reducer;
