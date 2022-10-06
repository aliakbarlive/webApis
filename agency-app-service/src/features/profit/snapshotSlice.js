import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const snapshostsSlice = createSlice({
  name: 'snapshot',
  initialState: {
    snapshot: null,
  },
  reducers: {
    setSnapshot: (state, action) => {
      state.snapshot = action.payload;
    },
  },
});

export const { setSnapshot } = snapshostsSlice.actions;

export const getSnapshotAsync =
  (selectedDates, account, marketplace) => async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/profit/snapshot',
        params: {
          ...selectedDates,
          accountId: account.accountId,
          marketplace: marketplace.details.countryCode,
        },
      });
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  };

export const selectSnapshots = (state) => state.snapshot.snapshot;
export default snapshostsSlice.reducer;
