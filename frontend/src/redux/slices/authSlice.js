import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      //localStorage.setItem('accessToken', action.payload.accessToken);
      document.cookie = `refreshToken=${action.payload.refreshToken}; path=/;`;
    },
    clearToken(state) {
      state.accessToken = null;
      state.refreshToken = null;

      //localStorage.removeItem('accessToken');
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },
    refeshAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
      //localStorage.setItem('accessToken', action.payload.accessToken);
    },
  },
});

export const { setToken, clearToken, refeshAccessToken } = authSlice.actions;

export const refreshAccessTokenAsync = () => async (dispatch) => {
  const API_LINK = import.meta.env.VITE_API_URL;
    const refreshToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('refreshToken='))
    ?.split('=')[1];

    if(!refreshToken){
        dispatch(clearToken());
        return false;
    }

    try {
        const response = await axios.post(`${API_LINK}/auth/refresh`, {refreshToken});
        const newAccessToken = response.data.data.accessToken;

        if( newAccessToken ) {
            dispatch(refeshAccessToken({ accessToken: newAccessToken}));
            return newAccessToken;
        }else{
            throw new Error("리프레시토큰 발급 실패");
        }
    }catch(error){
        console.log(error);
        dispatch(clearToken());
        return false;   
    }
};

export default authSlice.reducer;