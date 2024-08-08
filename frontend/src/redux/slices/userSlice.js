import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  member: null,
  image: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.member = action.payload.member;
      state.image = action.payload.image;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.member = null;
      state.image = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
