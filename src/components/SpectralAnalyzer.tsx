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

    if (!audio || !canvas) {
      // If no audio or canvas, ensure everything is cleaned up
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      // Optionally close AudioContext if it's only for this analyzer and no audioSrc
      // if (audioCtxRef.current && !audioSrc) {
      //   audioCtxRef.current.close();
      //   audioCtxRef.current = null;
      // }
      return;
    }

    // Initialize AudioContext and AnalyserNode once
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const audioCtx = audioCtxRef.current;

    if (!analyserRef.current) {
      analyserRef.current = audioCtx.createAnalyser();
      analyserRef.current.fftSize = 16384; // or your preferred fftSize
    }
    const analyser = analyserRef.current;

    // Handle audio source changes
    if (audioSrc) {
      audio.pause();
      audio.src = audioSrc;
      audio.load();

      // Disconnect previous source if it exists
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch (e) {
          console.warn("Error disconnecting previous source node:", e);
        }
      }

      // Create a new source node for the current audio element and connect it.
      // This check is crucial for preventing the re-connection error.
      if (!sourceNodeRef.current || sourceNodeRef.current.mediaElement !== audio) {
        try {
          sourceNodeRef.current = audioCtx.createMediaElementSource(audio);
        } catch (e) {
          console.error("Failed to create media element source:", e);
          return; // Exit if source creation fails
        }
      }

      sourceNodeRef.current.connect(analyser);
      analyser.connect(audioCtx.destination); // Connect analyser to output

    } else {
      // If audioSrc is removed, disconnect the source
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      audio.pause();
      // audio.src = ''; // Optionally clear src
    }

    const ctx = canvas.getContext("2d")!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const resizeCanvas = () => {
      if (canvasRef.current) { // Ensure canvas still exists
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = 300; // Or your desired canvas height
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let isDrawing = true; // Flag to control animation loop

    const draw = () => {
      if (!isDrawing || !analyserRef.current || !canvasRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

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

    if (audioSrc) {
      draw(); // Start drawing only if there's an audio source
    }

    const resumeAudioCtx = () => {
      if (audioCtx.state === 'suspended') audioCtx.resume();
    };

    audio.addEventListener('play', resumeAudioCtx);

    return () => {
      isDrawing = false; // Stop animation loop
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', resizeCanvas);
      audio.removeEventListener('play', resumeAudioCtx);
      // Source node is disconnected based on audioSrc changes now,
      // so direct disconnection here might be redundant or cause issues if audioSrc didn't change.
      // Analyser and AudioContext are reused, so generally not closed here unless component unmounts entirely.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef, audioSrc]); // audioRef should be stable, audioSrc triggers effect

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 15,
        width: '100vw',
        height: '64px',
        pointerEvents: 'none',
        background: 'transparent',
      }}
      height={200}
    />
  );
}