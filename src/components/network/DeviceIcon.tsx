import React from 'react';
import { DeviceType } from '@/types/network';
import { Router, MonitorSmartphone, Server, Network, Laptop, Smartphone, ShieldCheck, Wifi } from 'lucide-react';

interface DeviceIconProps {
  type: DeviceType;
  size?: number;
  className?: string;
}

const icons: Record<DeviceType, React.ElementType> = {
  router: Router,
  'wireless-router': Wifi,
  switch: Network,
  pc: MonitorSmartphone,
  server: Server,
  laptop: Laptop,
  smartphone: Smartphone,
  firewall: ShieldCheck,
};

const colors: Record<DeviceType, string> = {
  router: 'text-primary',
  'wireless-router': 'text-cyan-400',
  router: 'text-primary',
  switch: 'text-accent',
  pc: 'text-info',
  server: 'text-warning',
  laptop: 'text-info',
  smartphone: 'text-cyan-400',
  firewall: 'text-rose-500',
};

export function DeviceIcon({ type, size = 28, className = '' }: DeviceIconProps) {
  const Icon = icons[type];
  return <Icon size={size} className={`${colors[type]} ${className}`} />;
}
