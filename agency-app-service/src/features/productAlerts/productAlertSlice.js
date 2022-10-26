import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const productAlertSlice = createSlice({
  name: 'productAlerts',
  initialState: {
    history: { rows: [] },
    selected: {},
    configurations: {},
    selectedConfiguration: {},
    configurationSummary: {},
  },
  reducers: {
    setProductAlertHistory: (state, action) => {
      state.history = action.payload;
    },
    setSelectedProductAlert: (state, action) => {
      state.selected = action.payload;
    },
    setConfigurationSummary: (state, action) => {
      state.configurationSummary = action.payload;
    },
    setConfigurations: (state, action) => {
      state.configurations = action.payload;
    },
    setSelectedConfiguration: (state, action) => {
      state.selectedConfiguration = action.payload;
    },
  },
});

export const {
  setConfigurations,
  setProductAlertHistory,
  setSelectedProductAlert,
  setSelectedConfiguration,
  setConfigurationSummary,
} = productAlertSlice.actions;

export const getProductAlertsAsync = (params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/alerts',
      params,
    });

    await dispatch(setProductAlertHistory(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const markProductAlertAsync = (alertId, action, data) => async () => {
  try {
    await axios({
      method: 'POST',
      url: `/alerts/${alertId}/${action}`,
      data,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const getProductAlertDetailsAsync =
  (alertId, params) => async (dispatch) => {
    try {
      const res = await axios({
        method: 'GET',
        url: `/alerts/${alertId}`,
        params,
      });

      await dispatch(setSelectedProductAlert(res.data.data));
    } catch (error) {
      console.log(error.message);
    }
  };

export const getConfigurationSummaryAsync =
  () => async (dispatch, getState) => {
    try {
      const respose = await axios({
        method: 'GET',
        url: '/listings/alert-configs/summary',
        params: {
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      let { data } = respose.data;
      data.maximumProducts = 50; // TODO: Static for now

      await dispatch(setConfigurationSummary(data));
    } catch (error) {
      console.log(error.message);
    }
  };

export const getConfigurationsAsync =
  (params) => async (dispatch, getState) => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/listings/alert-configs',
        params: {
          ...params,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      await dispatch(setConfigurations(res.data.data));
    } catch (error) {
      console.log(error.message);
    }
  };

export const updateProductAlertConfigurationAsync =
  (id, data) => async (dispatch) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: `/listings/alert-configs/${id}`,
        data,
      });

      dispatch(setSelectedConfiguration(response.data.data));
    } catch (error) {
      console.log(error.message);
    }
  };

export const selectProductAlertHistory = (state) => state.productAlerts.history;
export const selectSelectedProductAlert = (state) =>
  state.productAlerts.selected;

export const selectConfigurationSummary = (state) =>
  state.productAlerts.configurationSummary;

export const selectConfigurations = (state) =>
  state.productAlerts.configurations;

export const selectSelectedConfig = (state) =>
  state.productAlerts.selectedConfiguration;

export default productAlertSlice.reducer;
