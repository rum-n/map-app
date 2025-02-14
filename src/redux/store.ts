import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import pinsReducer from './slices/pinsSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    pins: pinsReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;