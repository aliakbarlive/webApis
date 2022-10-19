import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { StaticRouter } from 'react-router';
import { setAlert } from '../alert/alertSlice';

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    summary: null,
    forecast: {
      rows: [],
      count: null,
    },
    estimate: {
      rows: [],
      count: null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setInventorySummary: (state, action) => {
      state.inventorySummary = action.payload;
    },
    setForecast: (state, action) => {
      state.forecast = action.payload;
      state.loading = false;
    },
    setEstimate: (state, action) => {
      state.estimate = action.payload;
      state.loading = false;
    },
    updateForecastItem: (state, action) => {
      state.forecast.rows = state.forecast.rows.map((item) =>
        item.inventoryItemId === action.payload.inventoryItemId
          ? { ...action.payload }
          : item
      );
    },
    updateEstimateItem: (state, action) => {
      state.estimate.rows = state.estimate.rows.map((item) =>
        item.inventoryItemId === action.payload.inventoryItemId
          ? { ...action.payload }
          : item
      );
    },

    updateInventoryItem: (state, action) => {
      state.inventoryItems = state.inventoryItems.map((item) =>
        item.sellerSku === action.payload.sellerSku &&
        item.asin === action.payload.asin
          ? { ...action.payload }
          : item
      );
    },
  },
});

export const {
  setInventorySummary,
  setForecast,
  setEstimate,
  updateInventoryItem,
  updateForecastItem,
  updateEstimateItem,
  setLoading,
} = inventorySlice.actions;

export const getInventorySummaryAsync = (query) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'get',
      url: '/inventory/summary',
      params: {
        marketplaceId: 'ATVPDKIKX0DER',
      },
    });
    dispatch(setInventorySummary(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getInventoryAsync = (query) => async (dispatch) => {
  const { queryType, pageSize, page, searchTerm, sortField, sortOrder } = query;

  const pageOffset = (page - 1) * pageSize;

  const params = {
    marketplaceId: 'ATVPDKIKX0DER',
    pageSize,
    pageOffset,
    status: 'active',
    queryType,
  };

  if (searchTerm) {
    params.searchTerm = searchTerm;
  }

  if (sortField && sortOrder) {
    params.sortField = sortField;
    params.sortOrder = sortOrder.toUpperCase();
  }
  try {
    const res = await axios({
      method: 'get',
      url: '/inventory',
      params,
    });

    if (queryType === 'forecast') {
      dispatch(setForecast(res.data.data));
    } else {
      dispatch(setEstimate(res.data.data));
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const updateInventoryItemAsync =
  (inventoryItemId, formData) => async (dispatch) => {
    try {
      const { queryType } = formData;

      const res = await axios({
        method: 'put',
        url: `/inventory/${inventoryItemId}`,
        data: formData,
      });
      console.log(res.data.data);

      if (queryType === 'forecast') {
        dispatch(updateForecastItem(res.data.data));
      } else {
        dispatch(updateEstimateItem(res.data.data));
      }
    } catch (err) {
      console.log(err);
      dispatch(setAlert(err.response.data.message));
    }
  };

export const selectInventorySummary = (state) =>
  state.inventory.inventorySummary;
export const selectForecast = (state) => state.inventory.forecast;
export const selectEstimate = (state) => state.inventory.estimate;

export default inventorySlice.reducer;
