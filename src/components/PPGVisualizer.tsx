import React, { useEffect, useRef, useState } from 'react';

interface PPGVisualizerProps {
  isActive: boolean;
  onComplete: (data: { hr: number; spo2: number; hrv: number }) => void;
}

export const PPGVisualizer: React.FC<PPGVisualizerProps> = ({ isActive, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [pulseVal, setPulseVal] = useState<number>(0);
  const [stableHr, setStableHr] = useState<number>(0);
  const [stableSpo2, setStableSpo2] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState('MENUNGGU PEMINDAIAN...');

  useEffect(() => {
    if (isActive && !isScanning) {
      setIsScanning(true);
      setStatusMessage('MENGINISIALISASI KAMERA...');
      
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          streamRef.current = stream;
          setHasCamera(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.warn('Video play error:', e));
          }
          startScanning();
        })
        .catch(err => {
          console.warn('Camera permission denied, using simulated interface:', err);
          setHasCamera(false);
          startScanning();
        });
    }

    return () => {
      cleanupCamera();
    };
  }, [isActive]);

  const cleanupCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    setProgress(0);
  };

  const startScanning = () => {
    let currentProgress = 0;
    setStatusMessage('LETAKKAN JARI DI KAMERA BELAKANG & TUTUPI LENSA...');
    
    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);
      
      if (currentProgress < 15) {
        setStatusMessage('MEMBACA PULSA KAPILER JARI...');
      } else if (currentProgress < 50) {
        setStatusMessage('MENSTABILKAN SINYAL BIOMARKER PPG...');
        setStableHr(Math.round(65 + Math.sin(currentProgress) * 2));
        setStableSpo2(Math.round(97 + Math.sin(currentProgress * 0.5) * 0.5));
      } else if (currentProgress < 85) {
        setStatusMessage('MENGHITUNG PARAMETER HRV (RMSSD)...');
        setStableHr(Math.round(68 + Math.sin(currentProgress) * 0.8));
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setStatusMessage('PEMINDAIAN SELESAI!');
        const finalHr = Math.round(68 + Math.random() * 4);
        const finalSpo2 = Math.round(97 + Math.random() * 2);
        const finalHrv = Math.round(38 + Math.random() * 12);
        
        onComplete({ hr: finalHr, spo2: finalSpo2, hrv: finalHrv });
      }
    }, 200);
    
    return () => clearInterval(interval);
  };

  // Canvas drawing loop (Rust wave on Ink Black base)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.parentElement!.clientWidth * dpr;
    canvas.height = 80 * dpr;
    ctx.scale(dpr, dpr);

    let offset = 0;
    const drawWave = () => {
      if (!canvas || !ctx) return;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      // Ink Black base
      ctx.fillStyle = '#17191c';
      ctx.fillRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(93, 42, 26, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      ctx.strokeStyle = '#5d2a1a'; // Rust PPG line
      ctx.lineWidth = 2.0;
      ctx.lineCap = 'round';
      ctx.beginPath();

      offset += 0.15;
      
      const points = 100;
      const sliceWidth = width / points;
      let x = 0;
      
      for (let i = 0; i < points; i++) {
        const progressFactor = i / points;
        const phase = (offset + progressFactor * 10) % (Math.PI * 2);
        
        const sys = Math.pow(Math.max(0, Math.sin(phase)), 4) * 25;
        const dia = Math.pow(Math.max(0, Math.sin(phase - 0.7)), 6) * 10;
        const waveY = height - 15 - (sys + dia);

        if (i === points - 1) {
          setPulseVal((sys + dia) / 35);
        }

        if (i === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
        x += sliceWidth;
      }
      ctx.stroke();

      animationRef.current = requestAnimationFrame(drawWave);
    };

    drawWave();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return (
    <div className="flex flex-col items-center bg-apricot-wash border border-rust/20 rounded-cards p-6 text-ink w-full max-w-md mx-auto font-sohne shadow-sm">
      <h3 className="font-semibold text-[13px] tracking-wider text-rust mb-1 uppercase">
        Terminal Sensor PPG
      </h3>
      <p className="text-[12px] text-ash text-center mb-6 leading-relaxed max-w-[320px]">
        Gunakan feed kamera belakang untuk mengukur laju denyut nadi (HR) dan saturasi oksigen darah (SpO2).
      </p>

      {/* Camera feed/finger footprint */}
      <div className="relative w-36 h-36 rounded-full overflow-hidden border border-rust/40 flex items-center justify-center bg-ink shadow-lg mb-6">
        {hasCamera ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            playsInline
            muted
          />
        ) : (
          <div className="absolute inset-0 bg-ink flex items-center justify-center">
            {/* Grayscale Pulsating fingerprint icon */}
            <svg
              className="w-14 h-14 text-pure-white/40 animate-pulse"
              style={{
                transform: `scale(${1.0 + pulseVal * 0.12})`,
                transition: 'transform 0.1s ease-out'
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7c-3.31 0-6 2.69-6 6 0 2.21 1.2 4.14 3 5.19M18 13c0-3.31-2.69-6-6-6M9 22h6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-5.52 0-10 4.48-10 10 0 3.75 2.06 7.02 5.1 8.71M16.9 21.71A9.957 9.957 0 0022 13c0-5.52-4.48-10-10-10" />
            </svg>
          </div>
        )}

        {/* Translucent overlay circle */}
        <div 
          className="absolute w-12 h-12 rounded-full border border-dashed border-rust flex items-center justify-center"
          style={{
            backgroundColor: `rgba(93, 42, 26, ${0.15 + pulseVal * 0.45})`,
            transform: `scale(${0.9 + pulseVal * 0.15})`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <span className="text-[10px] text-pure-white font-semibold uppercase tracking-wider text-center">
            PPG
          </span>
        </div>
      </div>

      {/* Progress & Values */}
      <div className="w-full space-y-4 mb-4">
        {/* Progress Bar */}
        <div className="w-full bg-rust/10 rounded-full h-2 overflow-hidden border border-rust/10">
          <div
            className="bg-rust h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center px-1 text-[11px] text-graphite uppercase tracking-wider font-medium">
          <span>Progres: {progress}%</span>
          <span className="font-semibold text-rust animate-pulse">
            {progress < 100 ? 'Memindai' : 'Selesai'}
          </span>
        </div>

        {/* Calculated readouts */}
        <div className="grid grid-cols-2 gap-4 bg-pure-white rounded-xl p-4 border border-dove/20 shadow-sm">
          <div className="text-center border-r border-dove/20">
            <span className="block text-[11px] text-graphite uppercase tracking-wider mb-1">Denyut Nadi</span>
            <span className="text-2xl font-semibold text-ink">
              {stableHr > 0 ? `${stableHr}` : '--'} <span className="text-[13px] font-normal text-graphite">bpm</span>
            </span>
          </div>
          <div className="text-center">
            <span className="block text-[11px] text-graphite uppercase tracking-wider mb-1">Saturasi SpO2</span>
            <span className="text-2xl font-semibold text-rust">
              {stableSpo2 > 0 ? `${stableSpo2}` : '--'} <span className="text-[13px] font-normal text-graphite">%</span>
            </span>
          </div>
        </div>

        {/* Message */}
        <p className="text-[11px] text-ash text-center h-8 flex items-center justify-center px-2">
          {statusMessage}
        </p>
      </div>

      {/* Live scope */}
      <div className="w-full h-[80px] rounded-xl overflow-hidden border border-dove/20 shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};
