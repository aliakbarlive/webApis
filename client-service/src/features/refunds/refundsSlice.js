import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { setAlert } from '../alert/alertSlice';

export const refundsSlice = createSlice({
  name: 'refunds',
  initialState: {
    refunds: null,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRefunds: (state, action) => {
      state.refunds = action.payload;
      state.loading = false;
    },
  },
});

export const { setRefunds, setLoading } = refundsSlice.actions;

export const getRefundsAsync =
  ({ pageSize, page, sortField, sortOrder, selectedDates }) =>
  async (dispatch) => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/refunds',
        params: { pageSize, page, sortField, sortOrder, ...selectedDates },
      });

      dispatch(setRefunds(res.data.data));
    } catch (error) {
      console.log(error.message);
    }
  };

export const selectRefunds = (state) => state.refunds.refunds;

export default refundsSlice.reducer;
