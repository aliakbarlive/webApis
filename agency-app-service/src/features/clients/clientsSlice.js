import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from '../alerts/alertsSlice';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const fetchClients = createAsyncThunk(
  'clients/getClients',
  async (params, thunkAPI) => {
    const response = await axios.get('/agency/client', { params });
    thunkAPI.dispatch(setPaginationParams(params));
    return response.data.data;
  }
);

export const fetchUnassignedClients = createAsyncThunk(
  'clients/getUnassignedClients',
  async (params, thunkAPI) => {
    const response = await axios.get('/agency/client-v2/unassigned', {
      params,
    });
    thunkAPI.dispatch(setPaginationParams(params));
    return response.data.data;
  }
);

export const fetchClientById = createAsyncThunk(
  'clients/getClient',
  async (id, thunkAPI) => {
    const response = await axios.get(`/agency/client/${id}`);
    return response.data.data;
  }
);

export const fetchClientCycleDateById = createAsyncThunk(
  'clients/getClientCycleDate',
  async (id, thunkAPI) => {
    const response = await axios.get(`/agency/client/${id}/store-cycle-dates`);
    return response.data.data;
  }
);

export const fetchClientInvoiceEmails = createAsyncThunk(
  'clients/getInvoiceEmails',
  async (id, thunkAPI) => {
    const response = await axios.get(`/agency/client/${id}/invoice-emails`);
    return response.data.data;
  }
);

export const fetchPlans = createAsyncThunk('clients/getPlans', async () => {
  const response = await axios.get('/agency/invoicing/list?operation=plans');
  return response.data.data;
});

export const fetchAddons = createAsyncThunk(
  'clients/getAddons',
  async (filter = '') => {
    let filterUrl = filter !== '' ? `&filter=${filter}` : '';
    const response = await axios.get(
      `/agency/invoicing/list?operation=addons${filterUrl}`
    );
    return response.data.data;
  }
);

export const fetchCurrencies = createAsyncThunk(
  'clients/getCurrency',
  async () => {
    const response = await axios.get('/agency/invoicing/currency');
    return response.data.output;
  }
);

export const fetchExchangeRates = createAsyncThunk(
  'clients/getExchangeRates',
  async () => {
    const response = await axios.get(
      '/agency/invoicing/currency/exchangerates'
    );
    return response.data.data;
  }
);

export const fetchMarketplaces = createAsyncThunk(
  'clients/getMarketplaces',
  async (params) => {
    const response = await axios.get(`/agency/marketplaces`, { params });
    return { data: response.data.data };
  }
);

export const fetchSalesPersons = createAsyncThunk(
  'clients/getSalesPersons',
  async () => {
    const response = await axios.get(
      `/agency/employees/roles/sales administrator`
    );
    return { data: response.data.data };
  }
);

export const getInitialSubscriptionFormData = createAsyncThunk(
  'clients/getInitialSubscriptionFormData',
  async (id = 0, thunkAPI) => {
    let batchJobs = [
      thunkAPI.dispatch(fetchPlans()),
      thunkAPI.dispatch(fetchMarketplaces()),
      thunkAPI.dispatch(fetchAddons()),
      thunkAPI.dispatch(fetchCurrencies()),
      thunkAPI.dispatch(fetchExchangeRates()),
      thunkAPI.dispatch(fetchSalesPersons()),
    ];

    const response = await Promise.all(batchJobs);

    return response.data;
  }
);

export const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    defaultMarketplaceId: 'ATVPDKIKX0DER', //US
    agencyClients: [],
    unAssignedAgencyClients: [],
    clients: [],
    paginationParams: {
      page: 1,
      pageSize: 30,
      search: '',
      sort: 'client:asc',
      migrateOnly: false,
      status: '',
    },
    plans: [],
    currencies: [],
    exchangeRates: [],
    marketplaces: [],
    salesPersons: [],
    addons: [],
    loading: false,
    error: null,
    agencyClient: null,
    dataLoaded: false,
    clientLoaded: false,
    hasNewAddons: false,
    invoiceEmails: null,
    errors: null,
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
      if (payload.some((p) => p === 0)) {
        state.hasNewAddons = true;
      } else {
        state.hasNewAddons = false;
      }
    },
    setPaginationParams: (state, action) => {
      state.paginationParams = action.payload;
    },
    setErrors: (state, { payload }) => {
      state.errors = payload;
    },
    setClientList: (state, action) => {
      state.clients = action.payload;
    },
  },
  extraReducers: {
    [fetchClients.fulfilled]: (state, { payload }) => {
      state.agencyClients = payload;
    },
    [fetchUnassignedClients.fulfilled]: (state, { payload }) => {
      state.unAssignedAgencyClients = payload;
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
    [fetchMarketplaces.fulfilled]: (state, { payload }) => {
      state.marketplaces = payload.data;
    },
    [getInitialSubscriptionFormData.fulfilled]: (state, { payload }) => {
      state.dataLoaded = true;
    },
    [fetchClientInvoiceEmails.fulfilled]: (state, { payload }) => {
      state.invoiceEmails = payload;
    },
    [fetchSalesPersons.fulfilled]: (state, { payload }) => {
      state.salesPersons = payload.data;
    },
  },
});

