// src/app/page.tsx
"use client";

// components
import DateWeatherHeader from "@/components/DateWeatherHeader";
import FullScreenMusicPlayer from "@/components/FullMusicPlyaer";
import Sidebar from "@/components/Sidebar";
import SpectralAnalyzer from "@/components/SpectralAnalyzer";
import UserLocationAndTime from "@/components/UserLocationAndTime";

// hooks
import { useAuth } from "@/context/AuthContext";
import { useAppLoader } from "@/hooks/useAppLoader";
import { useIdleHideUI } from "@/hooks/useIdleHidUI";
import { usePollImage } from "@/hooks/usePollImage";
import { usePollMusic } from "@/hooks/usePollMusic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LoadPage from "./load/page";

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
  useIdleHideUI(setShowUI);

  // Automatically hide loader after 5 seconds
  useAppLoader(setAppLoading);

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
    console.log("✅ Song added to queue:", { url, title });
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

  useEffect(() => {
  console.log("🎵 Updated musicQueue:", musicQueue);
}, [musicQueue]);


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
          songs={musicQueue}
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
          src={musicQueue[0]?.url || undefined}
          preload="auto"
          className="hidden"
        />
        <UserLocationAndTime
          onContentLoaded={(data) => {
            if (data.imageTaskId) setImageTaskId(data.imageTaskId);
              if (data.musicTaskId) {
                setMusicTaskId(data.musicTaskId);  // This triggers usePollMusic again
              }
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

          {/* <Header
            musicTaskId={musicTaskId}
            imageTaskId={imageTaskId}
          /> */}
          <DateWeatherHeader/>

        </div>
        <SpectralAnalyzer />
      </div>
    </>
  );
}
