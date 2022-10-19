import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from 'features/alert/alertSlice';

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

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post('agency/commission', body, config);
      thunkAPI.dispatch(setAlert('Commission record added', 'success'));
      thunkAPI.dispatch(fetchCommissions(formData.subscriptionId));
      return response.data.output;
    } catch (error) {
      thunkAPI.dispatch(setLoading(false));
      thunkAPI.dispatch(setAlert(error.response.data.message));
    }
  }
);

export const updateCommission = createAsyncThunk(
  'commissions/updateCommission',
  async ({ commissionId, formData }, thunkAPI) => {
    const body = JSON.stringify(formData);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.put(
        `agency/commission/${commissionId}`,
        body,
        config
      );
      thunkAPI.dispatch(setAlert('Commission record updated', 'success'));
      thunkAPI.dispatch(fetchCommissions(formData.subscriptionId));
      return response.data.output;
    } catch (error) {
      thunkAPI.dispatch(setLoading(false));
      thunkAPI.dispatch(setAlert(error.response.data.message));
    }
  }
);

export const commissionsSlice = createSlice({
  name: 'commissions',
  initialState: {
    commissions: [],
    commission: null,
    scheduledChanges: [],
    loading: false,
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
  },
});
export const { setLoading } = commissionsSlice.actions;

export const deleteCommission = (id, subscriptionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.delete(`agency/commission/${id}`);
    console.log(response.data.output);
    dispatch(setAlert('Commission record deleted', 'success'));
    dispatch(fetchCommissions(subscriptionId));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export default commissionsSlice.reducer;
