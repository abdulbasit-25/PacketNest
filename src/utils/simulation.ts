import { NetworkDevice, Connection, SimulationResult } from '@/types/network';
import { getNetworkAddress, ipToNumber, isValidIp } from './networkUtils';

function findPath(
  sourceId: string,
  destId: string,
  devices: NetworkDevice[],
  connections: Connection[]
): string[] | null {
  const visited = new Set<string>();
  const queue: string[][] = [[sourceId]];
  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];
    if (current === destId) return path;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const conn of connections) {
      let neighbor: string | null = null;
      if (conn.deviceAId === current) neighbor = conn.deviceBId;
      else if (conn.deviceBId === current) neighbor = conn.deviceAId;
      if (neighbor && !visited.has(neighbor)) {
        queue.push([...path, neighbor]);
      }
    }
  }
  return null;
}

export function simulatePing(
  sourceId: string,
  destIp: string,
  devices: NetworkDevice[],
  connections: Connection[]
): SimulationResult {
  const steps: string[] = [];
  const source = devices.find(d => d.id === sourceId);
  if (!source) return { success: false, message: 'Source device not found.', steps };

  const sourceIf = source.interfaces.find(i => i.ipAddress && i.isUp);
  if (!sourceIf) {
    steps.push(`${source.name}: No active interface with IP configured.`);
    return { success: false, message: 'Source has no active interface.', steps };
  }

  steps.push(`${source.name}: Pinging ${destIp} from ${sourceIf.ipAddress}...`);

  if (!isValidIp(destIp)) {
    steps.push('Invalid destination IP address.');
    return { success: false, message: 'Invalid destination IP.', steps };
  }

  // Find destination device
  const destDevice = devices.find(d =>
    d.interfaces.some(i => i.ipAddress === destIp && i.isUp)
  );
  if (!destDevice) {
    steps.push(`Destination ${destIp} not found in network.`);
    return { success: false, message: `Destination host ${destIp} unreachable.`, steps };
  }

  // Check same subnet
  const srcNet = getNetworkAddress(sourceIf.ipAddress, sourceIf.subnetMask);
  const destIf = destDevice.interfaces.find(i => i.ipAddress === destIp)!;
  const dstNet = getNetworkAddress(destIp, destIf.subnetMask);

  const sameSubnet = srcNet !== -1 && dstNet !== -1 && srcNet === dstNet;

  if (sameSubnet) {
    steps.push(`Same subnet detected (${sourceIf.subnetMask}).`);
  } else {
    steps.push(`Different subnets. Checking gateway...`);
    if (!source.defaultGateway) {
      steps.push(`${source.name}: No default gateway configured.`);
      return { success: false, message: 'No gateway configured on source.', steps };
    }
    const gwDevice = devices.find(d =>
      d.interfaces.some(i => i.ipAddress === source.defaultGateway && i.isUp)
    );
    if (!gwDevice) {
      steps.push(`Gateway ${source.defaultGateway} not reachable.`);
      return { success: false, message: 'Gateway unreachable.', steps };
    }
    steps.push(`Routing through gateway ${source.defaultGateway} (${gwDevice.name}).`);
  }

  // Check physical path
  const path = findPath(source.id, destDevice.id, devices, connections);
  if (!path) {
    steps.push('No physical path between devices.');
    return { success: false, message: 'Destination host unreachable (no path).', steps };
  }

  steps.push(`Physical path: ${path.map(id => devices.find(d => d.id === id)?.name).join(' → ')}`);
  steps.push(`Reply from ${destIp}: bytes=32 time<1ms TTL=128`);

  return {
    success: true,
    message: `Ping to ${destIp} successful!`,
    steps,
  };
}

export function getConnectionPath(
  sourceId: string,
  destDeviceId: string,
  connections: Connection[]
): string[] {
  const visited = new Set<string>();
  const queue: string[][] = [[sourceId]];
  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];
    if (current === destDeviceId) return path;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const conn of connections) {
      let neighbor: string | null = null;
      if (conn.deviceAId === current) neighbor = conn.deviceBId;
      else if (conn.deviceBId === current) neighbor = conn.deviceAId;
      if (neighbor && !visited.has(neighbor)) {
        queue.push([...path, neighbor]);
      }
    }
  }
  return [];
}
