// redux/slices/meetingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],  // 모임 리스트를 저장할 상태
};

const meetingSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    setMeetings: (state, action) => {
      state.list = action.payload;  // 모임 리스트를 업데이트
    },
  },
});

export const { setMeetings } = meetingSlice.actions;
export default meetingSlice.reducer;
