import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from '../alerts/alertsSlice';

export const getCreditNoteRequests = createAsyncThunk(
  'creditNotes/getCreditNoteRequests',
  async (params, thunkAPI) => {
    const response = await axios.get('/agency/credit-notes', { params });
    return response.data.data;
  }
);

export const getClientsByPodId = createAsyncThunk(
  'creditNotes/getClientsByPodId',
  async (params, thunkAPI) => {
    if (params.podId !== null) {
      const { podId, isPpc } = params;
      const response = await axios.get(
        `/agency/client/pod/${podId}?isPpc=${isPpc}`
      );
      return response.data.data;
    } else {
      return [];
    }
  }
);

export const creditNotesSlice = createSlice({
  name: 'creditNotes',
  initialState: {
    creditNotes: [],
    clients: [],
  },
  reducers: {},
  extraReducers: {
    [getCreditNoteRequests.fulfilled]: (state, { payload }) => {
      state.creditNotes = payload;
    },
    [getClientsByPodId.fulfilled]: (state, { payload }) => {
      state.clients = payload;
    },
  },
});

export default creditNotesSlice.reducer;
