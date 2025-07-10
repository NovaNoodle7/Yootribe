import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInitialNft } from './nftSlice';
import { toast } from 'react-toastify';
import { getInitialCounts } from './dashboardSlice';
import { ApiAxios } from '../api/Api';

export const getInitialCampaigns = createAsyncThunk(
  'campaign/get',
  async ({}, { getState, rejectWithValue }) => {
    try {
      const { data } = await ApiAxios.get(`/campaigns`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateFreshCampaigns = createAsyncThunk(
  'campaign/updateFreshCampaigns',
  async (campaigns, { dispatch }) => {
    await dispatch(getInitialCounts({}));

    return campaigns;
  }
);

export const getSuperUserCampaigns = createAsyncThunk(
  'campaign/get/superuser',
  async ({}, { getState, rejectWithValue }) => {
    try {
      const { data } = await ApiAxios.get(`/campaigns/superuser`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateSuperuserCampaigns = createAsyncThunk(
  'campaign/updateSuperuserCampaigns',
  async (campaigns, { dispatch }) => {
    await dispatch(getInitialCounts({}));

    return campaigns;
  }
);

export const deleteCampaign = createAsyncThunk(
  'campaign/delete',
  async ({ campaign, type }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { data } = await ApiAxios.delete(`/campaigns/${campaign._id}`);

      await dispatch(updateFreshCampaigns(data.campaigns));

      return {
        type,
        data
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateCampaign = createAsyncThunk(
  'campaign/update',
  async ({ campaign, type, rejectMessage }, { getState, rejectWithValue, dispatch }) => {
    try {
      if (type === 'draft') {
        const { data } = await ApiAxios.patch(
          `/campaigns/${campaign._id}`,
          {
            ...campaign
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        await dispatch(updateFreshCampaigns(data.campaigns));
        return data;
      }
      if (campaign.nft_id) {
        getInitialNft({});
      }
      if (type === 'adminApproval' && campaign.nft_id) {
        const { data } = await ApiAxios.patch(`/campaigns/${campaign._id}`, {
          ...campaign,
          status: 'adminApproval'
        });
        await dispatch(updateFreshCampaigns(data.campaigns));
        return data;
      }
      if (type === 'live' && campaign.nft_id) {
        const { data } = await ApiAxios.patch(`/campaigns/${campaign._id}`, {
          ...campaign,
          status: 'live',
          started_at: new Date()
        });
        await dispatch(updateFreshCampaigns(data.campaigns));
        return data;
      }
      if (type === 'cancel' && campaign.nft_id) {
        const { data } = await ApiAxios.patch(`/campaigns/${campaign._id}`, {
          ...campaign,
          status: 'draft',
          canceled_at: new Date()
        });
        await dispatch(updateFreshCampaigns(data.campaigns));
        return data;
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createCampaign = createAsyncThunk(
  'campaign/create',
  async ({ campaign }, { dispatch }) => {
    try {
      const { data } = await ApiAxios.post(`/campaigns`, campaign, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      await dispatch(updateFreshCampaigns(data.campaigns));

      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const approveCampaign = createAsyncThunk(
  'campaign/approve',
  async ({ campaign }, { dispatch, getState }) => {
    try {
      const { data } = await ApiAxios.post(`/campaigns/${campaign._id}/approve`, {
        id: campaign._id
      });
      await dispatch(updateSuperuserCampaigns(data.superuserCampaigns));
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const refuseCampaign = createAsyncThunk(
  'campaign/refuse',
  async ({ campaign, refusalMessage }, { dispatch, getState }) => {
    try {
      const { data } = await ApiAxios.post(`/campaigns/${campaign._id}/refuse`, {
        id: campaign._id,
        refusalMessage
      });
      await dispatch(updateSuperuserCampaigns(data.superuserCampaigns));
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

const campaignBuilder = (state, { payload }) => {
  const draftCampaigns = [];
  const adminApprovalCampaigns = [];
  const adminApprovedCampaigns = [];
  const adminRefusedCampaigns = [];
  const liveCampaigns = [];
  const finishedCampaigns = [];
  if (payload) {
    payload.forEach((campaign) => {
      if (campaign.status === 'draft') draftCampaigns.push(campaign);
      if (campaign.status === 'adminApproval') adminApprovalCampaigns.push(campaign);
      if (campaign.status === 'adminApproved') adminApprovedCampaigns.push(campaign);
      if (campaign.status === 'ready') adminApprovedCampaigns.push(campaign);
      if (campaign.status === 'adminRefused') adminRefusedCampaigns.push(campaign);
      if (campaign.status === 'live') liveCampaigns.push(campaign);
      if (campaign.status === 'finished' || campaign.status === 'ended') finishedCampaigns.push(campaign);
    });
  }
  state.draft = [
    ...adminApprovedCampaigns,
    ...adminRefusedCampaigns,
    ...adminApprovalCampaigns,
    ...draftCampaigns
  ];
  state.live = liveCampaigns;
  state.whitelisted = finishedCampaigns;
  state.totalCount = payload.length;
};

const CampaignSlice = createSlice({
  name: 'campaign',
  initialState: {
    draft: [],
    whitelisted: [],
    live: [],
    superUser: [],
    totalCount: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getInitialCampaigns.fulfilled, campaignBuilder);
    builder.addCase(updateFreshCampaigns.fulfilled, campaignBuilder);
    builder.addCase(getSuperUserCampaigns.fulfilled, (state, { payload }) => {
      state.superUser = payload;
      state.totalCount = payload.length;
    });
    builder.addCase(updateSuperuserCampaigns.fulfilled, (state, { payload }) => {
      state.superUser = payload;
      state.totalCount = payload.length;
    });
    builder.addCase(deleteCampaign.fulfilled, (state, { payload }) => {
      toast.success('Successfully deleted campaign!', {
        position: toast.POSITION.TOP_RIGHT
      });
    });
    builder.addCase(updateCampaign.fulfilled, (state, { payload }) => {
      console.log(state, payload);

      toast.success('Successfully updated campaign!', {
        position: toast.POSITION.TOP_RIGHT
      });
    });
  }
});

export default CampaignSlice.reducer;
