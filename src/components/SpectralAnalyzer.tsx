'use client';
import { useEffect, useRef } from "react";

export default function SpectralAnalyzer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barCount = 128;
  const lastBarValuesRef = useRef(new Array(barCount).fill(0));
  const intensityRef = useRef(0);

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
      canvas.height = 600; // Bar height
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);


    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const totalGap = canvas.width - (barCount * 1);
      const gap = barCount > 1 ? totalGap / (barCount - 1) : 0;

      const usableBins = Math.floor(bufferLength * (2 / 3));
      // Calculate audio progress ratio
      let progress = 0;
      if (audioRef.current && audioRef.current.duration > 0) {
        progress = audioRef.current.currentTime / audioRef.current.duration;
      }
      const minBarHeight = 0;

      const lastBarValues = lastBarValuesRef.current;
      const smoothingFactor = 0.7;

      const isPlaying = audioRef.current && !audioRef.current.paused && !audioRef.current.ended;
      const fadeSpeed = 0.01;
      let target = isPlaying ? 1 : 0;
      intensityRef.current += (target - intensityRef.current) * fadeSpeed;
      const intensity = intensityRef.current;

      for (let i = 0; i < barCount; i++) {
        const dataIdx = Math.floor((i / barCount) * usableBins);
        const rawValue = dataArray[dataIdx] / 255;
        const scaledValue = Math.pow(rawValue, 0.5); // square root scaling
        const rawHeight = scaledValue * canvas.height;
        const barHeight = Math.max(minBarHeight, rawHeight);
        const x = i * (1 + gap);

        const blended = lastBarValues[i] * smoothingFactor + barHeight * (1 - smoothingFactor);
        lastBarValues[i] = blended;

        const fadedHeight = blended * intensity;

        const color = (i / barCount) < progress ? "#ff3232" : "#fff";
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.fillRect(x, canvas.height - fadedHeight, 1, fadedHeight);
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