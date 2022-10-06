import axios from 'axios';
import { uniq } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

import { SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP } from 'features/advertising/utils/constants';

export const changeRequestsSlice = createSlice({
  name: 'changeRequests',
  initialState: {
    list: { rows: [] },
    selected: null,
    loading: true,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setList, setLoading, setSelected } = changeRequestsSlice.actions;

export const getChangeRequestsAsync = (params) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await axios.get('/ppc/change-requests', {
      params,
    });
    dispatch(setList(response.data.data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    console.log(error.message);
  }
};

export const getChangeRequestDetails = (id, params) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await axios.get(`/ppc/change-requests/${id}`, { params });
    let { data } = response.data;

    if (data && data.type === 'optimization') {
      const toExistingAdGroup = data.items.filter(
        (i) =>
          i.optimization.rule.action.code ===
          SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP
      );

      if (toExistingAdGroup.length) {
        const adGroupIds = uniq(
          toExistingAdGroup.map((i) => i.optimization.data.adGroupId)
        );

        const adGroupsResponse = await axios.get('/advertising/ad-groups', {
          params: {
            include: ['campaign'],
            advAdGroupIds: adGroupIds,
            pageSize: adGroupIds.length,
            campaignType: 'sponsoredProducts',
            accountId: data.advProfile.accountId,
            marketplace: data.advProfile.marketplace.countryCode,
          },
        });

        data.items = data.items.map((item) => {
          if (
            item.optimization.rule.action.code ===
            SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP
          ) {
            const adGroup = adGroupsResponse.data.data.rows.find(
              (a) =>
                a.advAdGroupId.toString() === item.optimization.data.adGroupId
            );
            item.optimization.data.adGroupName = adGroup ? adGroup.name : '';
            item.optimization.data.campaignName = adGroup
              ? adGroup.AdvCampaign.name
              : '';
          }

          return item;
        });
      }
    }

    dispatch(setSelected(data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    console.log(error.message);
  }
};

export const selectLoading = (state) => state.changeRequests.loading;
export const selectList = (state) => state.changeRequests.list;
export const selectSelectedChangeRequest = (state) =>
  state.changeRequests.selected;

export default changeRequestsSlice.reducer;
