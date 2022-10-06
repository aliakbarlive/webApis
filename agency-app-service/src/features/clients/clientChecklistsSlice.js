import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from '../alerts/alertsSlice';
import i18next from 'i18next';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const fetchClientChecklists = createAsyncThunk(
  'clientChecklists/getChecklistByClientId',
  async (id, thunkAPI) => {
    const response = await axios.get(`/agency/client/${id}/checklists`);
    return response.data.data;
  }
);

export const fetchClientChecklistsLogs = createAsyncThunk(
  'clientChecklists/getLogsByChecklist',
  async (id, thunkAPI) => {
    const response = await axios.get(`/agency/client/checklists/${id}/logs`);
    return response.data.data;
  }
);

export const fetchClientChecklistsById = createAsyncThunk(
  'clientChecklists/getClientChecklistById',
  async (id, thunkAPI) => {
    const response = await axios.get(`/agency/client/checklists/${id}`);
    return response.data.data;
  }
);

const initialState = {
  clientChecklists: [],
  clientChecklist: null,
  logs: [],
  loading: false,
};

export const clientChecklistsSlice = createSlice({
  name: 'clientChecklists',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchClientChecklists.fulfilled, (state, action) => {
      state.clientChecklists = action.payload;
    });
    builder.addCase(fetchClientChecklistsLogs.fulfilled, (state, action) => {
      state.logs = action.payload;
    });
    builder.addCase(fetchClientChecklistsById.fulfilled, (state, action) => {
      state.clientChecklist = action.payload;
    });
  },
});

export const { setLoading } = clientChecklistsSlice.actions;

export const updateClientChecklist = (id, body) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));
    await axios.post(`/agency/client/${id}/checklists`, body, config);

    await dispatch(
      setAlert('success', i18next.t('Clients.ClientChecklists.UpdateChecklist'))
    );
    await dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    await dispatch(setAlert('error', error.response.data.message));
  }
};

export const updateClientDefaultValue = (id, body) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));
    await axios.post(
      `/agency/client/${id}/checklists/default-value`,
      body,
      config
    );

    await dispatch(
      setAlert('success', i18next.t('Clients.ClientChecklists.UpdateChecklist'))
    );
    await dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    await dispatch(setAlert('error', error.response.data.message));
  }
};

export const emailSend = (id, body) => async (dispatch) => {
  body.defaultTo = body.defaultTo ? body.defaultTo : '';
  body.to = body.to ? `${body.to},${body.defaultTo}` : body.defaultTo;
  body.cc = body.cc ? `${body.cc},${body.defaultCc}` : body.defaultCc;
  try {
    await dispatch(setLoading(true));
    await axios.post(`/agency/client/${id}/send-email`, body, config);

    await dispatch(
      setAlert('success', i18next.t('Clients.ClientChecklists.EmailSent'))
    );
    await dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    await dispatch(setAlert('error', error.response.data.message));
  }
};

export const addLogs = (clientChecklistId, name) => async (dispatch) => {
  try {
    await axios.post(`/agency/client/checklists/${clientChecklistId}/logs`, {
      name,
    });
  } catch (error) {
    console.log(error.response.data);
  }
};

export const selectClientChecklists = (state) =>
  state.clientChecklists.clientChecklists;
export const selectClientChecklist = (state) =>
  state.clientChecklists.clientChecklist;
export const selectLogs = (state) => state.clientChecklists.logs;
export const selectLoading = (state) => state.clientChecklists.loading;

export default clientChecklistsSlice.reducer;
