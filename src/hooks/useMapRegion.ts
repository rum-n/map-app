import { useState } from 'react';
import { Region } from 'react-native-maps';

export const useMapRegion = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 42.6977,
    longitude: 23.3219,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return {
    region,
    setRegion,
  };
};

export default useMapRegion; 