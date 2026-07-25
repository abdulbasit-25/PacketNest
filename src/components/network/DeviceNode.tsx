import React, { useCallback, useRef, useState } from 'react';
import { NetworkDevice } from '@/types/network';
import { useNetwork } from '@/context/NetworkContext';
import { DeviceIcon } from './DeviceIcon';
import { Cable, Trash2 } from 'lucide-react';

interface DeviceNodeProps {
  device: NetworkDevice;
}

export function DeviceNode({ device }: DeviceNodeProps) {
  const { selectedDeviceId, selectDevice, moveDevice, removeDevice, startConnecting, completeConnection, connectingFrom } = useNetwork();
  const isSelected = selectedDeviceId === device.id;
  const isConnecting = connectingFrom === device.id;
  const isTarget = connectingFrom && connectingFrom !== device.id;
  const dragRef = useRef<{ startX: number; startY: number; devX: number; devY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.altKey) return; // alt+drag is for panning
    e.stopPropagation();
    if (isTarget) {
      completeConnection(device.id);
      return;
    }
    selectDevice(device.id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, devX: device.x, devY: device.y };

    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setIsDragging(true);
      // Get zoom from parent transform
      const canvas = document.querySelector('[class*="transform"]') as HTMLElement;
      const zoom = canvas ? parseFloat(canvas.style.transform.match(/scale\(([\d.]+)\)/)?.[1] || '1') : 1;
      moveDevice(device.id, dragRef.current.devX + dx / zoom, dragRef.current.devY + dy / zoom);
    };

    const handleUp = () => {
      dragRef.current = null;
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [device, isTarget, completeConnection, selectDevice, moveDevice]);

  const activeIf = device.interfaces.find(i => i.ipAddress && i.isUp);

  return (
    <div
      className={`absolute group transition-shadow duration-150`}
      style={{ left: device.x, top: device.y, width: 80 }}
      onMouseDown={handleMouseDown}
    >
      <div className={`
        relative flex flex-col items-center p-2 rounded-lg border-2 transition-all duration-150 cursor-pointer
        bg-device-bg
        ${isSelected ? 'border-device-selected shadow-[0_0_12px_hsl(var(--device-selected)/0.4)]' : 'border-device-border hover:border-device-selected/50'}
        ${isConnecting ? 'border-primary animate-pulse' : ''}
        ${isTarget ? 'border-accent/70 hover:border-accent shadow-[0_0_8px_hsl(var(--accent)/0.3)]' : ''}
      `}>
        <DeviceIcon type={device.type} size={30} />
        <span className="text-[10px] font-medium text-foreground mt-1 truncate w-full text-center">{device.name}</span>
        {activeIf && (
          <span className="text-[8px] text-muted-foreground font-mono truncate w-full text-center">{activeIf.ipAddress}</span>
        )}

        {/* Actions on hover */}
        {isSelected && !isDragging && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); startConnecting(device.id); }}
              className="p-1 rounded bg-primary/20 hover:bg-primary/40 text-primary transition-colors"
              title="Connect"
            >
              <Cable size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); removeDevice(device.id); }}
              className="p-1 rounded bg-destructive/20 hover:bg-destructive/40 text-destructive transition-colors"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
