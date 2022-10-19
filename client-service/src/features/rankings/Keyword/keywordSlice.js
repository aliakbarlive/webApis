import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const keywordSlice = createSlice({
  name: 'keyword',
  initialState: {
    keywordRankingItems: { rows: [] },
    keyword: {},
  },
  reducers: {
    setKeywordRankingItems: (state, action) => {
      state.keywordRankingItems = action.payload;
    },
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
  },
});

export const getKeywordRankingsAsync = (query) => async (dispatch) => {
  try {
    const { page, sizePerPage, searchTerm, sortField, sortOrder } = query;
    const params = {
      page,
      sizePerPage,
      searchTerm,
      sortField,
      sortOrder,
    };
    const res = await axios({
      method: 'get',
      url: '/keywords/keyword-rankings/top-products',
      params,
    });
    dispatch(setKeywordRankingItems(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getKeywordAsync = (keywordId) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'get',
      url: `/keywords/${keywordId}`,
    });
    dispatch(setKeyword(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const { setKeywordRankingItems, setKeyword } = keywordSlice.actions;
export const selectKeywordRankingItems = (state) =>
  state.keyword.keywordRankingItems;
export const selectKeyword = (state) => state.keyword.keyword;

export default keywordSlice.reducer;
