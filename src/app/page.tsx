// src/app/page.tsx
"use client";

// components
import FullScreenMusicPlayer from "@/components/FullMusicPlyaer";
import SpectralAnalyzer from "@/components/SpectralAnalyzer";
import UserLocationAndTime from "@/components/UserLocationAndTime";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

// hooks
import { usePollImage } from "@/hooks/usePollImage";
import { usePollMusic } from "@/hooks/usePollMusic";
import {
  Bars3Icon
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LoadPage from "./load/page";
import { useAuth } from "@/context/AuthContext";

interface Song {
  url: string;
  title: string | null;
}

export default function Home() {
  // Splash loader state
  const [appLoading, setAppLoading] = useState(true);
  // Player/UI states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarFullyClosed, setSidebarFullyClosed] = useState(true);
  const [showUI, setShowUI] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [imageTaskId, setImageTaskId] = useState<string | null>(null);
  const [musicTaskId, setMusicTaskId] = useState<string | null>(null);
  const [currentBg, setCurrentBg] = useState("/forest-bg.png");
  const [nextBg, setNextBg] = useState<string | null>(null);
  const [isNextLoaded, setIsNextLoaded] = useState(false);
  const [musicQueue, setMusicQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [overlayIcon, setOverlayIcon] = useState<'play' | 'pause' | null>(null);

  const { userId } = useAuth();

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

  // manage sidebar closing
  const closeSidebar = () => {
    setSidebarOpen(false);
    setSidebarFullyClosed(false);
    setTimeout(() => setSidebarFullyClosed(true), 500); // match the transition duration (500ms)
  };

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


  // In page.tsx (or wherever you define the test queue)
  const TestQueue: { url: string; title: string | null }[] = [
    {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      title: "SoundHelix Song 1",
    },
    {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      title: "SoundHelix Song 2",
    },
    {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      title: "SoundHelix Song 3",
    },
    {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      title: "SoundHelix Song 4",
    },
    {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      title: "SoundHelix Song 5",
    },
    {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      title: "SoundHelix Song 6",
    },
  ];


  return (
    <>
      {/* Loader Overlay */}
      <div
        className={
          `fixed inset-0 z-50 transition-opacity duration-700 ease-out ${appLoading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`
        }
      >
        <LoadPage />
      </div>
      {!appLoading && (
        <FullScreenMusicPlayer
          audioRef={audioRef}
          songs={TestQueue}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          overlayIcon={overlayIcon}
          setOverlayIcon={setOverlayIcon}
        />

      )}

      {/* Main UI Container */}
      <div
        className={
          `fixed inset-0 transition-opacity duration-700 ease-out ${appLoading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`
        }
        // onClick={togglePlay}
        onClickCapture={(e) => {
          const clickedElement = e.target as HTMLElement;
          const isInteractive =
            clickedElement.closest('button') ||
            clickedElement.closest('a') ||
            clickedElement.closest('input');

          if (!isInteractive) {
            const next = !isPlaying;
            setIsPlaying(next);
            setOverlayIcon(next ? 'play' : 'pause');
            setTimeout(() => setOverlayIcon(null), 1000);
          }
        }}
      >
        <audio
          ref={audioRef}
          src={TestQueue[0]?.url || undefined}
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
          className="absolute inset-0 z-0 object-cover transition-opacity duration-500 opacity-100"
        />
        {nextBg && (
          <Image
            src={nextBg}
            alt="Next Background"
            fill
            priority
            onLoad={() => setIsNextLoaded(true)}
            className={
              `absolute inset-0 z-0 object-cover transition-opacity duration-[2000ms] ${isNextLoaded ? "opacity-100" : "opacity-0"
              }`
            }
          />
        )}

        {/* UI Elements (sidebar, controls, etc.) */}
        <div
          className={
            `${showUI ? "opacity-100 pointer-events-auto z-20" : "opacity-0 pointer-events-none"} transition-opacity duration-500`
          }
        >
          <Sidebar />

          <Header
            musicTaskId={musicTaskId}
            imageTaskId={imageTaskId}
          />

        </div>
        <SpectralAnalyzer />
      </div>
    </>
  );
}
