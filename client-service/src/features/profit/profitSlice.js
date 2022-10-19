import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { setAlert } from '../alert/alertSlice';

export const profitSlice = createSlice({
  name: 'profit',
  initialState: {
    trendAnalysis: {},
    keyMetrics: {},
    profitBreakdown: {},
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setKeyMetrics: (state, action) => {
      state.keyMetrics = action.payload;
    },
    setTrendAnalysis: (state, action) => {
      state.trendAnalysis = action.payload;
    },
    setProfitBreakdown: (state, action) => {
      state.profitBreakdown = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const {
  setProfitBreakdown,
  setKeyMetrics,
  setTrendAnalysis,
  setProducts,
  setLoading,
} = profitSlice.actions;

export const getProfitSummaryAsync = (selectedDates) => async (dispatch) => {
  const { startDate, endDate } = selectedDates;

  try {
    const res = await axios({
      method: 'get',
      url: '/sales-metrics',
      params: { startDate, endDate },
    });

    dispatch(setKeyMetrics(res.data.data.keyMetrics));
    dispatch(setProfitBreakdown(res.data.data.profitBreakdown));
  } catch (error) {
    console.log(error.message);
  }
};

export const getSalesTrendAsync = (selectedDates) => async (dispatch) => {
  const { startDate, endDate } = selectedDates;

  try {
    const res = await axios({
      method: 'get',
      url: '/sales-metrics/trend',
      params: { startDate, endDate },
    });

    dispatch(setTrendAnalysis(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};
export const getProductsAsync = (query) => async (dispatch) => {
  const { pageSize, page, sortField, sortOrder, selectedDates } = query;

  const pageOffset = (page - 1) * pageSize;

  const params = {
    pageSize,
    pageOffset,
    ...selectedDates,
  };

  if (sortField && sortOrder) {
    params.sortField = sortField;
    params.sortOrder = sortOrder.toUpperCase();
  }

  try {
    const res = await axios({
      method: 'get',
      url: '/sales-metrics/products',
      params,
    });

    dispatch(setProducts(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectTrendAnalysis = (state) => state.profit.trendAnalysis;
export const selectKeyMetrics = (state) => state.profit.keyMetrics;
export const selectProfitBreakdown = (state) => state.profit.profitBreakdown;
export const selectProducts = (state) => state.profit.products;

export default profitSlice.reducer;
