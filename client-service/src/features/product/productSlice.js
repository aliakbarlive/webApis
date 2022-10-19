import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const serialize = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
};

export const productSlice = createSlice({
  name: 'product',
  initialState: {
    result: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProduct: (state, action) => {
      state.result = action.payload;
      state.loading = false;
    },
  },
});

export const { setProduct, setLoading } = productSlice.actions;

// Fetch Product with Orders and States
export const getProductAsync = (asin, dateRange) => async (dispatch) => {
  try {
    const url = `products/${asin}`;

    const res = await axios({
      method: 'post',
      url,
      data: dateRange,
    });

    const result = {
      product: res.data.data,
      states: res.data.states,
    };

    dispatch(setProduct(result));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectProduct = (state) => state.product.result;
export default productSlice.reducer;
