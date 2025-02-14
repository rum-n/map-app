import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Platform } from 'react-native';

export interface Location {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  connectors: Array<{
    type: 'J1772' | 'Type2' | 'CCS 2' | 'Type 3';
    status: 'available' | 'unavailable';
  }>;
}

interface PinsState {
  locations: Location[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: PinsState = {
  locations: [],
  loading: false,
  error: null,
  lastFetched: null,
};

const BASE_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000',
});

export const fetchPins = createAsyncThunk('pins/fetchPins', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/pins`);

    if (!response.ok) {
      const errorText = await response.text();
      return rejectWithValue(errorText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue('Network error');
  }
});

const pinsSlice = createSlice({
  name: 'pins',
  initialState,
  reducers: {
    setLocations: (state, action: PayloadAction<Location[]>) => {
      state.locations = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPins.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchPins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLocations } = pinsSlice.actions;
export default pinsSlice.reducer;