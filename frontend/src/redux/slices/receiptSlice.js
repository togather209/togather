import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "design", // 기본값 design
  color: 0, // 기본값 0
  businessName: null,
  paymentDate: null,
  items: [],
  totalPrice: 0,
  bookmarkId: null,
};

const receiptSlice = createSlice({
  name: "receipt",
  initialState,
  reducers: {
    setReceiptData: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateReceiptItem: (state, action) => {
      const { index, item } = action.payload;
      state.items[index] = item;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    resetReceipt: () => initialState,
  },
});

export const { setReceiptData, updateReceiptItem, setActiveTab, resetReceipt } =
  receiptSlice.actions;
export default receiptSlice.reducer;
