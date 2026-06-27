import React from 'react';

interface BodyMapProps {
  activePoint: 'right-upper' | 'left-upper' | 'basal';
  completedPoints: string[];
  onSelectPoint?: (point: 'right-upper' | 'left-upper' | 'basal') => void;
}

export const BodyMap: React.FC<BodyMapProps> = ({
  activePoint,
  completedPoints,
  onSelectPoint
}) => {
  const points = [
    {
      id: 'right-upper' as const,
      label: 'Dada Kanan Atas',
      cx: 110,
      cy: 110,
    },
    {
      id: 'left-upper' as const,
      label: 'Dada Kiri Atas',
      cx: 190,
      cy: 110,
    },
    {
      id: 'basal' as const,
      label: 'Basal Paru (Bawah/Punggung)',
      cx: 150,
      cy: 180,
    }
  ];

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[280px] mx-auto font-sohne">
      {/* Cool Tint Card Layout with 24px rounded corners and subtle shadow */}
      <div className="relative bg-sky-wash border border-dove/30 rounded-cards p-5 w-full shadow-sm">
        {/* SVG Torso */}
        <svg 
          viewBox="0 0 300 300" 
          className="w-full h-auto text-graphite"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {/* Torso Outline */}
          <path 
            d="M90 60 C90 40, 210 40, 210 60 C210 90, 240 100, 240 130 C240 190, 210 270, 150 280 C90 270, 60 190, 60 130 C60 100, 90 90, 90 60 Z" 
            fill="rgba(255, 255, 255, 0.45)"
            strokeWidth="1.5"
            stroke="var(--color-ink)"
            opacity="0.25"
          />
          
          {/* Lungs */}
          <path 
            d="M158 90 C175 90, 210 105, 210 150 C210 200, 180 220, 162 220 C156 220, 158 200, 158 150 Z" 
            className="fill-pure-white/10 stroke-ink/10"
            strokeWidth="1.2"
          />
          <path 
            d="M142 90 C125 90, 90 105, 90 150 C90 200, 120 220, 138 220 C144 220, 142 200, 142 150 Z" 
            className="fill-pure-white/10 stroke-ink/10"
            strokeWidth="1.2"
          />

          {/* Connective line */}
          <path 
            d="M150 65 L150 90 M150 90 L135 110 M150 90 L165 110" 
            stroke="currentColor" 
            strokeWidth="1.2" 
            opacity="0.15" 
          />

          {/* Recording Nodes */}
          {points.map((pt) => {
            const isActive = activePoint === pt.id;
            const isCompleted = completedPoints.includes(pt.id);
            
            return (
              <g 
                key={pt.id} 
                className="cursor-pointer group"
                onClick={() => onSelectPoint?.(pt.id)}
              >
                {/* Active pulsating ring */}
                {isActive && (
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r="18"
                    className="fill-rust/10 stroke-rust/35 animate-ping"
                    style={{ transformOrigin: `${pt.cx}px ${pt.cy}px` }}
                  />
                )}

                {/* Node center */}
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r="10"
                  className={`transition-all duration-150 ${
                    isCompleted
                      ? 'fill-ink stroke-pure-white'
                      : isActive
                      ? 'fill-rust stroke-pure-white animate-pulse'
                      : 'fill-pure-white stroke-dove'
                  }`}
                  strokeWidth="1.5"
                />

                {/* Text or Checkmark inside node */}
                {isCompleted ? (
                  <path
                    d={`M ${pt.cx - 3.5} ${pt.cy} L ${pt.cx - 1} ${pt.cy + 2.5} L ${pt.cx + 4} ${pt.cy - 2.5}`}
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ) : (
                  <text
                    x={pt.cx}
                    y={pt.cy + 3.5}
                    textAnchor="middle"
                    className={`text-[9px] font-semibold select-none font-sohne ${
                      isActive ? 'fill-pure-white' : 'fill-graphite'
                    }`}
                  >
                    {pt.id === 'right-upper' ? '1' : pt.id === 'left-upper' ? '2' : '3'}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[10px] bg-pure-white/80 backdrop-blur-sm border border-dove/20 p-2 rounded-xl text-ink">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-rust mr-1.5"></span> Aktif
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-ink mr-1.5"></span> Selesai
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-pure-white border border-dove mr-1.5"></span> Antrean
          </span>
        </div>
      </div>
      
      {/* Title */}
      <span className="text-[12px] font-medium tracking-wide mt-3 text-ink uppercase">
        {activePoint === 'right-upper' && 'Titik 1: Dada Kanan Atas'}
        {activePoint === 'left-upper' && 'Titik 2: Dada Kiri Atas'}
        {activePoint === 'basal' && 'Titik 3: Basal Paru'}
      </span>
    </div>
  );
};
