import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    list: { rows: [], totalPage: 1 },
    configurations: { rows: [], totalPage: 1 },
  },
  reducers: {
    setNotificationList: (state, action) => {
      state.list = action.payload;
    },
    setConfigurations: (state, action) => {
      state.configurations = action.payload;
    },
  },
});

export const { setNotificationList, setConfigurations } =
  notificationSlice.actions;

export const getNotificationsAsync = (params) => async (dispatch) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/notifications',
      params,
    });

    dispatch(setNotificationList(response.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const getConfigurationsAsync = (params) => async (dispatch) => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/listings/alert-configs',
      params,
    });

    dispatch(setConfigurations(response.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectNotificationList = (state) => state.notification.list;
export const selectConfigurationList = (state) =>
  state.notification.configurations;

export default notificationSlice.reducer;
