import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Location } from '../redux/slices/pinsSlice';
import BottomSheet from '@gorhom/bottom-sheet';

interface PinDetailsSheetProps {
  location: Location | null;
  bottomSheetRef: React.RefObject<BottomSheet>;
}

const PinDetailsSheet: React.FC<PinDetailsSheetProps> = ({ location, bottomSheetRef }) => {
  if (!location) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['50%']}
      enablePanDownToClose>
      <View style={styles.container}>
        <Text style={styles.title}>{location.title}</Text>
        <Text style={styles.coordinates}>
          Latitude: {location.latitude}
          {'\n'}
          Longitude: {location.longitude}
        </Text>
        <Text style={styles.sectionTitle}>Connectors:</Text>
        {location.connectors.map((connector, index) => (
          <View key={index} style={styles.connectorItem}>
            <Text style={styles.connectorType}>{connector.type}</Text>
            <Text
              style={[
                styles.connectorStatus,
                {
                  color:
                    connector.status === 'available' ? '#4CAF50' : '#F44336',
                },
              ]}>
              {connector.status}
            </Text>
          </View>
        ))}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  connectorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  connectorType: {
    fontSize: 16,
  },
  connectorStatus: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PinDetailsSheet;