import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from 'features/alert/alertSlice';

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/getSubscriptions',
  async () => {
    const response = await axios.get(
      '/agency/subscription?status=All&page=1&per_page=10'
    );
    return response.data.output;
  }
);

export const fetchSubscription = createAsyncThunk(
  'subscriptions/getSubscription',
  async (id, thunkAPI) => {
    const response = await axios.get(`/agency/subscription/${id}`);
    return response.data;
  }
);

export const fetchScheduledChanges = createAsyncThunk(
  'subscriptions/getScheduledChanges',
  async (id, thunkAPI) => {
    const response = await axios.get(
      `/agency/subscription/${id}/scheduledchanges`
    );
    return response.data.output;
  }
);

export const fetchRecentActivites = createAsyncThunk(
  'subscriptions/getRecentActivites',
  async (id, thunkAPI) => {
    const response = await axios.get(
      `/agency/subscription/${id}/recentactivities`
    );
    return response.data.output;
  }
);

export const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    subscriptions: [],
    subscription: null,
    recentActivities: [],
    scheduledChanges: [],
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: {
    [fetchSubscriptions.fulfilled]: (state, { payload }) => {
      state.subscriptions = payload;
    },
    [fetchSubscription.fulfilled]: (state, { payload }) => {
      state.subscription = payload.subscription;
      state.scheduledChanges = payload.scheduledChanges;
    },

    [fetchScheduledChanges.fulfilled]: (state, { payload }) => {
      state.scheduledChanges = payload;
    },
    [fetchRecentActivites.fulfilled]: (state, { payload }) => {
      state.recentActivities = payload;
    },
  },
});

export const { setLoading } = subscriptionsSlice.actions;

export const updateCard = (subscriptionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(
      `agency/subscription/${subscriptionId}/updatecard`
    );
    dispatch(
      setAlert(
        "A link was sent to the client's default contact email with the steps to update their payment details",
        'success'
      )
    );
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export const updateAutoCollect =
  (subscriptionId, autoCollect) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const body = JSON.stringify({ auto_collect: autoCollect });
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(
        `agency/subscription/${subscriptionId}/autocollect`,
        body,
        config
      );

      dispatch(
        setAlert(
          `Subscription set to ${autoCollect ? 'Online' : 'Offline'}`,
          'success'
        )
      );
      dispatch(fetchSubscription(subscriptionId));
      dispatch(setLoading(false));
    } catch (error) {
      //console.log(error.response.data);
      dispatch(setLoading(false));
      dispatch(setAlert(error.response.data.message));
    }
  };

export const dropScheduledChanges = (subscriptionId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(
      `agency/subscription/${subscriptionId}/scheduledchanges`
    );
    dispatch(setAlert('success', 'Dropped Scheduled Changes'));
    //dispatch(fetchSubscription(subscriptionId));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export default subscriptionsSlice.reducer;
