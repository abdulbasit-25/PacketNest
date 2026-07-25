import React from 'react';
import { DeviceType } from '@/types/network';
import { DeviceIcon } from './DeviceIcon';
import { useNetwork } from '@/context/NetworkContext';
import { createDevice } from '@/utils/networkUtils';
import { exampleTopologies } from '@/utils/exampleTopologies';
import { Undo2, Redo2, Trash2, Bot, Download, Upload, RotateCcw, Cable, FolderOpen, Sparkle } from 'lucide-react';
import { useRef, useState } from 'react';

const deviceTypes: { type: DeviceType; label: string }[] = [
  { type: 'router', label: 'Router' },
  { type: 'switch', label: 'Switch' },
  { type: 'pc', label: 'PC' },
  { type: 'server', label: 'Server' },
];

export function DevicePalette() {
  const { addDevice, undo, redo, canUndo, canRedo, resetState, loadState, exportState, connectingFrom, cancelConnecting } = useNetwork();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent, type: DeviceType) => {
    e.dataTransfer.setData('device-type', type);
  };

  const handleExport = () => {
    const data = exportState();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network-topology.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const state = JSON.parse(ev.target?.result as string);
        if (state.devices && state.connections) loadState(state);
      } catch {}
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="w-56 bg-card border-r border-border flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">Devices</h2>
      </div>

      <div className="p-3 space-y-2 flex-1">
        {deviceTypes.map(({ type, label }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            className="flex items-center gap-3 p-2.5 rounded-md bg-secondary/50 border border-border cursor-grab hover:border-primary/50 hover:bg-secondary transition-colors"
          >
            <DeviceIcon type={type} size={22} />
            <span className="text-sm text-foreground">{label}</span>
          </div>
        ))}

        {connectingFrom && (
          <div className="mt-3 p-2 rounded-md bg-primary/10 border border-primary/30 text-center">
            <p className="text-xs text-primary">Click another device to connect</p>
            <button onClick={cancelConnecting} className="text-xs text-destructive mt-1 hover:underline">Cancel</button>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border space-y-1.5">
        <div className="flex gap-1">
          <button onClick={undo} disabled={!canUndo} className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded text-xs bg-secondary hover:bg-secondary/80 disabled:opacity-30 text-secondary-foreground transition-colors">
            <Undo2 size={14} /> Undo
          </button>
          <button onClick={redo} disabled={!canRedo} className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded text-xs bg-secondary hover:bg-secondary/80 disabled:opacity-30 text-secondary-foreground transition-colors">
            <Redo2 size={14} /> Redo
          </button>
        </div>
        <button onClick={handleExport} className="w-full flex items-center justify-center gap-1 p-1.5 rounded text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors">
          <Download size={14} /> Export
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-1 p-1.5 rounded text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors">
          <Upload size={14} /> Import
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        <button onClick={() => setShowExamples(!showExamples)} className="w-full flex items-center justify-center gap-1 p-1.5 rounded text-xs bg-primary/20 hover:bg-primary/30 text-primary transition-colors">
          <FolderOpen size={14} /> Examples
        </button>
        {showExamples && (
          <div className="space-y-1 mt-1">
            {Object.entries(exampleTopologies).map(([key, topo]) => (
              <button
                key={key}
                onClick={() => { loadState(topo.state); setShowExamples(false); }}
                className="w-full text-left p-2 rounded text-xs bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                <div className="font-medium">{topo.name}</div>
                <div className="text-muted-foreground text-[10px]">{topo.description}</div>
              </button>
            ))}
          </div>
        )}
        <button onClick={resetState} className="w-full flex items-center justify-center gap-1 p-1.5 rounded text-xs bg-destructive/20 hover:bg-destructive/30 text-destructive transition-colors">
          <Trash2 size={14} /> Reset
        </button>
          <a
      href="https://abdulbasit-archer.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "6px 10px",
        fontSize: "12px",
        borderRadius: "8px",
        cursor: "pointer",
        textDecoration: "none",
        color: "#e5e7eb",

        /* background */
        background: hovered
          ? "linear-gradient(135deg, #1e293b, #0f172a)"
          : "linear-gradient(135deg, #0f172a, #1e293b)",

       boxShadow: hovered
  ? "0 4px 12px rgba(0,0,0,0.15)"
  : "none",

transform: hovered
  ? "translateY(-2px)"
  : "translateY(0)",

transition: "all 0.25s ease",
      }}
    >
      <Sparkle
        size={14}
        style={{
          color: hovered ? "#22c55e" : "#6366f1",
          transform: hovered
            ? "rotate(20deg) scale(1.25)"
            : "rotate(0deg) scale(1)",
          filter: hovered ? "drop-shadow(0 0 6px #22c55e)" : "none",
          transition: "all 0.3s ease",
        }}
      />

      <span style={{ opacity: 0.7 }}>Powered by</span>

      <span
        style={{
          fontWeight: "700",
          background:
            "linear-gradient(90deg, #6366f1, #22c55e, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: hovered ? "0.5px" : "0px",
          transition: "all 0.3s ease",
        }}
      >
        Archer
      </span>
    </a>
      </div>
    </div>
  );
}
