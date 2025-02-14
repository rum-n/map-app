import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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

export const fetchPins = createAsyncThunk('pins/fetchPins', async () => {
  const response = await fetch('http://localhost:3000/pins');
  const data = await response.json();
  return data;
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
        state.error = action.error.message || 'Failed to fetch pins';
      });
  },
});

export const { setLocations } = pinsSlice.actions;
export default pinsSlice.reducer;