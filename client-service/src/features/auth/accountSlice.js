import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const selectInitialMarketplace = (marketplaces) => {
  const defaultMarketplace = marketplaces.find(
    (m) => m.AccountMarketplace.isDefault
  );

  return defaultMarketplace ?? marketplaces[0];
};

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    list: [],
    current: {},
    currentMarketplace: {},
    initialSyncStatus: {},
  },
  reducers: {
    setAccountList: (state, action) => {
      state.list = action.payload;
      if (action.payload.length) {
        state.current = action.payload[0];

        const { marketplaces } = action.payload[0];
        state.currentMarketplace = selectInitialMarketplace(marketplaces);
      }
    },
    setCurrentAccount: (state, action) => {
      state.current = action.payload;

      const { marketplaces } = action.payload;
      state.currentMarketplace = selectInitialMarketplace(marketplaces);
    },
    setInitialSyncStatus: (state, action) => {
      state.initialSyncStatus = action.payload;
    },
    setCurrentMarketplace: (state, action) => {
      state.currentMarketplace = action.payload;
    },
  },
});

export const {
  setAccountList,
  setCurrentAccount,
  setCurrentMarketplace,
  setInitialSyncStatus,
} = accountSlice.actions;

export const getInitialSyncStatus = () => async (dispatch) => {
  try {
    const res = await axios.get('/auth/account/initial-sync-status');

    dispatch(setInitialSyncStatus(res.data.data));
  } catch (error) {}
};

export const selectAccountList = (state) => state.account.list;

export const selectCurrentAccount = (state) => state.account.current;

export const selectCurrentMarketplace = (state) =>
  state.account.currentMarketplace;

export const selectInitialSyncStatus = (state) =>
  state.account.initialSyncStatus;

export default accountSlice.reducer;
