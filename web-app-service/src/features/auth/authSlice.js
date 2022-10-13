import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAccountsAsync } from 'features/accounts/accountsSlice';

import { setAppNotification } from 'features/appNotifications/appNotificationSlice';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: null,
    user: {},
    loading: true,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser, setIsAuthenticated, setLoading } = authSlice.actions;

export const getMeAsync = () => async (dispatch) => {
  await dispatch(setLoading(true));

  try {
    const res = await axios.get('/auth/me');

    await dispatch(setUser(res.data.data));
    await dispatch(setIsAuthenticated(true));
    await dispatch(getAccountsAsync());
    await dispatch(setLoading(false));
  } catch (error) {
    console.log(error.message);
    await dispatch(setIsAuthenticated(false));
    await dispatch(setLoading(false));
  }
};

export const signInAsync = (formData, history) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));

    const res = await axios({
      method: 'POST',
      url: '/auth/login',
      data: formData,
    });

    await dispatch(setIsAuthenticated(true));
    await dispatch(setUser(res.data.data));
    await dispatch(getAccountsAsync());
    await dispatch(setLoading(false));

    history.push('/plan');
  } catch (error) {
    await dispatch(setIsAuthenticated(false));
    await dispatch(setLoading(false));
    await dispatch(
      setAppNotification(
        'error',
        'Authentication Error',
        error.response.data.message
      )
    );
  }
};

export const forgotPassword = (formData, history) => async (dispatch) => {
  try {
    await axios.post('/auth/forgot-password', formData);
    history.push('/forgot-password/success');
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAppNotification('error', error.response.data.message));
  }
};

export const signOutAsync = (history) => async (dispatch) => {
  try {
    await axios({
      method: 'GET',
      url: '/auth/logout',
    });

    // history.push(null, '/sign-in');

    await dispatch(setIsAuthenticated(false));
    await dispatch(setUser({}));
    await dispatch(setAppNotification('success', 'Successfully signed out'));
  } catch (error) {
    console.log(error.message);
  }
};

export const registerWithEmailAndPasswordAsync =
  (formData, history) => async (dispatch) => {
    try {
      await dispatch(setLoading(true));

      const res = await axios({
        method: 'POST',
        url: '/auth/register',
        data: formData,
      });

      await dispatch(setIsAuthenticated(true));
      await dispatch(setUser(res.data.data));
      await dispatch(getAccountsAsync());
      await dispatch(setLoading(false));

      history.push('/email-verification');
    } catch (error) {
      await dispatch(setLoading(false));
      await dispatch(
        setAppNotification(
          'error',
          'Registration Error',
          error.response.data.message
        )
      );
    }
  };

export const registerWithInviteTokenAsync =
  (formData, inviteToken, history) => async (dispatch) => {
    try {
      await dispatch(setLoading(true));

      const res = await axios({
        method: 'POST',
        url: `/auth/register/${inviteToken}`,
        data: formData,
      });

      await dispatch(setIsAuthenticated(true));
      await dispatch(setUser(res.data.data));
      await dispatch(getAccountsAsync()); //error here
      history.push('/email-verification');
      await dispatch(setLoading(false));
    } catch (error) {
      await dispatch(setLoading(false));
      await dispatch(
        setAppNotification(
          'error',
          'Registration Error',
          error.response ? error.response.data.message : error.message
        )
      );
    }
  };

export const verifyEmailAsync = (token, history) => async (dispatch) => {
  try {
    const res = await axios.get(`/auth/verify-email?token=${token}`);

    await dispatch(setUser(res.data.data));
    await dispatch(setAppNotification('success', 'Email verified'));
    history.push('/onboarding');
  } catch (error) {
    await dispatch(
      setAppNotification(
        'error',
        'Verification Error',
        error.response.data.message
      )
    );
  }
};

export const resendVerificationEmailAsync = () => async (dispatch) => {
  try {
    await axios.get(`/auth/verify-email/resend`);
    await dispatch(
      setAppNotification('success', 'Successfully resent verification code')
    );
  } catch (error) {
    await dispatch(
      setAppNotification(
        'error',
        'Sending Email Error',
        error.response.data.message
      )
    );
  }
};

export const updateMeAsync = (formData) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: '/auth/me',
      data: formData,
    });

    await dispatch(setUser(res.data.data));
    await dispatch(
      setAppNotification('success', 'Successfully updated profile')
    );
  } catch (error) {
    await dispatch(
      setAppNotification(
        'error',
        'Error updating profile',
        error.response.data.message
      )
    );
  }
};

export const updatePasswordAsync = (formData) => async (dispatch) => {
  try {
    await axios({
      method: 'PUT',
      // TODO: Refactor endpoint to /auth/me/password to simplify
      url: '/auth/me/password',
      data: formData,
    });

    await dispatch(
      setAppNotification('success', 'Successfully updated password')
    );
  } catch (error) {
    await dispatch(
      setAppNotification(
        'error',
        'Error updating password',
        error.response.data.message
      )
    );
  }
};

export const selectAuth = (state) => state.auth;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthenticatedUser = (state) => state.auth.user;

export default authSlice.reducer;
