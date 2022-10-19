import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const costManagerSlice = createSlice({
  name: 'costManager',
  initialState: { cogs: {} },
  reducers: {
    setCostManager: (state, action) => {
      state.cogs = action.payload;
    },
  },
});

export const { setCostManager } = costManagerSlice.actions;

export const getCostManagerAsync = (query) => async (dispatch) => {
  const { page, sizePerPage, sortField, sortOrder } = query;
  const params = {
    page,
    sizePerPage,
    sortField,
    sortOrder,
  };

  try {
    const res = await axios({
      method: 'get',
      url: '/sales-metrics/cogs',
      params,
    });
    dispatch(setCostManager(res.data.data));
  } catch (err) {
    console.log(err.message);
  }
};

export const selectCostManager = (state) => state.costManager;

export default costManagerSlice.reducer;
