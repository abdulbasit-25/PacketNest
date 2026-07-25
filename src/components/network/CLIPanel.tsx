import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { simulatePing } from '@/utils/simulation';
import { getConnectionPath } from '@/utils/simulation';
import { isValidIp } from '@/utils/networkUtils';
import { Terminal, X, Minimize2, Maximize2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CLILine {
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

export function CLIPanel() {
  const { devices, connections, selectedDeviceId, updateDevice, addPacketAnimation, removePacketAnimation } = useNetwork();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lines, setLines] = useState<CLILine[]>([
    { type: 'output', text: 'PacketNest CLI v1.0 — Type "help" for commands.' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const addLine = useCallback((type: CLILine['type'], text: string) => {
    setLines(prev => [...prev, { type, text }]);
  }, []);

  const getDevice = useCallback(() => {
    if (!selectedDeviceId) return null;
    return devices.find(d => d.id === selectedDeviceId) || null;
  }, [selectedDeviceId, devices]);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    addLine('input', `> ${trimmed}`);
    setHistory(prev => [...prev, trimmed]);
    setHistIdx(-1);

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const device = getDevice();

    switch (command) {
      case 'help':
        addLine('output', 'Available commands:');
        addLine('output', '  help                   — Show this help');
        addLine('output', '  show devices           — List all devices');
        addLine('output', '  show interfaces        — Show interfaces (select device first)');
        addLine('output', '  ping <ip>              — Ping from selected device');
        addLine('output', '  ip addr <if> <ip> <mask> — Set interface IP');
        addLine('output', '  ip gateway <ip>        — Set default gateway');
        addLine('output', '  interface <name> up|down — Toggle interface');
        addLine('output', '  hostname <name>        — Set device name');
        addLine('output', '  clear                  — Clear terminal');
        break;

      case 'clear':
        setLines([]);
        break;

      case 'show':
        if (parts[1] === 'devices') {
          devices.forEach(d => {
            const ip = d.interfaces.find(i => i.ipAddress && i.isUp)?.ipAddress || 'no IP';
            addLine('output', `  ${d.name} (${d.type}) — ${ip}`);
          });
        } else if (parts[1] === 'interfaces' || parts[1] === 'int') {
          if (!device) { addLine('error', 'Select a device first.'); break; }
          addLine('output', `Interfaces for ${device.name}:`);
          device.interfaces.forEach(i => {
            addLine('output', `  ${i.name} — ${i.isUp ? 'UP' : 'DOWN'} — ${i.ipAddress || 'no IP'}/${i.subnetMask || 'no mask'}${i.connectedTo ? ' [connected]' : ''}`);
          });
        } else {
          addLine('error', 'Usage: show devices | show interfaces');
        }
        break;

      case 'ping': {
        if (!device) { addLine('error', 'Select a device first.'); break; }
        const targetIp = parts[1];
        if (!targetIp || !isValidIp(targetIp)) { addLine('error', 'Usage: ping <valid-ip>'); break; }

        const result = simulatePing(device.id, targetIp, devices, connections);
        result.steps.forEach(s => addLine('output', `  ${s}`));
        addLine(result.success ? 'success' : 'error', result.message);

        // Animate packets
        if (result.success) {
          const destDevice = devices.find(d => d.interfaces.some(i => i.ipAddress === targetIp));
          if (destDevice) {
            const path = getConnectionPath(device.id, destDevice.id, connections);
            for (let i = 0; i < path.length - 1; i++) {
              const animId = uuidv4();
              setTimeout(() => {
                addPacketAnimation({ id: animId, connectionId: '', fromDeviceId: path[i], toDeviceId: path[i + 1], progress: 0, success: true });
                setTimeout(() => removePacketAnimation(animId), 1300);
              }, i * 400);
            }
          }
        }
        break;
      }

      case 'ip':
        if (!device) { addLine('error', 'Select a device first.'); break; }
        if (parts[1] === 'addr' && parts[2] && parts[3] && parts[4]) {
          const iface = device.interfaces.find(i => i.name === parts[2]);
          if (!iface) { addLine('error', `Interface ${parts[2]} not found.`); break; }
          if (!isValidIp(parts[3])) { addLine('error', 'Invalid IP address.'); break; }
          const updated = {
            ...device,
            interfaces: device.interfaces.map(i => i.id === iface.id ? { ...i, ipAddress: parts[3], subnetMask: parts[4], isUp: true } : i)
          };
          updateDevice(updated);
          addLine('success', `Set ${parts[2]} to ${parts[3]} ${parts[4]}`);
        } else if (parts[1] === 'gateway' && parts[2]) {
          if (!isValidIp(parts[2])) { addLine('error', 'Invalid gateway IP.'); break; }
          updateDevice({ ...device, defaultGateway: parts[2] });
          addLine('success', `Default gateway set to ${parts[2]}`);
        } else {
          addLine('error', 'Usage: ip addr <interface> <ip> <mask> | ip gateway <ip>');
        }
        break;

      case 'interface':
        if (!device) { addLine('error', 'Select a device first.'); break; }
        if (parts[1] && (parts[2] === 'up' || parts[2] === 'down')) {
          const iface = device.interfaces.find(i => i.name === parts[1]);
          if (!iface) { addLine('error', `Interface ${parts[1]} not found.`); break; }
          const updated = {
            ...device,
            interfaces: device.interfaces.map(i => i.id === iface.id ? { ...i, isUp: parts[2] === 'up' } : i)
          };
          updateDevice(updated);
          addLine('success', `${parts[1]} is now ${parts[2].toUpperCase()}`);
        } else {
          addLine('error', 'Usage: interface <name> up|down');
        }
        break;

      case 'hostname':
        if (!device) { addLine('error', 'Select a device first.'); break; }
        if (parts[1]) {
          updateDevice({ ...device, name: parts[1] });
          addLine('success', `Hostname set to ${parts[1]}`);
        } else {
          addLine('error', 'Usage: hostname <name>');
        }
        break;

      default:
        addLine('error', `Unknown command: ${command}. Type "help" for available commands.`);
    }
  }, [addLine, getDevice, devices, connections, updateDevice, addPacketAnimation, removePacketAnimation]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx >= 0) {
        const idx = histIdx + 1;
        if (idx >= history.length) { setHistIdx(-1); setInput(''); }
        else { setHistIdx(idx); setInput(history[idx]); }
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/50 text-foreground text-sm transition-colors shadow-lg"
      >
        <Terminal size={16} className="text-primary" /> CLI
      </button>
    );
  }

  return (
    <div className={`fixed bottom-0 right-0 z-50 bg-card border-l border-t border-border shadow-2xl transition-all ${isMinimized ? 'w-64 h-10' : 'w-[480px] h-80'}`}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-secondary/50 cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-primary" />
          <span className="text-xs font-medium text-foreground">CLI Terminal</span>
          {selectedDeviceId && (
            <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded">{devices.find(d => d.id === selectedDeviceId)?.name}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-muted-foreground hover:text-foreground">
            {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={12} /></button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-0.5 scrollbar-thin" style={{ height: 'calc(100% - 68px)' }} onClick={() => inputRef.current?.focus()}>
            {lines.map((line, i) => (
              <div key={i} className={`${
                line.type === 'input' ? 'text-primary' :
                line.type === 'error' ? 'text-destructive' :
                line.type === 'success' ? 'text-success' :
                'text-foreground'
              }`}>
                {line.text}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 px-3 py-2 border-t border-border">
            <span className="text-primary text-xs font-mono">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-xs font-mono text-foreground focus:outline-none"
              placeholder="Type a command..."
              autoFocus
            />
          </div>
        </>
      )}
    </div>
  );
}
