import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';

moment.tz.setDefault('America/Toronto');

export const dateSlice = createSlice({
  name: 'date',
  initialState: {
    range: {
      startDate: moment().subtract(7, 'd').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    },
  },
  reducers: {
    setRange: (state, action) => {
      state.range = action.payload;
    },
  },
});

export const { setRange } = dateSlice.actions;

export const selectDateRange = (state) => {
  const { startDate, endDate } = state.date.range;
  return {
    startDate: moment(startDate).toDate(),
    endDate: moment(endDate).toDate(),
  };
};

export const selectCurrentDateRange = (state) => state.date.range;

export default dateSlice.reducer;
