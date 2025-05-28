'use client';
import { useEffect, useRef } from "react";

export default function SpectralAnalyzer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barCount = 128;
  const lastBarValuesRef = useRef(new Array(barCount).fill(0));
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;

    // Prevent re-creating source for already connected audio
    if (sourceNodeRef.current) return;

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 16384;

    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    sourceNodeRef.current = source;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const ctx = canvas.getContext("2d")!;
    let rafId: number;

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = 300;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let progress = 0;
      if (audio.duration > 0) {
        progress = audio.currentTime / audio.duration;
      }

      const totalGap = canvas.width - (barCount * 1);
      const gap = barCount > 1 ? totalGap / (barCount - 1) : 0;
      const barWidth = 1;
      const lastBarValues = lastBarValuesRef.current;
      const smoothingFactor = 0.9;

      for (let i = 0; i < barCount; i++) {
        const rawValue = dataArray[i] / 255;
        const scaledValue = Math.pow(rawValue, 0.5);
        const barHeight = scaledValue * canvas.height;
        const x = i * (barWidth + gap);
        const color = (i / barCount) < progress ? "#ff3232" : "#fff";
        ctx.fillStyle = color;
        const blended = lastBarValues[i] * smoothingFactor + barHeight * (1 - smoothingFactor);
        lastBarValues[i] = blended;
        ctx.fillRect(x, canvas.height - blended, barWidth, blended);
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    function resumeAudioCtx() {
      if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    audio.addEventListener('play', resumeAudioCtx);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      audio.removeEventListener('play', resumeAudioCtx);
      audioCtx.close();
      sourceNodeRef.current = null;
      audioCtxRef.current = null;
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