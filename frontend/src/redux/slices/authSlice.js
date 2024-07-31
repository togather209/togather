import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

const initialState = {
  isAuthenticated: false,
  member: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.member = action.payload.member;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      localStorage.getItem('accessToken', action.payload.accessToken);
      document.cookie = `refreshToken=${action.payload.refreshToken}; path=/;`;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.member = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem('accessToken');
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },
    refeshAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
  },
});

export const { loginSuccess, logout, refeshAccessToken } = authSlice.actions;

export const refreshAccessTokenAsync = () => async (dispatch, getState) => {
    const refreshToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('refreshToken='))
    ?.split('=')[1];

    if(!refreshToken){
        dispatch(logout());
        return false;
    }

    try {
        const response = await axios.post('http://localhost:8080/auth/refresh', {refreshToken});
        const newAccessToken = response.data.accessToken;

        if( newAccessToken ) {
            dispatch(refeshAccessToken({ accessToken: newAccessToken}));
            return true;
        }else{
            throw new Error("리프레시토큰 발급 실패");
        }
    }catch(error){
        console.log(error);
        dispatch(logout());
        return false
    }
};

export default authSlice.reducer;