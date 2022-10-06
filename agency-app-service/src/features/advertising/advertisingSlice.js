import { createSlice } from '@reduxjs/toolkit';
import { isObject, kebabCase, keys } from 'lodash';
import moment from 'moment';
import axios from 'axios';

import { KEY_FIELDS } from './utils/constants';
import { setAlert } from 'features/alerts/alertsSlice';
import { optimize } from './utils/optimization';

export const advertisingSlice = createSlice({
  name: 'advertising',
  initialState: {
    exporting: false,
    statistics: {},
    campaigns: { rows: [] },
    adGroups: { rows: [] },
    keywords: {},
    targets: {},
    products: { rows: [] },
    searchTerms: { rows: [] },
    productAds: { rows: [] },
    records: [],
    rules: {},
    list: {},
    optimizations: [],
    ruleActions: { rows: [] },
    portfolios: { rows: [] },
    changeCollections: {},
    prevOptimizations: { rows: [] },
    displayCampaignTypeChart: false,
    displayTargetingTypeChart: false,
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
    setProductAds: (state, action) => {
      state.productAds = action.payload;
    },
    setSearchTerms: (state, action) => {
      state.searchTerms = action.payload;
    },
    setRecords: (state, action) => {
      state.records = action.payload;
    },
    setExporting: (state, action) => {
      state.exporting = action.payload;
    },
    setRules: (state, action) => {
      state.rules = action.payload;
    },
    setRuleActions: (state, action) => {
      state.ruleActions = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
    setPortfolios: (state, action) => {
      state.portfolios = action.payload;
    },
    setPrevOptimizations: (state, action) => {
      state.prevOptimizations = action.payload;
    },
    setOptimizations: (state, action) => {
      state.optimizations = action.payload;
    },
    setOptimizationItem: (state, action) => {
      const { index, value } = action.payload;
      if (value.selected) {
        state.optimizations
          .filter((opt) => opt.optimizableId === value.optimizableId)
          .forEach((opt) => {
            opt.selected = false;
          });
      }

      state.optimizations[index] = value;
    },
    setChangeCollections: (state, action) => {
      state.changeCollections = action.payload;
    },
    setDisplayCampaignTypeChart: (state, action) => {
      state.displayCampaignTypeChart = action.payload;
    },
    setDisplayTargetingTypeChart: (state, action) => {
      state.displayTargetingTypeChart = action.payload;
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
  setProductAds,
  setSearchTerms,
  setRecords,
  setExporting,
  setRules,
  setList,
  setPortfolios,
  setRuleActions,
  setOptimizations,
  setOptimizationItem,
  setNegativeKeywords,
  setPrevOptimizations,
  setChangeCollections,
  setDisplayCampaignTypeChart,
  setDisplayTargetingTypeChart,
} = advertisingSlice.actions;

export const getListAsync =
  (recordType, params) => async (dispatch, getState) => {
    try {
      const res = await axios({
        method: 'GET',
        url: `ppc/${kebabCase(recordType)}`,
        params,
      });

      const key = KEY_FIELDS[recordType];
      let optimizations = [...getState().advertising.optimizations];
      res.data.data.rows.forEach((row) => {
        row.rules.forEach((rule) => {
          const idx = optimizations.findIndex(
            (opt) =>
              opt.optimizableId === row[key] && opt.ruleId === rule.advRuleId
          );

          if (idx < 0) {
            optimizations.push({
              values: row,
              selected: false,
              ruleId: rule.advRuleId,
              optimizableId: row[key],
              data: optimize(rule.action, rule.actionData, row),
            });
          }
        });
      });
      dispatch(setOptimizations(optimizations));
      dispatch(setList(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

export const getPrevOptimizationsAsync = (params) => async (dispatch) => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'ppc/optimizations',
      params,
    });

    await dispatch(setPrevOptimizations(response.data.data));
  } catch (error) {
    console.log(error);
  }
};

export const proceedOptimizationAsync = (data) => async (dispatch) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'ppc/optimizations',
      data,
    });

    await dispatch(setAlert('success', response.data.message));
  } catch (error) {
    console.log(error);
  }
};

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
    const response = await axios({
      method: 'GET',
      url: 'advertising/campaigns',
      params,
    });

    dispatch(setCampaigns(response.data.data));

    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateCampaignAsync = (campaignId, data) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.put(`ppc/campaigns/${campaignId}`, data);

      await dispatch(setAlert('success', response.data.message));
      resolve();
    } catch (error) {
      const { errors, message: title } = error.response.data;
      await dispatch(
        setAlert('error', title, errors ? errors[keys(errors)[0]] : '')
      );
      reject(title);
    }
  });
};

