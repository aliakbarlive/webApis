import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: null,
    loading: false,
    error: null,
    summary: [],
    states: null,
    selected: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
    },
    setSummary: (state, action) => {
      state.summary = action.payload;
      state.loading = false;
    },
    setStates: (state, action) => {
      state.states = action.payload;
      state.loading = false;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
      state.loading = false;
    },
  },
});

export const { setOrders, setLoading, setSummary, setStates, setSelected } =
  ordersSlice.actions;

export const getOrdersAsync = (params) => async (dispatch, getState) => {
  dispatch(setLoading(true));

  try {
    const res = await axios({
      method: 'GET',
      url: '/orders',
      params: {
        ...params,
        ...getState().datePicker.range,
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });

    dispatch(setOrders(res.data.data));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.message);
  }
};

export const getOrderSummaryAsync = (params) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const res = await axios({
      method: 'GET',
      url: '/orders/summary',
      params: {
        ...params,
        ...getState().datePicker.range,
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });

    dispatch(setSummary(res.data.data));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.message);
  }
};

export const getStatesAsync = (params) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const res = await axios({
      method: 'GET',
      url: '/orders/states',
      params: {
        ...params,
        ...getState().datePicker.range,
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });
    dispatch(setStates(res.data.data));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.message);
  }
};

export const getOrderDetailsAsync = (orderId) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const res = await axios({
      method: 'GET',
      url: `/orders/${orderId}`,
      params: {
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });
    dispatch(setSelected(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectOrders = (state) => state.orders.orders;
export const selectOrderSummary = (state) => state.orders.summary;
export const selectOrderStates = (state) => state.orders.states;
export const selectSelectedOrder = (state) => state.orders.selected;

export default ordersSlice.reducer;
