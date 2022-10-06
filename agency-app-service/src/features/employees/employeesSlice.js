import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from '../alerts/alertsSlice';

export const fetchEmployees = createAsyncThunk(
  'employees/getEmployees',
  async (params, thunkAPI) => {
    const response = await axios.get('/agency/employees', { params });
    return response.data.data;
  }
);

export const fetchInvites = createAsyncThunk(
  'employees/getInvites',
  async (params, thunkAPI) => {
    const response = await axios.get('/agency/invite/employee', { params });
    return response.data.data;
  }
);

export const fetchRoles = createAsyncThunk(
  'employees/roles',
  async (params, thunkAPI) => {
    const response = await axios.get('/agency/employees/roles', { params });
    return response.data.data;
  }
);

export const fetchGroupsByLevel = createAsyncThunk(
  'employees/groupsBy/level',
  async (params, thunkAPI) => {
    const response = await axios.get('/agency/employees/groupsBy/level', {
      params,
    });
    return response.data.data;
  }
);

export const fetchEmployeesGroupByRole = createAsyncThunk(
  'employees/groupsBy/role',
  async (params, thunkAPI) => {
    const response = await axios.get('/agency/employees/groupsBy/role', {
      params,
    });
    return response.data.data;
  }
);

export const fetchGroupsOptions = createAsyncThunk(
  'employees/groupsOptions',
  async (params, thunkAPI) => {
    const response = await axios.get('/agency/employees/groups/options', {
      params,
    });
    return response.data;
  }
);

export const getRolesAndGroups = createAsyncThunk(
  'employees/rolesAndGroups',
  async (id = 0, thunkAPI) => {
    let batchJobs = [
      thunkAPI.dispatch(fetchRoles()),
      thunkAPI.dispatch(fetchGroupsOptions()),
    ];

    const response = await Promise.all(batchJobs);
    // console.log(response);
    return response;
  }
);

export const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    invites: [],
    roles: [],
    clients: {},
    groups: {},
    groupsOptions: {},
    groupsByLevel: {},
    employee: {},
    types: [
      { label: 'Operations', value: 'operations' },
      { label: 'PPC', value: 'ppc' },
      { label: 'Writing', value: 'writing' },
      { label: 'Design', value: 'design' },
      { label: 'Sales Leadgen', value: 'sales lead' },
      { label: 'Sales', value: 'sales' },
    ],
    typeInitialOption: { label: 'All', value: null },
    squadInitialOption: {
      squadId: null,
      type: '',
      name: 'All',
    },
    podInitialOption: {
      podId: null,
      type: '',
      name: 'All',
    },
    cellInitialOption: {
      cellId: null,
      type: '',
      name: 'All',
    },
    selectedType: { label: 'All', value: null },
    selectedSquad: {
      squadId: null,
      type: '',
      name: 'All',
    },
    selectedPod: {
      podId: null,
      type: '',
      name: 'All',
    },
    selectedCell: {
      cellId: null,
      type: '',
      name: 'All',
    },
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setEmployee: (state, action) => {
      state.employee = action.payload;
    },
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setGroupsOptions: (state, action) => {
      state.groupsOptions = action.payload;
    },
    setSelectedType: (state, { payload }) => {
      state.selectedType = payload;
    },
    setSelectedSquad: (state, { payload }) => {
      state.selectedSquad = payload;
    },
    setSelectedPod: (state, { payload }) => {
      state.selectedPod = payload;
    },
    setSelectedCell: (state, { payload }) => {
      state.selectedCell = payload;
    },
  },
  extraReducers: {
    [fetchEmployees.fulfilled]: (state, { payload }) => {
      state.employees = payload;
    },
    [fetchInvites.fulfilled]: (state, { payload }) => {
      state.invites = payload;
    },
    [fetchRoles.fulfilled]: (state, { payload }) => {
      state.roles = payload;
    },
    [fetchGroupsByLevel.fulfilled]: (state, { payload }) => {
      state.groupsByLevel = payload;
    },
    [fetchGroupsOptions.fulfilled]: (state, { payload }) => {
      state.groupsOptions = payload;
    },
  },
});

