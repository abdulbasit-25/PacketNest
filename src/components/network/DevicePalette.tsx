// import React from 'react';
// import { DeviceType } from '@/types/network';
// import { DeviceIcon } from './DeviceIcon';
// import { useNetwork } from '@/context/NetworkContext';
// import { createDevice } from '@/utils/networkUtils';
// import { exampleTopologies } from '@/utils/exampleTopologies';
// import { Undo2, Redo2, Trash2, Bot, Download, Upload, RotateCcw, Cable, FolderOpen, Sparkle } from 'lucide-react';
// import { useRef, useState } from 'react';

// const endpointDeviceTypes: { type: DeviceType; label: string }[] = [
//   { type: 'pc', label: 'PC' },
//   { type: 'laptop', label: 'Laptop' },
//   { type: 'smartphone', label: 'Smartphone' },
//   { type: 'server', label: 'Server' },
// ];

// const infrastructureDeviceTypes: { type: DeviceType; label: string }[] = [
//   { type: 'router', label: 'Router' },
//   { type: 'wireless-router', label: 'Wireless Router' },
//   { type: 'switch', label: 'Switch' },
//   { type: 'firewall', label: 'Firewall' },
// ];

// export function DevicePalette() {
//   const { addDevice, undo, redo, canUndo, canRedo, resetState, loadState, exportState, connectingFrom, cancelConnecting } = useNetwork();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [showExamples, setShowExamples] = useState(false);
//   const [hovered, setHovered] = useState(false);

//   const handleDragStart = (e: React.DragEvent, type: DeviceType) => {
//     e.dataTransfer.setData('device-type', type);
//   };

