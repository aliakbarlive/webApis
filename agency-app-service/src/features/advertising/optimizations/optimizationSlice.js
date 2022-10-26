import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from 'features/alerts/alertsSlice';

export const advertisingOptimizationSlice = createSlice({
  name: 'advertisingOptimization',
  initialState: {
    loading: false,
    isGenerating: false,
    report: null,
    itemList: { rows: [] },
    params: {
      page: 1,
      pageSize: 10,
    },
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setIsGenerating: (state, action) => {
      state.isGenerating = action.payload;
    },
    setReport: (state, action) => {
      state.report = action.payload;
    },
    setItemList: (state, action) => {
      state.itemList = action.payload;
    },
    setParams: (state, action) => {
      state.params = action.payload;
    },
  },
});

export const {
  setLoading,
  setIsGenerating,
  setReport,
  setItemList,
  setParams,
} = advertisingOptimizationSlice.actions;

export const createReportAsync = (data) => async (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(setIsGenerating(true));

    axios
      .post('ppc/optimizations/reports', data)
      .then((respone) => {
        const report = respone.data.data;
        dispatch(setReport(report));
        dispatch(setIsGenerating(false));

        return resolve(report);
      })
      .catch((err) => {
        const { errors } = err.response.data;
        dispatch(
          setAlert('error', err.response.data.message, Object.values(errors)[0])
        );
        dispatch(setIsGenerating(false));
      });
  });
};

export const getReportItemsAsync = (reportId, params) => async (dispatch) => {
  const response = await axios.get(
    `ppc/optimizations/reports/${reportId}/items`,
    {
      params,
    }
  );

  dispatch(setItemList(response.data.data));
};

export const getReportAsync = (reportId, params) => async (dispatch) => {
  const response = await axios.get(`ppc/optimizations/reports/${reportId}`, {
    params,
  });

  dispatch(setReport(response.data.data));
};

export default advertisingOptimizationSlice.reducer;

export const selectLoading = (state) => state.advertisingOptimization.loading;
export const selectParams = (state) => state.advertisingOptimization.params;
export const selectIsGenerating = (state) =>
  state.advertisingOptimization.isGenerating;
export const selectReport = (state) => state.advertisingOptimization.report;
export const selectItemList = (state) => state.advertisingOptimization.itemList;
