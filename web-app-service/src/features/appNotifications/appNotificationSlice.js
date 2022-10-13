import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export const appNotificationSlice = createSlice({
  name: 'appNotifications',
  initialState: {
    appNotifications: [],
  },
  reducers: {
    addAppNotification: (state, action) => {
      state.appNotifications = [action.payload, ...state.appNotifications];
    },
    deleteAppNotification: (state, action) => {
      state.appNotifications = [
        ...state.appNotifications.filter(
          (appNotification) => appNotification.id !== action.payload
        ),
      ];
    },
  },
});

export const { addAppNotification, deleteAppNotification } =
  appNotificationSlice.actions;

export const setAppNotification =
  (type, title, message, duration = 15000) =>
  async (dispatch) => {
    const id = uuidv4();
    const appNotification = { id, title, message, type, duration };

    dispatch(addAppNotification(appNotification));

    setTimeout(() => {
      dispatch(deleteAppNotification(id));
    }, duration);
  };

export const selectAppNotifications = (state) =>
  state.appNotifications.appNotifications;

export default appNotificationSlice.reducer;
