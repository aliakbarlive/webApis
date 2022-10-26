import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchOneTimeAddons = createAsyncThunk(
  'upsells/oneTimeAddons',
  async () => {
    const response = await axios.get(
      `/agency/invoicing/list?operation=addons&status=ONETIME`
    );
    return response.data.data;
  }
);

export const upsellsSlice = createSlice({
  name: 'upsells',
  initialState: {
    currentPage: null,
    upsellsPaginationParams: {
      page: 1,
      pageSize: 30,
      search: '',
      sort: 'createdAt:asc',
      status: 'pending',
      client: '',
    },
    ordersPaginationParams: {
      page: 1,
      pageSize: 30,
      search: '',
      sort: 'createdAt:asc',
      status: 'pending',
      client: '',
    },
    itemsPaginationParams: {
      page: 1,
      pageSize: 30,
      search: '',
      sort: 'name:asc',
    },
    selectValue: null,
    addons: [],
  },

  reducers: {
    setCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    },
    setUpsellsPaginationParams: (state, action) => {
      state.upsellsPaginationParams = action.payload;
    },
    setOrdersPaginationParams: (state, action) => {
      state.ordersPaginationParams = action.payload;
    },
    setItemsPaginationParams: (state, action) => {
      state.itemsPaginationParams = action.payload;
    },
    setSelectValue: (state, action) => {
      state.selectValue = action.payload;
    },
  },
  extraReducers: {
    [fetchOneTimeAddons.fulfilled]: (state, { payload }) => {
      state.addons = payload;
    },
  },
});

export const {
  setCurrentPage,
  setUpsellsPaginationParams,
  setOrdersPaginationParams,
  setItemsPaginationParams,
  setSelectValue,
} = upsellsSlice.actions;

export default upsellsSlice.reducer;
