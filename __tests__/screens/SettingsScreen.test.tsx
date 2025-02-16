import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SettingsScreen from '../../src/screens/SettingsScreen';
import settingsReducer from '../../src/redux/slices/settingsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

declare global {
  var mockNavigate: jest.Mock;
}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn(),
}));

describe('SettingsScreen', () => {
  const mockStore = configureStore({
    reducer: {
      settings: settingsReducer,
    },
    preloadedState: {
      settings: {
        pinStyle: 'default'
      }
    }
  });

  it('renders all pin style options', () => {
    const { getAllByTestId } = render(
      <Provider store={mockStore} >
        <SettingsScreen />
      </Provider>
    );

    const styleOptions = getAllByTestId('style-option');
    expect(styleOptions).toHaveLength(4); // default, custom1, custom2, custom3
  });

  it('handles style selection', async () => {
    const { getByText } = render(
      <Provider store={mockStore} >
        <SettingsScreen />
      </Provider>
    );

    fireEvent.press(getByText('custom1'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Map');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('pinStyle', 'custom1');
    });
  });
});