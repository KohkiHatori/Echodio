// src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Spinner } from "@/components/Spinner";
import {
  PlayIcon,
  PauseIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetIdle = () => {
    setShowUI(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setShowUI(false), 5000);
  };

  useEffect(() => {
    const events = ["mousemove", "mousedown", "touchstart", "wheel"];
    events.forEach((e) => window.addEventListener(e, resetIdle));
    resetIdle();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdle));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const handleSkipBack = () => {
    // TODO: implement skip back logic
  };
  const handleSkipForward = () => {
    // TODO: implement skip forward logic
  };
  const togglePlay = () => setIsPlaying((p) => !p);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Fullscreen background */}
      <Image
        src="/forest-bg.png"
        alt="Background"
        fill
        priority
        className="absolute inset-0 -z-10 object-cover"
      />

      {/* All UI fades out on idle */}
      <div
        className={`
          ${showUI ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          transition-opacity duration-500
        `}
      >
        {/* Sidebar (push‐aside) */}
        <aside
          className={`
            fixed top-0 left-0 h-full w-64 bg-gray-900 text-white
            transform transition-transform duration-500 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <button
            className="absolute top-4 left-4 p-2"
            onClick={() => setSidebarOpen(false)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <div className="pt-16 px-6 space-y-6">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-toggle" />
              <span>インストゥルメンタル</span>
            </label>

            <div>
              <h4 className="mb-2">ジャンル</h4>
              <ul className="space-y-1">
                {["ジャズ", "ロック", "クラシック", "ポップ", "ヒップホップ"].map(
                  (g) => (
                    <li key={g} className="px-3 py-1 bg-gray-800 rounded">
                      {g}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </aside>

        {/* Open button */}
        {!sidebarOpen && (
          <button
            className="fixed top-4 left-4 z-50 p-2 bg-black/50 rounded-full"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Top‐right user + spinner pill */}
        <header className="fixed top-4 right-4 z-50">
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center space-y-2">
            <Image
              src="/avatar.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full ring-2 ring-white"
            />
            <Spinner />
          </div>
        </header>

        {/* Media controls */}
        <footer
          className="fixed bottom-4 z-50 w-[95%] max-w-4xl transition-all duration-500 ease-in-out"
          style={{
            left: sidebarOpen ? "calc(50vw + 8rem)" : "50vw",
            transform: "translateX(-50%)",
          }}
        >
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-6 py-4 flex flex-col space-y-3">
            {/* top row: time – skip back – play/pause – skip forward – duration */}
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">0:12</span>
              <div className="flex items-center space-x-4">
                <button onClick={handleSkipBack}>
                  <ChevronLeftIcon className="w-6 h-6 text-white" />
                </button>
                <button onClick={togglePlay}>
                  {isPlaying ? (
                    <PauseIcon className="w-8 h-8 text-white" />
                  ) : (
                    <PlayIcon className="w-8 h-8 text-white" />
                  )}
                </button>
                <button onClick={handleSkipForward}>
                  <ChevronRightIcon className="w-6 h-6 text-white" />
                </button>
              </div>
              <span className="text-white text-sm">2:00</span>
            </div>

            {/* progress bar */}
            <div className="h-1 bg-white/30 rounded-full overflow-hidden w-full">
              <div
                className="h-full bg-white"
                style={{ width: `${(12 / 120) * 100}%` }}
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
