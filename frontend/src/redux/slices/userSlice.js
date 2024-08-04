import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  member: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.member = action.payload.member;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.member = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
