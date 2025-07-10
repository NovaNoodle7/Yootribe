import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAuthUser as getAuthUserApi } from '../api';

const getToken = localStorage.getItem('token');

export const getAuthUser = createAsyncThunk('auth/get-user', async ({ callback }, { rejectWithValue }) => {
  try {
    const { user } = await getAuthUserApi()
      .then((res) => {
        if (callback) {
          callback();
        }

        return res;
      })
      .catch(() => {
        if (callback) {
          callback();
        }
      });

    return user;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    value: {
      user: null,
      token: getToken ? getToken : null,
    },
  },
  reducers: {
    logout: (state) => {
      state.value = {
        user: null,
        token: null,
      };

      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    },
    login: (state, action) => {
      state.value = {
        token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
        ...(action?.payload?.user && { user: action?.payload?.user }),
      };
    },
    updateUser: (state, action) => {
      state.value = {
        ...state.value,
        user: { ...state.value.user, ...action.payload },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAuthUser.fulfilled, (state, { payload }) => {
      state.value.user = payload;
    });
  },
});

export const { login, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;
