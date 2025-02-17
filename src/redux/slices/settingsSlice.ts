import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PinStyle } from '../../types';

interface SettingsState {
  pinStyle: PinStyle;
}

const initialState: SettingsState = {
  pinStyle: 'default',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPinStyle: (state, action: PayloadAction<PinStyle>) => {
      state.pinStyle = action.payload;
    },
  },
});

export const { setPinStyle } = settingsSlice.actions;
export default settingsSlice.reducer;