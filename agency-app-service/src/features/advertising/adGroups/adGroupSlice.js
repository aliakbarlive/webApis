import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

export const advertisingAdGroupSlice = createSlice({
  name: 'advertisingAdGroup',
  initialState: {
    loading: false,
    list: { rows: [] },
    columns:
      localStorage.getItem('columns-ad-groups') ??
      'advAdGroupId,name,state,cost,sales,orders',
  },
  reducers: {
    setList: (state, action) => {
      state.list = action.payload;
    },
    setColumns: (state, action) => {
      localStorage.setItem('columns-ad-groups', action.payload);
      state.columns = action.payload;
    },
  },
});

export const { setList, setColumns } = advertisingAdGroupSlice.actions;

export const getAdGroupListAsync = (params) => async (dispatch) => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'advertising/ad-groups',
      params,
    });

    dispatch(setList(response.data.data));

    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const selectList = (state) => state.advertisingAdGroup.list;
export const selectColumns = (state) => state.advertisingAdGroup.columns;

export default advertisingAdGroupSlice.reducer;
