import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    linkedAccountInfo: null,
}

const linkedAccountSlice = createSlice({
    name: 'linkedAccount',
    initialState,
    reducers: {
        setLinkedAccount: (state, action) => {
            state.linkedAccountInfo = action.payload.linkedAccountInfo;
        },
        clearLinkedAccount: (state) => {
            state.linkedAccountInfo = null;
        }
    }
});

export const {setLinkedAccount, clearLinkedAccount} = linkedAccountSlice.actions;
export default linkedAccountSlice.reducer;