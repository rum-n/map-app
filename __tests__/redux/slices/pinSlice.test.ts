import pinsReducer, { setLocations, fetchPins } from '../../../src/redux/slices/pinsSlice';
import { Location } from '../../../src/types/index';
describe('Pins Slice', () => {
  const initialState = {
    locations: [],
    loading: false,
    error: null,
    lastFetched: null,
  };

  const mockLocations = [
    {
      _id: '1',
      title: 'Test Location',
      latitude: 42.6977,
      longitude: 23.3219,
      connectors: [
        { type: 'J1772', status: 'available' }
      ]
    }
  ];

  it('should handle initial state', () => {
    expect(pinsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setLocations', () => {
    const actual = pinsReducer(
      initialState,
      setLocations(mockLocations as Location[])
    );
    expect(actual.locations).toEqual(mockLocations);
  });

  it('should handle fetchPins.pending', () => {
    const actual = pinsReducer(
      initialState,
      { type: fetchPins.pending.type }
    );
    expect(actual.loading).toBe(true);
    expect(actual.error).toBe(null);
  });

  it('should handle fetchPins.fulfilled', () => {
    const actual = pinsReducer(
      { ...initialState, loading: true },
      { type: fetchPins.fulfilled.type, payload: mockLocations }
    );
    expect(actual.loading).toBe(false);
    expect(actual.locations).toEqual(mockLocations);
    expect(actual.lastFetched).toBeTruthy();
  });

  it('should handle fetchPins.rejected', () => {
    const errorMessage = 'Failed to fetch';
    const actual = pinsReducer(
      { ...initialState, loading: true },
      { type: fetchPins.rejected.type, payload: errorMessage }
    );
    expect(actual.loading).toBe(false);
    expect(actual.error).toBe(errorMessage);
  });
});