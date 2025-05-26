// components/SpectralAnalyzer.tsx
"use client";

import React, { RefObject, useEffect, useRef, useState } from "react";

interface SpectralAnalyzerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  /** Height in pixels of the analyzer strip */
  height?: number;
  /** How many bars to draw */
  barCount?: number;
  /** Minimum bar height (in px) so each bar remains visible */
  minHeight?: number;
}

export default function SpectralAnalyzer({
  audioRef,
  isPlaying,
  height = 128,
  barCount = 64,
  minHeight = 5,
}: SpectralAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);

  // Track the viewport width so we can size the canvas
  const [canvasWidth, setCanvasWidth] = useState(0);
  useEffect(() => {
    function onResize() {
      setCanvasWidth(window.innerWidth);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 1) Initialize Web Audio & AnalyserNode
  useEffect(() => {
    const audioEl = audioRef?.current;
    if (!audioEl) return;

    const audioCtx = new AudioContext();
    const srcNode = audioCtx.createMediaElementSource(audioEl);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 16384;

    srcNode.connect(analyser);
    analyser.connect(audioCtx.destination);

    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;

    return () => {
      if (srcNode) srcNode.disconnect();
      if (analyser) analyser.disconnect();
      analyserRef.current = null;
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
    };
  }, [audioRef]);

  // 2) Draw loop whenever playback is active
  useEffect(() => {
    function draw() {
      animationRef.current = requestAnimationFrame(draw);

      const analyser = analyserRef?.current;
      const canvas = canvasRef?.current;
      if (!analyser || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvasWidth, height);

      const barWidth = canvasWidth / barCount;
      ctx.lineWidth = Math.max(1, barWidth * 0.1);
      ctx.strokeStyle = "#fff";
      for (let i = 0; i < barCount; i++) {
        const raw = dataArray[i];
        const barHeight = Math.max(raw, minHeight);
        const x = i * barWidth + barWidth / 2;
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x, height - barHeight);
        ctx.stroke();
      }
    }

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, canvasWidth, height, barCount, minHeight]);

  // 3) Render the canvas fixed at bottom
  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={height}
      className="fixed bottom-0 left-0 w-full pointer-events-none z-0"
    />
  );
}
