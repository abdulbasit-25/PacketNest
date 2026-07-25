import React from 'react';
import { DeviceType } from '@/types/network';
import { Router, MonitorSmartphone, Server, Network } from 'lucide-react';

interface DeviceIconProps {
  type: DeviceType;
  size?: number;
  className?: string;
}

const icons: Record<DeviceType, React.ElementType> = {
  router: Router,
  switch: Network,
  pc: MonitorSmartphone,
  server: Server,
};

const colors: Record<DeviceType, string> = {
  router: 'text-primary',
  switch: 'text-accent',
  pc: 'text-info',
  server: 'text-warning',
};

export function DeviceIcon({ type, size = 28, className = '' }: DeviceIconProps) {
  const Icon = icons[type];
  return <Icon size={size} className={`${colors[type]} ${className}`} />;
}
