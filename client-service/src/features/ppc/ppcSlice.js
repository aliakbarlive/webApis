import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';

export const ppcSlice = createSlice({
  name: 'ppc',
  initialState: {
    stats: {},
    list: {},
    loading: true,
    error: null,
    profiles: [],
    currentProfile: null,
    campaignType: null,
    campaignTypes: [
      {
        key: 'sp',
        display: 'Sponsored Products',
        salesAttr: 'attributedSales30d',
        ordersAttr: 'attributedConversions30d',
        budgetAttr: 'dailyBudget',
      },
      {
        key: 'sb',
        display: 'Sponsored Brands',
        salesAttr: 'attributedSales14d',
        ordersAttr: 'attributedConversions14d',
        budgetAttr: 'budget',
      },
      {
        key: 'sd',
        display: 'Sponsored Display',
        salesAttr: 'attributedSales30d',
        ordersAttr: 'attributedConversions30d',
        budgetAttr: 'budget',
      },
    ],
  },
  reducers: {
    setProfiles: (state, action) => {
      state.profiles = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload;
    },
    setCampaignType: (state, action) => {
      const type = state.campaignTypes.find((ct) => ct.key == action.payload);
      state.campaignType = type;
      state.header = type.display;
    },
  },
});

export const {
  setProfiles,
  setCurrentProfile,
  setStats,
  setLoading,
  setList,
  setCampaignType,
} = ppcSlice.actions;

export const getProfilesAsync = () => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'ppc/profiles',
    });

    dispatch(setProfiles(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getStatsAsync = (url, params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url,
      params,
    });

    const defaultValues = {
      acos: 0,
      attributedSales30d: 0,
      attributedSales14d: 0,
      clicks: 0,
      cost: 0,
      cpc: 0,
      cr: 0,
      ctr: 0,
    };

    dispatch(setStats(res.data.data ?? defaultValues));
  } catch (error) {
    console.log(error.message);
  }
};

export const getCampaignsAsync = (params) => async (dispatch, getState) => {
  const campaignType = getState().ppc.campaignType.key;

  try {
    const res = await axios({
      method: 'get',
      url: `ppc/${campaignType}/campaigns`,
      params,
    });

    dispatch(setList(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getAdGroupsAsync = (params) => async (dispatch, getState) => {
  const campaignType = getState().ppc.campaignType.key;

  try {
    const res = await axios({
      method: 'get',
      url: `ppc/${campaignType}/adGroups`,
      params,
    });

    dispatch(setList(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getProductsAsync = (params) => async (dispatch, getState) => {
  try {
    const campaignType = getState().ppc.campaignType.key;

    const res = await axios({
      method: 'get',
      url: `ppc/${campaignType}/products`,
      params,
    });

    dispatch(setList(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getKeywordsAsync = (params) => async (dispatch, getState) => {
  const campaignType = getState().ppc.campaignType.key;

  try {
    const res = await axios({
      method: 'get',
      url: `ppc/${campaignType}/keywords`,
      params,
    });

    dispatch(setList(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getSearchTermsAsync = (params) => async (dispatch, getState) => {
  const campaignType = getState().ppc.campaignType.key;

  try {
    const res = await axios({
      method: 'get',
      url: `ppc/${campaignType}/searchTerms`,
      params,
    });

    dispatch(setList(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getTargetsAsync = (params) => async (dispatch, getState) => {
  const campaignType = getState().ppc.campaignType.key;

  try {
    const res = await axios({
      method: 'get',
      url: `ppc/${campaignType}/targets`,
      params,
    });

    dispatch(setList(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectLoading = (state) => state.ppc.loading;
export const selectStats = (state) => state.ppc.stats;
export const selectList = (state) => state.ppc.list;
export const selectProfiles = (state) => state.ppc.profiles;
export const selectCurrentProfile = (state) => state.ppc.currentProfile;
export const selectCampaignType = (state) => state.ppc.campaignType;

export default ppcSlice.reducer;
