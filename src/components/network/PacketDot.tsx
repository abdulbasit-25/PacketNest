import React, { useEffect, useState } from 'react';

interface PacketDotProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  success: boolean;
}

export function PacketDot({ x1, y1, x2, y2, success }: PacketDotProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number;
    const duration = 1200;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const cx = x1 + (x2 - x1) * progress;
  const cy = y1 + (y2 - y1) * progress;
  const color = success ? 'hsl(var(--success))' : 'hsl(var(--destructive))';

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} opacity={0.9}>
        <animate attributeName="r" values="4;6;4" dur="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={10} fill={color} opacity={0.2}>
        <animate attributeName="r" values="8;14;8" dur="0.5s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}
