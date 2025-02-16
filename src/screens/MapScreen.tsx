import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import MapView, { Marker, Region, Callout } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchPins } from '../redux/slices/pinsSlice';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const BASE_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000',
});

const MapScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { locations } = useSelector((state: RootState) => state.pins);
  const filters = useSelector((state: RootState) => state.filters);
  const pinStyle = useSelector((state: RootState) => state.settings.pinStyle);
  const [visibleRegion, setVisibleRegion] = useState<Region>();
  const [isOnline, setIsOnline] = useState(true);
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

    const intervalId = setInterval(checkConnectivity, 60000);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [dispatch, isOnline, pinStyle]);

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

  const filteredLocations = locations
    .filter(location => {
      // Basic validation
      if (!location?._id || !location?.latitude || !location?.longitude) {
        return false;
      }

      // Region bounds check
      if (visibleRegion) {
        const isWithinBounds =
          location.latitude <= visibleRegion.latitude + visibleRegion.latitudeDelta / 2 &&
          location.latitude >= visibleRegion.latitude - visibleRegion.latitudeDelta / 2 &&
          location.longitude <= visibleRegion.longitude + visibleRegion.longitudeDelta / 2 &&
          location.longitude >= visibleRegion.longitude - visibleRegion.longitudeDelta / 2;

        if (!isWithinBounds) return false;
      }

      // Filter check
      const anyTypeSelected = Object.values(filters.types).some(value => value);
      const anyStatusSelected = Object.values(filters.statuses).some(value => value);

      if (!anyTypeSelected && !anyStatusSelected) {
        return true;
      }

      return location.connectors?.some(
        connector =>
          connector &&
          (!anyTypeSelected || filters.types[connector.type]) &&
          (!anyStatusSelected || filters.statuses[connector.status])
      ) ?? false;
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container} testID="map-container">
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
          onRegionChangeComplete={setVisibleRegion}
          initialRegion={{
            latitude: 42.6977,
            longitude: 23.3219,
            latitudeDelta: 1.5,
            longitudeDelta: 1.5,
          }}>
          {filteredLocations.map(location => (
            <Marker
              key={location._id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              pinColor={getPinColor(pinStyle)}>
              <Callout tooltip style={styles.customCallout}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>
                    {location.title || 'N/A'}
                  </Text>
                  <Text style={styles.calloutText}>
                    Latitude: {location.latitude.toFixed(2)}
                  </Text>
                  <Text style={styles.calloutText}>
                    Longitude: {location.longitude.toFixed(2)}
                  </Text>
                  <Text style={styles.calloutText}>
                    Connectors:
                  </Text>
                  {(location.connectors || [])
                    .filter(connector => connector?.type || connector?.status)
                    .map((connector, index) => (
                      <Text key={`${location._id}-${index}`} style={styles.calloutText}>
                        {connector.type || 'Unknown'}: {connector.status || 'Unknown'}
                      </Text>
                    ))}
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    </GestureHandlerRootView>
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
    backgroundColor: '#FF9800',
    padding: 10,
    zIndex: 1000,
  },
  bannerText: {
    color: 'white',
    textAlign: 'center',
  },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    width: 150,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calloutText: {
    fontSize: 14,
    marginVertical: 5,
  },
  customCallout: {
    width: 150,
    height: 100,
  },
});

export default MapScreen;