//   const handleExport = () => {
//     const data = exportState();
//     const blob = new Blob([data], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'network-topology.json';
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       try {
//         const state = JSON.parse(ev.target?.result as string);
//         if (state.devices && state.connections) loadState(state);
//       } catch {}
//     };
//     reader.readAsText(file);
//     e.target.value = '';
//   };

//   return (
//     <div className="w-56 bg-card border-r border-border flex flex-col h-full">
//       <div className="p-3 border-b border-border">
//         <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">Devices</h2>
//       </div>

//       <div className="p-3 space-y-2 flex-1">
//         <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Endpoints</div>
//         {endpointDeviceTypes.map(({ type, label }) => (
//           <div
//             key={type}
//             draggable
//             onDragStart={(e) => handleDragStart(e, type)}
//             className="flex items-center gap-3 p-2.5 rounded-md bg-secondary/50 border border-border cursor-grab hover:border-primary/50 hover:bg-secondary transition-colors"
//           >
//             <DeviceIcon type={type} size={22} />
//             <span className="text-sm text-foreground">{label}</span>
//           </div>
//         ))}
//         <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Infrastructure</div>
//         {infrastructureDeviceTypes.map(({ type, label }) => (
//           <div
//             key={type}
//             draggable
//             onDragStart={(e) => handleDragStart(e, type)}
//             className="flex items-center gap-3 p-2.5 rounded-md bg-secondary/50 border border-border cursor-grab hover:border-primary/50 hover:bg-secondary transition-colors"
//           >
//             <DeviceIcon type={type} size={22} />
//             <span className="text-sm text-foreground">{label}</span>
//           </div>
//         ))}

//         {connectingFrom && (
//           <div className="mt-3 p-2 rounded-md bg-primary/10 border border-primary/30 text-center">
//             <p className="text-xs text-primary">Click another device to connect</p>
//             <button onClick={cancelConnecting} className="text-xs text-destructive mt-1 hover:underline">Cancel</button>
//           </div>
//         )}
//       </div>

//       <div className="p-3 border-t border-border space-y-1.5">
//         <div className="flex gap-1">
//           <button onClick={undo} disabled={!canUndo} className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded text-xs bg-secondary hover:bg-secondary/80 disabled:opacity-30 text-secondary-foreground transition-colors">
//             <Undo2 size={14} /> Undo
//           </button>
//           <button onClick={redo} disabled={!canRedo} className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded text-xs bg-secondary hover:bg-secondary/80 disabled:opacity-30 text-secondary-foreground transition-colors">
//             <Redo2 size={14} /> Redo
//           </button>
//         </div>
//         <button onClick={handleExport} className="w-full flex items-center justify-center gap-1 p-1.5 rounded text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors">
//           <Download size={14} /> Export
//         </button>
//         <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-1 p-1.5 rounded text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors">
//           <Upload size={14} /> Import
//         </button>
//         <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
//         <button onClick={() => setShowExamples(!showExamples)} className="w-full flex items-center justify-center gap-1 p-1.5 rounded text-xs bg-primary/20 hover:bg-primary/30 text-primary transition-colors">
//           <FolderOpen size={14} /> Examples
//         </button>
//         {showExamples && (
//           <div className="space-y-1 mt-1">
//             {Object.entries(exampleTopologies).map(([key, topo]) => (
//               <button
//                 key={key}
//                 onClick={() => { loadState(topo.state); setShowExamples(false); }}
//                 className="w-full text-left p-2 rounded text-xs bg-muted hover:bg-muted/80 text-foreground transition-colors"
//               >
//                 <div className="font-medium">{topo.name}</div>
//                 <div className="text-muted-foreground text-[10px]">{topo.description}</div>
//               </button>
//             ))}
//           </div>
//         )}
//         <button onClick={resetState} className="w-full flex items-center justify-center gap-1 p-1.5 rounded text-xs bg-destructive/20 hover:bg-destructive/30 text-destructive transition-colors">
//           <Trash2 size={14} /> Reset
//         </button>
//           <a
//       href="https://abdulbasit-archer.vercel.app/"
//       target="_blank"
//       rel="noopener noreferrer"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: "6px",
//         padding: "6px 10px",
//         fontSize: "12px",
//         borderRadius: "8px",
//         cursor: "pointer",
//         textDecoration: "none",
//         color: "#e5e7eb",

//         /* background */
//         background: hovered
//           ? "linear-gradient(135deg, #1e293b, #0f172a)"
//           : "linear-gradient(135deg, #0f172a, #1e293b)",

//        boxShadow: hovered
//   ? "0 4px 12px rgba(0,0,0,0.15)"
//   : "none",

// transform: hovered
//   ? "translateY(-2px)"
//   : "translateY(0)",

// transition: "all 0.25s ease",
//       }}
//     >
//       <Sparkle
//         size={14}
//         style={{
//           color: hovered ? "#22c55e" : "#6366f1",
//           transform: hovered
//             ? "rotate(20deg) scale(1.25)"
//             : "rotate(0deg) scale(1)",
//           filter: hovered ? "drop-shadow(0 0 6px #22c55e)" : "none",
//           transition: "all 0.3s ease",
//         }}
//       />

//       <span style={{ opacity: 0.7 }}>Powered by</span>

//       <span
//         style={{
//           fontWeight: "700",
//           background:
//             "linear-gradient(90deg, #6366f1, #22c55e, #06b6d4)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           letterSpacing: hovered ? "0.5px" : "0px",
//           transition: "all 0.3s ease",
//         }}
//       >
//         Archer
//       </span>
//     </a>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { Link } from 'react-router-dom';
import { DeviceType } from '@/types/network';
import { DeviceIcon } from './DeviceIcon';
import { useNetwork } from '@/context/NetworkContext';
import { createDevice } from '@/utils/networkUtils';
import { exampleTopologies } from '@/utils/exampleTopologies';
import { Undo2, Redo2, Trash2, Bot, Download, Upload, RotateCcw, Cable, FolderOpen, Sparkle, ChevronDown, ChevronUp, Link2Off } from 'lucide-react';
import { useRef, useState } from 'react';

const endpointDeviceTypes: { type: DeviceType; label: string }[] = [
  { type: 'pc', label: 'PC' },
  { type: 'laptop', label: 'Laptop' },
  { type: 'smartphone', label: 'Smartphone' },
  { type: 'server', label: 'Server' },
];

const infrastructureDeviceTypes: { type: DeviceType; label: string }[] = [
  { type: 'router', label: 'Router' },
  { type: 'wireless-router', label: 'Wireless Router' },
  { type: 'switch', label: 'Switch' },
  { type: 'firewall', label: 'Firewall' },
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
    <div
      style={{
        width: '220px',
        minWidth: '220px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(180deg, #0f1117 0%, #111827 100%)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 14px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #22c55e)',
              boxShadow: '0 0 8px #6366f188',
            }}
          />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            Device Palette
          </span>
        </div>
      </div>

      {/* Scrollable middle section */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 10px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}
      >
        {/* Connection Mode Banner */}
        {connectingFrom && (
          <div
            style={{
              marginBottom: '12px',
              padding: '10px 10px',
              borderRadius: '10px',
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.35)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
              <Cable size={13} style={{ color: '#818cf8' }} />
              <span style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: 600 }}>
                Select target device
              </span>
            </div>
            <button
              onClick={cancelConnecting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                color: '#f87171',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '6px',
                padding: '3px 8px',
                cursor: 'pointer',
              }}
            >
              <Link2Off size={10} /> Cancel
            </button>
          </div>
        )}

        {/* Endpoints Section */}
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
              marginBottom: '7px',
              paddingLeft: '2px',
            }}
          >
            Endpoints
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {endpointDeviceTypes.map(({ type, label }) => (
              <DeviceRow key={type} type={type} label={label} onDragStart={handleDragStart} />
            ))}
          </div>
        </div>

        {/* Infrastructure Section */}
        <div style={{ marginBottom: '6px' }}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
              marginBottom: '7px',
              paddingLeft: '2px',
            }}
          >
            Infrastructure
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {infrastructureDeviceTypes.map(({ type, label }) => (
              <DeviceRow key={type} type={type} label={label} onDragStart={handleDragStart} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '14px 0' }} />

        {/* Examples */}
        <button
          onClick={() => setShowExamples(!showExamples)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 10px',
            borderRadius: '8px',
            background: showExamples ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${showExamples ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`,
            color: showExamples ? '#818cf8' : 'rgba(255,255,255,0.55)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: showExamples ? '6px' : '0',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FolderOpen size={13} /> Examples
          </span>
          {showExamples ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {showExamples && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Object.entries(exampleTopologies).map(([key, topo]) => (
              <button
                key={key}
                onClick={() => { loadState(topo.state); setShowExamples(false); }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.1)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.25)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: '2px' }}>
                  {topo.name}
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                  {topo.description}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div
        style={{
          padding: '10px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.2)',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {/* Undo / Redo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <ActionButton onClick={undo} disabled={!canUndo} icon={<Undo2 size={12} />} label="Undo" />
          <ActionButton onClick={redo} disabled={!canRedo} icon={<Redo2 size={12} />} label="Redo" />
        </div>

        {/* Export / Import */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <ActionButton onClick={handleExport} icon={<Download size={12} />} label="Export" />
          <ActionButton onClick={() => fileInputRef.current?.click()} icon={<Upload size={12} />} label="Import" />
        </div>

        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" style={{ display: 'none' }} />

        {/* Reset */}
        <button
          onClick={resetState}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '7px',
            borderRadius: '8px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.18)',
            color: '#f87171',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.16)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.35)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.18)';
          }}
        >
          <Trash2 size={12} /> Reset Canvas
        </button>

        <Link
          to="/about"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '7px',
            borderRadius: '8px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#c7d2fe',
            fontSize: '11px',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(99,102,241,0.18)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(99,102,241,0.1)';
          }}
        >
          <Bot size={12} /> About Page
        </Link>

        {/* Powered by Archer */}
        <a
          href="https://abdulbasit-archer.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '6px 10px',
            fontSize: '11px',
            borderRadius: '8px',
            cursor: 'pointer',
            textDecoration: 'none',
            color: '#e5e7eb',
            background: hovered
              ? 'linear-gradient(135deg, #1e293b, #0f172a)'
              : 'linear-gradient(135deg, #0f172a, #1e293b)',
            boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.25)' : 'none',
            transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
            transition: 'all 0.25s ease',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Sparkle
            size={13}
            style={{
              color: hovered ? '#22c55e' : '#6366f1',
              transform: hovered ? 'rotate(20deg) scale(1.25)' : 'rotate(0deg) scale(1)',
              filter: hovered ? 'drop-shadow(0 0 6px #22c55e)' : 'none',
              transition: 'all 0.3s ease',
            }}
          />
          <span style={{ opacity: 0.5, fontSize: '10px' }}>Powered by</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: '11px',
              background: 'linear-gradient(90deg, #6366f1, #22c55e, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: hovered ? '0.5px' : '0px',
              transition: 'all 0.3s ease',
            }}
          >
            Archer
          </span>
        </a>
      </div>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────── */

function DeviceRow({
  type,
  label,
  onDragStart,
}: {
  type: DeviceType;
  label: string;
  onDragStart: (e: React.DragEvent, type: DeviceType) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '7px 10px',
        borderRadius: '9px',
        background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.06)'}`,
        cursor: 'grab',
        transition: 'all 0.15s ease',
        transform: hovered ? 'translateX(2px)' : 'translateX(0)',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '7px',
          background: hovered ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
          transition: 'background 0.15s ease',
          flexShrink: 0,
        }}
      >
        <DeviceIcon type={type} size={18} />
      </div>
      <span
        style={{
          fontSize: '12px',
          fontWeight: 500,
          color: hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
          transition: 'color 0.15s ease',
        }}
      >
        {label}
      </span>
      {hovered && (
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '9px',
            color: 'rgba(99,102,241,0.7)',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          drag
        </span>
      )}
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  icon,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        padding: '6px',
        borderRadius: '8px',
        background: hovered && !disabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        color: disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
        fontSize: '11px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.15s ease',
      }}
    >
      {icon} {label}
    </button>
  );
}