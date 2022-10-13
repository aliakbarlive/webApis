import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const advertisingSlice = createSlice({
  name: 'advertising',
  initialState: {
    statistics: {},
    campaigns: {},
    adGroups: {},
    keywords: {},
    targets: {},
    products: {},
    searchTerms: {},
  },
  reducers: {
    setStatistics: (state, action) => {
      state.statistics = action.payload;
    },
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    setAdGroups: (state, action) => {
      state.adGroups = action.payload;
    },
    setKeywords: (state, action) => {
      state.keywords = action.payload;
    },
    setTargets: (state, action) => {
      state.targets = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSearchTerms: (state, action) => {
      state.searchTerms = action.payload;
    },
  },
});

export const {
  setStatistics,
  setCampaigns,
  setAdGroups,
  setKeywords,
  setTargets,
  setProducts,
  setSearchTerms,
} = advertisingSlice.actions;

export const getStatisticAsync = (url, params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url,
      params,
    });

    dispatch(setStatistics(res.data.data));
  } catch (error) {
    console.log(error);
  }
};

export const getCampaignsAsync = (params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `ppc/campaigns`,
      params,
    });

    dispatch(setCampaigns(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getAdGroupsAsync = (params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `ppc/ad-groups`,
      params,
    });

    dispatch(setAdGroups(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getKeywordsAsync = (params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `ppc/keywords`,
      params,
    });

    dispatch(setKeywords(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getTargetsAsync = (params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `ppc/targets`,
      params,
    });

    dispatch(setTargets(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getSearchTermsAsync = (params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `ppc/search-terms`,
      params,
    });

    dispatch(setSearchTerms(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getProductsAsync = (params) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `ppc/products`,
      params,
    });

    dispatch(setProducts(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectStatistics = (state) => state.advertising.statistics;
export const selectList = (state) => state.advertising.list;
export const selectCampaigns = (state) => state.advertising.campaigns;
export const selectAdGroups = (state) => state.advertising.adGroups;
export const selectKeywords = (state) => state.advertising.keywords;
export const selectTargets = (state) => state.advertising.targets;
export const selectProducts = (state) => state.advertising.products;
export const selectSearchTerms = (state) => state.advertising.searchTerms;

export default advertisingSlice.reducer;
