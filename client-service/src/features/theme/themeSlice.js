import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    primary: '#2c7be5',
    secondary: '#9d7bd8',
    tertiary: '#5997eb',
    success: '#4caf50',
    info: '#47bac1',
    warning: '#ff9800',
    danger: '#e51c23',
  },
  reducers: {},
});

export const {} = themeSlice.actions;

export const selectTheme = (state) => state.theme;

export default themeSlice.reducer;
