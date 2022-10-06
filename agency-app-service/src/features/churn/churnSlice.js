import { createSlice } from '@reduxjs/toolkit';

export const churnSlice = createSlice({
  name: 'churn',
  initialState: {
    currentPage: null,
  },
  reducers: {
    setCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    },
  },
});

export const { setCurrentPage } = churnSlice.actions;

export default churnSlice.reducer;
