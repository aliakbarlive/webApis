import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

export const advertisingCampaignSlice = createSlice({
  name: 'advertisingCampaign',
  initialState: {
    loading: false,
    list: { rows: [] },
    columns:
      localStorage.getItem('campaigns') ??
      'advCampaignId,name,state,campaignType,startDate,endDate,cost,sales,orders',
  },
  reducers: {
    setList: (state, action) => {
      state.list = action.payload;
    },
    setColumns: (state, action) => {
      localStorage.setItem('campaigns', action.payload);
      state.columns = action.payload;
    },
  },
});

export const { setList, setColumns } = advertisingCampaignSlice.actions;

export const getCampaignListAsync = (params) => async (dispatch) => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'advertising/campaigns',
      params,
    });

    dispatch(setList(response.data.data));

    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const selectList = (state) => state.advertisingCampaign.list;
export const selectColumns = (state) => state.advertisingCampaign.columns;

export default advertisingCampaignSlice.reducer;
