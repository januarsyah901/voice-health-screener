import React, { useEffect, useState } from 'react';

interface CircularGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  duration?: number;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  score,
  size = 200,
  strokeWidth = 6,
  duration = 1200
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      setAnimatedScore(Math.floor(progress * score));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [score, duration]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let statusText = 'Normal';
  let statusClass = 'bg-status-good/10 text-status-good border border-status-good/20';
  if (score < 50) {
    statusText = 'Perlu Tindakan';
    statusClass = 'bg-status-critical/10 text-status-critical border border-status-critical/20';
  } else if (score < 80) {
    statusText = 'Perlu Perhatian';
    statusClass = 'bg-status-warning/10 text-status-warning border border-status-warning/20';
  }

  return (
    <div className="flex flex-col items-center justify-center font-sohne">
      <div 
        className="relative flex items-center justify-center" 
        style={{ width: size, height: size }}
      >
        {/* Background Circle */}
        <svg
          className="absolute inset-0 transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            className="stroke-dove/20"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          
          {/* Foreground Progress Circle */}
          <circle
            style={{
              stroke: 'var(--color-rust)',
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.15s ease-out',
            }}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Center Text */}
        <div className="text-center z-10 px-4">
          <span className="block text-[12px] uppercase tracking-[0.02em] font-medium text-graphite">
            Skor Indeks
          </span>
          <span className="text-6xl font-signifier text-ink select-none my-1 block leading-none">
            {animatedScore}
          </span>
          <span className="block text-[11px] text-graphite font-normal">
            Skala 0-100
          </span>
        </div>
      </div>
      
      {/* Editorial Status Label */}
      <div className={`mt-6 px-4 py-1.5 rounded-full text-[13px] font-[500] tracking-[-0.009em] ${statusClass}`}>
        Status: {statusText}
      </div>
    </div>
  );
};
