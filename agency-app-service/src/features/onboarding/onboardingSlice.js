import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from 'features/alerts/alertsSlice';
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

export const authorizeSpApiAsync = (query, redirectUrl) => async (dispatch) => {
  dispatch(setIsAuthorizing(true));

  try {
    const data = {
      state: query.state,
      oAuthCode: query.spapi_oauth_code,
      sellingPartnerId: query.selling_partner_id,
      redirectUrl,
    };

    const url = '/auth/selling-partner-api/callback';

    const response = await axios.post(url, data);
    dispatch(setAccounts([response.data.data]));
    dispatch(
      setAlert('success', 'Successfully authorized Selling Partner API')
    );
    dispatch(setIsAuthorizing(false));

    return true;
  } catch (error) {
    console.log(error);
    dispatch(
      setAlert('error', 'Authorization Error', error.response.data.message)
    );
    dispatch(setIsAuthorizing(false));

    return false;
  }
};

export const authorizeAdvApiAsync =
  (query, redirectUrl) => async (dispatch) => {
    dispatch(setIsAuthorizing(true));

    try {
      const data = {
        oAuthCode: query.code,
        sellingPartnerId: query.selling_partner_id,
        redirectUrl,
      };

      const url = '/auth/advertising-api/callback';

      const response = await axios.post(url, data);
      dispatch(setAccounts([response.data.data]));
      dispatch(setAlert('success', 'Successfully authorized Advertising API'));
      dispatch(setIsAuthorizing(false));

      return true;
    } catch (error) {
      dispatch(
        setAlert('error', 'Authorization Error', error.response.data.message)
      );
      dispatch(setIsAuthorizing(false));

      return false;
    }
  };

export const selectIsAuthorizing = (state) => state.onboarding.isAuthorizing;

export default onboardingSlice.reducer;
