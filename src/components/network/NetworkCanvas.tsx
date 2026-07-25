import React, { useCallback, useRef, useState } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { createDevice } from '@/utils/networkUtils';
import { DeviceType } from '@/types/network';
import { DeviceNode } from './DeviceNode';
import { ConnectionLine } from './ConnectionLine';
import { PacketDot } from './PacketDot';

export function NetworkCanvas() {
  const { devices, connections, addDevice, moveDevice, selectDevice, selectConnection, selectedDeviceId, selectedConnectionId, connectingFrom, packetAnimations } = useNetwork();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.min(3, Math.max(0.2, z * delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
      e.preventDefault();
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: panStart.current.panX + (e.clientX - panStart.current.x),
        y: panStart.current.panY + (e.clientY - panStart.current.y),
      });
    }
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('device-type') as DeviceType;
    if (!type) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    addDevice(createDevice(type, x, y));
  }, [addDevice, pan, zoom]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-grid')) {
      selectDevice(null);
      selectConnection(null);
    }
  }, [selectDevice, selectConnection]);

  const gridSize = 20 * zoom;
  const gridOffsetX = pan.x % gridSize;
  const gridOffsetY = pan.y % gridSize;

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative overflow-hidden bg-canvas-bg select-none"
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleCanvasClick}
    >
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none canvas-grid" style={{ zIndex: 0 }}>
        <defs>
          <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse" x={gridOffsetX} y={gridOffsetY}>
            <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="hsl(var(--canvas-grid))" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Connections SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {connections.map(conn => {
            const devA = devices.find(d => d.id === conn.deviceAId);
            const devB = devices.find(d => d.id === conn.deviceBId);
            if (!devA || !devB) return null;
            return (
              <ConnectionLine
                key={conn.id}
                connection={conn}
                x1={devA.x + 40}
                y1={devA.y + 30}
                x2={devB.x + 40}
                y2={devB.y + 30}
                isSelected={selectedConnectionId === conn.id}
                onClick={() => selectConnection(conn.id)}
              />
            );
          })}
        </g>
      </svg>

      {/* Packet animations SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3 }}>
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {packetAnimations.map(anim => {
            const devA = devices.find(d => d.id === anim.fromDeviceId);
            const devB = devices.find(d => d.id === anim.toDeviceId);
            if (!devA || !devB) return null;
            return (
              <PacketDot
                key={anim.id}
                x1={devA.x + 40}
                y1={devA.y + 30}
                x2={devB.x + 40}
                y2={devB.y + 30}
                success={anim.success}
              />
            );
          })}
        </g>
      </svg>

      {/* Devices */}
      <div className="absolute inset-0" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', zIndex: 2 }}>
        {devices.map(device => (
          <DeviceNode key={device.id} device={device} />
        ))}
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 bg-card/80 backdrop-blur-sm border border-border rounded px-2 py-1 text-xs text-muted-foreground font-mono z-10">
        {Math.round(zoom * 100)}% · Alt+Drag to pan
      </div>
    </div>
  );
}
