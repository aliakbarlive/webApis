import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { setAlert } from '../alerts/alertsSlice';

export const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    grouped: [],
  },
  reducers: {
    setGrouped: (state, action) => {
      state.grouped = action.payload;
    },
  },
});

export const { setGrouped } = permissionSlice.actions;

export const getPermissionsAsync = () => async (dispatch) => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/agency/permissions',
    });
    await dispatch(setGrouped(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const updateRolePermissions = (data) => async (dispatch) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/agency/permissions/rolePermissions`,
      data,
    });

    await dispatch(
      setAlert(
        'success',
        `Permission ${res.data.action}`,
        res.data.result.description
      )
    );
  } catch (error) {
    console.log(error.message);
  }
};

export const selectPermissionsGrouped = (state) => state.permissions.grouped;

export default permissionSlice.reducer;
