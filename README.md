# PacketNest — Documentation

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
| Command | Example |
|---|---|
| `ip addr   ` | `ip addr eth0 192.168.1.10 255.255.255.0` |
| `ping ` | `ping 192.168.1.1` |
| `show interfaces` | Shows all interface details |
| `hostname ` | Renames the device |

### Ping Simulation
Type `ping ` in the CLI. The simulator checks:
- Source has a valid IP on an active interface
- Target device exists with that IP
- Both are on the same subnet **or** gateways are configured
- A physical path exists between them (BFS across connections)

Animated dots travel along cables showing success (green) or failure (red).

### Save / Load / Export
- **Auto-save**: topology saves to localStorage on every change
- **Undo/Redo**: Ctrl+Z / Ctrl+Shift+Z
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
| File | Purpose |
|---|---|
| `NetworkContext.tsx` | Global state (devices, connections, history, localStorage) |
| `simulation.ts` | Ping logic with BFS path finding |
| `networkUtils.ts` | IP/subnet math helpers |
| `NetworkCanvas.tsx` | SVG workspace with pan/zoom |
| `CLIPanel.tsx` | Terminal emulator & command parser |
| `ConfigPanel.tsx` | Device property editor |
| `DevicePalette.tsx` | Drag-and-drop sidebar |

Export as DOCX
Add VLAN support