import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const statesSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
    },
  },
});

export const { setOrders, setLoading } = statesSlice.actions;

// Fetch all orders if the asin set
export const getOrdersAsync = (asin) => async (dispatch) => {
  try {
    let url = '/orders';
    if (asin) {
      // Specific Product
      url = url + '/' + asin + '/states';
    } else {
      // All Products
      url = url + '/states';
    }

    const res = await axios({
      method: 'get',
      url,
    });
    dispatch(setOrders(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectOrders = (state) => state.orders.orders;

export default statesSlice.reducer;
