import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchInvoices = createAsyncThunk(
  'invoices/getInvoices',
  async (params, thunkAPI) => {
    const response = await axios.get(`/agency/invoice`, { params });
    thunkAPI.dispatch(setPaginationParams(params));
    return { data: response.data.data, params };
  }
);

export const fetchInvoice = createAsyncThunk(
  'invoices/getInvoice',
  async (id, thunkAPI) => {
    const response = await axios.get(`/agency/invoice/${id}`);
    return response.data.output.invoice;
  }
);

export const invoicesSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    invoice: null,
    loading: false,
    paginationParams: {
      page: 1,
      per_page: 25,
      sizePerPage: 25,
      status: 'All',
      subscriptionId: null,
    },
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPaginationParams: (state, action) => {
      state.paginationParams = action.payload;
    },
  },
  extraReducers: {
    [fetchInvoices.fulfilled]: (state, { payload }) => {
      state.invoices = payload.data;
    },
    [fetchInvoice.fulfilled]: (state, { payload }) => {
      state.invoice = payload;
    },
  },
});

export const { setLoading, setPaginationParams } = invoicesSlice.actions;

export default invoicesSlice.reducer;
