import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const accountsSlice = createSlice({
  name: 'profitProduct',
  initialState: {
    productMetrics: null,
    feeBreakdown: null,
  },
  reducers: {
    setProductMetrics: (state, action) => {
      state.productMetrics = action.payload;
    },
    setFeeBreakdown: (state, action) => {
      state.feeBreakdown = action.payload;
    },
  },
});

export const { setProductMetrics, setFeeBreakdown } = accountsSlice.actions;

export const getProductMetricsAsync =
  (params) => async (dispatch, getState) => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/profit/products',
        params: {
          ...params,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      dispatch(setProductMetrics(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

export const getFeeBreakdownAsync =
  (selectedDates) => async (dispatch, getState) => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/profit/breakdown/product/fees',
        params: {
          ...selectedDates,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      dispatch(setFeeBreakdown(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

export const selectProductMetrics = (state) =>
  state.profitProduct.productMetrics;
export const selectFeeBreakdown = (state) => state.profitProduct.feeBreakdown;

export default accountsSlice.reducer;
