import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setPinStyle } from '../redux/slices/settingsSlice';
import { useNavigation } from '@react-navigation/native';
import { DrawerParamList } from '../../App';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { PinStyle } from '@/types';

type SettingsScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Settings'>;

const PIN_STYLES: PinStyle[] = ['default', 'custom1', 'custom2', 'custom3'];

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleStyleSelect = async (style: PinStyle) => {
    try {
      await AsyncStorage.setItem('pinStyle', style);
      dispatch(setPinStyle(style));
      navigation.navigate('Map');
    } catch (error) {
      console.error('Error saving pin style:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Map Pin Style</Text>
      <View style={styles.styleContainer}>
        {PIN_STYLES.map((style: PinStyle) => (
          <TouchableOpacity
            testID="style-option"
            key={style}
            style={[styles.styleOption]}
            onPress={() => handleStyleSelect(style)}>
            <Text style={styles.styleText}>{style}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  styleContainer: {
    gap: 10,
  },
  styleOption: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  styleText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SettingsScreen;