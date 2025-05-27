'use client';
import { useEffect, useRef } from "react";

export default function SpectralAnalyzer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    // Set up AudioContext/Analyser
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

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
      canvas.height = 120; // Bar height
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 128;
      const barWidth = 1; // Thin bars
      const totalGap = canvas.width - (barCount * barWidth);
      const gap = barCount > 1 ? totalGap / (barCount - 1) : 0;

      const usableBins = Math.floor(bufferLength * (2 / 3));
      // Calculate audio progress ratio
      let progress = 0;
      if (audioRef.current && audioRef.current.duration > 0) {
        progress = audioRef.current.currentTime / audioRef.current.duration;
      }
      for (let i = 0; i < barCount; i++) {
        const dataIdx = Math.floor((i / barCount) * usableBins);
        const barHeight = (dataArray[dataIdx] / 255) * canvas.height;
        const x = i * (barWidth + gap);

        const color = (i / barCount) < progress ? "#ff3232" : "#fff";
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        ctx.restore();
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
        height={64}
      />
    </>
  );
}