export const getAdGroupsAsync = (params) => async (dispatch) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `ppc/ad-groups`,
      params,
    });

    dispatch(setAdGroups(response.data.data));

    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateAdGroupsAsync = (data) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.put('ppc/ad-groups', data);

      await dispatch(setAlert('success', response.data.message));
      resolve();
    } catch (error) {
      const { errors, message: title } = error.response.data;
      await dispatch(
        setAlert('error', title, errors ? errors[keys(errors)[0]] : '')
      );
      reject(title);
    }
  });
};

export const getKeywordsAsync = (params) => async (dispatch) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `advertising/keywords`,
      params,
    });

    dispatch(setKeywords(response.data.data));

    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const createKeywordsAsync = (data) => async (dispatch) => {
  try {
    const response = await axios({ method: 'POST', url: `ppc/keywords`, data });

    await dispatch(setAlert('success', response.data.message));
  } catch (error) {
    await dispatch(setAlert('error', error.response.data.message));
  }
};

export const updateKeywordsAsync = (data) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.put('ppc/keywords', data);

      await dispatch(setAlert('success', response.data.message));
      resolve();
    } catch (error) {
      const { errors, message: title } = error.response.data;
      await dispatch(
        setAlert('error', title, errors ? errors[keys(errors)[0]] : '')
      );
      reject(title);
    }
  });
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
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get('/advertising/product-ads/products', {
        params,
      });

      const { data } = response.data;
      dispatch(setProducts(data));
      resolve(data);
    } catch (error) {
      reject();
    }
  });
};

export const getProductAdsAsync = (params) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get('ppc/product-ads', { params });

      const { data } = response.data;
      dispatch(setProductAds(data));

      resolve(data);
    } catch (error) {
      reject();
    }
  });
};

export const getRecordsAsync =
  (url, params, selectedMetrics) => async (dispatch) => {
    try {
      const { startDate, endDate } = params;
      params.attributes = selectedMetrics.map((m) => m.value).join(',');

      const records = [];

      const response = await axios({
        method: 'GET',
        url,
        params,
      });

      const apiData = response.data.data;

      let ref = moment(startDate);

      while (ref.isSameOrBefore(moment(endDate).format('YYYY-MM-DD'))) {
        const date = ref.format('YYYY-MM-DD');
        const value = apiData.find((r) => r.date === date);
        let data = { date };

        selectedMetrics.forEach((metric) => {
          let metricValue =
            isObject(value) && metric.value in value ? value[metric.value] : 0;

          data[metric.label] = ['acos', 'ctr', 'cr'].includes(metric.value)
            ? (parseFloat(metricValue) * 100).toFixed(2)
            : metricValue;
        });

        records.push(data);
        ref.add(1, 'd');
      }

      dispatch(setRecords(records));
    } catch (error) {
      dispatch(setRecords([]));
    }
  };