export const {
  setLoading,
  setEmployees,
  setClients,
  setGroups,
  setGroupsOptions,
  setEmployee,
  setSelectedType,
  setSelectedSquad,
  setSelectedPod,
  setSelectedCell,
} = employeesSlice.actions;

export const getClients = (userId) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));

    const response = await axios.get(`/agency/employees/${userId}/clients`);
    await dispatch(setClients(response.data.data));
    await dispatch(setEmployee(response.data.data.employee));
    await dispatch(setLoading(false));
  } catch (error) {
    console.log('error', error);
    await dispatch(setLoading(false));
  }
};

export const getGroups = (params) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));
    const response = await axios.get(
      `/agency/employees/groups?type=${params.type}`
    );
    await dispatch(setGroups(response.data.data));
    await dispatch(setLoading(false));
  } catch (error) {
    console.log('error', error);
    await dispatch(setLoading(false));
  }
};

export const getGroupsOptions = () => async (dispatch) => {
  try {
    await dispatch(setLoading(true));
    const response = await axios.get(`/agency/employees/groups/options`);
    await dispatch(setGroupsOptions(response.data));
    await dispatch(setLoading(false));
    return response.data;
  } catch (error) {
    console.log('error', error);
    await dispatch(setLoading(false));
  }
};

export const updateEmployeeRole =
  (userId, role, employees, userGroup, employeeParams) => async (dispatch) => {
    try {
      await dispatch(setLoading(true));

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = { roleId: role.value, userGroup };
      const response = await axios.put(
        `/agency/employees/${userId}`,
        body,
        config
      );
      console.log('response', response);
      if (response.data.success === true) {
        await dispatch(setAlert('success', response.data.message));
        let newEmployees = JSON.parse(JSON.stringify(employees));
        let index = newEmployees.rows.findIndex((rec) => rec.userId === userId);
        newEmployees.rows[index].role = {
          name: role.label,
          level: 'agency',
        };
        await dispatch(setEmployees(newEmployees));
        await dispatch(fetchEmployees(employeeParams));
      } else {
        await dispatch(setAlert('error', response.data.message));
      }
      await dispatch(setLoading(false));
    } catch (error) {
      console.log(error.response.data);
      await dispatch(setLoading(false));
      await dispatch(setAlert('error', error.response.data.message));
    }
  };

export const removeEmployee = (userId, employees) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));

    const response = await axios.delete(`/agency/employees/${userId}`);
    if (response.data.success === true) {
      let newEmployees = JSON.parse(JSON.stringify(employees));
      let index = newEmployees.rows.findIndex((rec) => rec.userId === userId);
      newEmployees.rows.splice(index, 1);
      await dispatch(setEmployees(newEmployees));
      await dispatch(
        setAlert('success', 'Employee successfully removed from the agency app')
      );
    }

    await dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    await dispatch(setLoading(false));
    await dispatch(setAlert('error', error.response.data.message));
  }
};

export const sendInvite =
  (selectedRole, email, userGroup) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = { roleId: selectedRole.value, email, userGroup };
      const res = await axios.post('agency/employees', body, config);
      if (res.data.success === true) {
        dispatch(setAlert('success', 'Invite successfully sent!'));
        dispatch(setLoading(false));
      } else {
        await dispatch(setAlert('error', res.data.message));
        dispatch(setLoading(false));
      }
      return true;
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setAlert('error', error.response.data.message));
      return false;
    }
  };

export const updateGroups = (body) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.put(
      `/agency/employees/groups/${body.level}`,
      body,
      config
    );
    await dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    await dispatch(setLoading(false));
    await dispatch(setAlert('error', error.response.data.message));
  }
};

export const removeGroup = (body) => async (dispatch) => {
  try {
    await dispatch(setLoading(true));

    const response = await axios.delete(
      `/agency/employees/groups/${body.level}/${body.id}`
    );

    await dispatch(setLoading(false));
  } catch (error) {
    console.log(error.response.data);
    await dispatch(setLoading(false));
    await dispatch(setAlert('error', error.response.data.message));
  }
};

export const selectGroups = (state) => state.employees.groups;
export const selectGroupsOptions = (state) => state.employees.groupsOptions;

export default employeesSlice.reducer;
