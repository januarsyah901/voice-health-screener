import React, { useEffect, useRef, useState } from 'react';

interface WaveformVisualizerProps {
  isRecording: boolean;
  type: 'heart' | 'lung' | 'ambient';
  onVolumeChange?: (volume: number) => void;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isRecording,
  type,
  onVolumeChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

  // Setup/Teardown Microphone
  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          streamRef.current = stream;
          setHasMicPermission(true);
          
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = audioCtx;
          
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;
          
          const source = audioCtx.createMediaStreamSource(stream);
          sourceRef.current = source;
          source.connect(analyser);
          
          const bufferLength = analyser.frequencyBinCount;
          dataArrayRef.current = new Uint8Array(bufferLength);
        })
        .catch(err => {
          console.warn('Microphone permission denied or unavailable, using simulation:', err);
          setHasMicPermission(false);
        });
    } else {
      cleanupAudio();
    }

    return () => {
      cleanupAudio();
    };
  }, [isRecording]);

  const cleanupAudio = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    dataArrayRef.current = null;
  };

  // Canvas Drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handler
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let offset = 0; // For simulated waveforms

    const draw = () => {
      if (!canvas || !ctx) return;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Background styling: Steep Ink (#17191c)
      ctx.fillStyle = '#17191c';
      ctx.fillRect(0, 0, width, height);

      // Grid Lines: Graphite at low opacity
      ctx.strokeStyle = 'rgba(119, 123, 134, 0.12)';
      ctx.lineWidth = 1;
      const gridSpacing = 40;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Center baseline
      ctx.strokeStyle = 'rgba(93, 42, 26, 0.25)'; // Rust outline at low opacity
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Main drawing line: Rust (#5d2a1a) or Peach/Apricot for contrast
      const drawColor = '#fbe1d1'; // Apricot wash lines look stunning on Ink background!
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 2.0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();

      if (isRecording && hasMicPermission && analyserRef.current && dataArrayRef.current) {
        // --- REAL MICROPHONE DATA DRAWING ---
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;
        analyser.getByteTimeDomainData(dataArray as any);

        const sliceWidth = width / dataArray.length;
        let x = 0;
        let totalVol = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0; // Normalized between 0 and 2
          const y = (v * height) / 2;
          
          totalVol += Math.abs(dataArray[i] - 128);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }
        
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Calculate simple volume level
        const avgVol = totalVol / dataArray.length;
        if (onVolumeChange) {
          onVolumeChange(avgVol);
        }

      } else {
        // --- SIMULATED WAVEFORM DRAWING ---
        const points = 180;
        const sliceWidth = width / points;
        let x = 0;
        offset += isRecording ? 0.08 : 0.02;

        let totalVol = 0;

        for (let i = 0; i < points; i++) {
          const progress = i / points;
          const edgeFade = Math.sin(progress * Math.PI); 

          let amplitude = 0;

          if (type === 'heart') {
            const pulseRate = isRecording ? 2.2 : 1.2;
            const phase = (offset + progress * 8) % (Math.PI * 2);
            
            const s1 = Math.pow(Math.max(0, Math.sin(phase * pulseRate)), 8) * 35;
            const s2 = Math.pow(Math.max(0, Math.sin((phase - 0.4) * pulseRate)), 8) * 22;
            
            const noise = (Math.sin(offset * 20 + i * 0.8) * 2 + Math.cos(offset * 35 + i * 1.5)) * (s1 + s2 > 1 ? 0.35 : 0.05);

            amplitude = (s1 + s2 + noise) * edgeFade;
          } else if (type === 'lung') {
            const breathingRate = 0.5;
            const baseBreath = Math.sin(offset * breathingRate) * 12;
            const airNoise = (Math.sin(offset * 25 + i * 0.5) * Math.cos(offset * 40 + i * 0.2)) * (Math.abs(baseBreath) > 1 ? 2.5 : 0.2);
            
            amplitude = (baseBreath + airNoise) * edgeFade;
          } else {
            amplitude = (Math.sin(offset + i * 0.05) * 8 + Math.cos(offset * 1.5 + i * 0.1) * 4) * edgeFade;
          }

          amplitude = Math.max(-height / 2.2, Math.min(height / 2.2, amplitude));
          const y = height / 2 + amplitude;
          totalVol += Math.abs(amplitude);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.stroke();

        // Calculate simulated volume
        if (onVolumeChange) {
          const avgVol = totalVol / points;
          onVolumeChange(isRecording ? 10 + avgVol * 1.5 : 1.5);
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, hasMicPermission, type, onVolumeChange]);

  return (
    <div className="relative w-full h-full min-h-[160px] md:min-h-[220px] rounded-cards overflow-hidden border border-dove/20 shadow-steep">
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-ink/90 px-3 py-1.5 rounded-full border border-dove/30 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-rust animate-pulse"></span>
          <span className="text-[11px] font-sohne font-[500] uppercase tracking-wide text-pure-white">
            {hasMicPermission ? 'Mic Aktif' : 'Merekam (Simulasi)'}
          </span>
        </div>
      )}
    </div>
  );
};
