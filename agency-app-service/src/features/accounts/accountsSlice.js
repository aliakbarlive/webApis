import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { setAlert } from 'features/alerts/alertsSlice';

const selectInitialMarketplace = (marketplaces) => {
  if (!marketplaces || (Array.isArray(marketplaces) && !marketplaces.length)) {
    return null;
  }

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
    loading: false,
    list: { rows: [], count: 0 },
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
    },
    setList: (state, action) => {
      state.list = action.payload;
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
    },
    setCurrentMarketplace: (state, action) => {
      state.currentMarketplace = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setInitialSyncStatus: (state, action) => {
      state.initialSyncStatus = action.payload;
    },
  },
});

export const {
  setLoading,
  setList,
  setUsers,
  setAccounts,
  setCurrentAccount,
  setCurrentMarketplace,
  setInitialSyncStatus,
  updateAccount,
} = accountsSlice.actions;

export const getAccountsAsync =
  (params = {}, autoSelectAccount = false) =>
  async (dispatch) => {
    try {
      const response = await axios.get('/accounts', { params });
      const list = response.data.data;
      await dispatch(setList(list));

      if (autoSelectAccount) {
        if (list.count) {
          const [defaultAccount] = list.rows;
          const { marketplaces } = defaultAccount;
          await dispatch(setCurrentAccount(defaultAccount));

          await dispatch(
            setCurrentMarketplace(selectInitialMarketplace(marketplaces))
          );
        }
      }
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
    await dispatch(setAlert('success', 'Sucessfully updated account'));
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
        setAlert('success', 'Sucessfully updated account marketplace')
      );
    } catch (error) {
      console.log(error);
    }
  };

export const selectUsers = (state) => state.accounts.users;
export const selectAccounts = (state) => state.accounts.accounts;
export const selectAccountList = (state) => state.accounts.list;
export const selectCurrentAccount = (state) => state.accounts.currentAccount;
export const selectCurrentMarketplace = (state) =>
  state.accounts.currentMarketplace;
export const selectInitialSyncStatus = (state) =>
  state.accounts.initialSyncStatus;
export const selectLoading = (state) => state.accounts.loading;

export default accountsSlice.reducer;
