'use client';
import { useEffect, useRef } from "react";

interface Props {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioSrc?: string;
}

export default function SpectralAnalyzer({ audioRef, audioSrc }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barCount = 128;
  const lastBarValuesRef = useRef<number[]>(new Array(barCount).fill(0));
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas || !audioSrc) return;

    // Reset <audio> element and stop playback
    audio.pause();
    audio.src = audioSrc;
    audio.load();

    // Clear previous audio context
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 16384;
    analyserRef.current = analyser;

    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    sourceNodeRef.current = source;

    const ctx = canvas.getContext("2d")!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 300;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 128;
      const totalGap = canvas.width - (barCount * 1);
      const gap = barCount > 1 ? totalGap / (barCount - 1) : 0;
      const barWidth = 1;
      const smoothingFactor = 0.9;
      const lastBarValues = lastBarValuesRef.current;

      const progress = audio.duration > 0 ? audio.currentTime / audio.duration : 0;

      for (let i = 0; i < barCount; i++) {
        const rawValue = dataArray[i] / 255;
        const scaledValue = Math.pow(rawValue, 0.5);
        const barHeight = scaledValue * canvas.height;
        const x = i * (barWidth + gap);
        const blended = lastBarValues[i] * smoothingFactor + barHeight * (1 - smoothingFactor);
        lastBarValues[i] = blended;

        ctx.fillStyle = (i / barCount) < progress ? "#ff3232" : "#fff";
        ctx.fillRect(x, canvas.height - blended, barWidth, blended);
      }

      rafIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    const resumeAudioCtx = () => {
      if (audioCtx.state === 'suspended') audioCtx.resume();
    };

    audio.addEventListener('play', resumeAudioCtx);

    // Optionally auto-play here if needed
    // audio.play().catch(e => console.warn("Playback failed:", e));

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', resizeCanvas);
      audio.removeEventListener('play', resumeAudioCtx);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      sourceNodeRef.current = null;
      analyserRef.current = null;
    };
  }, [audioSrc]);

  return (
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
        pointerEvents: 'none',
        background: 'transparent',
      }}
      height={200}
    />
  );
}