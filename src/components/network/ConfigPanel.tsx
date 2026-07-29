import React, { useState } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { NetworkDevice, NetworkInterface } from '@/types/network';
import { isValidIp, isValidMask } from '@/utils/networkUtils';
import { X, Trash2, Cable } from 'lucide-react';
import { DeviceIcon } from './DeviceIcon';

export function ConfigPanel() {
  const { devices, connections, selectedDeviceId, selectedConnectionId, selectDevice, selectConnection, updateDevice, removeConnection, removeDevice } = useNetwork();

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);
  const selectedConn = connections.find(c => c.id === selectedConnectionId);

  if (!selectedDevice && !selectedConn) return null;

  if (selectedConn) {
    const devA = devices.find(d => d.id === selectedConn.deviceAId);
    const devB = devices.find(d => d.id === selectedConn.deviceBId);
    return (
      <div className="w-72 bg-card border-l border-border flex flex-col h-full">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Connection</h3>
          <button onClick={() => selectConnection(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>
        <div className="p-3 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            {devA && <><DeviceIcon type={devA.type} size={16} /><span className="text-foreground">{devA.name}</span></>}
            <Cable size={14} className="text-muted-foreground" />
            {devB && <><DeviceIcon type={devB.type} size={16} /><span className="text-foreground">{devB.name}</span></>}
          </div>
          <button
            onClick={() => removeConnection(selectedConn.id)}
            className="w-full flex items-center justify-center gap-1 p-2 rounded bg-destructive/20 hover:bg-destructive/30 text-destructive text-xs transition-colors"
          >
            <Trash2 size={14} /> Delete Connection
          </button>
        </div>
      </div>
    );
  }

  if (!selectedDevice) return null;

  return <DeviceConfigPanel device={selectedDevice} />;
}

function DeviceConfigPanel({ device }: { device: NetworkDevice }) {
  const { updateDevice, removeDevice, selectDevice } = useNetwork();
  const [editDevice, setEditDevice] = useState<NetworkDevice>(JSON.parse(JSON.stringify(device)));

  // Sync when device changes
  React.useEffect(() => {
    setEditDevice(JSON.parse(JSON.stringify(device)));
  }, [device.id, device]);

  const handleSave = () => {
    updateDevice(editDevice);
  };

  const updateInterface = (ifId: string, updates: Partial<NetworkInterface>) => {
    setEditDevice(prev => ({
      ...prev,
      interfaces: prev.interfaces.map(i => i.id === ifId ? { ...i, ...updates } : i),
    }));
  };

  const hasChanges = JSON.stringify(editDevice) !== JSON.stringify(device);

  return (
    <div className="w-72 bg-card border-l border-border flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DeviceIcon type={device.type} size={18} />
          <h3 className="text-sm font-semibold text-foreground">Configure</h3>
        </div>
        <button onClick={() => selectDevice(null)} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-4">
        {/* Device name */}
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide">Name</label>
          <input
            type="text"
            value={editDevice.name}
            onChange={(e) => setEditDevice(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 w-full bg-secondary border border-border rounded px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Default gateway */}
        {(device.type === 'pc' || device.type === 'server' || device.type === 'laptop' || device.type === 'smartphone' || device.type === 'wireless-router') && (
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide">Default Gateway</label>
            <input
              type="text"
              value={editDevice.defaultGateway}
              onChange={(e) => setEditDevice(prev => ({ ...prev, defaultGateway: e.target.value }))}
              placeholder="e.g. 192.168.1.1"
              className={`mt-1 w-full bg-secondary border rounded px-2 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${editDevice.defaultGateway && !isValidIp(editDevice.defaultGateway) ? 'border-destructive' : 'border-border'}`}
            />
          </div>
        )}

        {/* Firewall ACL / Security Rules */}
        {device.type === 'firewall' && (
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide">Security Rules (ACL)</label>
            <textarea
              value={editDevice.acl || ''}
              onChange={(e) => setEditDevice(prev => ({ ...prev, acl: e.target.value }))}
              placeholder="e.g. permit any\ndeny 10.0.0.0/8"
              className="mt-1 w-full bg-secondary border border-border rounded px-2 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              rows={3}
            />
            <p className="text-[10px] text-muted-foreground mt-1">Firewall can override routing for blocked addresses.</p>
          </div>
        )}

        {/* Interfaces */}
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide">Interfaces</label>
          <div className="mt-1 space-y-2">
            {editDevice.interfaces.map(iface => (
              <div key={iface.id} className="p-2 rounded bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-foreground">{iface.name}</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <span className={`text-[10px] ${iface.isUp ? 'text-success' : 'text-destructive'}`}>{iface.isUp ? 'UP' : 'DOWN'}</span>
                    <div
                      className={`w-7 h-4 rounded-full relative cursor-pointer transition-colors ${iface.isUp ? 'bg-success/40' : 'bg-muted'}`}
                      onClick={() => updateInterface(iface.id, { isUp: !iface.isUp })}
                    >
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${iface.isUp ? 'left-3.5 bg-success' : 'left-0.5 bg-muted-foreground'}`} />
                    </div>
                  </label>
                </div>
                <input
                  type="text"
                  value={iface.ipAddress}
                  onChange={(e) => updateInterface(iface.id, { ipAddress: e.target.value })}
                  placeholder="IP Address"
                  className={`w-full bg-secondary border rounded px-1.5 py-1 text-[11px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${iface.ipAddress && !isValidIp(iface.ipAddress) ? 'border-destructive' : 'border-border'}`}
                />
                <input
                  type="text"
                  value={iface.subnetMask}
                  onChange={(e) => updateInterface(iface.id, { subnetMask: e.target.value })}
                  placeholder="Subnet Mask"
                  className={`w-full bg-secondary border rounded px-1.5 py-1 text-[11px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${iface.subnetMask && !isValidMask(iface.subnetMask) ? 'border-destructive' : 'border-border'}`}
                />
                {iface.connectedTo && (
                  <div className="text-[10px] text-primary flex items-center gap-1">
                    <Cable size={10} /> Connected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ARP / Routing summary */}
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide">ARP Table (simulated)</label>
          <div className="mt-1 p-2 rounded bg-muted/50 border border-border text-[11px] font-mono text-foreground">
            {editDevice.arpTable.length === 0 ? 'No entries' : editDevice.arpTable.map((entry, i) => (
              <div key={i}>{entry.ip} → {entry.mac} ({entry.interfaceId})</div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide">Routing Table</label>
          <div className="mt-1 p-2 rounded bg-muted/50 border border-border text-[11px] font-mono text-foreground">
            {editDevice.routingTable.length === 0 ? 'No routes' : editDevice.routingTable.map((route, i) => (
              <div key={i}>{route.destination}/{route.mask} via {route.nextHop} ({route.interfaceId})</div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-border space-y-1.5">
        {hasChanges && (
          <button onClick={handleSave} className="w-full p-2 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            Apply Changes
          </button>
        )}
        <button
          onClick={() => { removeDevice(device.id); selectDevice(null); }}
          className="w-full flex items-center justify-center gap-1 p-2 rounded bg-destructive/20 hover:bg-destructive/30 text-destructive text-xs transition-colors"
        >
          <Trash2 size={14} /> Delete Device
        </button>
      </div>
    </div>
  );
}
