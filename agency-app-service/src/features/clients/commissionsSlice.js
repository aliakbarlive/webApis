import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from '../alerts/alertsSlice';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const fetchCommissions = createAsyncThunk(
  'commissions/getCommissions',
  async (subscriptionId, thunkAPI) => {
    const response = await axios.get(
      `/agency/subscription/${subscriptionId}/commissions`
    );
    return response.data;
  }
);

export const fetchCommission = createAsyncThunk(
  'commissions/getCommission',
  async (id, thunkAPI) => {
    const response = await axios.get(`/agency/commission/${id}`);
    return response.data.output;
  }
);

export const addCommission = createAsyncThunk(
  'commissions/addCommission',
  async (formData, thunkAPI) => {
    const body = JSON.stringify(formData);

    try {
      const response = await axios.post('agency/commission', body, config);
      thunkAPI.dispatch(setAlert('success', 'Commission added'));
      return { success: true, data: response.data.output };
    } catch (error) {
      thunkAPI.dispatch(setLoading(false));
      const errorMessages = Object.keys(error.response.data.errors)
        .map((key) => {
          return `- ${error.response.data.errors[key]}`;
        })
        .join('\n');
      thunkAPI.dispatch(
        setAlert('error', error.response.data.message, errorMessages)
      );
      return { success: false, data: error.response.data.errors };
    }
  }
);

export const updateCommission = createAsyncThunk(
  'commissions/updateCommission',
  async ({ commissionId, formData }, thunkAPI) => {
    const body = JSON.stringify(formData);

    try {
      const response = await axios.put(
        `agency/commission/${commissionId}`,
        body,
        config
      );
      thunkAPI.dispatch(setAlert('success', 'Commission record updated'));
      return { success: true, data: response.data.output };
    } catch (error) {
      thunkAPI.dispatch(setLoading(false));
      const errorMessages = Object.keys(error.response.data.errors)
        .map((key) => {
          return `- ${error.response.data.errors[key]}`;
        })
        .join('\n');
      thunkAPI.dispatch(
        setAlert('error', error.response.data.message, errorMessages)
      );
      return { success: false, data: error.response.data.errors };
    }
  }
);

export const computeCommissions = createAsyncThunk(
  'commissions/compute',
  async (payload, thunkAPI) => {
    const body = JSON.stringify(payload);

    const response = await axios.post(
      `agency/commission/compute`,
      body,
      config
    );
    return response.data;
  }
);

export const commissionsSlice = createSlice({
  name: 'commissions',
  initialState: {
    commissions: [],
    commission: null,
    scheduledChanges: [],
    loading: false,
    errors: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: {
    [fetchCommissions.fulfilled]: (state, { payload }) => {
      state.commissions = payload.commissions;
    },
    [fetchCommission.fulfilled]: (state, { payload }) => {
      state.commission = payload;
    },
    [addCommission.fulfilled]: (state, { payload }) => {
      state.commission = payload;
    },
    [addCommission.rejected]: (state, { payload }) => {
      state.errors = payload;
    },
    [updateCommission.rejected]: (state, { payload }) => {
      state.errors = payload;
    },
  },
});
export const { setLoading } = commissionsSlice.actions;

export const deleteCommission = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const output = await axios.delete(`agency/commission/${id}`);
    dispatch(setAlert('success', 'Commission record deleted'));
    dispatch(setLoading(false));
    return output;
  } catch (error) {
    //console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert('error', error.response.data.message));
  }
};

export default commissionsSlice.reducer;
