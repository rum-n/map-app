export type ConnectorType = 'J1772' | 'Type2' | 'CCS 2' | 'Type 3';
export type ConnectorStatus = 'available' | 'unavailable';
export type PinStyle = 'default' | 'custom1' | 'custom2' | 'custom3';

export interface Connector {
  type: ConnectorType;
  status: ConnectorStatus;
}

export interface Location {
  _id: string;
  title: string;
  latitude: number;
  longitude: number;
  connectors: Connector[];
}