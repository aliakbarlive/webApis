import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { joiAlertErrorsStringify } from 'utils/formatters';
import { setAlert } from '../alerts/alertsSlice';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

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

export const createOfflineSubscription =
  (formData, history) => async (dispatch) => {
    try {
      const body = JSON.stringify(formData);
      await axios.post(`agency/subscription/offline`, body, config);
      await dispatch(setAlert('success', `Offline subscription created`));
      history.push('/clients');
    } catch (error) {
      console.log(error.response.data);
      dispatch(setLoading(false));
      dispatch(setAlert('error', error.response.data.message));
    }
  };

export const changeSubscription =
  (subscriptionId, formData) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const body = JSON.stringify(formData);
      const res = await axios.put(
        `agency/subscription/${subscriptionId}`,
        body,
        config
      );

      //dispatch(setAlert('success', `Subscription updated`));

      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setLoading(false));
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

export const updateCard = (subscriptionId, email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axios.post(`agency/subscription/${subscriptionId}/updatecard`);
    dispatch(
      setAlert(
        'success',
        `A link was sent to ${email} with the steps to update their payment details`
      )
    );
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert('error', error.response.data.message));
  }
};

export const updateAutoCollect =
  (subscriptionId, autoCollect) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const body = JSON.stringify({ auto_collect: autoCollect });
      await axios.post(
        `agency/subscription/${subscriptionId}/autocollect`,
        body,
        config
      );

      dispatch(
        setAlert(
          'success',
          `Subscription set to ${autoCollect ? 'Online' : 'Offline'}`
        )
      );

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setAlert('error', error.response.data.message));
    }
  };

export const dropScheduledChanges = (subscriptionId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(
      `agency/subscription/${subscriptionId}/scheduledchanges`
    );
    dispatch(setAlert('success', `Drop scheduled changes successful!`));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert('error', error.response.data.message));
  }
};

export const cancelSubscription =
  (subscriptionId, cancelAtEnd) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const body = JSON.stringify({ cancelAtEnd: cancelAtEnd });
      await axios.post(
        `agency/subscription/${subscriptionId}/cancel`,
        body,
        config
      );
      dispatch(setAlert('success', `Subscription Cancelled!`));
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error.response.data);
      dispatch(setLoading(false));
      dispatch(setAlert('error', error.response.data.message));
    }
  };

export const deleteSubscription = (subscriptionId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(`agency/subscription/${subscriptionId}`);
    dispatch(setAlert('success', `Subscription Deleted!`));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert('error', error.response.data.message));
  }
};

export const reactivateSubscription = (subscriptionId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.post(`agency/subscription/${subscriptionId}/reactivate`);
    dispatch(setAlert('success', `Subscription Reactivated!`));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert('error', error.response.data.message));
  }
};

export const addCharge = (subscriptionId, formData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const body = JSON.stringify(formData);
    const res = await axios.post(
      `agency/subscription/${subscriptionId}/addcharge`,
      body,
      config
    );

    if (res.data.output.code === 0) {
      dispatch(setAlert('success', res.data.output.message));
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert('error', error.response.data.message));
  }
};

export const buyOneTimeAddon = (subscriptionId, addons) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const body = JSON.stringify({ addons: addons });
    const res = await axios.post(
      `agency/subscription/${subscriptionId}/buyonetimeaddon`,
      body,
      config
    );

    if (res.data.output.code === 0) {
      dispatch(setAlert('success', res.data.output.message));
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    dispatch(setLoading(false));
    return res.data;
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert('error', error.response.data.message));
  }
};

export const extendBillingCycle =
  (subscriptionId, billing_cycles) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const body = JSON.stringify({ billing_cycles: billing_cycles });
      const res = await axios.post(
        `agency/subscription/${subscriptionId}/extend`,
        body,
        config
      );

      if (res.data.output.code === 0) {
        dispatch(setAlert('success', res.data.output.message));
      } else {
        dispatch(setAlert('error', res.data.output.message));
      }
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      console.log(error.response.data);
      dispatch(setLoading(false));
      dispatch(setAlert('error', error.response.data.message));
    }
  };

export const changeSubscriptionStatus =
  (subscriptionId, status) => async (dispatch) => {
    // status = pause | resume
    dispatch(setLoading(true));
    try {
      const res = await axios.post(
        `agency/subscription/${subscriptionId}/${status}`
      );

      if (res.data.output.code === 0) {
        dispatch(
          setAlert(
            'success',
            `${res.data.output.message} Subscription ${status}d`
          )
        );
      } else {
        dispatch(setAlert('error', res.data.output.message));
      }
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      console.log(error.response.data);
      dispatch(setLoading(false));
      dispatch(setAlert('error', error.response.data.message));
    }
  };

export const postponeRenewal =
  (subscriptionId, renewalAt) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const body = JSON.stringify({ renewal_at: renewalAt });
      const res = await axios.post(
        `agency/subscription/${subscriptionId}/postpone`,
        body,
        config
      );

      if (res.data.output.code === 0) {
        dispatch(setAlert('success', res.data.output.message));
      } else {
        dispatch(setAlert('error', res.data.output.message));
      }
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      console.log(error.response.data);
      dispatch(setLoading(false));
      dispatch(setAlert('error', error.response.data.message));
    }
  };

export const updateCustomField =
  (subscriptionId, label, value) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const body = JSON.stringify({ label, value });
      const res = await axios.post(
        `agency/subscription/${subscriptionId}/customfields`,
        body,
        config
      );

      if (res.data.output.code === 0) {
        dispatch(setAlert('success', res.data.output.message));
      } else {
        dispatch(setAlert('error', res.data.output.message));
      }
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      console.log(error.response.data);
      dispatch(setLoading(false));
      dispatch(setAlert('error', error.response.data.message));
    }
  };

export const updatePlanDescription =
  (subscriptionId, planCode, description) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      //const body = { description };
      const res = await axios.post(
        `agency/subscription/${subscriptionId}/lineitems/${planCode}`,
        { description }
      );

      if (res.data.output.code === 0) {
        dispatch(setAlert('success', res.data.output.message));
      } else {
        dispatch(setAlert('error', res.data.output.message));
      }
      dispatch(setLoading(false));
      return res.data;
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setLoading(false));
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

export const addNote = (subscriptionId, description) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.post(
      `agency/subscription/${subscriptionId}/notes`,
      { description }
    );

    if (res.data.output.code === 0) {
      dispatch(setAlert('success', res.data.output.message));
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    dispatch(setLoading(false));
    return res.data;
  } catch (error) {
    const errorMessages = joiAlertErrorsStringify(error);
    dispatch(setLoading(false));
    dispatch(setAlert('error', error.response.data.message, errorMessages));
  }
};

export const deleteNote = (subscriptionId, noteId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.delete(
      `agency/subscription/${subscriptionId}/notes/${noteId}`
    );

    if (res.data.output.code === 0) {
      dispatch(setAlert('success', res.data.output.message));
    } else {
      dispatch(setAlert('error', res.data.output.message));
    }
    dispatch(setLoading(false));
    return res.data;
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert('error', error.response.data.message));
  }
};

export default subscriptionsSlice.reducer;
