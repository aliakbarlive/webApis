import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';

moment.tz.setDefault('America/Toronto');

export const datePickerSlice = createSlice({
  name: 'datePicker',
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

export const { setRange } = datePickerSlice.actions;

export const selectDateRange = (state) => {
  const { startDate, endDate } = state.datePicker.range;
  return {
    startDate: moment(startDate).toDate(),
    endDate: moment(endDate).toDate(),
  };
};

export const selectCurrentDateRange = (state) => state.datePicker.range;

export default datePickerSlice.reducer;
