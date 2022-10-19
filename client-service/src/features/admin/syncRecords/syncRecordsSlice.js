import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const syncRecordsSlice = createSlice({
  name: 'syncRecords',
  initialState: {
    list: {},
    loading: true,
    syncRecord: { summary: [] },
    reports: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSyncRecords: (state, action) => {
      state.list = action.payload;
    },
    setSyncRecord: (state, action) => {
      state.syncRecord = action.payload;
    },
    setSyncRecordReports: (state, action) => {
      state.reports = action.payload;
    },
  },
});

export const {
  setSyncRecords,
  setLoading,
  setSyncRecord,
  setSyncRecordReports,
} = syncRecordsSlice.actions;

export const getSyncRecordsAsync = (params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/syncRecords',
      params,
    });

    dispatch(setSyncRecords(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getSyncRecordDetailsAsync = (syncRecordId) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/syncRecords/${syncRecordId}`,
    });

    dispatch(setSyncRecord(res.data.data));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.message);
  }
};

export const getSyncRecordReportsAsync = (syncRecordId, params) => async (
  dispatch
) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/syncRecords/${syncRecordId}/reports`,
      params,
    });

    dispatch(setSyncRecordReports(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectSyncRecords = (state) => state.syncRecords.list;
export const selectSyncRecord = (state) => state.syncRecords.syncRecord;
export const selectLoading = (state) => state.syncRecords.loading;
export const selectSyncRecordReports = (state) => state.syncRecords.reports;

export default syncRecordsSlice.reducer;
