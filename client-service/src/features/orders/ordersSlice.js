import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { setAlert } from '../alert/alertSlice';

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: null,
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

export const { setOrders, setLoading } = ordersSlice.actions;

export const getOrdersAsync =
  ({ pageSize, page, sortField, sortOrder, selectedDates }) =>
  async (dispatch) => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/orders',
        params: {
          pageSize,
          page,
          sortField,
          sortOrder,
          ...selectedDates,
        },
      });

      console.log(res.data.data);
      let orders = res.data.data;

      let rows = orders.rows.map((ord) => {
        let order = ord;
        order.product = {
          productName: order.productName,
          asin: order.asin,
          sku: order.sku,
        };
        return order;
      });

      orders.rows = rows;

      dispatch(setOrders(orders));
    } catch (error) {
      console.log(error.message);
    }
  };

export const selectOrders = (state) => state.orders.orders;

export default ordersSlice.reducer;
