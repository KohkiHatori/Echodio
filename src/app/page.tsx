// src/app/page.tsx
"use client";

import LoadPage from "./load/page";
import { Spinner } from "@/components/Spinner";
import UserLocationAndTime from "@/components/UserLocationAndTime";
import SpectralAnalyzer from "@/components/SpectralAnalyzer";
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
  // Splash loader state
  const [appLoading, setAppLoading] = useState(true);
  // Player/UI states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [overlayIcon, setOverlayIcon] = useState<"play" | "pause" | null>(null);
  const [showUI, setShowUI] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [imageTaskId, setImageTaskId] = useState<string | null>(null);
  const [musicTaskId, setMusicTaskId] = useState<string | null>(null);
  const [currentBg, setCurrentBg] = useState("/forest-bg.png");
  const [nextBg, setNextBg] = useState<string | null>(null);
  const [isNextLoaded, setIsNextLoaded] = useState(false);
  const [musicQueue, setMusicQueue] = useState<Song[]>([]);

  // Idle-hide UI
  useEffect(() => {
    const resetIdle = () => {
      setShowUI(true);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setShowUI(false), 5000);
    };
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

  // Automatically hide loader after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Skip / play handlers
  const handleSkipBack = () => {
    // TODO: implement skip back logic
  };
  const handleSkipForward = () => {
    // TODO: implement skip forward logic
  };
  const togglePlay = () => {
    if (!audioRef.current) return;
    const next = !isPlaying;
    if (next) {
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(next);
    setOverlayIcon(next ? "play" : "pause");
    setTimeout(() => setOverlayIcon(null), 1000);
  };

  // Space key toggles play/pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying]);

  // Polling hooks
  usePollImage(imageTaskId, setNextBg);
  usePollMusic(musicTaskId, (url, title) => {
    setMusicQueue((prev) => [...prev, { url, title }]);
  });

  // Background transition on new image
  useEffect(() => {
    if (isNextLoaded && nextBg) {
      const t = setTimeout(() => {
        setCurrentBg(nextBg);
        setNextBg(null);
        setIsNextLoaded(false);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [isNextLoaded, nextBg]);

  return (
    <>
      {/* Loader Overlay */}
      <div
        className={
          `fixed inset-0 z-50 transition-opacity duration-700 ease-out ${
            appLoading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`
        }
      >
        <LoadPage />
      </div>

      {/* Main UI Container */}
      <div
        className={
          `fixed inset-0 transition-opacity duration-700 ease-out ${
            appLoading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`
        }
        onClick={togglePlay}
      >
        <audio
          ref={audioRef}
          src={musicQueue[0]?.url || undefined}
          preload="auto"
          className="hidden"
        />
        <UserLocationAndTime
          onContentLoaded={(data) => {
            if (data.imageTaskId) setImageTaskId(data.imageTaskId);
            if (data.musicTaskId) setMusicTaskId(data.musicTaskId);
          }}
        />

        {/* Background Images */}
        <Image
          src={currentBg}
          alt="Background"
          fill
          priority
          className="absolute inset-0 -z-20 object-cover transition-opacity duration-500 opacity-100"
        />
        {nextBg && (
          <Image
            src={nextBg}
            alt="Next Background"
            fill
            priority
            onLoad={() => setIsNextLoaded(true)}
            className={
              `absolute inset-0 -z-10 object-cover transition-opacity duration-[2000ms] ${
                isNextLoaded ? "opacity-100" : "opacity-0"
              }`
            }
          />
        )}

        {/* UI Elements (sidebar, controls, etc.) */}
        <div
          className={
            `${showUI ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-500`
          }
        >
          {/* Sidebar */}
          <aside
            className={
              `fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-500 ease-in-out ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
            }
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 left-4 p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(false);
              }}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <div className="pt-16 px-6 space-y-6">
              {/* Genre filters... */}
            </div>
          </aside>

          {/* Open Sidebar Button */}
          {!sidebarOpen && (
            <button
              className="fixed top-4 left-4 z-50 p-2 bg-black/50 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(true);
              }}
            >
              <Bars3Icon className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Header (Avatar + Spinner) */}
          <header
            className="fixed top-4 right-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
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

          {/* Left arrow */}
          <button
            className="fixed top-1/2 transform -translate-y-1/2 z-50 p-2 bg-black/50 rounded-full transition-all duration-500 ease-in-out"
            style={{ left: sidebarOpen ? "calc(16rem + 1rem)" : "1rem" }}
            onClick={(e) => {
              e.stopPropagation();
              handleSkipBack();
            }}
          >
            <ChevronLeftIcon className="w-8 h-8 text-white" />
          </button>

          {/* Right arrow */}
          <button
            className="fixed top-1/2 transform -translate-y-1/2 right-4 z-50 p-2 bg-black/50 rounded-full transition-all duration-500 ease-in-out"
            onClick={(e) => {
              e.stopPropagation();
              handleSkipForward();
            }}
          >
            <ChevronRightIcon className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Play/Pause Overlay */}
        {overlayIcon && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            {overlayIcon === "play" ? (
              <PlayIcon className="w-16 h-16 text-white animate-pulse" />
            ) : (
              <PauseIcon className="w-16 h-16 text-white animate-pulse" />
            )}
          </div>
        )}
      </div>
      <SpectralAnalyzer
        audioRef={audioRef}
        isPlaying={isPlaying}
        height={128}
        barCount={128}
      />
    </>
  );
}
