import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MapScreen from '../../src/screens/MapScreen';
import pinsReducer from '../../src/redux/slices/pinsSlice';
import filterReducer from '../../src/redux/slices/filterSlice';
import settingsReducer from '../../src/redux/slices/settingsSlice';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{
      _id: '1',
      title: 'Test Location',
      latitude: 42.6977,
      longitude: 23.3219,
      connectors: [{
        type: 'J1772' as const,
        status: 'available' as const
      }]
    }])
  })
) as jest.Mock;

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: 'GestureHandlerRootView',
}));

jest.mock('react-native', () => ({
  Platform: {
    select: jest.fn(obj => obj.ios),
  },
  StyleSheet: {
    create: jest.fn(styles => styles),
  },
  View: 'View',
  Text: 'Text',
  Animated: {
    View: 'Animated.View',
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      interpolate: jest.fn(() => ({
        interpolate: jest.fn(),
      })),
    })),
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    sequence: jest.fn(() => ({
      start: jest.fn(),
    })),
    delay: jest.fn(),
  },
}));

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const MockMapView = (props: any) => (
    <View testID={props.testID || 'map-view'} {...props}>
      {props.children}
    </View>
  );

  const MockMarker = (props: any) => (
    <View testID={props.testID || 'map-marker'} {...props}>
      {props.children}
    </View>
  );

  const MockCallout = (props: any) => (
    <View testID={props.testID || 'map-callout'} {...props}>
      {props.children}
    </View>
  );

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Callout: MockCallout,
  };
});

jest.mock('../../src/hooks/useMapRegion', () => ({
  __esModule: true,
  default: () => ({
    region: {
      latitude: 42.6977,
      longitude: 23.3219,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    setRegion: jest.fn(),
  }),
}));

describe('MapScreen', () => {
  let mockStore: any;

  beforeEach(() => {
    const initialState = {
      pins: {
        locations: [{
          _id: '1',
          title: 'Test Location',
          latitude: 42.6977,
          longitude: 23.3219,
          connectors: [{
            type: 'J1772' as const,
            status: 'available' as const
          }]
        }],
        loading: false,
        error: null,
        lastFetched: Date.now()
      },
      filters: {
        types: { 'J1772': true, 'Type2': false, 'CCS 2': false, 'Type 3': false },
        statuses: { 'available': true, 'unavailable': false }
      },
      settings: { pinStyle: 'default' }
    };

    mockStore = configureStore({
      reducer: {
        pins: pinsReducer,
        filters: filterReducer,
        settings: settingsReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
          immutableCheck: false,
        }),
      preloadedState: initialState
    });

    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    const { getByTestId } = render(
      <Provider store={mockStore}>
        <MapScreen />
      </Provider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(getByTestId('map-view')).toBeTruthy();
  });

  it('shows offline banner when connection is lost', async () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <MapScreen />
      </Provider>
    );

    await act(async () => {
      mockStore.dispatch({ type: 'CONNECTION_LOST' });
    });

    expect(getByText('You are currently offline. The information may be outdated.')).toBeTruthy();
  });

  it('filters locations based on visible region', async () => {
    const { getByTestId, queryAllByTestId, debug } = render(
      <Provider store={mockStore}>
        <MapScreen />
      </Provider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const markers = queryAllByTestId('map-marker');
    expect(markers.length).toBeGreaterThan(0);
  });
});