export const exportDataAsync = (params) => async (dispatch) => {
  try {
    dispatch(setExporting(true));

    const response = await axios({
      method: 'GET',
      url: '/ppc/export',
      responseType: 'arraybuffer',
      params,
    });

    const type = response.headers['content-type'];
    let fileName = `${params.recordType}-${new Date().valueOf()}.csv`;

    if (response.headers['Content-Disposition']) {
      fileName = response.headers['Content-Disposition']
        .replace('attachment; filename="', '')
        .replace('"', '');
    }

    const blob = new Blob([response.data], {
      type: type,
      encoding: 'UTF-8',
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    dispatch(setExporting(false));
  } catch (error) {
    dispatch(setExporting(false));
  }
};

export const createCampaignNegativeKeywordsAsync =
  (data, searchTerms = []) =>
  async (dispatch) => {
    const { accountId, marketplace } = data;
    try {
      const response = await axios({
        method: 'POST',
        url: '/ppc/campaign-negative-keywords',
        data,
      });

      await axios.put('ppc/search-terms', {
        accountId,
        marketplace,
        searchTerms: searchTerms.map((st) => {
          return {
            searchTermId: st,
            data: { convertedAsCampaignNegativeKeyword: true },
          };
        }),
      });

      await dispatch(setAlert('success', response.data.message));
    } catch (error) {
      await dispatch(setAlert('error', error.response.data.message));
    }
  };

export const createNegativeKeywordsAsync =
  (data, searchTerms = []) =>
  async (dispatch) => {
    const { accountId, marketplace } = data;

    try {
      const response = await axios({
        method: 'POST',
        url: '/ppc/negative-keywords',
        data,
      });

      await axios.put('ppc/search-terms', {
        accountId,
        marketplace,
        searchTerms: searchTerms.map((st) => {
          return {
            searchTermId: st,
            data: { convertedAsNegativeKeyword: true },
          };
        }),
      });

      await dispatch(setAlert('success', response.data.message));
    } catch (error) {
      await dispatch(setAlert('error', error.response.data.message));
    }
  };

export const getRuleActionsAsync = (params) => async (dispatch) => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'ppc/rules/actions',
      params,
    });

    dispatch(setRuleActions(response.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getRulesAsync = (params) => async (dispatch) => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'ppc/rules',
      params,
    });

    dispatch(setRules(response.data.data));

    return response.data.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const createRuleAsync = (data) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post('ppc/rules', data);
      await dispatch(setAlert('success', response.data.message));

      resolve(response.data);
    } catch (error) {
      await dispatch(setAlert('error', error.response.data.message));
      reject(error.response.data.errors);
    }
  });
};

export const getPortfoliosAsync = (params) => async (dispatch) => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'ppc/portfolios',
      params,
    });

    dispatch(setPortfolios(response.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getChangeCollectionsAsync = (params) => async (dispatch) => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'ppc/change-collections',
      params,
    });

    dispatch(setChangeCollections(response.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectList = (state) => state.advertising.list;
export const selectStatistics = (state) => state.advertising.statistics;
export const selectCampaigns = (state) => state.advertising.campaigns;
export const selectAdGroups = (state) => state.advertising.adGroups;
export const selectKeywords = (state) => state.advertising.keywords;
export const selectTargets = (state) => state.advertising.targets;
export const selectProducts = (state) => state.advertising.products;
export const selectProductAds = (state) => state.advertising.productAds;
export const selectSearchTerms = (state) => state.advertising.searchTerms;
export const selectRecords = (state) => state.advertising.records;
export const selectExporting = (state) => state.advertising.exporting;
export const selectCurrentFilter = (state) => state.advertising.currentFilter;
export const selectRules = (state) => state.advertising.rules;
export const selectRuleActions = (state) => state.advertising.ruleActions;
export const selectOptimizations = (state) => state.advertising.optimizations;
export const selectPortfolios = (state) => state.advertising.portfolios;
export const selectChangeCollections = (state) =>
  state.advertising.changeCollections;
export const selectPrevOptimizations = (state) =>
  state.advertising.prevOptimizations;

export const selectDisplayCampaignTypeChart = (state) =>
  state.advertising.displayCampaignTypeChart;

export const selectDisplayTargetingTypeChart = (state) =>
  state.advertising.displayTargetingTypeChart;

export default advertisingSlice.reducer;
