
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ConnectorType = 'J1772' | 'Type2' | 'CCS 2' | 'Type 3';
type ConnectorStatus = 'available' | 'unavailable';

interface FilterState {
  types: { [key in ConnectorType]: boolean };
  statuses: { [key in ConnectorStatus]: boolean };
}

const initialState: FilterState = {
  types: {
    'J1772': false,
    'Type2': false,
    'CCS 2': false,
    'Type 3': false,
  },
  statuses: {
    'available': false,
    'unavailable': false,
  },
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setTypeFilter: (state, action: PayloadAction<{ type: ConnectorType; value: boolean }>) => {
      state.types[action.payload.type] = action.payload.value;
    },
    setStatusFilter: (state, action: PayloadAction<{ status: ConnectorStatus; value: boolean }>) => {
      state.statuses[action.payload.status] = action.payload.value;
    },
    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const { setTypeFilter, setStatusFilter, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;