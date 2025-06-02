'use client';
import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface ControlCenterProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PANEL_HEIGHT = 200;

const EQ_BANDS = [
  { label: 'Preamp', key: 'preamp', min: -12, max: 12, step: 0.1, default: 0 },
  { label: '32', key: '32', min: -12, max: 12, step: 0.1, default: 0 },
  { label: '64', key: '64', min: -12, max: 12, step: 0.1, default: 0 },
  { label: '125', key: '125', min: -12, max: 12, step: 0.1, default: 0 },
  { label: '250', key: '250', min: -12, max: 12, step: 0.1, default: 0 },
  { label: '500', key: '500', min: -12, max: 12, step: 0.1, default: 0 },
  { label: '1k', key: '1k', min: -12, max: 12, step: 0.1, default: 0 },
  { label: '2k', key: '2k', min: -12, max: 12, step: 0.1, default: 0 },
  { label: '4k', key: '4k', min: -12, max: 12, step: 0.1, default: 0 },
  { label: '8k', key: '8k', min: -12, max: 12, step: 0.1, default: 0 },
  { label: '16k', key: '16k', min: -12, max: 12, step: 0.1, default: 0 },
];

const DB_AXIS = [-12, -6, 0, 6, 12];
const SLIDER_HEIGHT = 112; // px, for h-28 (Tailwind)

export default function ControlCenter({ audioRef }: ControlCenterProps) {
  const [volume, setVolume] = useState(0.5); // Default volume at 50%
  const [open, setOpen] = useState(false);
  const [eq, setEq] = useState(() =>
    Object.fromEntries(EQ_BANDS.map(b => [b.key, b.default]))
  );

  // Sync slider with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  // Calculate the vertical position for the toggle button
  const buttonTop = open ? PANEL_HEIGHT : 0;

  return (
    <>
      {/* Slide-down Panel */}
      <div
        className={`fixed left-1/2 top-0 z-40 w-[520px] max-w-[98vw] p-6 pt-8 rounded-b-2xl shadow-2xl bg-zinc-900/95 border-b border-zinc-700 transition-transform duration-500 ease-in-out ${open ? "translate-x-[-50%] translate-y-0" : "translate-x-[-50%] -translate-y-full"}`}
        style={{ height: PANEL_HEIGHT, pointerEvents: open ? "auto" : "none" }}
      >
        <div className="flex flex-col items-center">
          <div className="w-full flex flex-row items-end justify-center gap-6">
            {/* Sliders Row with Axis and Lines */}
            <div className="relative flex flex-row items-end gap-2" style={{ height: SLIDER_HEIGHT }}>
              {/* Volume Slider (leftmost, aligned with EQ) */}
              <div className="flex flex-col items-center justify-end h-full">
                <input
                  id="volume-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="h-28 w-3 accent-blue-500 appearance-none bg-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ writingMode: 'vertical-lr', WebkitAppearance: 'slider-vertical', direction: 'rtl', height: SLIDER_HEIGHT }}
                />
                <label htmlFor="volume-slider" className="text-white text-xs mt-1 select-none">Vol</label>
              </div>
              {/* dB Axis and Lines */}
              <div className="relative flex flex-col items-center justify-end" style={{ height: SLIDER_HEIGHT }}>
                {/* Axis labels and lines perfectly aligned with sliders */}
                <div className="absolute left-0 top-0" style={{ height: SLIDER_HEIGHT, width: '56px' }}>
                  {/* Horizontal lines */}
                  {DB_AXIS.map((db) => (
                    <div
                      key={db}
                      className="absolute left-8 w-[calc(100%-2rem)] h-px bg-zinc-600 opacity-60"
                      style={{ top: `${((12 - db) / 24) * 100}%` }}
                    />
                  ))}
                  {/* Axis labels */}
                  {DB_AXIS.map((db) => (
                    <span
                      key={db}
                      className="absolute text-zinc-400 text-xs w-8 text-right pr-1 select-none"
                      style={{ top: `calc(${((12 - db) / 24) * 100}% - 0.5em)` }}
                    >
                      {db}
                    </span>
                  ))}
                </div>
                {/* Spacer for axis width */}
                <div className="w-8" />
              </div>
              {/* EQ Sliders */}
              <div className="flex flex-row items-end gap-2 relative z-20 h-full">
                {EQ_BANDS.map(band => (
                  <div key={band.key} className="flex flex-col items-center justify-end h-full">
                    <input
                      type="range"
                      min={band.min}
                      max={band.max}
                      step={band.step}
                      value={eq[band.key]}
                      onChange={e => setEq(eq => ({ ...eq, [band.key]: Number(e.target.value) }))}
                      className="h-28 w-3 accent-green-500 appearance-none bg-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ writingMode: 'vertical-lr', WebkitAppearance: 'slider-vertical', direction: 'rtl', height: SLIDER_HEIGHT }}
                    />
                    <label className="text-zinc-300 text-xs mt-1 select-none">{band.label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Toggle Button - always attached to the bottom of the panel */}
      <div
        className="fixed left-1/2 z-50 transform -translate-x-1/2"
        style={{ top: buttonTop, transition: 'top 0.5s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <button
          className="bg-black/60 text-white px-8 py-2 rounded-b-2xl shadow-lg hover:bg-black/80 transition flex items-center justify-center w-48 cursor-pointer"
          style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
        </button>
      </div>
    </>
  );
}