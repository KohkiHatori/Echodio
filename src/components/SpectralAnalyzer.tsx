'use client';
import { useEffect, useRef } from "react";

export default function SpectralAnalyzer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barCount = 128;
  const lastBarValuesRef = useRef(new Array(barCount).fill(0));

  useEffect(() => {
    if (!audioRef.current) return;

    // Set up AudioContext/Analyser
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 16384;

    const source = audioCtx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let rafId: number;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = 300; // Bar height
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);


    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let progress = 0;
      if (audioRef.current && audioRef.current.duration > 0) {
        progress = audioRef.current.currentTime / audioRef.current.duration;
      }

      const totalGap = canvas.width - (barCount * 1);
      const gap = barCount > 1 ? totalGap / (barCount - 1) : 0;
      const barWidth = 1;
      // Temporal smoothing variables
      const lastBarValues = lastBarValuesRef.current;
      const smoothingFactor = 0.9; // much more smoothing
      // Only use the first barCount bins from dataArray
      for (let i = 0; i < barCount; i++) {
        const rawValue = dataArray[i] / 255;
        const scaledValue = Math.pow(rawValue, 0.5); // square root normalization
        const barHeight = scaledValue * canvas.height;
        const x = i * (barWidth + gap);
        const color = (i / barCount) < progress ? "#ff3232" : "#fff";
        ctx.fillStyle = color;
        // Blend with previous value for temporal smoothing
        const shownHeight = barHeight;
        const blended = lastBarValues[i] * smoothingFactor + shownHeight * (1 - smoothingFactor);
        lastBarValues[i] = blended;
        ctx.fillRect(x, canvas.height - blended, barWidth, blended);
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();

    function resumeAudioCtx() {
      if (audioCtx.state === 'suspended') audioCtx.resume();
    }
    audioRef.current.addEventListener('play', resumeAudioCtx);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      if (audioRef.current) audioRef.current.removeEventListener('play', resumeAudioCtx);
      audioCtx.close();
    };
  }, []);

  // Render audio element with controls and canvas visualizer
  return (
    <>
      <audio ref={audioRef} src="/test.mp3" controls style={{ width: '100%' }} />
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
          width: '100vw',
          height: '64px',
          pointerEvents: 'none', // Don't block clicks!
          background: 'transparent',
        }}
        height={200}
      />
    </>
  );
}