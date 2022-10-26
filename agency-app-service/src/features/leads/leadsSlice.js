import { createSlice } from '@reduxjs/toolkit';

export const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    currentPage: null,
    leadsPaginationParams: {
      page: 1,
      pageSize: 30,
      sort: 'pitchDate:desc NULLS last',
      statuses: 'Unprocessed New Leads',
      // status: '',
      // lead: '',
      // companyName: '',
      search: '',
      fields: '',
    },
    allLeadsPaginationParams: {
      page: 1,
      pageSize: 30,
      sort: 'pitchDate:desc NULLS last',
      statuses: '',
      status: '',
      lead: '',
      companyName: '',
    },
    leadsVariablesPaginationParams: {
      page: 1,
      pageSize: 30,
      sort: 'createdAt:desc',
    },
    liAccountsPaginationParams: {
      page: 1,
      pageSize: 30,
      sort: 'name:asc',
    },
  },

  reducers: {
    setCurrentPage: (state, { payload }) => {
      state.currentPage = payload;
    },
    setLeadsPaginationParams: (state, action) => {
      state.leadsPaginationParams = action.payload;
    },
    setAllLeadsPaginationParams: (state, action) => {
      state.allLeadsPaginationParams = action.payload;
    },
    setLeadsVariablesPaginationParams: (state, action) => {
      state.leadsVariablesPaginationParams = action.payload;
    },
    setLiAccountsPaginationParams: (state, action) => {
      state.liAccountsPaginationParams = action.payload;
    },
  },
});

export const {
  setCurrentPage,
  setLeadsPaginationParams,
  setAllLeadsPaginationParams,
  setLeadsVariablesPaginationParams,
  setLiAccountsPaginationParams,
} = leadsSlice.actions;

export default leadsSlice.reducer;
