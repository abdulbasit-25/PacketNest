export type DeviceType = 'router' | 'switch' | 'pc' | 'server';

export interface NetworkInterface {
  id: string;
  name: string;
  ipAddress: string;
  subnetMask: string;
  isUp: boolean;
  connectedTo?: string; // connection id
}

export interface NetworkDevice {
  id: string;
  type: DeviceType;
  name: string;
  x: number;
  y: number;
  interfaces: NetworkInterface[];
  defaultGateway: string;
}

export interface Connection {
  id: string;
  deviceAId: string;
  deviceBId: string;
  interfaceAId: string;
  interfaceBId: string;
}

export interface PacketAnimation {
  id: string;
  connectionId: string;
  fromDeviceId: string;
  toDeviceId: string;
  progress: number;
  success: boolean;
}

export interface SimulationResult {
  success: boolean;
  message: string;
  steps: string[];
}

export interface NetworkState {
  devices: NetworkDevice[];
  connections: Connection[];
}

export type HistoryEntry = {
  devices: NetworkDevice[];
  connections: Connection[];
};
