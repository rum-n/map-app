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
        <View style={styles.coordinatesContainer}>
          <View style={styles.coordinateRow}>
            <Text style={styles.coordinateLabel}>Latitude:</Text>
            <Text style={styles.coordinateValue}>{location.latitude.toFixed(6)}°</Text>
          </View>
          <View style={styles.coordinateRow}>
            <Text style={styles.coordinateLabel}>Longitude:</Text>
            <Text style={styles.coordinateValue}>{location.longitude.toFixed(6)}°</Text>
          </View>
        </View>
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
  coordinatesContainer: {
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  coordinateLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  coordinateValue: {
    fontSize: 16,
    fontFamily: 'monospace',
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