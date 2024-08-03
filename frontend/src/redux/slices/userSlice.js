import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    member: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action){//로그인 할 때 부를거
            state.isAuthenticated = true;
            state.member = action.payload.member;
            console.log(state.member);
        },
        clearUser(state){//로그아웃할 때 부를거
            state.isAuthenticated = false;
            state.member = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;