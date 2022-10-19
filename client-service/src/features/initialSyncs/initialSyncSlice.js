import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const initialSyncSlice = createSlice({
  name: 'sellingPartners',
  initialState: {
    list: {},
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setInitialSyncList: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setInitialSyncList, setLoading } = initialSyncSlice.actions;

export const getInitialSyncAsync = () => async (dispatch) => {
  try {
    const res = await axios({
      method: 'get',
      url: '/accounts/initial-sync-status',
    });

    dispatch(setInitialSyncList(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectInitialSyncList = (state) => state.initialSync.list;

export default initialSyncSlice.reducer;
