import { createSlice } from "@reduxjs/toolkit";

//redux 함수를 정의 
export const counterSlice = createSlice({
    name : 'counter',
    initialState: {
        value: 0,
    },
    reducers: {
        increment: state => {
            state.value += 1;
        },
        decrement: state => {
            state.value -= 1;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        },
    },
});

//선언해야 다른데서 사용가능하고...
export const {increment, decrement, incrementByAmount} = counterSlice.actions;

//리듀서를 밖으로 
export default counterSlice.reducer;