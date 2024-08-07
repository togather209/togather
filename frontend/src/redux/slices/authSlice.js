import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_LINK = import.meta.env.VITE_API_URL;

export const refreshAccessTokenAsync = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try   {
      const response = await axios.post(`${API_LINK}/auth/refresh`, {}, { withCredentials: true });
      return response.data.data; // accessToken과 refreshToken을 반환한다고 가정
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    refreshToken: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessTokenAsync.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshAccessTokenAsync.rejected, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
