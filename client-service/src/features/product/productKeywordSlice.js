import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const keywordSlice = createSlice({
  name: 'productKeyword',
  initialState: {
    productKeywords: [],
  },
  reducers: {
    setProductKeywords: (state, action) => {
      state.productKeywords = action.payload;
    },
  },
});

export const getKeywordItemsAsync = (asin) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'get',
      url: `/product/${asin}/keywords`,
    });
    dispatch(setProductKeywords(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const { setProductKeywords } = keywordSlice.actions;
export const selectKeywordItems = (state) =>
  state.productKeyword.productKeywords;
export default keywordSlice.reducer;
