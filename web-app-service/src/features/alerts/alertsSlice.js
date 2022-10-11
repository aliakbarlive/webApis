import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const alertSlice = createSlice({
  name: 'alerts',
  initialState: {
    history: { rows: [] },
    selectedAlert: {},
    configurations: {},
    selectedConfiguration: {},
    configurationSummary: {},
    attributes: [
      'title',
      'description',
      'price',
      'featureBullets',
      'listingImages',
      'buyboxWinner',
      'categories',
      'reviews',
      'lowStock',
      'rating',
      'lowStockThreshold',
      'ratingCondition',
    ],
  },
  reducers: {
    setAlertHistory: (state, action) => {
      state.history = action.payload;
    },
    setSelectedAlert: (state, action) => {
      state.selectedAlert = action.payload;
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
  setAlertHistory,
  setSelectedAlert,
  setConfigurations,
  setSelectedConfiguration,
  setConfigurationSummary,
} = alertSlice.actions;

export const getAlertsAsync = (params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/alerts',
      params,
    });

    await dispatch(setAlertHistory(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const markAlertAsync = (alertId, action, data) => async () => {
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

export const getAlertDetailsAsync = (alertId, params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/alerts/${alertId}`,
      params,
    });

    await dispatch(setSelectedAlert(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getConfigurationSummaryAsync =
  () => async (dispatch, getState) => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/listings/alert-configs/summary',
        params: {
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      await dispatch(setConfigurationSummary(res.data.data));
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

export const updateConfigurationAsync = (id, data) => async (dispatch) => {
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

export const selectAlertHistory = (state) => state.alerts.history;
export const selectSelectedAlert = (state) => state.alerts.selectedAlert;

export const selectConfigurationSummary = (state) =>
  state.alerts.configurationSummary;

export const selectAlertConfigurations = (state) => state.alerts.configurations;

export const selectSelectedConfig = (state) =>
  state.alerts.selectedConfiguration;

export const selectAlertConfigurationAttributes = (state) =>
  state.alerts.attributes;

export const selectAlertConfigurationToggledAttributes = (state) =>
  state.alerts.attributes.filter(
    (attr) => !['lowStockThreshold', 'ratingCondition'].includes(attr)
  );
export default alertSlice.reducer;
