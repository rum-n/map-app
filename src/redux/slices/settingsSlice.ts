import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  pinStyle: string;
}

const initialState: SettingsState = {
  pinStyle: 'default',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPinStyle: (state, action: PayloadAction<string>) => {
      state.pinStyle = action.payload;
    },
  },
});

export const { setPinStyle } = settingsSlice.actions;
export default settingsSlice.reducer;