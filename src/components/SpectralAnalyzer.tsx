'use client';
import { useEffect, useRef, useState } from "react";

interface Props {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioSrc?: string;
  isSidebarOpen?: boolean;
  showProgressTime?: boolean;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function SpectralAnalyzer({ audioRef, audioSrc, isSidebarOpen, showProgressTime }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barCount = 128;
  const lastBarValuesRef = useRef<number[]>(new Array(barCount).fill(0));
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const [eqValues, setEqValues] = useState<number[]>(() => new Array(barCount).fill(1));
  const [draggingBar, setDraggingBar] = useState<number | null>(null);
  const [timeLabel, setTimeLabel] = useState<string>("0:00 / 0:00");
  const [progress, setProgress] = useState<number>(0);
  const [labelX, setLabelX] = useState<number | null>(null);

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
      if (audio) {
        const current = audio.currentTime;
        const total = audio.duration || 0;
        // 時間ラベルの更新（前述と同様）
        setTimeLabel(`${formatTime(current)} / ${formatTime(total)}`);
        setProgress(total > 0 ? current / total : 0);
      }

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
        const x = i * (barWidth + gap);

        // User curve height (limit), now limited to 1.5× but cannot exceed canvas height
        const userCurveHeight = canvas.height * Math.min(1.5 * eqValues[i], 1);

        // Main spectrum bar, limited by user curve
        const spectrumBarHeight = scaledValue * canvas.height;
        const barHeight = Math.min(spectrumBarHeight, userCurveHeight);
        // Smoothing
        const blended = lastBarValues[i] * smoothingFactor + barHeight * (1 - smoothingFactor);
        lastBarValues[i] = blended;

        ctx.fillStyle = (i / barCount) < progress ? "#FFA500" : "#ffffff";
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
  }, [audioRef, audioSrc, eqValues]);

  const totalGap = typeof window !== 'undefined' ? window.innerWidth - (barCount * 1) : 0;
  const gap = barCount > 1 ? totalGap / (barCount - 1) : 0;

  return (
    <>
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
      {showProgressTime && (
  <div
    style={{
      position: 'fixed',
      // If labelX is set, use it; otherwise fall back to progress*vw:
      left: labelX !== null
        ? `${labelX - 44}px`                  // 44px is half the tooltip’s width
        : `calc(${progress * 100}vw - 44px)`,
      bottom: '0px',
      zIndex: 21,
      width: '88px',
      height: '28px',
      background: 'rgba(30,30,40,0.85)',
      color: 'white',
      borderRadius: '10px 10px 0 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '15px',
      fontWeight: 500,
      boxShadow: '0 0 12px #000a',
      border: '1px solid #fff2',
      pointerEvents: 'none',
      transition: 'left 0.15s linear',
      userSelect: 'none'
    }}
  >
    {timeLabel}
  </div>
)}

      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 16,
          width: '100vw',
          height: '200px',
          pointerEvents: 'auto',
          background: 'transparent',
          cursor: draggingBar !== null ? 'ns-resize' : 'pointer',
        }}


        
        onMouseDown={(e) => {
          const audio = audioRef.current;
          if (!audio) return;

          // 1) Figure out where you clicked (fraction of total width)
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const width = rect.width || 1;
          let clickedPercent = x / width;
          clickedPercent = Math.max(0, Math.min(1, clickedPercent));

          // 2) Only seek if duration is valid
          const total = audio.duration;
          if (typeof total === "number" && total > 0) {
            const newTime = total * clickedPercent;
            audio.currentTime = newTime;

            // 3) Immediately move the floating time label
            setTimeLabel(`${formatTime(newTime)} / ${formatTime(total)}`);
            setProgress(clickedPercent);

            setLabelX(rect.left + x);
          }

          // 4) (Optional) If you still want bar‐dragging for EQ, calculate barIdx here…
          // const barArea = rect.width;
          // const gapLocal = barCount > 1 ? (barArea - barCount * 1) / (barCount - 1) : 0;
          // const barWidth = 1;
          // const perBar = barWidth + gapLocal;
          // const barIdx = Math.floor(x / perBar);
          // if (barIdx >= 0 && barIdx < barCount) {
          //   setDraggingBar(barIdx);
          // }
        }}




        // onMouseMove={e => {
        //   if (draggingBar === null) return;
        //   const rect = e.currentTarget.getBoundingClientRect();
        //   const y = e.clientY - rect.top;
        //   const norm = 1 - Math.max(0, Math.min(1, y / rect.height));
        //   const influenceRadius = 4; // how wide the "mountain" spreads
        //   setEqValues(vals => {
        //     const next = [...vals];
        //     for (let i = 0; i < next.length; i++) {
        //       const dist = Math.abs(i - draggingBar);
        //       const weight = Math.exp(-0.5 * (dist / influenceRadius) ** 2);
        //       next[i] = norm * weight + next[i] * (1 - weight);
        //     }
        //     return next;
        //   });
        // }}
        // onMouseUp={() => setDraggingBar(null)}
        // onMouseLeave={() => setDraggingBar(null)}
      />
    </>
  );
}