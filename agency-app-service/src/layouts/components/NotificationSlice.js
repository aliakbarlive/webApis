import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (thunkAPI) => {
    const response = await axios.get(`/notifications`);
    return response.data;
  }
);

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: null,
    hasNew: null,
    newMessages: [],
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: {
    [fetchNotifications.fulfilled]: (state, { payload }) => {
      state.notifications = payload.data.messages;
      const newMessages = payload.data.messages.filter((m) => m.new === true);
      state.hasNew = newMessages.length > 0;
      state.newMessages = newMessages.map((m) => m.id);
    },
  },
});

export const { setLoading } = notificationsSlice.actions;

export const markAsRead = (ids) => async (dispatch) => {
  await axios.post('/notifications/read', { ids });
  dispatch(fetchNotifications());
};

export default notificationsSlice.reducer;
