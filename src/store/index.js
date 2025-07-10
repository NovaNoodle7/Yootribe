import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import dashboardSlice from './dashboardSlice';
import nftSlice from './nftSlice'
import campaignSlice from './campaignSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardSlice,
        campaigns: campaignSlice,
        nft: nftSlice,
    }
});

export default store;