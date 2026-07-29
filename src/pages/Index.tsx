import { Link } from 'react-router-dom';
import { NetworkProvider } from '@/context/NetworkContext';
import { DevicePalette } from '@/components/network/DevicePalette';
import { NetworkCanvas } from '@/components/network/NetworkCanvas';
import { ConfigPanel } from '@/components/network/ConfigPanel';
import { CLIPanel } from '@/components/network/CLIPanel';
import { Wifi } from 'lucide-react';

const Index = () => {
  return (
    <NetworkProvider>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <header className="h-10 flex items-center px-4 border-b border-border bg-card/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2">
            <Wifi size={18} className="text-primary" />
            <h1 className="text-sm font-semibold text-foreground tracking-wide">PacketNest</h1>
            <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">v1.1</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link
              to="/about"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              About
            </Link>
            <div className="text-[10px] text-muted-foreground font-mono">
              Drag devices • Click to select • Alt+Drag to pan • Scroll to zoom
            </div>
          </div>
        </header>

        {/* Main */}
        <div className="flex flex-1 overflow-hidden">
          <DevicePalette />
          <NetworkCanvas />
          <ConfigPanel />
        </div>

        <CLIPanel />
      </div>
    </NetworkProvider>
  );
};

export default Index;
