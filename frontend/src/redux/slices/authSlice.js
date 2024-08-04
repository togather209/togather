import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_LINK = import.meta.env.VITE_API_URL;

export const refreshAccessTokenAsync = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_LINK}/auth/refresh`, {
        // refresh token or other needed data
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    refreshToken: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearToken: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  //추가 케이스 설정
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessTokenAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(refreshAccessTokenAsync.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.status = 'succeeded';
      })
      .addCase(refreshAccessTokenAsync.rejected, (state, action) => {
        state.accessToken = null;
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
