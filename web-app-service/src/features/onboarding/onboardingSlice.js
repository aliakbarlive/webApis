import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAppNotification } from 'features/appNotifications/appNotificationSlice';

import { setAccounts } from 'features/accounts/accountsSlice';

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    isAuthorizing: false,
  },
  reducers: {
    setIsAuthorizing: (state, action) => {
      state.isAuthorizing = action.payload;
    },
  },
});

export const { setIsAuthorizing } = onboardingSlice.actions;

export const authorizeSpApiAsync = (query) => async (dispatch) => {
  dispatch(setIsAuthorizing(true));

  try {
    const data = {
      state: query.state,
      oAuthCode: query.spapi_oauth_code,
      sellingPartnerId: query.selling_partner_id,
    };

    const url = '/auth/selling-partner-api/callback';

    const response = await axios.post(url, data);
    dispatch(setAccounts([response.data.data]));
    dispatch(
      setAppNotification(
        'success',
        'Successfully authorized Selling Partner API'
      )
    );
  } catch (error) {
    console.log(error);
    dispatch(
      setAppNotification(
        'error',
        'Authorization Error',
        error.response.data.message
      )
    );
  }

  dispatch(setIsAuthorizing(false));
};

export const authorizeAdvApiAsync = (query) => async (dispatch) => {
  dispatch(setIsAuthorizing(true));

  try {
    const data = {
      oAuthCode: query.code,
      sellingPartnerId: query.selling_partner_id,
    };

    const url = '/auth/advertising-api/callback';

    const response = await axios.post(url, data);
    dispatch(setAccounts([response.data.data]));
    dispatch(
      setAppNotification('success', 'Successfully authorized Advertising API')
    );
  } catch (error) {
    dispatch(
      setAppNotification(
        'error',
        'Authorization Error',
        error.response.data.message
      )
    );
  }

  dispatch(setIsAuthorizing(false));
};

export const selectIsAuthorizing = (state) => state.onboarding.isAuthorizing;

export default onboardingSlice.reducer;
