export type DeviceType = 'router' | 'wireless-router' | 'switch' | 'pc' | 'server' | 'laptop' | 'smartphone' | 'firewall';

export interface NetworkInterface {
  id: string;
  name: string;
  ipAddress: string;
  subnetMask: string;
  isUp: boolean;
  connectedTo?: string; // connection id
  type?: 'ethernet' | 'wireless' | 'inside' | 'outside';
}

export interface ArpEntry {
  ip: string;
  mac: string;
  interfaceId: string;
}

export interface RouteEntry {
  destination: string;
  mask: string;
  nextHop: string;
  interfaceId: string;
}

export interface NetworkDevice {
  id: string;
  type: DeviceType;
  name: string;
  x: number;
  y: number;
  interfaces: NetworkInterface[];
  defaultGateway: string;
  acl?: string;
  arpTable: ArpEntry[];
  routingTable: RouteEntry[];
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
