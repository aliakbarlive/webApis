import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from 'features/alert/alertSlice';

export const fetchClients = createAsyncThunk(
  'agencyClients/getClients',
  async (params) => {
    const response = await axios.get('/agency/client', { params });
    return response.data.data;
  }
);

export const fetchClientById = createAsyncThunk(
  'agencyClients/getClient',
  async (id, thunkAPI) => {
    const response = await axios.get(`/agency/client/${id}`);
    return response.data.data;
  }
);

export const fetchPlans = createAsyncThunk(
  'agencyClients/getPlans',
  async () => {
    const response = await axios.get('/agency/invoicing/list?operation=plans');
    return response.data.data;
  }
);

export const fetchAddons = createAsyncThunk(
  'agencyClients/getAddons',
  async () => {
    const response = await axios.get('/agency/invoicing/list?operation=addons');
    return response.data.data;
  }
);

export const fetchCurrencies = createAsyncThunk(
  'agencyClients/getCurrency',
  async () => {
    const response = await axios.get('/agency/invoicing/currency');
    return response.data.output;
  }
);

export const fetchExchangeRates = createAsyncThunk(
  'agencyClients/getExchangeRates',
  async () => {
    const response = await axios.get(
      '/agency/invoicing/currency/exchangerates'
    );
    return response.data.data;
  }
);

export const agencyClientsSlice = createSlice({
  name: 'agencyClients',
  initialState: {
    agencyClients: [],
    plans: [],
    currencies: [],
    exchangeRates: [],
    addons: [],
    loading: false,
    error: null,
    agencyClient: null,
    dataLoaded: false,
    clientLoaded: false,
    hasNewAddons: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDataLoaded: (state, action) => {
      state.dataLoaded = action.payload;
    },
    setClientLoaded: (state, { payload }) => {
      state.clientLoaded = payload;
    },
    checkNewAddons: (state, { payload }) => {
      if (payload.some((p) => p == 0)) {
        state.hasNewAddons = true;
      } else {
        state.hasNewAddons = false;
      }
    },
  },
  extraReducers: {
    [fetchClients.fulfilled]: (state, { payload }) => {
      state.agencyClients = payload;
    },
    [fetchClientById.fulfilled]: (state, { payload }) => {
      state.agencyClient = payload;
      state.clientLoaded = true;
    },
    [fetchPlans.fulfilled]: (state, { payload }) => {
      state.plans = payload;
    },
    [fetchAddons.fulfilled]: (state, { payload }) => {
      state.addons = payload;
    },
    [fetchCurrencies.fulfilled]: (state, { payload }) => {
      state.currencies = payload;
    },
    [fetchExchangeRates.fulfilled]: (state, { payload }) => {
      state.exchangeRates = payload;
    },
  },
});

export const { setLoading, setDataLoaded, setClientLoaded, checkNewAddons } =
  agencyClientsSlice.actions;

export const createAgencyClient = (formData, history) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const body = JSON.stringify(formData);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.post('agency/client', body, config);
    dispatch(checkNewAddons(response.data.addons_response));
    dispatch(setAlert('Successfully created a new client', 'success'));
    dispatch(setLoading(false));
    history.push('/clients');
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export const updateAgencyClient =
  (id, formData, history) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const body = JSON.stringify(formData);

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.put(`agency/client/${id}`, body, config);
      dispatch(checkNewAddons(response.data.addons_response));
      dispatch(setAlert('Successfully updated client details', 'success'));
      dispatch(setLoading(false));
      history.push('/clients');
    } catch (error) {
      console.log(error.response.data);
      dispatch(setLoading(false));
      dispatch(setAlert(error.response.data.message));
    }
  };

export const patchAgencyClient = (id, formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const body = JSON.stringify(formData);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios.patch(`agency/client/${id}`, body, config);
    dispatch(fetchClientById(id));
    dispatch(setAlert('Successfully updated client details', 'success'));
    dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    dispatch(setLoading(false));
    dispatch(setAlert(error.response.data.message));
  }
};

export const getData =
  (id = 0) =>
  async (dispatch) => {
    let batchJobs = [
      dispatch(fetchPlans()),
      dispatch(fetchAddons()),
      dispatch(fetchCurrencies()),
      dispatch(fetchExchangeRates()),
    ];

    if (id > 0) {
      batchJobs = [...batchJobs, dispatch(fetchClientById(id))];
    }

    await Promise.all(batchJobs);

    return dispatch(setDataLoaded(true));
  };

export default agencyClientsSlice.reducer;
