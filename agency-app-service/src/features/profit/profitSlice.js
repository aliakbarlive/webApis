import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const accountsSlice = createSlice({
  name: 'profit',
  initialState: {
    metrics: null,
    prevMetrics: null,
    netProfit: null,
    netRevenue: null,
    totalCost: null,
    margin: null,
    ROI: null,
    profitGraph: null,
    prevProfitGraph: null,
  },
  reducers: {
    setMetrics: (state, action) => {
      state.metrics = action.payload;
    },
    setPrevMetrics: (state, action) => {
      state.prevMetrics = action.payload;
    },
    setNetProfit: (state, action) => {
      state.netProfit = action.payload;
    },
    setNetRevenue: (state, action) => {
      state.netRevenue = action.payload;
    },
    setTotalCost: (state, action) => {
      state.totalCost = action.payload;
    },
    setMargin: (state, action) => {
      state.margin = action.payload;
    },
    setRoi: (state, action) => {
      state.roi = action.payload;
    },
    setProfitGraph: (state, action) => {
      state.profitGraph = action.payload;
    },
    setPrevProfitGraph: (state, action) => {
      state.prevProfitGraph = action.payload;
    },
  },
});

export const {
  setMetrics,
  setPrevMetrics,
  setNetProfit,
  setNetRevenue,
  setTotalCost,
  setMargin,
  setRoi,
  setProfitGraph,
  setPrevProfitGraph,
} = accountsSlice.actions;

export const getMetricsAsync =
  (selectedDates, prev = false) =>
  async (dispatch, getState) => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/profit/metrics',
        params: {
          ...selectedDates,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      if (prev === false) {
        dispatch(setMetrics(res.data.data));
      } else {
        dispatch(setPrevMetrics(res.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

export const getNetProfitAsync =
  (selectedDates) => async (dispatch, getState) => {
    try {
      const breakdown = await axios({
        method: 'GET',
        url: '/profit/breakdown/net-profit',
        params: {
          ...selectedDates,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      const history = await axios({
        method: 'GET',
        url: '/profit/history/net-profit',
        params: {
          ...selectedDates,
          view: 'day',
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      dispatch(
        setNetProfit({
          breakdown: breakdown.data.data,
          history: history.data.data,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

export const getNetRevenueAsync =
  (selectedDates) => async (dispatch, getState) => {
    try {
      const breakdown = await axios({
        method: 'GET',
        url: '/profit/breakdown/net-revenue',
        params: {
          ...selectedDates,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      const history = await axios({
        method: 'GET',
        url: '/profit/history/net-revenue',
        params: {
          ...selectedDates,
          view: 'day',
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      dispatch(
        setNetRevenue({
          breakdown: breakdown.data.data,
          history: history.data.data,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

export const getTotalCostAsync =
  (selectedDates) => async (dispatch, getState) => {
    try {
      const breakdown = await axios({
        method: 'GET',
        url: '/profit/breakdown/cost',
        params: {
          ...selectedDates,
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      const history = await axios({
        method: 'GET',
        url: '/profit/history/cost',
        params: {
          ...selectedDates,
          view: 'day',
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });

      dispatch(
        setTotalCost({
          breakdown: breakdown.data.data,
          history: history.data.data,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

export const getMarginAsync = (selectedDates) => async (dispatch, getState) => {
  try {
    const breakdown = await axios({
      method: 'GET',
      url: '/profit/breakdown/margin',
      params: {
        ...selectedDates,
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });

    const history = await axios({
      method: 'GET',
      url: '/profit/history/margin',
      params: {
        ...selectedDates,
        view: 'day',
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });

    dispatch(
      setMargin({
        breakdown: breakdown.data.data,
        history: history.data.data,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const getRoiAsync = (selectedDates) => async (dispatch, getState) => {
  try {
    const breakdown = await axios({
      method: 'GET',
      url: '/profit/breakdown/roi',
      params: {
        ...selectedDates,
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });

    const history = await axios({
      method: 'GET',
      url: '/profit/history/roi',
      params: {
        ...selectedDates,
        view: 'day',
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });

    dispatch(
      setRoi({
        breakdown: breakdown.data.data,
        history: history.data.data,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const getProfitGraphAsync =
  (selectedDates, filters, prev = false) =>
  async (dispatch, getState) => {
    try {
      const history = await axios({
        method: 'GET',
        url: '/profit/history/profit-graph',
        params: {
          ...selectedDates,
          view: 'day',
          filters: filters.join(','),
          accountId: getState().accounts.currentAccount.accountId,
          marketplace:
            getState().accounts.currentMarketplace.details.countryCode,
        },
      });
      if (prev === false) {
        dispatch(setProfitGraph(history.data.data));
      } else {
        const data = history.data.data.map((d) => {
          const {
            date: prevDate,
            unitSoldAmount,
            orderAmount,
            netRevenueAmount,
            promotionAmount,
            refundAmount,
            costsAmount,
            cogsAmount,
            ppcAmount,
            netProfitAmount,
            profitMarginAmount,
          } = d;
          let result = {
            prevDate,
            prevUnitSoldAmount: unitSoldAmount ? unitSoldAmount : null,
            prevOrderAmount: orderAmount ? orderAmount : null,
            prevNetRevenueAmount: netRevenueAmount ? netRevenueAmount : null,
            prevPromotionAmount: promotionAmount ? promotionAmount : null,
            prevRefundAmount: refundAmount ? refundAmount : null,
            prevCostsAmount: costsAmount ? costsAmount : null,
            prevCogsAmount: cogsAmount ? cogsAmount : null,
            prevPpcAmount: ppcAmount ? ppcAmount : null,
            prevNetProfitAmount: netProfitAmount ? netProfitAmount : null,
            prevProfitMarginAmount: profitMarginAmount
              ? profitMarginAmount
              : null,
          };

          for (var propName in result) {
            if (result[propName] === null || result[propName] === undefined) {
              delete result[propName];
            }
          }
          return result;
        });
        dispatch(setPrevProfitGraph(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

export const selectMetrics = (state) => state.profit.metrics;
export const selectPrevMetrics = (state) => state.profit.prevMetrics;
export const selectNetProfit = (state) => state.profit.netProfit;
export const selectNetRevenue = (state) => state.profit.netRevenue;
export const selectTotalCost = (state) => state.profit.totalCost;
export const selectMargin = (state) => state.profit.margin;
export const selectRoi = (state) => state.profit.roi;
export const selectProfitGraph = (state) => state.profit.profitGraph;
export const selectPrevProfitGraph = (state) => state.profit.prevProfitGraph;

export default accountsSlice.reducer;
