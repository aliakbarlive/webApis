import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers, setLoading } = usersSlice.actions;

export const getUsersAsync = () => async (dispatch) => {
  try {
    const res = await axios({
      method: 'get',
      url: '/users',
    });

    dispatch(setUsers(res.data.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const selectUsers = (state) => state.users.users;

export default usersSlice.reducer;
