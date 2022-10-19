import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from 'features/alert/alertSlice';

export const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    subscriptions: [],
    prepData: {
      nonSubscribers: [],
      plans: [],
      currencies: [],
      exchangeRates: [],
    },
    loading: false,
    error: null,
    hostedPage: {},
    hasNewHostedPage: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSubscriptions: (state, action) => {
      state.subscriptions = action.payload;
    },
    setPrepData: (state, action) => {
      state.prepData = action.payload;
    },
    setHostedPage: (state, action) => {
      state.hostedPage = action.payload;
      state.hasNewHostedPage = true;
      state.loading = false;
    },
    setHasNewHostedPage: (state, action) => {
      state.hasNewHostedPage = action.payload;
    },
  },
});

export const {
  setSubscriptions,
  setPrepData,
  setLoading,
  setHostedPage,
  setHasNewHostedPage,
} = subscriptionsSlice.actions;

export const getSubscriptionsAsync = () => async (dispatch) => {
  try {
    const res = await axios({
      method: 'get',
      url: '/agency/subscription?status=All&page=1&per_page=10',
    });

    dispatch(setSubscriptions(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getPrepDataAsync = () => async (dispatch) => {
  try {
    const data = await Promise.all([
      axios.get('/agency/invoicing/notsubbed/sellingpartners'),
      axios.get('/agency/invoicing/list?operation=plans'),
      axios.get('/agency/invoicing/currency'),
      axios.get('/agency/invoicing/currency/exchangerates'),
    ]);

    const prepData = {
      nonSubscribers: data[0].data.data,
      plans: data[1].data.data,
      currencies: data[2].data.output,
      exchangeRates: data[3].data.data,
    };

    dispatch(setPrepData(prepData));
  } catch (error) {
    console.log(error.message);
  }
};

export const subscribe = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const body = JSON.stringify(formData);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post('agency/invoicing/subscription', body, config);
    dispatch(setHostedPage(res.data.output));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export const hasNewHostedPage = (value) => async (dispatch) => {
  dispatch(setHasNewHostedPage(value));
};

export const selectSubscriptions = (state) => state.subscriptions.subscriptions;
export default subscriptionsSlice.reducer;
