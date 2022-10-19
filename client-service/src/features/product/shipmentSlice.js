import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const shipmentSlice = createSlice({
  name: 'shipments',
  initialState: {
    result: [],
    sku: '',
    loading: false,
    error: null,
  },
  reducers: {
    setSku: (state, action) => {
      state.sku = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setShipment: (state, action) => {
      state.result = action.payload;
      state.loading = false;
    },
  },
});

export const { setShipment, setLoading, setSku } = shipmentSlice.actions;

export const getShipmentsAsync = (query) => async (dispatch) => {
  try {
    const { sku, page, pageSize, searchTerm, sortField, sortOrder } = query;
    const url = `inbound-fba-shipments/sku/${sku}?limit=${pageSize}&page=${page}&order_by=${sortField}&order_direction=${sortOrder}&keyword=${searchTerm}`;

    const res = await axios({
      method: 'get',
      url,
    });

    dispatch(setShipment(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectShipment = (state) => state.shipments.result;
export const getSku = (state) => state.shipments.sku;
export default shipmentSlice.reducer;
