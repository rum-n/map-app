import 'react-native-gesture-handler/jestSetup';

global.mockNavigate = jest.fn();

jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: jest.fn(props => <View testID="map-view" {...props} />),
    Marker: jest.fn(props => <View testID="map-marker" {...props} />),
    Callout: jest.fn(props => <View testID="map-callout" {...props} />),
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: global.mockNavigate,
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => { };
  return Reanimated;
});

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: jest.fn(props => <View {...props} />),
    Swipeable: jest.fn(props => <View {...props} />),
    DrawerLayout: jest.fn(props => <View {...props} />),
    State: {},
    ScrollView: jest.fn(props => <View {...props} />),
    Slider: jest.fn(props => <View {...props} />),
    Switch: jest.fn(props => <View {...props} />),
    TextInput: jest.fn(props => <View {...props} />),
    gestureHandlerRootHOC: jest.fn(),
    Direction: {},
  };
});

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.StyleSheet = {
    create: jest.fn((styles) => styles),
    flatten: jest.fn((styles) => styles),
    compose: jest.fn(),
  };
  return RN;
}); 