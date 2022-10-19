import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from '../alert/alertSlice';
import { setUser, setUserIsAmazonVerified } from '../auth/authSlice';

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    isAuthorizing: false,
    agencyClient: null,
    hostedPage: {},
    hasNewHostedPage: false,
    hasSubscription: null,
  },
  reducers: {
    setIsAuthorizing: (state, action) => {
      state.isAuthorizing = action.payload;
    },
    setAgencyClient: (state, action) => {
      state.agencyClient = action.payload;
    },
    setHostedPage: (state, action) => {
      state.hostedPage = action.payload;
      state.hasNewHostedPage = true;
    },
    setHasSubscription: (state, action) => {
      state.hasSubscription = action.payload;
    },
  },
});

export const {
  setIsAuthorizing,
  setAgencyClient,
  setHostedPage,
  setHasSubscription,
} = onboardingSlice.actions;

export const verifyEmail = (token) => async (dispatch) => {
  try {
    const url = `/auth/verify-email?token=${token}`;

    const res = await axios.get(url);

    dispatch(setUser(res.data.data));

    dispatch(setAlert('Email verified', 'success'));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setAlert(error.response.data.message));
  }
};

export const resendVerificationEmail = () => async (dispatch) => {
  try {
    const url = `/auth/verify-email/resend`;

    await axios.get(url);

    dispatch(setAlert('Successfully resent verification code', 'success'));
  } catch (error) {
    dispatch(setAlert(error.response.data.message));
  }
};

export const authorizeSellerCentral = (query, history) => async (dispatch) => {
  dispatch(setIsAuthorizing(true));

  try {
    const data = {
      state: query.state,
      oAuthCode: query.spapi_oauth_code,
      sellingPartnerId: query.selling_partner_id,
    };

    const url = `/auth/selling-partner-api/callback`;
    const body = JSON.stringify(data);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post(url, body, config);

    dispatch(setUser(response.data.data));
    dispatch(setAlert('Successfully authorized Advertising API', 'success'));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setAlert(error.response.data.message));
  }

  dispatch(setIsAuthorizing(false));
};

export const authorizeAdvAPI = (query, history) => async (dispatch) => {
  dispatch(setIsAuthorizing(true));

  try {
    const data = {
      oAuthCode: query.code,
      sellingPartnerId: query.selling_partner_id,
    };

    const url = `/auth/advertising-api/callback`;
    const body = JSON.stringify(data);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post(url, body, config);

    dispatch(setUser(response.data.data));
    dispatch(setAlert('Successfully authorized Advertising API', 'success'));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setAlert(error.response.data.message));
  }

  dispatch(setIsAuthorizing(false));
};

export const getAgencySubscription = () => async (dispatch) => {
  dispatch(setIsAuthorizing(true));
  try {
    const res = await axios.get('/auth/me/agency-subscription');

    dispatch(setAgencyClient(res.data.data));
  } catch (error) {
    console.log(error.message);
  }

  dispatch(setIsAuthorizing(false));
};

export const hasAgencySubscription = () => async (dispatch) => {
  try {
    const res = await axios.post('/auth/me/agency-subscription');
    dispatch(setHasSubscription(res.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const createZohoSubscription =
  (hostedpageDetails) => async (dispatch) => {
    dispatch(setIsAuthorizing(true));
    try {
      const res = await axios.post('/agency/subscription', hostedpageDetails);
      dispatch(setHostedPage(res.data.output));
    } catch (error) {
      console.log(error.message);
    }

    dispatch(setIsAuthorizing(false));
  };

export const selectUser = (state) => state.auth.user;
export const selectIsAuthorizing = (state) => state.onboarding.isAuthorizing;
export const selectAgencyClient = (state) => state.onboarding.agencyClient;

export default onboardingSlice.reducer;
