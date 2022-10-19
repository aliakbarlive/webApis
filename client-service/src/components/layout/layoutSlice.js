import { createSlice } from '@reduxjs/toolkit';

export const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    sidebarCollapse: false,
  },
  reducers: {
    toggleSidebar: (state, action) => {
      state.sidebarCollapse = !state.sidebarCollapse;
    },
  },
});

export const { toggleSidebar } = layoutSlice.actions;

export const selectSidebarCollapse = (state) => state.layout.sidebarCollapse;

export default layoutSlice.reducer;
