import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    account: null,
}

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAcoount: (state , action) => {
            state.account = action.payload.account;
        },
        clearAccount: (state) => {
            state.account = null;
        },
    },
});

export const { setAcoount, clearAccount } = accountSlice.actions;
export default accountSlice.reducer;