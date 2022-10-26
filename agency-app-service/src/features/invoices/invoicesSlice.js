import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from 'features/alerts/alertsSlice';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const fetchInvoices = createAsyncThunk(
  'invoices/getInvoices',
  async (params, thunkAPI) => {
    const response = await axios.get(`/agency/invoice`, { params });
    thunkAPI.dispatch(setPaginationParams(params));
    return { data: response.data.data, params };
  }
);

export const invoicesSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    loading: false,
    paginationParams: {
      page: 1,
      sizePerPage: 25,
      status: 'Pending',
      subscriptionId: null,
    },
    currentPage: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPaginationParams: (state, action) => {
      state.paginationParams = action.payload;
    },
    setCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    },
  },
  extraReducers: {
    [fetchInvoices.fulfilled]: (state, { payload }) => {
      state.invoices = payload.data;
    },
  },
});

export const { setLoading, setPaginationParams, setCurrentPage } =
  invoicesSlice.actions;

export const bulkCollectCharge = (invoices) => async (dispatch) => {
  const body = JSON.stringify({ invoices });

  const res = await axios.post(`agency/invoice/bulkcollect`, body, config);
  dispatch(
    setAlert(
      'info',
      'Collect charge invoices pushed to the queue. Please refresh your browser in a few mins to verify the status'
    )
  );
  return res.data;
};

export const bulkEmail = (payload) => async (dispatch) => {
  const body = JSON.stringify({ payload });

  const res = await axios.post(`agency/invoice/bulkemail`, body, config);
  dispatch(
    setAlert(
      'info',
      'Email invoices pushed to the queue. They will be processed shortly'
    )
  );
  return res.data;
};

export default invoicesSlice.reducer;
