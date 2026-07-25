import { NetworkState } from '@/types/network';
import { createDevice } from './networkUtils';

export const exampleTopologies: Record<string, { name: string; description: string; state: NetworkState }> = {
  simple: {
    name: 'Simple LAN',
    description: '2 PCs connected via a switch',
    state: (() => {
      const pc1 = createDevice('pc', 150, 300, 'PC1');
      pc1.interfaces[0].ipAddress = '192.168.1.10';
      pc1.interfaces[0].subnetMask = '255.255.255.0';
      pc1.interfaces[0].isUp = true;
      pc1.defaultGateway = '192.168.1.1';

      const pc2 = createDevice('pc', 650, 300, 'PC2');
      pc2.interfaces[0].ipAddress = '192.168.1.20';
      pc2.interfaces[0].subnetMask = '255.255.255.0';
      pc2.interfaces[0].isUp = true;
      pc2.defaultGateway = '192.168.1.1';

      const sw = createDevice('switch', 400, 300, 'Switch1');

      return {
        devices: [pc1, sw, pc2],
        connections: [
          { id: 'c1', deviceAId: pc1.id, deviceBId: sw.id, interfaceAId: pc1.interfaces[0].id, interfaceBId: sw.interfaces[0].id },
          { id: 'c2', deviceAId: sw.id, deviceBId: pc2.id, interfaceAId: sw.interfaces[1].id, interfaceBId: pc2.interfaces[0].id },
        ],
      };
    })(),
  },
  routed: {
    name: 'Routed Network',
    description: '2 LANs connected by a router',
    state: (() => {
      const router = createDevice('router', 400, 200, 'Router1');
      router.interfaces[0].ipAddress = '192.168.1.1';
      router.interfaces[0].subnetMask = '255.255.255.0';
      router.interfaces[0].isUp = true;
      router.interfaces[1].ipAddress = '10.0.0.1';
      router.interfaces[1].subnetMask = '255.255.255.0';
      router.interfaces[1].isUp = true;

      const sw1 = createDevice('switch', 200, 350, 'Switch1');
      const sw2 = createDevice('switch', 600, 350, 'Switch2');

      const pc1 = createDevice('pc', 100, 500, 'PC1');
      pc1.interfaces[0].ipAddress = '192.168.1.10';
      pc1.interfaces[0].subnetMask = '255.255.255.0';
      pc1.interfaces[0].isUp = true;
      pc1.defaultGateway = '192.168.1.1';

      const server = createDevice('server', 700, 500, 'Server1');
      server.interfaces[0].ipAddress = '10.0.0.10';
      server.interfaces[0].subnetMask = '255.255.255.0';
      server.interfaces[0].isUp = true;
      server.defaultGateway = '10.0.0.1';

      return {
        devices: [router, sw1, sw2, pc1, server],
        connections: [
          { id: 'c1', deviceAId: router.id, deviceBId: sw1.id, interfaceAId: router.interfaces[0].id, interfaceBId: sw1.interfaces[0].id },
          { id: 'c2', deviceAId: router.id, deviceBId: sw2.id, interfaceAId: router.interfaces[1].id, interfaceBId: sw2.interfaces[0].id },
          { id: 'c3', deviceAId: sw1.id, deviceBId: pc1.id, interfaceAId: sw1.interfaces[1].id, interfaceBId: pc1.interfaces[0].id },
          { id: 'c4', deviceAId: sw2.id, deviceBId: server.id, interfaceAId: sw2.interfaces[1].id, interfaceBId: server.interfaces[0].id },
        ],
      };
    })(),
  },
};
