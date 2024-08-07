import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    account: null,
}

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccount: (state , action) => {
            state.account = action.payload.account;
        },
        clearAccount: (state) => {
            state.account = null;
        },
    },
});

export const { setAccount, clearAccount } = accountSlice.actions;
export default accountSlice.reducer;