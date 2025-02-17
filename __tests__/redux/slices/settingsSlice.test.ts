import settingsReducer, { setPinStyle } from "../../../src/redux/slices/settingsSlice";
import { PinStyle } from '../../../src/types/index';

describe('Settings Slice', () => {
  const initialState = {
    pinStyle: 'default' as PinStyle,
  };

  it('should handle initial state', () => {
    expect(settingsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setPinStyle', () => {
    const actual = settingsReducer(
      initialState,
      setPinStyle('custom1')
    );
    expect(actual.pinStyle).toBe('custom1');
  });
});