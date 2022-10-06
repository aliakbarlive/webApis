import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { setAlert } from '../../alerts/alertsSlice';

export const keywordSlice = createSlice({
  name: 'keyword',
  initialState: {
    rankings: { rows: [] },
    selected: {},
  },
  reducers: {
    setKeywordRankings: (state, action) => {
      state.rankings = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const getKeywordRankingsAsync =
  (params) => async (dispatch, getState) => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/keywords',
        params: {
          ...params,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });
      dispatch(setKeywordRankings(res.data.data));
    } catch (error) {
      console.log(error.message);
    }
  };

export const addKeywordsAsync = (data, msg) => async (dispatch, getState) => {
  try {
    await axios({
      method: 'POST',
      url: `/keywords`,
      data: {
        ...data,
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });
    dispatch(setAlert('success', msg.success));
  } catch (error) {
    console.log(error.response.data.message);
    dispatch(setAlert('error', error.response.data.message));
  }
};

export const updateKeywordAsync =
  (keywordId, data) => async (dispatch, getState) => {
    try {
      const res = await axios({
        method: 'PUT',
        url: `/keywords/${keywordId}`,
        data: {
          ...data,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });
      dispatch(setSelected(res.data.data));
    } catch (error) {
      console.log(error.message);
    }
  };

export const { setKeywordRankings, setSelected } = keywordSlice.actions;

export const selectKeywordRankings = (state) => state.keyword.rankings;

export default keywordSlice.reducer;
