import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTypeFilter, setStatusFilter } from '../redux/slices/filterSlice';
import type { RootState } from '../redux/store';

type ConnectorType = 'J1772' | 'Type2' | 'CCS 2' | 'Type 3';
type ConnectorStatus = 'available' | 'unavailable';

const FilterDrawer = ({ navigation }: any) => {
  const filters = useSelector((state: RootState) => state.filters);
  const dispatch = useDispatch();

  const handleApplyFilters = () => {
    navigation.closeDrawer();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connector Types</Text>
        {Object.keys(filters.types).map((type) => (
          <View key={type} style={styles.checkboxContainer}>
            <CheckBox
              value={filters.types[type as ConnectorType]}
              onValueChange={(newValue) =>
                dispatch(setTypeFilter({ type: type as ConnectorType, value: newValue }))
              }
            />
            <Text style={styles.label}>{type}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connector Status</Text>
        {Object.keys(filters.statuses).map((status) => (
          <View key={status} style={styles.checkboxContainer}>
            <CheckBox
              value={filters.statuses[status as ConnectorStatus]}
              onValueChange={(newValue) =>
                dispatch(setStatusFilter({ status: status as ConnectorStatus, value: newValue }))
              }
            />
            <Text style={styles.label}>{status}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.applyButton}
        onPress={handleApplyFilters}>
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FilterDrawer;