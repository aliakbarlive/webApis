import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { setAppNotification } from 'features/appNotifications/appNotificationSlice';

const selectInitialMarketplace = (marketplaces) => {
  const defaultMarketplace = marketplaces.find(
    (marketplace) => marketplace.isDefault
  );

  return defaultMarketplace ?? marketplaces[0];
};

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState: {
    users: [],
    accounts: [],
    currentAccount: null,
    currentMarketplace: null,
    initialSyncStatus: {},
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload;

      if (action.payload.length > 0) {
        state.currentAccount = action.payload[0];
        state.currentMarketplace = selectInitialMarketplace(
          action.payload[0].marketplaces
        );
      } else {
        state.currentAccount = null;
        state.currentMarketplace = null;
      }
    },
    updateAccount: (state, action) => {
      state.accounts = [
        ...state.accounts.map((account) =>
          account.accountId === action.payload.accountId
            ? action.payload
            : account
        ),
      ];

      if (state.currentAccount.accountId === action.payload.accountId) {
        state.currentAccount = { ...action.payload };
      }
    },
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;

      const { marketplaces } = action.payload;
      state.currentMarketplace = selectInitialMarketplace(marketplaces);
    },
    setCurrentMarketplace: (state, action) => {
      state.currentMarketplace = action.payload;
    },

    setInitialSyncStatus: (state, action) => {
      state.initialSyncStatus = action.payload;
    },
  },
});

export const {
  setUsers,
  setAccounts,
  setCurrentAccount,
  setCurrentMarketplace,
  setInitialSyncStatus,
  updateAccount,
} = accountsSlice.actions;

export const getAccountsAsync = () => async (dispatch) => {
  try {
    const res = await axios.get('/accounts');

    await dispatch(setAccounts(res.data.data));
  } catch (error) {
    console.log(error);
  }
};

export const getAccountAsync = (accountId) => async (dispatch) => {
  try {
    const res = await axios.get(`/accounts/${accountId}`);

    await dispatch(updateAccount(res.data.data));
  } catch (error) {
    console.log(error);
  }
};

export const getInitialSyncStatusAsync = (accountId) => async (dispatch) => {
  try {
    const res = await axios.get(`/accounts/${accountId}/initial-sync-status`);

    await dispatch(setInitialSyncStatus(res.data.data));
  } catch (error) {
    console.log(error);
  }
};

export const getUsersAsync = (accountId, params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/accounts/${accountId}/members`,
      params,
    });
    dispatch(setUsers(res.data.data));
  } catch (error) {
    console.log(error);
  }
};

export const updateAccountAsync = (accountId, data) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `/accounts/${accountId}`,
      data,
    });
    await dispatch(updateAccount(res.data.data));
    await dispatch(
      setAppNotification('success', 'Sucessfully updated account')
    );
  } catch (error) {
    console.log(error);
  }
};

export const updateAccountMarketplaceAsync =
  (accountId, marketplaceId, data) => async (dispatch) => {
    try {
      const res = await axios({
        method: 'PUT',
        url: `/accounts/${accountId}/marketplaces/${marketplaceId}`,
        data,
      });
      await dispatch(updateAccount(res.data.data));
      await dispatch(
        setAppNotification('success', 'Sucessfully updated account marketplace')
      );
    } catch (error) {
      console.log(error);
    }
  };

export const selectUsers = (state) => state.accounts.users;
export const selectAccounts = (state) => state.accounts.accounts;
export const selectCurrentAccount = (state) => state.accounts.currentAccount;
export const selectCurrentMarketplace = (state) =>
  state.accounts.currentMarketplace;
export const selectInitialSyncStatus = (state) =>
  state.accounts.initialSyncStatus;

export default accountsSlice.reducer;
