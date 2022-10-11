import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: {},
    loading: false,
    selected: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
      state.loading = false;
    },
    setSelectedReview: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setReviews, setSelectedReview, setLoading } =
  reviewsSlice.actions;

export const getReviewsAsync = (params) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const res = await axios({
      method: 'GET',
      url: '/reviews',
      params: {
        ...params,
        ...getState().datePicker.range,
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });

    dispatch(setReviews(res.data.data));
  } catch (error) {
    dispatch(setLoading(false));
  }
};

export const getReviewAsync = (reviewId) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const res = await axios({
      method: 'GET',
      url: `/reviews/${reviewId}`,
      params: {
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });

    dispatch(setSelectedReview(res.data.data));
  } catch (error) {
    dispatch(setLoading(false));
  }
};

export const addNoteAsync = (data) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios({
      method: 'POST',
      url: '/notes',
      data,
    });
  } catch (error) {
    dispatch(setLoading(false));
  }
};

export const deleteNoteAsync = (noteId) => async (dispatch) => {
  try {
    await axios({
      method: 'DELETE',
      url: `/notes/${noteId}`,
    });
  } catch (error) {
    console.log(error.message);
    dispatch(setLoading(false));
  }
};

export const selectReviews = (state) => state.reviews.reviews;
export const selectSelectedReview = (state) => state.reviews.selected;

export default reviewsSlice.reducer;
