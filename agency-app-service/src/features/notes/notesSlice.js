import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';

export const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    loading: false,
    entity: {},
    list: { rows: [] },
  },
  reducers: {
    setList: (state, action) => {
      state.list = action.payload;
    },
    setNoteEntity: (state, action) => {
      state.entity = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setList, setNoteEntity, setLoading } = notesSlice.actions;

export const getNotesAsync = (params) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const response = await axios({
      method: 'GET',
      url: '/notes',
      params: {
        ...params,
        accountId: getState().accounts.currentAccount.accountId,
      },
    });

    dispatch(setList(response.data.data));
  } catch (error) {
    console.log(error);
  }
  dispatch(setLoading(false));
};

export const addNoteAsync = (data) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    await axios({
      method: 'POST',
      url: '/notes',
      data: {
        ...data,
        accountId: getState().accounts.currentAccount.accountId,
        marketplace: getState().accounts.currentMarketplace.details.countryCode,
      },
    });
  } catch (error) {
    console.log(error);
  }
  dispatch(setLoading(false));
};

export const deleteNoteAsync = (noteId) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    await axios({
      method: 'DELETE',
      url: `/notes/${noteId}`,
      data: {
        accountId: getState().accounts.currentAccount.accountId,
      },
    });
  } catch (error) {
    console.log(error);
  }
  dispatch(setLoading(false));
};

export const selectNotesList = (state) => state.notes.list;
export const selectNotesEntity = (state) => state.notes.entity;

export default notesSlice.reducer;
