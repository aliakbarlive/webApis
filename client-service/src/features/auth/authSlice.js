import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from '../alert/alertSlice';
import { setAccountList } from './accountSlice';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: {},
    loading: true,
    error: null,
    prefill: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
    },
    setUserIsAmazonVerified: (state, action) => {
      state.user = { ...state.user, isAmazonAuthorized: true };
    },
    setPrefill: (state, action) => {
      state.prefill = action.payload;
    },
  },
});

export const { setUser, setLoading, setUserIsAmazonVerified, setPrefill } =
  authSlice.actions;

export const getMe = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const GET_ME_RESPONSE = await axios.get('/auth/me');
    const user = GET_ME_RESPONSE.data.data;

    // if (user.accounts.length) {
    //   const GET_ACCOUNTS_RESPONSE = await axios.get('/auth/me/accounts');
    //   dispatch(setAccountList(GET_ACCOUNTS_RESPONSE.data.data));
    // }

    dispatch(setUser(user));
  } catch (error) {
    console.log(error.message);
    dispatch(setLoading(false));
  }
};

export const login = (formData, history) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const body = JSON.stringify(formData);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const LOGIN_RESPONSE = await axios.post('/auth/login', body, config);

    const user = LOGIN_RESPONSE.data.data;

    // if (user.accounts.length) {
    //   const GET_ACCOUNTS_RESPONSE = await axios.get('/auth/me/accounts');
    //   dispatch(setAccountList(GET_ACCOUNTS_RESPONSE.data.data));
    // }

    dispatch(setUser(user));
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    const url = '/auth/logout';

    await axios.get(url);

    window.location.reload();
  } catch (error) {
    console.log(error.message);
  }
};

export const register = (formData, history) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const url = '/auth/register';

    const body = JSON.stringify(formData);
    console.log(body);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(url, body, config);

    dispatch(setUser(res.data.data));

    if (formData.inviteId) {
      history.push('/onboarding/agency');
    } else {
      history.push('/onboarding');
    }
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export const getInvitePrefill = (inviteId, history) => async (dispatch) => {
  try {
    const res = await axios.post('/auth/register/prefill', {
      id: inviteId,
    });
    dispatch(setPrefill(res.data.email));
  } catch (error) {
    console.log(error.response.data);
    history.push('/register');
    dispatch(setLoading(false));
    //dispatch(setAlert(error.response.data.message));
    dispatch(setAlert('Invalid invite link'));
  }
};

export const forgotPassword = (formData, history) => async (dispatch) => {
  try {
    const url = '/auth/forgot-password';

    const body = JSON.stringify(formData);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(url, body, config);
    history.push('/forgot-password/success');
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export const resetPassword = (formData, token, history) => async (dispatch) => {
  try {
    const url = `/auth/reset-password/${token}`;

    const body = JSON.stringify(formData);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put(url, body, config);
    history.push('/reset-password/success');
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export const verifyEmail = (token, history) => async (dispatch) => {
  try {
    // dispatch(setLoading(true));

    const url = `/auth/verify-email?token=${token}`;

    const res = await axios.get(url);

    dispatch(setUser(res.data.data));

    dispatch(setAlert('Email verified', 'success'));
    // history.push('/onboarding');
  } catch (error) {
    console.log(error.response.data);
    // console.log(error.response.data.message);
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export const authorizeSellerCentral = (query, history) => async (dispatch) => {
  try {
    // dispatch(setLoading(true));

    const formData = {
      state: query.state,
      oAuthCode: query.spapi_oauth_code,
      sellingPartnerId: query.selling_partner_id,
    };

    const url = `/auth/seller-central/callback`;
    const body = JSON.stringify(formData);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post(url, body, config);

    dispatch(setAlert('Successfully authorized seller central', 'success'));
    // history.push('/onboarding');
  } catch (error) {
    console.log(error.response.data);
    // console.log(error.response.data.message);
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export const resendVerificationEmail = () => async (dispatch) => {
  try {
    // dispatch(setLoading(true));

    const url = `/auth/verify-email/resend`;

    await axios.get(url);

    dispatch(setAlert('Successfully resent verification code', 'success'));
    // history.push('/onboarding');
  } catch (error) {
    console.log(error.response.data);
    // console.log(error.response.data.message);
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export const selectisAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthenticatedUser = (state) => state.auth.user;

export default authSlice.reducer;
