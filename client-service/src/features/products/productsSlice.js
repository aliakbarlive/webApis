import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { setAlert } from '../alert/alertSlice';

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts, setLoading } = productsSlice.actions;

export const getProductsAsync = (query) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'get',
      url: '/products',
      params: { status: 'Active', marketplaceId: 'ATVPDKIKX0DER' }, //TODO: change static marketplaceId
    });

    dispatch(setProducts(res.data.data.rows));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectProducts = (state) => state.products.products;

export default productsSlice.reducer;
