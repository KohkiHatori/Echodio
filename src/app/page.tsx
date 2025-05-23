// src/app/page.tsx
"use client";

import { Spinner } from "@/components/Spinner";
import UserLocationAndTime from "@/components/UserLocationAndTime";
// import MusicQueuePlayer from "@/components/MusicQueuePlayer";
import { usePollImage } from "@/hooks/usePollImage";
import { usePollMusic } from "@/hooks/usePollMusic";
import {
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Song {
  url: string;
  title: string | null;
}

export default function Home() {
  // 1) Splash loader state
  const [appLoading, setAppLoading] = useState(true);
  // 2) Player/UI states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [imageTaskId, setImageTaskId] = useState<string | null>(null);
  const [musicTaskId, setMusicTaskId] = useState<string | null>(null);
  const [currentBg, setCurrentBg] = useState("/forest-bg.png");
  const [nextBg, setNextBg] = useState<string | null>(null);
  const [isNextLoaded, setIsNextLoaded] = useState(false);
  const [, setMusicQueue] = useState<Song[]>([]);
    // const [musicQueue, setMusicQueue] = useState<Song[]>([]);



  // update logic:

  // Idle‐hide logic (unchanged)
  const resetIdle = () => {
    setShowUI(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setShowUI(false), 5000);
  };
  useEffect(() => {
    ["mousemove", "mousedown", "touchstart", "wheel"].forEach((e) =>
      window.addEventListener(e, resetIdle)
    );
    resetIdle();
    return () => {
      ["mousemove", "mousedown", "touchstart", "wheel"].forEach((e) =>
        window.removeEventListener(e, resetIdle)
      );
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // After 5s, trigger the fade
  useEffect(() => {
    const t = setTimeout(() => setAppLoading(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // Skip / play handlers
  const handleSkipBack = () => {/* … */ };
  const handleSkipForward = () => {/* … */ };
  const togglePlay = () => setIsPlaying((p) => !p);

  // This hook will poll the server every 3 seconds until the image is ready
  usePollImage(imageTaskId, setNextBg);
  usePollMusic(musicTaskId, (url, title) => {
    const newSong = { url, title };
    setMusicQueue((prev) => [...prev, newSong]);
  });

  useEffect(() => {
    if (isNextLoaded && nextBg) {
      const timeout = setTimeout(() => {
        setCurrentBg(nextBg);
        setNextBg(null);
        setIsNextLoaded(false);
      }, 2000); // match transition duration
      return () => clearTimeout(timeout);
    }
  }, [isNextLoaded, nextBg]);


  return (
    <>
      <UserLocationAndTime
        onContentLoaded={(data) => {
          if (data.imageTaskId) {
            setImageTaskId(data.imageTaskId)
          }
          if (data.musicTaskId) {
            setMusicTaskId(data.musicTaskId)
          }
        }}
      />
      {/* ─── SPLASH OVERLAY ─── */}
      <div
        className={`
          fixed inset-0 z-50 flex flex-col items-center justify-center
          bg-black text-white
          transition-opacity duration-700 ease-out
          ${appLoading ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <Image
          src={currentBg}
          alt="Background"
          fill
          className="absolute inset-0 object-cover blur-md opacity-50 -z-10"
          priority
        />
        <h1 className="text-3xl mb-4">Loading…</h1>
        <Spinner />
      </div>

      {/* ─── MAIN PLAYER UI ─── */}
      <div
        className={`
          relative h-screen w-screen overflow-hidden
          transition-opacity duration-700 ease-out
          ${appLoading ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        {/* Fullscreen background */}
        {/* <Image
          src={backgroundUrl}
          alt="Background"
          fill
          priority
          className="absolute inset-0 -z-10 object-cover"
        /> */}
        {/* Visible background image */}
        <Image
          src={currentBg}
          alt="Current Background"
          fill
          priority
          className="absolute inset-0 -z-20 object-cover transition-opacity duration-500 opacity-100"
        />

        {/* Fading-in next image */}
        {nextBg && (
          <Image
            src={nextBg}
            alt="Next Background"
            fill
            priority
            onLoad={() => setIsNextLoaded(true)}
            className={`absolute inset-0 -z-10 object-cover transition-opacity duration-[2000ms] ${isNextLoaded ? "opacity-100" : "opacity-0"
              }`}
          />
        )}
        {/* All other UI (idle‐fade, sidebar, controls) */}
        <div
          className={`
            ${showUI ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            transition-opacity duration-500
          `}
        >
          {/* Sidebar */}
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
              {/* …your toggles/genres… */}
            </div>
          </aside>

          {/* Open-sidebar button */}
          {!sidebarOpen && (
            <button
              className="fixed top-4 left-4 z-50 p-2 bg-black/50 rounded-full"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Top-right avatar + spinner pill */}
          <header className="fixed top-4 right-4 z-50">
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center space-y-2">
              <Link href="/auth">
                <Image
                  src="/avatar.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-white cursor-pointer"
                />
              </Link>
              <Spinner />
            </div>
          </header>

          {/* <MusicQueuePlayer songs={_musicQueue} /> */}

          {/* Bottom media controls */}
          <footer
            className="fixed bottom-4 z-50 w-[95%] max-w-4xl transition-all duration-500 ease-in-out"
            style={{
              left: sidebarOpen ? "calc(50vw + 8rem)" : "50vw",
              transform: "translateX(-50%)",
            }}
          >
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-6 py-4 flex flex-col space-y-3">
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
    </>
  );
}
