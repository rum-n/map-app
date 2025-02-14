import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchPins, Location } from '../redux/slices/pinsSlice';
import PinDetailsSheet from '../components/PinDetailsSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { Platform } from 'react-native';

const BASE_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000',
});

const MapScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { locations, loading, error } = useSelector((state: RootState) => state.pins);
  const filters = useSelector((state: RootState) => state.filters);
  const pinStyle = useSelector((state: RootState) => state.settings.pinStyle);
  const [visibleRegion, setVisibleRegion] = useState<Region>();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bannerOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    const controller = new AbortController();

    const checkConnectivity = async () => {
      try {
        const response = await fetch(`${BASE_URL}/ping`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Network response was not ok');
        if (!isOnline) {
          setIsOnline(true);
          dispatch(fetchPins());
        }
      } catch (error) {
        console.error('Connectivity check error:', error);
        if (!controller.signal.aborted) {
          setIsOnline(false);
        }
      }
    };

    dispatch(fetchPins());

    // Set up polling interval
    const intervalId = setInterval(checkConnectivity, 30000);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [dispatch, isOnline]);

  useEffect(() => {
    if (!isOnline) {
      Animated.sequence([
        Animated.timing(bannerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(4000),
        Animated.timing(bannerOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOnline, bannerOpacity]);

  const handleMarkerPress = (location: Location) => {
    setSelectedLocation(location);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const getPinColor = (style: string): string => {
    switch (style) {
      case 'custom1':
        return 'blue';
      case 'custom2':
        return 'green';
      case 'custom3':
        return 'purple';
      default:
        return 'red';
    }
  };

  const filteredLocations = locations.filter(location => {
    // First check if location is within visible bounds
    if (visibleRegion) {
      const isWithinBounds =
        location.latitude <= visibleRegion.latitude + visibleRegion.latitudeDelta / 2 &&
        location.latitude >= visibleRegion.latitude - visibleRegion.latitudeDelta / 2 &&
        location.longitude <= visibleRegion.longitude + visibleRegion.longitudeDelta / 2 &&
        location.longitude >= visibleRegion.longitude - visibleRegion.longitudeDelta / 2;

      if (!isWithinBounds) return false;
    }

    // Then apply connector filters
    const anyTypeSelected = Object.values(filters.types).some(value => value);
    const anyStatusSelected = Object.values(filters.statuses).some(value => value);

    if (!anyTypeSelected && !anyStatusSelected) {
      return true;
    }

    return location.connectors.some(
      connector =>
        (!anyTypeSelected || filters.types[connector.type]) &&
        (!anyStatusSelected || filters.statuses[connector.status])
    );
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.banner,
          {
            opacity: bannerOpacity,
            transform: [
              {
                translateY: bannerOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}>
        <Text style={styles.bannerText}>
          You are currently offline. The information may be outdated.
        </Text>
      </Animated.View>
      <MapView
        style={styles.map}
        onRegionChangeComplete={(region) => {
          setVisibleRegion(region);
        }}
        initialRegion={{
          latitude: 42.6977,
          longitude: 23.3219,
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        }}>
        {filteredLocations.map(location => {
          return (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={location.title}
              onPress={() => handleMarkerPress(location)}
              pinColor={getPinColor(pinStyle)}
            />
          );
        })}
      </MapView>
      <PinDetailsSheet location={selectedLocation} bottomSheetRef={bottomSheetRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f44336',
    padding: 10,
    zIndex: 1000,
  },
  bannerText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default MapScreen;