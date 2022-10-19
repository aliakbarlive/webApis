import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categoryRankingItems: {
      rows: [],
      count: null,
    },
  },
  reducers: {
    setCategoryRankingItems: (state, action) => {
      state.categoryRankingItems = action.payload;
    },
  },
});

export const { setCategoryRankingItems } = categorySlice.actions;

export const getCategoryRankingsAsync = (query) => async (dispatch) => {
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
      url: '/product/rankings',
      params,
    });

    dispatch(setCategoryRankingItems(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectCategoryRankingItems = (state) =>
  state.category.categoryRankingItems;
export default categorySlice.reducer;
