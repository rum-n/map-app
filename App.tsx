import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapScreen from './src/screens/MapScreen';
import FilterDrawer from './src/components/FilterDrawer';
import SettingsScreen from './src/screens/SettingsScreen';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

export type DrawerParamList = {
  Map: undefined;
  Settings: undefined;
};

const LeftDrawer = createDrawerNavigator<DrawerParamList>();
const RightDrawer = createDrawerNavigator<DrawerParamList>();

const Map = () => {
  return (
    <LeftDrawer.Navigator>
      <LeftDrawer.Screen
        name="Map"
        component={MapScreen}
        options={({ navigation }: any) => ({
          title: 'Map',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.getParent()?.openDrawer()}
              style={{
                marginRight: 15,
                padding: 8,
                borderRadius: 20,
              }}>
              <Icon name="filter" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        })}
      />
      <LeftDrawer.Screen name="Settings" component={SettingsScreen} />
    </LeftDrawer.Navigator>
  );
};

const RightDrawerNavigator = () => {
  return (
    <RightDrawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
      }}
      drawerContent={(props) => <FilterDrawer {...props} />}>
      <RightDrawer.Screen name="Map" component={Map} />
    </RightDrawer.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <RightDrawerNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
