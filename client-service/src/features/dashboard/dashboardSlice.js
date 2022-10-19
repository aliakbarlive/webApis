import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: [],
    refunds: {},
    loading: true,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setRefunds: (state, action) => {
      state.refunds = action.payload;
    },
  },
});

export const { setStats, setLoading, setRefunds } = dashboardSlice.actions;

export const getStatsAsync = (selectedDates) => async (dispatch) => {
  const { startDate, endDate } = selectedDates;

  try {
    const res = await axios({
      method: 'post',
      url: '/sales-metrics',
      data: {
        marketplaceIds: ['ATVPDKIKX0DER'],
        startDate,
        endDate,
        granularityTimeZone: 'US/Pacific',
        granularity: 'Total',
      },
    });

    dispatch(setStats(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getRefundsAsync = (selectedDates) => async (dispatch) => {
  const { startDate, endDate } = selectedDates;

  try {
    const res = await axios({
      method: 'post',
      url: '/sales-metrics/refunds',
      data: {
        startDate,
        endDate,
      },
    });

    dispatch(setRefunds(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectStats = (state) => state.dashboard.stats;
export const selectRefunds = (state) => state.dashboard.refunds;

export default dashboardSlice.reducer;
