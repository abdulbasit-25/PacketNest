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
  firewall: {
    name: 'Firewall DMZ',
    description: 'Firewall between internal LAN and external network',
    state: (() => {
      const firewall = createDevice('firewall', 400, 220, 'FW1');
      firewall.interfaces[0].ipAddress = '192.168.10.1';
      firewall.interfaces[0].subnetMask = '255.255.255.0';
      firewall.interfaces[0].isUp = true;
      firewall.interfaces[1].ipAddress = '10.0.0.1';
      firewall.interfaces[1].subnetMask = '255.255.255.0';
      firewall.interfaces[1].isUp = true;
      firewall.acl = 'permit any';

      const laptop = createDevice('laptop', 200, 420, 'Laptop1');
      laptop.interfaces[0].ipAddress = '192.168.10.10';
      laptop.interfaces[0].subnetMask = '255.255.255.0';
      laptop.interfaces[0].isUp = true;
      laptop.defaultGateway = '192.168.10.1';

      const smartphone = createDevice('smartphone', 600, 420, 'Phone1');
      smartphone.interfaces[0].ipAddress = '192.168.10.20';
      smartphone.interfaces[0].subnetMask = '255.255.255.0';
      smartphone.interfaces[0].isUp = true;
      smartphone.defaultGateway = '192.168.10.1';

      const internet = createDevice('router', 400, 60, 'InternetRouter');
      internet.interfaces[0].ipAddress = '10.0.0.2';
      internet.interfaces[0].subnetMask = '255.255.255.0';
      internet.interfaces[0].isUp = true;

      return {
        devices: [firewall, laptop, smartphone, internet],
        connections: [
          { id: 'c1', deviceAId: firewall.id, deviceBId: laptop.id, interfaceAId: firewall.interfaces[0].id, interfaceBId: laptop.interfaces[0].id },
          { id: 'c2', deviceAId: firewall.id, deviceBId: smartphone.id, interfaceAId: firewall.interfaces[0].id, interfaceBId: smartphone.interfaces[0].id },
          { id: 'c3', deviceAId: firewall.id, deviceBId: internet.id, interfaceAId: firewall.interfaces[1].id, interfaceBId: internet.interfaces[0].id },
        ],
      };
    })(),
  },
  fullstack: {
    name: 'Full Stack: All Devices',
    description: 'Example using router + wireless router + switch + firewall + PC + laptop + smartphone + server',
    state: (() => {
      const internet = createDevice('router', 400, 50, 'Internet');
      internet.interfaces[0].ipAddress = '10.0.0.254';
      internet.interfaces[0].subnetMask = '255.255.255.0';
      internet.interfaces[0].isUp = true;

      const firewall = createDevice('firewall', 400, 170, 'Firewall');
      firewall.interfaces[0].ipAddress = '192.168.0.1';
      firewall.interfaces[0].subnetMask = '255.255.255.0';
      firewall.interfaces[0].isUp = true;
      firewall.interfaces[1].ipAddress = '10.0.0.1';
      firewall.interfaces[1].subnetMask = '255.255.255.0';
      firewall.interfaces[1].isUp = true;
      firewall.acl = 'permit any';

      const sw = createDevice('switch', 400, 310, 'Switch');

      const wirelessRouter = createDevice('wireless-router', 250, 250, 'WiFi-Router');
      wirelessRouter.interfaces[0].ipAddress = '192.168.0.2';
      wirelessRouter.interfaces[0].subnetMask = '255.255.255.0';
      wirelessRouter.interfaces[0].isUp = true;
      wirelessRouter.interfaces[1].ipAddress = '192.168.0.254';
      wirelessRouter.interfaces[1].subnetMask = '255.255.255.0';
      wirelessRouter.interfaces[1].isUp = true;
      wirelessRouter.defaultGateway = '192.168.0.1';

      const pc = createDevice('pc', 230, 380, 'PC');
      pc.interfaces[0].ipAddress = '192.168.0.10';
      pc.interfaces[0].subnetMask = '255.255.255.0';
      pc.interfaces[0].isUp = true;
      pc.defaultGateway = '192.168.0.1';

      const laptop = createDevice('laptop', 350, 380, 'Laptop');
      laptop.interfaces[0].ipAddress = '192.168.0.20';
      laptop.interfaces[0].subnetMask = '255.255.255.0';
      laptop.interfaces[0].isUp = true;
      laptop.defaultGateway = '192.168.0.1';

      const server = createDevice('server', 460, 380, 'Server');
      server.interfaces[0].ipAddress = '192.168.0.100';
      server.interfaces[0].subnetMask = '255.255.255.0';
      server.interfaces[0].isUp = true;
      server.defaultGateway = '192.168.0.1';

      const smartphone = createDevice('smartphone', 160, 320, 'Smartphone');
      smartphone.interfaces[0].ipAddress = '192.168.0.30';
      smartphone.interfaces[0].subnetMask = '255.255.255.0';
      smartphone.interfaces[0].isUp = true;
      smartphone.defaultGateway = '192.168.0.1';

      return {
        devices: [internet, firewall, sw, wirelessRouter, pc, laptop, server, smartphone],
        connections: [
          { id: 'c1', deviceAId: internet.id, deviceBId: firewall.id, interfaceAId: internet.interfaces[0].id, interfaceBId: firewall.interfaces[1].id },
          { id: 'c2', deviceAId: firewall.id, deviceBId: sw.id, interfaceAId: firewall.interfaces[0].id, interfaceBId: sw.interfaces[0].id },
          { id: 'c3', deviceAId: sw.id, deviceBId: pc.id, interfaceAId: sw.interfaces[1].id, interfaceBId: pc.interfaces[0].id },
          { id: 'c4', deviceAId: sw.id, deviceBId: laptop.id, interfaceAId: sw.interfaces[2].id, interfaceBId: laptop.interfaces[0].id },
          { id: 'c5', deviceAId: sw.id, deviceBId: server.id, interfaceAId: sw.interfaces[3].id, interfaceBId: server.interfaces[0].id },
          { id: 'c6', deviceAId: sw.id, deviceBId: wirelessRouter.id, interfaceAId: sw.interfaces[4].id, interfaceBId: wirelessRouter.interfaces[0].id },
          { id: 'c7', deviceAId: wirelessRouter.id, deviceBId: smartphone.id, interfaceAId: wirelessRouter.interfaces[1].id, interfaceBId: smartphone.interfaces[0].id },
        ],
      };
    })(),
  },
  vlanOffice: {
    name: 'VLAN Office Network',
    description: 'Two VLANs on switch with inter-VLAN routing on a router',
    state: (() => {
      const router = createDevice('router', 400, 120, 'Router');
      router.interfaces[0].name = 'VLAN10'; router.interfaces[0].ipAddress = '192.168.10.1'; router.interfaces[0].subnetMask = '255.255.255.0'; router.interfaces[0].isUp = true;
      router.interfaces[1].name = 'VLAN20'; router.interfaces[1].ipAddress = '192.168.20.1'; router.interfaces[1].subnetMask = '255.255.255.0'; router.interfaces[1].isUp = true;

      const sw = createDevice('switch', 400, 260, 'Switch');
      const pc1 = createDevice('pc', 300, 340, 'PC-VLAN10');
      pc1.interfaces[0].ipAddress = '192.168.10.10'; pc1.interfaces[0].subnetMask = '255.255.255.0'; pc1.interfaces[0].isUp = true; pc1.defaultGateway = '192.168.10.1';
      const pc2 = createDevice('pc', 500, 340, 'PC-VLAN20');
      pc2.interfaces[0].ipAddress = '192.168.20.10'; pc2.interfaces[0].subnetMask = '255.255.255.0'; pc2.interfaces[0].isUp = true; pc2.defaultGateway = '192.168.20.1';

      return {
        devices: [router, sw, pc1, pc2],
        connections: [
          { id: 'c1', deviceAId: router.id, deviceBId: sw.id, interfaceAId: router.interfaces[0].id, interfaceBId: sw.interfaces[0].id },
          { id: 'c2', deviceAId: router.id, deviceBId: sw.id, interfaceAId: router.interfaces[1].id, interfaceBId: sw.interfaces[1].id },
          { id: 'c3', deviceAId: pc1.id, deviceBId: sw.id, interfaceAId: pc1.interfaces[0].id, interfaceBId: sw.interfaces[2].id },
          { id: 'c4', deviceAId: pc2.id, deviceBId: sw.id, interfaceAId: pc2.interfaces[0].id, interfaceBId: sw.interfaces[3].id },
        ],
      };
    })(),
  },
  redundantDualRouter: {
    name: 'Redundant Dual-Router Network',
    description: 'Primary and backup routers on same LAN with one host',
    state: (() => {
      const router1 = createDevice('router', 320, 120, 'Router1');
      router1.interfaces[0].ipAddress = '192.168.1.1'; router1.interfaces[0].subnetMask = '255.255.255.0'; router1.interfaces[0].isUp = true;
      const router2 = createDevice('router', 480, 120, 'Router2');
      router2.interfaces[0].ipAddress = '192.168.1.2'; router2.interfaces[0].subnetMask = '255.255.255.0'; router2.interfaces[0].isUp = true;
      const sw = createDevice('switch', 400, 240, 'Switch');
      const pc = createDevice('pc', 400, 340, 'PC');
      pc.interfaces[0].ipAddress = '192.168.1.10'; pc.interfaces[0].subnetMask = '255.255.255.0'; pc.interfaces[0].isUp = true; pc.defaultGateway = '192.168.1.1';
      return {
        devices: [router1, router2, sw, pc],
        connections: [
          { id: 'c1', deviceAId: router1.id, deviceBId: sw.id, interfaceAId: router1.interfaces[0].id, interfaceBId: sw.interfaces[0].id },
          { id: 'c2', deviceAId: router2.id, deviceBId: sw.id, interfaceAId: router2.interfaces[0].id, interfaceBId: sw.interfaces[1].id },
          { id: 'c3', deviceAId: pc.id, deviceBId: sw.id, interfaceAId: pc.interfaces[0].id, interfaceBId: sw.interfaces[2].id },
        ],
      };
    })(),
  },
  guestWifiIsolation: {
    name: 'Guest WiFi Isolation Network',
    description: 'Wireless router guest SSID isolated from internal LAN',
    state: (() => {
      const wirelessRouter = createDevice('wireless-router', 400, 110, 'WiFiRouter');
      wirelessRouter.interfaces[0].ipAddress = '192.168.0.1'; wirelessRouter.interfaces[0].subnetMask = '255.255.255.0'; wirelessRouter.interfaces[0].isUp = true;
      wirelessRouter.interfaces[1].ipAddress = '192.168.50.1'; wirelessRouter.interfaces[1].subnetMask = '255.255.255.0'; wirelessRouter.interfaces[1].isUp = true;
      const sw = createDevice('switch', 400, 240, 'Switch');
      const internalPc = createDevice('pc', 320, 340, 'InternalPC');
      internalPc.interfaces[0].ipAddress = '192.168.0.10'; internalPc.interfaces[0].subnetMask = '255.255.255.0'; internalPc.interfaces[0].isUp = true; internalPc.defaultGateway = '192.168.0.1';
      const server = createDevice('server', 480, 340, 'Server');
      server.interfaces[0].ipAddress = '192.168.0.100'; server.interfaces[0].subnetMask = '255.255.255.0'; server.interfaces[0].isUp = true; server.defaultGateway = '192.168.0.1';
      const guestPhone = createDevice('smartphone', 520, 210, 'GuestPhone');
      guestPhone.interfaces[0].ipAddress = '192.168.50.10'; guestPhone.interfaces[0].subnetMask = '255.255.255.0'; guestPhone.interfaces[0].isUp = true; guestPhone.defaultGateway = '192.168.50.1';
      return {
        devices: [wirelessRouter, sw, internalPc, server, guestPhone],
        connections: [
          { id: 'c1', deviceAId: wirelessRouter.id, deviceBId: sw.id, interfaceAId: wirelessRouter.interfaces[0].id, interfaceBId: sw.interfaces[0].id },
          { id: 'c2', deviceAId: internalPc.id, deviceBId: sw.id, interfaceAId: internalPc.interfaces[0].id, interfaceBId: sw.interfaces[1].id },
          { id: 'c3', deviceAId: server.id, deviceBId: sw.id, interfaceAId: server.interfaces[0].id, interfaceBId: sw.interfaces[2].id },
          { id: 'c4', deviceAId: wirelessRouter.id, deviceBId: guestPhone.id, interfaceAId: wirelessRouter.interfaces[1].id, interfaceBId: guestPhone.interfaces[0].id },
        ],
      };
    })(),
  },
  serverFarm: {
    name: 'Server Farm with Firewall',
    description: 'Clients access multiple servers through firewall-controlled perimeter',
    state: (() => {
      const firewall = createDevice('firewall', 400, 90, 'Firewall');
      firewall.interfaces[0].ipAddress = '192.168.1.1'; firewall.interfaces[0].subnetMask = '255.255.255.0'; firewall.interfaces[0].isUp = true;
      firewall.interfaces[1].ipAddress = '10.0.0.1'; firewall.interfaces[1].subnetMask = '255.255.255.0'; firewall.interfaces[1].isUp = true;
      firewall.acl = 'permit any';
      const sw = createDevice('switch', 400, 220, 'Switch');
      const clientPc = createDevice('pc', 300, 310, 'ClientPC');
      clientPc.interfaces[0].ipAddress = '192.168.1.10'; clientPc.interfaces[0].subnetMask = '255.255.255.0'; clientPc.interfaces[0].isUp = true; clientPc.defaultGateway = '192.168.1.1';
      const server1 = createDevice('server', 320, 410, 'Server1');
      server1.interfaces[0].ipAddress = '10.0.0.10'; server1.interfaces[0].subnetMask = '255.255.255.0'; server1.interfaces[0].isUp = true; server1.defaultGateway = '10.0.0.1';
      const server2 = createDevice('server', 480, 410, 'Server2');
      server2.interfaces[0].ipAddress = '10.0.0.11'; server2.interfaces[0].subnetMask = '255.255.255.0'; server2.interfaces[0].isUp = true; server2.defaultGateway = '10.0.0.1';
      return {
        devices: [firewall, sw, clientPc, server1, server2],
        connections: [
          { id: 'c1', deviceAId: firewall.id, deviceBId: sw.id, interfaceAId: firewall.interfaces[0].id, interfaceBId: sw.interfaces[0].id },
          { id: 'c2', deviceAId: firewall.id, deviceBId: sw.id, interfaceAId: firewall.interfaces[1].id, interfaceBId: sw.interfaces[1].id },
          { id: 'c3', deviceAId: clientPc.id, deviceBId: sw.id, interfaceAId: clientPc.interfaces[0].id, interfaceBId: sw.interfaces[2].id },
          { id: 'c4', deviceAId: server1.id, deviceBId: sw.id, interfaceAId: server1.interfaces[0].id, interfaceBId: sw.interfaces[3].id },
          { id: 'c5', deviceAId: server2.id, deviceBId: sw.id, interfaceAId: server2.interfaces[0].id, interfaceBId: sw.interfaces[4].id },
        ],
      };
    })(),
  },
};
