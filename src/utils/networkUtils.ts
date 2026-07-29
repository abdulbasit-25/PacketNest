import { v4 as uuidv4 } from 'uuid';
import { NetworkDevice, DeviceType, NetworkInterface } from '@/types/network';

export const deviceTemplates: Record<DeviceType, Partial<NetworkDevice>> = {
  router: { name: 'Router', defaultGateway: '', acl: '', arpTable: [], routingTable: [] },
  'wireless-router': { name: 'Wireless Router', defaultGateway: '', acl: '', arpTable: [], routingTable: [] },
  switch: { name: 'Switch', defaultGateway: '', arpTable: [], routingTable: [] },
  pc: { name: 'PC', defaultGateway: '', arpTable: [], routingTable: [] },
  server: { name: 'Server', defaultGateway: '', arpTable: [], routingTable: [] },
  laptop: { name: 'Laptop', defaultGateway: '', arpTable: [], routingTable: [] },
  smartphone: { name: 'Smartphone', defaultGateway: '', arpTable: [], routingTable: [] },
  firewall: { name: 'Firewall', defaultGateway: '', acl: '', arpTable: [], routingTable: [] },
};

export function createDefaultInterfaces(type: DeviceType): NetworkInterface[] {
  if (type === 'firewall') {
    return [
      { id: uuidv4(), name: 'inside', ipAddress: '', subnetMask: '', isUp: false, type: 'inside' },
      { id: uuidv4(), name: 'outside', ipAddress: '', subnetMask: '', isUp: false, type: 'outside' },
    ];
  }

  if (type === 'router') {
    return Array.from({ length: 4 }, (_, i) => ({
      id: uuidv4(),
      name: `GigabitEthernet0/${i}`,
      ipAddress: '',
      subnetMask: '',
      isUp: false,
      type: 'ethernet',
    }));
  }

  if (type === 'switch') {
    return Array.from({ length: 8 }, (_, i) => ({
      id: uuidv4(),
      name: `FastEthernet0/${i}`,
      ipAddress: '',
      subnetMask: '',
      isUp: false,
      type: 'ethernet',
    }));
  }

  if (type === 'wireless-router') {
    return [
      { id: uuidv4(), name: 'eth0', ipAddress: '', subnetMask: '', isUp: false, type: 'ethernet' },
      { id: uuidv4(), name: 'wlan0', ipAddress: '', subnetMask: '', isUp: false, type: 'wireless' },
    ];
  }

  if (type === 'smartphone') {
    return [{ id: uuidv4(), name: 'wlan0', ipAddress: '', subnetMask: '', isUp: false, type: 'wireless' }];
  }

  // pc, server, laptop (ethernet)
  return [{ id: uuidv4(), name: 'eth0', ipAddress: '', subnetMask: '', isUp: false, type: 'ethernet' }];
}

export function createDevice(type: DeviceType, x: number, y: number, name?: string): NetworkDevice {
  const names: Record<DeviceType, string> = {
    router: 'Router',
    'wireless-router': 'Wireless Router',
    switch: 'Switch',
    pc: 'PC',
    server: 'Server',
    laptop: 'Laptop',
    smartphone: 'Smartphone',
    firewall: 'Firewall',
  };
  return {
    id: uuidv4(),
    type,
    name: name || names[type],
    x,
    y,
    interfaces: createDefaultInterfaces(type),
    defaultGateway: '',
    acl: type === 'firewall' ? 'permit any' : '',
    arpTable: [],
    routingTable: [],
  };
}


export function ipToNumber(ip: string): number {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return -1;
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
}

export function maskToNumber(mask: string): number {
  return ipToNumber(mask);
}

export function getNetworkAddress(ip: string, mask: string): number {
  const ipNum = ipToNumber(ip);
  const maskNum = maskToNumber(mask);
  if (ipNum === -1 || maskNum === -1) return -1;
  return (ipNum & maskNum) >>> 0;
}

export function isValidIp(ip: string): boolean {
  return ipToNumber(ip) !== -1;
}

export function isValidMask(mask: string): boolean {
  const num = ipToNumber(mask);
  if (num === -1) return false;
  const unsigned = num >>> 0;
  const inverted = ~unsigned >>> 0;
  return (inverted & (inverted + 1)) === 0;
}
