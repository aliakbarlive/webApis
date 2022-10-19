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
      state.alerts = [
        ...state.alerts.filter((alert) => alert.id !== action.payload),
      ];
    },
  },
});

export const { addAlert, deleteAlert } = alertSlice.actions;

export const setAlert =
  (message, color = 'danger', duration = 5000) =>
  async (dispatch) => {
    // Generate id for alert identification
    const id = uuidv4();

    const alert = { id, message, color, duration };

    dispatch(addAlert(alert));

    setTimeout(() => {
      dispatch(deleteAlert(id));
    }, duration);
  };

export const selectAlerts = (state) => state.alert.alerts;

export default alertSlice.reducer;
