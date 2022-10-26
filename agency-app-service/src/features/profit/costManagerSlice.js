import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from 'features/alerts/alertsSlice';
import i18next from 'i18next';

export const costsSlice = createSlice({
  name: 'costs',
  initialState: {
    loading: false,
    productCost: {},
    productCosts: {},
    selected: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProductCosts: (state, action) => {
      state.productCosts = action.payload;
    },
    setSelectedProductCost: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setLoading, setProductCosts, setSelectedProductCost } =
  costsSlice.actions;

export const getProductCostsAsync =
  (inventoryItemId, params) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const res = await axios({
        method: 'GET',
        url: `/inventory/${inventoryItemId}/costs`,
        params: {
          ...params,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });
      dispatch(setProductCosts(res.data.data));
    } catch (error) {
      console.log(error.message);
      dispatch(setLoading(false));
    }
  };

export const addProductCostsAsync =
  (inventoryItemId, payload) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: `/inventory/${inventoryItemId}/costs`,
        data: {
          ...payload,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      })
        .then(() => {
          dispatch(
            setAlert(
              'success',
              i18next.t('CostManager.SuccessfullyCreatedCost')
            )
          );
          return resolve();
        })
        .catch((error) => {
          console.log(error.response);
          dispatch(setAlert('error', error.response.data.message));
        });
    });
  };

export const updateProductCostsAsync =
  (inventoryItemId, productCostId, payload) => async (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'PUT',
        url: `/inventory/${inventoryItemId}/costs/${productCostId}`,
        data: {
          ...payload,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      })
        .then(() => {
          dispatch(
            setAlert(
              'success',
              i18next.t('CostManager.SuccessfullyUpdatedCost')
            )
          );
          return resolve();
        })
        .catch((error) => {
          dispatch(setAlert('error', error.response.data.message));
        });
    });
  };

export const deleteProductCostAsync =
  (inventoryItemId, productCostId) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      await axios({
        method: 'DELETE',
        url: `/inventory/${inventoryItemId}/costs/${productCostId}`,
        data: {
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });
      dispatch(setLoading(false));
      await dispatch(
        setAlert('success', i18next.t('CostManager.SuccessfullyDeletedCost'))
      );
    } catch (error) {
      await dispatch(setLoading(false));
      await dispatch(
        setAlert(
          'error',
          i18next.t('CostManager.DeleteRecordError'),
          error.response.data.message
        )
      );
    }
  };

export const selectProductCosts = (state) => state.costs.productCosts;
export const selectSelectedProductCost = (state) => state.costs.selected;

export default costsSlice.reducer;