export const {
  setLoading,
  setDataLoaded,
  setClientLoaded,
  checkNewAddons,
  setPaginationParams,
  setErrors,
  setClientList,
} = clientsSlice.actions;

export const createAgencyClient =
  (formData, status, history) => async (dispatch) => {
    const { leadId } = formData;
    delete formData.leadId;
    try {
      await dispatch(setLoading(true));

      const body = JSON.stringify({
        ...formData,
        price: formData.price === '' ? 0 : formData.price,
        status,
      });

      const response = await axios.post('agency/client', body, config);

      if (leadId) {
        const res = await axios.put(`/agency/leads/${leadId}`, {
          status: 'Client',
        });
      }

      await dispatch(checkNewAddons(response.data.addonsResponse));

      await dispatch(
        setAlert(
          'success',
          status === 'draft'
            ? 'Sucessfully created draft'
            : `Successfully invited ${formData.email}`
        )
      );
      await dispatch(setLoading(false));
      history.goBack();
    } catch (error) {
      const errorMessages = error.response.data.errors
        ? Object.keys(error.response.data.errors)
            .map((key) => {
              return `- ${error.response.data.errors[key]}`;
            })
            .join('\n')
        : '';
      dispatch(setErrors(error.response.data.errors));
      dispatch(setLoading(false));
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

export const updateAgencyClient =
  (id, formData, status, history) => async (dispatch) => {
    try {
      await dispatch(setLoading(true));
      const body = JSON.stringify({
        ...formData,
        price: formData.price === '' ? 0 : formData.price,
        status,
      });
      const response = await axios.put(`agency/client/${id}`, body, config);

      await dispatch(checkNewAddons(response.data.addonsResponse));

      await dispatch(
        setAlert(
          'success',
          status === 'created'
            ? `Successfully invited ${formData.email}`
            : 'Successfully updated client details'
        )
      );

      await dispatch(setLoading(false));
      history.goBack();
    } catch (error) {
      const errorMessages = error.response.data.errors
        ? Object.keys(error.response.data.errors)
            .map((key) => {
              return `- ${error.response.data.errors[key]}`;
            })
            .join('\n')
        : '';

      dispatch(setErrors(error.response.data.errors));
      dispatch(setLoading(false));
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

// export const patchAgencyClient = (id, formData) => async (dispatch) => {
//   try {
//     //dispatch(setLoading(true));
//     const body = JSON.stringify(formData);
//     const res = await axios.patch(`agency/client/${id}`, body, config);
//     dispatch(setAlert('success', 'Successfully updated client details'));
//     //dispatch(setLoading(false));
//     return res;
//   } catch (error) {
//     console.log(error.response.data);
//     await dispatch(setErrors(error.response.data.errors));
//     //dispatch(setLoading(false));
//     dispatch(setAlert('error', error.response.data.message));
//   }
// };

export const getClientAsync = (search) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));

    const res = await axios.get(
      `/agency/client?status=subscribed&pageSize=1000&sort=client:asc&search=${
        search ? search : ''
      }`
    );
    await dispatch(setClientList(res.data.data));
    await dispatch(setLoading(false));
    return res.data.data;
  } catch (error) {
    const message =
      error.response.status === 500
        ? 'Whoops. Something went wrong!'
        : error.response.status === 204
        ? 'No Clients Available!'
        : error.response.data.message;
    await dispatch(setLoading(false));
    return {};
  }
};

export const selectInvoiceEmails = (state) => state.clients.invoiceEmails;
export const selectClientList = (state) => state.clients.clients;

export default clientsSlice.reducer;
