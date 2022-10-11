import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: {},
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setProducts: (state, action) => {
      state.products = action.payload;

      state.loading = false;
    },
  },
});

export const { setProducts, setLoading } = productsSlice.actions;

export const getProductsAsync =
  (params, append) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const res = await axios({
        method: 'GET',
        url: '/products',
        params: {
          ...params,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      const { count, rows } = getState().products.products;

      if (append && rows && res.data.data.count > 1) {
        res.data.data.rows = [...rows, ...res.data.data.rows];
        res.data.data.count = res.data.data.count + count;
      }

      dispatch(setProducts(res.data.data));
    } catch (error) {
      console.log(error.message);
      dispatch(setLoading(false));
    }
  };

export const selectProducts = (state) => state.products.products;

export default productsSlice.reducer;
