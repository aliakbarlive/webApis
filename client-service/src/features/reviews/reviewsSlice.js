import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { setAlert } from '../alert/alertSlice';

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    productReviews: {},
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProductReviews: (state, action) => {
      state.productReviews = action.payload;
      state.loading = false;
    },
  },
});

export const { setProductReviews } = reviewsSlice.actions;

export const getProductReviews = (query) => async (dispatch) => {
  const { page, sizePerPage, searchTerm, sortField, sortOrder } = query;

  const params = {
    page,
    sizePerPage,
    searchTerm,
    sortField,
    sortOrder,
  };
  try {
    const res = await axios({
      method: 'get',
      url: '/product/ratings',
      params,
    });

    dispatch(setProductReviews(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectProductReviews = (state) => state.reviews.productReviews;

export default reviewsSlice.reducer;
