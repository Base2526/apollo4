import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface State {
  theme: 'light' | 'dark';
  loading: boolean;
}

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const userTheme = (localStorage.getItem('theme') as State['theme']) || 'light';

const initialState: State = {
  theme: userTheme || systemTheme,
  loading: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setGlobalState(state, action: PayloadAction<Partial<State>>) {
      Object.assign(state, action.payload);

      if (action.payload.theme) {
        const body = document.body;
        const themeMode = action.payload.theme === 'dark' ? 'dark' : 'light';

        body.setAttribute('theme-mode', themeMode);
      }
    },
  },
});

export const { setGlobalState } = globalSlice.actions;

export default globalSlice.reducer;
