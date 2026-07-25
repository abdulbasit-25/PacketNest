import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react';
import { NetworkDevice, Connection, HistoryEntry, PacketAnimation } from '@/types/network';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'network-sim-state';
const MAX_HISTORY = 50;

interface NetworkContextType {
  devices: NetworkDevice[];
  connections: Connection[];
  selectedDeviceId: string | null;
  selectedConnectionId: string | null;
  connectingFrom: string | null;
  packetAnimations: PacketAnimation[];
  addDevice: (device: NetworkDevice) => void;
  updateDevice: (device: NetworkDevice) => void;
  removeDevice: (id: string) => void;
  moveDevice: (id: string, x: number, y: number) => void;
  selectDevice: (id: string | null) => void;
  selectConnection: (id: string | null) => void;
  startConnecting: (deviceId: string) => void;
  completeConnection: (deviceId: string) => void;
  cancelConnecting: () => void;
  removeConnection: (id: string) => void;
  addPacketAnimation: (anim: PacketAnimation) => void;
  removePacketAnimation: (id: string) => void;
  clearPacketAnimations: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetState: () => void;
  loadState: (state: { devices: NetworkDevice[]; connections: Connection[] }) => void;
  exportState: () => string;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider');
  return ctx;
}

function loadFromStorage(): { devices: NetworkDevice[]; connections: Connection[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { devices: [], connections: [] };
}

function saveToStorage(devices: NetworkDevice[], connections: Connection[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ devices, connections }));
}

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const initial = loadFromStorage();
  const [devices, setDevices] = useState<NetworkDevice[]>(initial.devices);
  const [connections, setConnections] = useState<Connection[]>(initial.connections);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [packetAnimations, setPacketAnimations] = useState<PacketAnimation[]>([]);

  const historyRef = useRef<HistoryEntry[]>([{ devices: initial.devices, connections: initial.connections }]);
  const historyIndexRef = useRef(0);
  const skipHistoryRef = useRef(false);

  useEffect(() => {
    saveToStorage(devices, connections);
  }, [devices, connections]);

  const pushHistory = useCallback((d: NetworkDevice[], c: Connection[]) => {
    if (skipHistoryRef.current) { skipHistoryRef.current = false; return; }
    const idx = historyIndexRef.current;
    historyRef.current = historyRef.current.slice(0, idx + 1);
    historyRef.current.push({ devices: JSON.parse(JSON.stringify(d)), connections: JSON.parse(JSON.stringify(c)) });
    if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
  }, []);

  const addDevice = useCallback((device: NetworkDevice) => {
    setDevices(prev => {
      const next = [...prev, device];
      pushHistory(next, connections);
      return next;
    });
  }, [connections, pushHistory]);

  const updateDevice = useCallback((device: NetworkDevice) => {
    setDevices(prev => {
      const next = prev.map(d => d.id === device.id ? device : d);
      pushHistory(next, connections);
      return next;
    });
  }, [connections, pushHistory]);

  const removeDevice = useCallback((id: string) => {
    setDevices(prev => {
      const next = prev.filter(d => d.id !== id);
      const nextConns = connections.filter(c => c.deviceAId !== id && c.deviceBId !== id);
      setConnections(nextConns);
      pushHistory(next, nextConns);
      return next;
    });
    if (selectedDeviceId === id) setSelectedDeviceId(null);
  }, [connections, selectedDeviceId, pushHistory]);

  const moveDevice = useCallback((id: string, x: number, y: number) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, x, y } : d));
  }, []);

  const startConnecting = useCallback((deviceId: string) => {
    setConnectingFrom(deviceId);
  }, []);

  const completeConnection = useCallback((deviceId: string) => {
    if (!connectingFrom || connectingFrom === deviceId) { setConnectingFrom(null); return; }
    const existing = connections.find(c =>
      (c.deviceAId === connectingFrom && c.deviceBId === deviceId) ||
      (c.deviceAId === deviceId && c.deviceBId === connectingFrom)
    );
    if (existing) { setConnectingFrom(null); return; }

    const devA = devices.find(d => d.id === connectingFrom);
    const devB = devices.find(d => d.id === deviceId);
    if (!devA || !devB) { setConnectingFrom(null); return; }

    const ifA = devA.interfaces.find(i => !i.connectedTo);
    const ifB = devB.interfaces.find(i => !i.connectedTo);
    if (!ifA || !ifB) { setConnectingFrom(null); return; }

    const connId = uuidv4();
    const newConn: Connection = {
      id: connId,
      deviceAId: connectingFrom,
      deviceBId: deviceId,
      interfaceAId: ifA.id,
      interfaceBId: ifB.id,
    };

    ifA.connectedTo = connId;
    ifB.connectedTo = connId;

    setConnections(prev => {
      const next = [...prev, newConn];
      const nextDevices = devices.map(d => {
        if (d.id === connectingFrom) return { ...d, interfaces: d.interfaces.map(i => i.id === ifA.id ? { ...i, connectedTo: connId } : i) };
        if (d.id === deviceId) return { ...d, interfaces: d.interfaces.map(i => i.id === ifB.id ? { ...i, connectedTo: connId } : i) };
        return d;
      });
      setDevices(nextDevices);
      pushHistory(nextDevices, next);
      return next;
    });
    setConnectingFrom(null);
  }, [connectingFrom, connections, devices, pushHistory]);

  const removeConnection = useCallback((id: string) => {
    setConnections(prev => {
      const next = prev.filter(c => c.id !== id);
      const conn = prev.find(c => c.id === id);
      if (conn) {
        setDevices(devs => {
          const nextDevs = devs.map(d => ({
            ...d,
            interfaces: d.interfaces.map(i => i.connectedTo === id ? { ...i, connectedTo: undefined } : i)
          }));
          pushHistory(nextDevs, next);
          return nextDevs;
        });
      }
      return next;
    });
    if (selectedConnectionId === id) setSelectedConnectionId(null);
  }, [selectedConnectionId, pushHistory]);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const entry = historyRef.current[historyIndexRef.current];
    skipHistoryRef.current = true;
    setDevices(JSON.parse(JSON.stringify(entry.devices)));
    setConnections(JSON.parse(JSON.stringify(entry.connections)));
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const entry = historyRef.current[historyIndexRef.current];
    skipHistoryRef.current = true;
    setDevices(JSON.parse(JSON.stringify(entry.devices)));
    setConnections(JSON.parse(JSON.stringify(entry.connections)));
  }, []);

  const resetState = useCallback(() => {
    setDevices([]);
    setConnections([]);
    setSelectedDeviceId(null);
    setSelectedConnectionId(null);
    historyRef.current = [{ devices: [], connections: [] }];
    historyIndexRef.current = 0;
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const loadState = useCallback((state: { devices: NetworkDevice[]; connections: Connection[] }) => {
    setDevices(state.devices);
    setConnections(state.connections);
    historyRef.current = [{ devices: JSON.parse(JSON.stringify(state.devices)), connections: JSON.parse(JSON.stringify(state.connections)) }];
    historyIndexRef.current = 0;
    setSelectedDeviceId(null);
    setSelectedConnectionId(null);
  }, []);

  const exportState = useCallback(() => {
    return JSON.stringify({ devices, connections }, null, 2);
  }, [devices, connections]);

  const addPacketAnimation = useCallback((anim: PacketAnimation) => {
    setPacketAnimations(prev => [...prev, anim]);
  }, []);
  const removePacketAnimation = useCallback((id: string) => {
    setPacketAnimations(prev => prev.filter(a => a.id !== id));
  }, []);
  const clearPacketAnimations = useCallback(() => setPacketAnimations([]), []);

  return (
    <NetworkContext.Provider value={{
      devices, connections, selectedDeviceId, selectedConnectionId, connectingFrom, packetAnimations,
      addDevice, updateDevice, removeDevice, moveDevice,
      selectDevice: setSelectedDeviceId, selectConnection: setSelectedConnectionId,
      startConnecting, completeConnection, cancelConnecting: () => setConnectingFrom(null),
      removeConnection, addPacketAnimation, removePacketAnimation, clearPacketAnimations,
      undo, redo, canUndo: historyIndexRef.current > 0, canRedo: historyIndexRef.current < historyRef.current.length - 1,
      resetState, loadState, exportState,
    }}>
      {children}
    </NetworkContext.Provider>
  );
}
