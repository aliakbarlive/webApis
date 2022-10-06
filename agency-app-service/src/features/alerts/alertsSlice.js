import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    alerts: [],
  },
  reducers: {
    addAlert: (state, action) => {
      state.alerts = [action.payload, ...state.alerts];
    },
    deleteAlert: (state, action) => {
      //console.log(state.alerts);
      state.alerts = [
        ...state.alerts.filter((alert) => alert.id !== action.payload),
      ];
    },
  },
});

export const { addAlert, deleteAlert } = alertSlice.actions;

export const setAlert =
  (type, title, message, duration = 8000) =>
  async (dispatch) => {
    const id = uuidv4();
    const alert = { id, title, message, type, duration };

    dispatch(addAlert(alert));

    setTimeout(() => {
      dispatch(deleteAlert(id));
    }, duration);
  };

export const selectAlerts = (state) => state.alerts.alerts;

export default alertSlice.reducer;
