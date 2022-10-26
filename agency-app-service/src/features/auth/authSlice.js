import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from 'features/alerts/alertsSlice';
import { getAccountsAsync } from 'features/accounts/accountsSlice';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: null,
    user: {},
    roles: {},
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
      state.loading = false;
    },
    setUserOnly: (state, action) => {
      state.user = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
  },
});

export const {
  setUser,
  setIsAuthenticated,
  setLoading,
  setRoles,
  setUserOnly,
} = authSlice.actions;

export const getMeAsync = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await axios.get('/auth/me');
    const user = response.data.data;

    await dispatch(setIsAuthenticated(true));
    await dispatch(getAccountsAsync({}, true));
    await dispatch(getRolesAsync());
    await dispatch(setUser(user));
  } catch (error) {
    console.log(error.message);
    dispatch(setIsAuthenticated(false));
    dispatch(setLoading(false));
  }
};

export const getRolesAsync = () => async (dispatch) => {
  try {
    const res = await axios.get('/auth/me/roles');
    dispatch(setRoles(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const signInAsync = (formData, history, query) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await axios({
      method: 'POST',
      url: '/auth/login',
      data: formData,
    });

    const user = res.data.data;

    await dispatch(setIsAuthenticated(true));
    await dispatch(getAccountsAsync({}, true));
    await dispatch(getRolesAsync());
    await dispatch(setUser(user));

    if (user.role.level === 'application') {
      if (query.get('ref')) {
        history.push(query.get('ref'));
      } else {
        history.push('/plan');
      }
    } else if (user.role.level === 'agency') {
      history.push('/clients');
    }

    dispatch(setLoading(false));
  } catch (error) {
    console.log(error);
    dispatch(setIsAuthenticated(false));
    dispatch(setLoading(false));
    dispatch(
      setAlert('error', 'Authentication Error', error.response.data.message)
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

      const user = res.data.data;

      await dispatch(setUserOnly(user));
      await dispatch(setIsAuthenticated(true));
      await dispatch(setLoading(false));
      await dispatch(getAccountsAsync({}, true));

      if (user.role.level === 'application') {
        history.push('/subscription');
      } else if (user.role.level === 'agency') {
        history.push('/clients');
      }

      await dispatch(setLoading(false));
    } catch (error) {
      const errorMessages = error.response.data.errors
        ? Object.keys(error.response.data.errors)
            .map((key) => {
              return `- ${error.response.data.errors[key]}`;
            })
            .join('\n')
        : 'Validation Error';

      await dispatch(setLoading(false));
      await dispatch(setAlert('error', 'Registration Error', errorMessages));
    }
  };

export const forgotPassword = (formData, history) => async (dispatch) => {
  try {
    await axios.post('/auth/forgot-password', formData);
    history.push('/forgot-password/success');
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert('error', error.response.data.message));
  }
};

export const resetPassword = (formData, token, history) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `/auth/reset-password/${token}`,
      data: formData,
    });

    history.push('/reset-password/success');
  } catch (error) {
    const errorMessages = error.response.data.errors
      ? Object.keys(error.response.data.errors)
          .map((key) => {
            return `- ${error.response.data.errors[key]}`;
          })
          .join('\n')
      : '';
    dispatch(setLoading(false));
    dispatch(setAlert('error', error.response.data.message, errorMessages));
  }
};

export const signOutAsync = (history) => async (dispatch) => {
  try {
    await axios({
      method: 'GET',
      url: '/auth/logout',
    });

    // history.push(null, '/sign-in');

    dispatch(setIsAuthenticated(false));
    dispatch(setUser({}));
    dispatch(setAlert('success', 'Sucessfully signed out'));
  } catch (error) {
    console.log(error.message);
  }
};

export const registerAsync = (formData, history) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await axios({
      method: 'POST',
      url: '/auth/register',
      data: formData,
    });

    dispatch(setIsAuthenticated(true));
    dispatch(setUser(res.data.data));
    history.push('/email-verification');
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(
      setAlert('error', 'Registration Error', error.response.data.message)
    );
  }
};

export const verifyEmailAsync = (token, history) => async (dispatch) => {
  try {
    const res = await axios.get(`/auth/verify-email?token=${token}`);

    dispatch(setUser(res.data.data));
    dispatch(setAlert('success', 'Email verified'));
    history.push('/onboarding');
  } catch (error) {
    dispatch(
      setAlert('error', 'Verification Error', error.response.data.message)
    );
  }
};

export const resendVerificationEmailAsync = () => async (dispatch) => {
  try {
    await axios.get(`/auth/verify-email/resend`);
    dispatch(setAlert('success', 'Successfully resent verification code'));
  } catch (error) {
    dispatch(
      setAlert('error', 'Sending Email Error', error.response.data.message)
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

    dispatch(setUser(res.data.data));
    dispatch(setAlert('success', 'Successfully updated profile'));
  } catch (error) {
    dispatch(
      setAlert('error', 'Error updating profile', error.response.data.message)
    );
  }
};

export const updatePasswordAsync = (formData) => async (dispatch) => {
  try {
    await axios({
      method: 'PUT',
      url: '/auth/me/password',
      data: formData,
    });

    dispatch(setAlert('success', 'Successfully updated password'));
  } catch (error) {
    dispatch(
      setAlert('error', 'Error updating password', error.response.data.message)
    );
  }
};

export const selectAuth = (state) => state.auth;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthenticatedUser = (state) => state.auth.user;
export const selectAuthenticatedUserRoles = (state) => state.auth.roles;

export default authSlice.reducer;
