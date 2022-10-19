import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';

const serialize = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
};

export const productMetricSlice = createSlice({
  name: 'productMetric',
  initialState: {
    result: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProductMetric: (state, action) => {
      state.result = action.payload;
      state.loading = false;
    },
  },
});

export const { setProductMetric, setLoading } = productMetricSlice.actions;

// Fetch Product with Metrics
export const getProductMetricAsync = (productId, dateRange) => async (
  dispatch
) => {
  try {
    const { startDate, endDate } = dateRange;
    // Product Id Temporary (For Testing)
    const tempProductId = 'A1KNJ4I0Y7PR0U-64-C0S0-KMN5';
    const url = `sales-metrics/product/${tempProductId}?startDate=${moment(
      startDate
    ).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`;

    const res = await axios({
      method: 'get',
      url,
    });

    const result = {
      productMetric: res.data.data,
    };

    dispatch(setProductMetric(result));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectProductMetric = (state) => state.productMetric.result;
export default productMetricSlice.reducer;
