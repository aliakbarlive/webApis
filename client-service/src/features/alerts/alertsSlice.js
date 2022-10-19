import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { setAlert } from '../alert/alertSlice';

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    alerts: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAlerts: (state, action) => {
      state.alerts = action.payload;
    },
  },
});

export const { setAlerts, setLoading } = alertsSlice.actions;

export const getAlertsAsync = (query) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'get',
      url: '/product/alerts',
    });

    dispatch(setAlerts(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectAlerts = (state) => state.alerts.alerts;

export default alertsSlice.reducer;
