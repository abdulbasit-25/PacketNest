import { v4 as uuidv4 } from 'uuid';
import { NetworkDevice, DeviceType, NetworkInterface } from '@/types/network';

export function createDefaultInterfaces(type: DeviceType): NetworkInterface[] {
  const count = type === 'router' ? 4 : type === 'switch' ? 8 : 1;
  const prefix = type === 'router' ? 'GigabitEthernet0/' : type === 'switch' ? 'FastEthernet0/' : 'eth';
  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    name: `${prefix}${i}`,
    ipAddress: '',
    subnetMask: '',
    isUp: false,
  }));
}

export function createDevice(type: DeviceType, x: number, y: number, name?: string): NetworkDevice {
  const names: Record<DeviceType, string> = {
    router: 'Router',
    switch: 'Switch',
    pc: 'PC',
    server: 'Server',
  };
  return {
    id: uuidv4(),
    type,
    name: name || names[type],
    x,
    y,
    interfaces: createDefaultInterfaces(type),
    defaultGateway: '',
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
