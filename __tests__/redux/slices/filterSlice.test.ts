import filterReducer, { setTypeFilter, setStatusFilter, resetFilters } from "../../../src/redux/slices/filterSlice";


describe('Filter Slice', () => {
  const initialState = {
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

  it('should handle initial state', () => {
    expect(filterReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setTypeFilter', () => {
    const actual = filterReducer(
      initialState,
      setTypeFilter({ type: 'J1772', value: true })
    );
    expect(actual.types['J1772']).toBe(true);
  });

  it('should handle setStatusFilter', () => {
    const actual = filterReducer(
      initialState,
      setStatusFilter({ status: 'available', value: true })
    );
    expect(actual.statuses['available']).toBe(true);
  });

  it('should handle resetFilters', () => {
    const modifiedState = {
      types: { ...initialState.types, 'J1772': true },
      statuses: { ...initialState.statuses, 'available': true },
    };
    const actual = filterReducer(modifiedState, resetFilters());
    expect(actual).toEqual(initialState);
  });
});