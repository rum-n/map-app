import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchPins, Location } from '../redux/slices/pinsSlice';
import PinDetailsSheet from '../components/PinDetailsSheet';
import BottomSheet from '@gorhom/bottom-sheet';

const MapScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { locations, loading, error } = useSelector((state: RootState) => state.pins);
  const filters = useSelector((state: RootState) => state.filters);
  const pinStyle = useSelector((state: RootState) => state.settings.pinStyle);
  const [visibleRegion, setVisibleRegion] = useState<Region>();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    const controller = new AbortController();

    const checkConnectivity = async () => {
      try {
        const response = await fetch('http://localhost:3000/ping', {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Network response was not ok');
        if (!isOnline) {
          setIsOnline(true);
          dispatch(fetchPins());
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setIsOnline(false);
          setTimeout(() => {
            Alert.alert(
              'Offline Mode',
              'You are currently offline. The information may be outdated.',
            );
          }, 4000);
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

  const filteredLocations = locations.filter(location => {
    // Filter by map boundaries
    if (visibleRegion) {
      const isWithinBounds =
        location.latitude >= visibleRegion.latitude - visibleRegion.latitudeDelta / 2 &&
        location.latitude <= visibleRegion.latitude + visibleRegion.latitudeDelta / 2 &&
        location.longitude >= visibleRegion.longitude - visibleRegion.longitudeDelta / 2 &&
        location.longitude <= visibleRegion.longitude + visibleRegion.longitudeDelta / 2;

      if (!isWithinBounds) return false;
    }

    // Filter by connector types and status
    return location.connectors.some(
      connector =>
        filters.types[connector.type] && filters.statuses[connector.status]
    );
  });

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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onRegionChangeComplete={setVisibleRegion}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {filteredLocations.map(location => (
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
        ))}
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
});

export default MapScreen;