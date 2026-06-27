import React from 'react';
import type { ScreeningResult } from '../types';

interface TrendChartProps {
  history: ScreeningResult[];
  metric: 'score' | 'hr' | 'spo2' | 'hrv';
}

export const TrendChart: React.FC<TrendChartProps> = ({ history, metric }) => {
  if (!history || history.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-[13px] font-sohne text-graphite uppercase tracking-wider italic">
        [ Belum Ada Catatan Data ]
      </div>
    );
  }

  // Sort history chronologically
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Setup dimensions
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  // Extract values
  const values = sortedHistory.map((item) => {
    if (metric === 'score') return item.score;
    if (metric === 'hr') return item.biomarkers.hr;
    if (metric === 'spo2') return item.biomarkers.spo2;
    if (metric === 'hrv') return item.biomarkers.hrv;
    return item.score;
  });

  // Calculate scales
  const maxVal = Math.max(...values, metric === 'score' || metric === 'spo2' ? 100 : 90);
  const minVal = Math.min(...values, metric === 'score' ? 40 : metric === 'spo2' ? 90 : 40);
  const valRange = maxVal - minVal || 10;

  // Coordinate mapper
  const getCoords = (index: number, val: number) => {
    const totalPoints = sortedHistory.length;
    const x = paddingX + (index / Math.max(1, totalPoints - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((val - minVal) / valRange) * (height - paddingY * 2);
    return { x, y };
  };

  // Generate SVG Line Path
  let dPath = '';
  let areaPath = '';
  
  if (sortedHistory.length > 0) {
    const coords = sortedHistory.map((_, idx) => getCoords(idx, values[idx]));
    
    coords.forEach((pt, i) => {
      if (i === 0) {
        dPath = `M ${pt.x} ${pt.y}`;
        areaPath = `M ${pt.x} ${height - paddingY} L ${pt.x} ${pt.y}`;
      } else {
        const prev = coords[i - 1];
        const cpX1 = prev.x + (pt.x - prev.x) / 2;
        const cpY1 = prev.y;
        const cpX2 = prev.x + (pt.x - prev.x) / 2;
        const cpY2 = pt.y;
        
        dPath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
        areaPath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
      }
      
      if (i === coords.length - 1) {
        areaPath += ` L ${pt.x} ${height - paddingY} Z`;
      }
    });
  }

  // Formatting helpers
  const formatLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const getMetricLabel = () => {
    if (metric === 'score') return 'Skor Kesehatan (%)';
    if (metric === 'hr') return 'Denyut Nadi (BPM)';
    if (metric === 'spo2') return 'Saturasi Oksigen (SpO2 %)';
    if (metric === 'hrv') return 'Variabilitas Jantung (HRV ms)';
    return '';
  };

  const isWarm = metric === 'score' || metric === 'hr';
  const lineColor = isWarm ? '#5d2a1a' : '#17191c';
  const dotColor = isWarm ? '#5d2a1a' : '#777b86';
  const fillStopColor = isWarm ? '#fbe1d1' : '#d3e3fc';

  // Grid line values
  const gridLinesCount = 3;
  const gridLines = Array.from({ length: gridLinesCount }, (_, i) => {
    const val = minVal + (i / (gridLinesCount - 1)) * valRange;
    const y = height - paddingY - (i / (gridLinesCount - 1)) * (height - paddingY * 2);
    return { val: Math.round(val), y };
  });

  return (
    <div className="w-full font-sohne">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[12px] font-medium tracking-[0.02em] text-graphite uppercase">
          Grafik Tren Historis
        </span>
        <span className="text-[13px] font-semibold text-ink">
          {getMetricLabel()}
        </span>
      </div>

      {/* Card container matching the Steep style */}
      <div className="relative w-full overflow-hidden bg-pure-white border border-dove/40 rounded-cards p-5 shadow-steep">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id={`chartGradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fillStopColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={fillStopColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y Axis values */}
          {gridLines.map((line, i) => (
            <g key={i} className="opacity-80">
              <line
                x1={paddingX}
                y1={line.y}
                x2={width - paddingX}
                y2={line.y}
                stroke="var(--color-dove)"
                strokeWidth="0.5"
                strokeOpacity="0.5"
                strokeDasharray="3 4"
              />
              <text
                x={paddingX - 8}
                y={line.y + 3}
                textAnchor="end"
                className="text-[9px] font-medium fill-graphite"
              >
                {line.val}
              </text>
            </g>
          ))}

          {/* Shaded Area under the curve */}
          {areaPath && (
            <path
              d={areaPath}
              fill={`url(#chartGradient-${metric})`}
            />
          )}

          {/* Main Curved Line */}
          {dPath && (
            <path
              d={dPath}
              fill="none"
              stroke={lineColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* Interactive Data Dots & Labels */}
          {sortedHistory.map((item, idx) => {
            const val = values[idx];
            const pt = getCoords(idx, val);
            
            return (
              <g key={item.id} className="group">
                {/* Hover targets */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="12"
                  className="fill-transparent cursor-pointer"
                />
                
                {/* Visual Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#ffffff"
                  stroke={dotColor}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-100 group-hover:r-5 group-hover:stroke-width-3"
                />
                
                {/* Value tooltip */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                  <rect
                    x={pt.x - 22}
                    y={pt.y - 28}
                    width="44"
                    height="18"
                    rx="4"
                    fill="var(--color-ink)"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 16}
                    textAnchor="middle"
                    className="text-[9px] font-bold fill-pure-white"
                  >
                    {val}
                  </text>
                </g>

                {/* X Axis Labels */}
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[9px] font-medium fill-graphite"
                >
                  {formatLabel(item.date)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
