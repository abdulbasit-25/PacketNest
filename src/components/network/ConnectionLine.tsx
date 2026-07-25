import React from 'react';
import { Connection } from '@/types/network';

interface ConnectionLineProps {
  connection: Connection;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isSelected: boolean;
  onClick: () => void;
}

export function ConnectionLine({ connection, x1, y1, x2, y2, isSelected, onClick }: ConnectionLineProps) {
  return (
    <g>
      {/* Invisible wider line for easier clicking */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="transparent"
        strokeWidth={12}
        style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      />
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={isSelected ? 'hsl(var(--device-selected))' : 'hsl(var(--connection-line))'}
        strokeWidth={isSelected ? 2.5 : 1.5}
        strokeDasharray={isSelected ? 'none' : '4 2'}
        style={{ pointerEvents: 'none' }}
      />
      {isSelected && (
        <>
          <circle cx={x1} cy={y1} r={3} fill="hsl(var(--device-selected))" />
          <circle cx={x2} cy={y2} r={3} fill="hsl(var(--device-selected))" />
        </>
      )}
    </g>
  );
}
