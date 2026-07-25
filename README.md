# PacketNest — Documentation

> A browser-based interactive network simulator inspired by Cisco Packet Tracer — 100% client-side, zero backend.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/localStorage-only-orange)

## Overview

PacketNest is a browser-based interactive network simulator inspired by Cisco Packet Tracer. It runs entirely client-side with no backend — all data persists in **localStorage**.

## Tech Stack

- **React 18** + **TypeScript** — UI framework
- **Vite** — build tool
- **Tailwind CSS** — styling
- **shadcn/ui** — component library (Radix UI primitives)
- **Framer Motion** — packet animations
- **uuid** — unique device/interface IDs
- **LocalStorage** — persistence (no database)

## Design & Visual Effects

PacketNest's interface is built to feel like a real network-engineering tool, not a form-heavy dashboard — dark canvas, high-contrast device iconography, and motion that communicates _what the network is doing_ rather than decorating the UI.

### Visual Language

- **Dark, blueprint-style canvas** — a deep neutral background with a faint dotted/grid pattern, evoking a schematic or blueprint workspace so cables and devices pop visually.
- **Device iconography** — Router, Switch, PC, and Server each get a distinct silhouette and accent color (e.g. routers in blue, switches in violet, servers in amber) so topology shape is readable at a glance without reading labels.
- **Status-driven color coding**:
  - 🟢 Green — interface up / ping success
  - 🔴 Red — interface down / ping failure / unreachable
  - 🟡 Amber — misconfigured (missing IP, mismatched subnet)
  - ⚪ Gray — unselected / idle device
- **Glassmorphism panels** — the Config Panel and CLI panel use a translucent, blurred-background surface (`backdrop-blur`) that floats above the canvas rather than boxing it in, keeping the topology visible underneath.
- **Selection glow** — the active device gets a soft outer-glow ring (box-shadow, not a hard border) to indicate selection without disrupting the layout.

### Motion & Animation (Framer Motion)

- **Packet travel animation** — when a `ping` is issued, an animated dot travels along the connection path in real time, following the exact BFS-computed route hop by hop.
  - Successful ping → dot animates in **green**, with a small pulse/scale-up burst on arrival at the destination.
  - Failed ping → dot animates in **red** and fades out mid-path at the point of failure (e.g. stops at the last reachable hop rather than completing the route).
- **Cable draw-in** — new connections animate as a line drawing from source to target device (stroke-dashoffset transition) instead of snapping in instantly.
- **Device drop/spawn** — dragging a device from the palette onto the canvas triggers a small spring-scale entrance (springs in from 0.8 → 1 scale) rather than appearing abruptly.
- **Panel transitions** — Config Panel and CLI panel slide/fade in and out (`AnimatePresence`) rather than toggling visibility instantly.
- **Hover micro-interactions** — device nodes lift slightly (translateY + shadow increase) on hover to signal interactivity.
- **Drag feedback** — while dragging a device, connected cables re-render live so the topology never looks "broken" mid-drag.

### Layout

- **Three-zone workspace**: device palette (left) → canvas (center, pan/zoom) → config panel (right), with a collapsible CLI panel docked at the bottom — mirroring the layout convention of professional network simulators.
- **Zoom/pan indicators** — a small on-canvas readout shows current zoom level; scroll-to-zoom is centered on the cursor position, not the canvas origin.

## How to Use

### Adding Devices

Drag **Router**, **Switch**, **PC**, or **Server** from the left sidebar onto the canvas.

### Connecting Devices

1. Click **a device** to select it
2. In the **Config Panel** (right side), choose an interface and click **Connect**
3. Click a **second device** to complete the connection — a cable line appears

### Configuring Devices

Click any device → the **Config Panel** opens where you can set:

- **Device name**
- **IP address** & **Subnet mask** per interface
- **Default gateway** (for PCs/servers)
- **Interface up/down** toggle

### CLI (Command Line)

Expand the bottom **CLI panel**, select a device, then type commands:

| Command                       | Example                                   |
| ----------------------------- | ----------------------------------------- |
| `ip addr <iface> <ip> <mask>` | `ip addr eth0 192.168.1.10 255.255.255.0` |
| `ping <ip>`                   | `ping 192.168.1.1`                        |
| `show interfaces`             | Shows all interface details               |
| `hostname <name>`             | Renames the device                        |

### Ping Simulation

Type `ping <ip>` in the CLI. The simulator checks:

- Source has a valid IP on an active interface
- Target device exists with that IP
- Both are on the same subnet **or** gateways are configured
- A physical path exists between them (BFS across connections)

Animated dots travel along cables showing success (green) or failure (red).

### Save / Load / Export

- **Auto-save**: topology saves to localStorage on every change
- **Undo/Redo**: `Ctrl+Z` / `Ctrl+Shift+Z`
- **Export**: downloads topology as `.json`
- **Import**: loads a `.json` file
- **Reset**: clears the canvas
- **Example topologies**: load prebuilt networks from the sidebar

### Canvas Controls

- **Scroll** → zoom in/out
- **Alt + Drag** → pan the canvas
- **Click device** → select
- **Drag device** → reposition

## Architecture

| File                 | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `NetworkContext.tsx` | Global state (devices, connections, history, localStorage) |
| `simulation.ts`      | Ping logic with BFS path finding                           |
| `networkUtils.ts`    | IP/subnet math helpers                                     |
| `NetworkCanvas.tsx`  | SVG workspace with pan/zoom                                |
| `CLIPanel.tsx`       | Terminal emulator & command parser                         |
| `ConfigPanel.tsx`    | Device property editor                                     |
| `DevicePalette.tsx`  | Drag-and-drop sidebar                                      |

## Roadmap

- [ ] Export as DOCX
- [ ] VLAN support
