import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    loading: false,
    list: {},
    selected: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    setSelectedReview: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setList, setSelectedReview, setLoading } = reviewsSlice.actions;

export const getReviewsAsync = (params) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await axios.get('/reviews', { params });

    dispatch(setList(response.data.data));
  } catch (error) {
    dispatch(setLoading(false));
  }
};

export const getReviewDetailsAsync = (reviewId, params) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await axios.get(`/reviews/${reviewId}`, { params });

    dispatch(setSelectedReview(response.data.data));
  } catch (error) {
    dispatch(setLoading(false));
  }
};

export const selectReviewList = (state) => state.reviews.list;
export const selectSelectedReview = (state) => state.reviews.selected;

export default reviewsSlice.reducer;
