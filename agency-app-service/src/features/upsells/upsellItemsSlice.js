import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { joiAlertErrorsStringify } from 'utils/formatters';
import { setAlert } from '../alerts/alertsSlice';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const fetchItems = createAsyncThunk('upsells/getItems', async () => {
  const response = await axios.get('/agency/upsells/list/items');
  return response.data.data;
});

export const addItem = createAsyncThunk(
  'upsellItems/addItem',
  async (formData, thunkAPI) => {
    const body = JSON.stringify(formData);
    try {
      const response = await axios.post('/agency/upsells/item', body, config);
      thunkAPI.dispatch(setAlert('success', 'Upsell Item added'));
      thunkAPI.dispatch(fetchItems());
      return { success: true, data: response.data.output };
    } catch (error) {
      thunkAPI.dispatch(setLoading(false));
      const errorMessages = joiAlertErrorsStringify(error);
      thunkAPI.dispatch(
        setAlert('error', error.response.data.message, errorMessages)
      );
      return { success: false, data: error.response.data.errors };
    }
  }
);

export const updateItem = createAsyncThunk(
  'upsellItems/addItem',
  async ({ upsellItemId, formData }, thunkAPI) => {
    const body = JSON.stringify(formData);
    try {
      const response = await axios.put(
        `agency/upsells/item/${upsellItemId}`,
        body,
        config
      );
      thunkAPI.dispatch(setAlert('success', 'Upsell item updated'));
      thunkAPI.dispatch(fetchItems());
      return { success: true, data: response.data.output };
    } catch (error) {
      thunkAPI.dispatch(setLoading(false));
      const errorMessages = joiAlertErrorsStringify(error);
      thunkAPI.dispatch(
        setAlert('error', error.response.data.message, errorMessages)
      );
      return { success: false, data: error.response.data.errors };
    }
  }
);

export const deleteItem = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axios.delete(`agency/upsells/item/${id}`);
    dispatch(setAlert('success', 'Upsell item deleted'));
    dispatch(fetchItems());
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setAlert('error', error.response.data.message));
  }
};

export const upsellItemsSlice = createSlice({
  name: 'upsellItems',
  initialState: {
    item: null,
    loading: false,
    items: [],
  },

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },

  extraReducers: {
    [fetchItems.fulfilled]: (state, { payload }) => {
      state.items = payload;
    },
    [addItem.fulfilled]: (state, { payload }) => {
      state.item = payload;
    },
    [addItem.rejected]: (state, { payload }) => {
      state.errors = payload;
    },
    [updateItem.fulfilled]: (state, { payload }) => {
      state.item = payload;
    },
    [updateItem.rejected]: (state, { payload }) => {
      state.errors = payload;
    },
  },
});

export const { setLoading } = upsellItemsSlice.actions;

export default upsellItemsSlice.reducer;
