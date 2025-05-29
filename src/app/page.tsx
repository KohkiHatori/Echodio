// src/app/page.tsx
"use client";

// components
import DateWeatherHeader from "@/components/DateWeatherHeader";
import FullScreenMusicPlayer from "@/components/FullMusicPlyaer";
import SpectralAnalyzer from "@/components/SpectralAnalyzer";
import Sidebar from "@/components/Sidebar";
import Background from "@/components/Background";
import FavoriteButton from "@/components/FavoriteButton";

// hooks
import { useAppLoader } from "@/hooks/useAppLoader";
import { useIdleHideUI } from "@/hooks/useIdleHidUI";
import { usePollMusic } from "@/hooks/usePollMusic";
import { useUserFavorites, FavoriteSong } from "@/hooks/useUserFavorites";
import { useEffect, useRef, useState } from "react";
import LoadPage from "./load/page";
import SmallCityWeatherClockWidget from "@/components/CityWeatherClockWidget";
import { useLocationAndTime } from "@/hooks/useLocationAndTime";
import { useGenerate } from "@/hooks/useGenerate";

interface Song {
  url: string;
  title: string | null;
}

export default function Home() {
  // Splash loader state
  const [appLoading, setAppLoading] = useState(true);
  // Player/UI states
  const [showUI, setShowUI] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [imageTaskId, setImageTaskId] = useState<string | null>(null);
  const [musicTaskId, setMusicTaskId] = useState<string | null>(null);
  const [musicQueue, setMusicQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [overlayIcon, setOverlayIcon] = useState<'play' | 'pause' | null>(null);
  const [themeColor, setThemeColor] = useState<string>('rgb(17, 24, 39)');
  const { location, time, locationChecked } = useLocationAndTime();
  const { favorites, loadingFavorites, favoritesError, refreshFavorites } = useUserFavorites();

  // Call useGenerate unconditionally
  useGenerate({ setImageTaskId, setMusicTaskId, time, location, locationChecked });

  // Idle-hide UI
  useIdleHideUI(setShowUI);

  // Automatically hide loader after 5 seconds
  useAppLoader(setAppLoading);

  // Polling hooks
  usePollMusic(musicTaskId, (url, title) => {
    setMusicQueue((prev) => [...prev, { url, title }]);
    console.log("✅ Song added to queue:", { url, title });
  });

  // Background transition on new image

  useEffect(() => {
    console.log("🎵 Updated musicQueue:", musicQueue);
  }, [musicQueue]);


  return (
    <>
      {/* Loader Overlay */}
      <div
        className={
          `fixed inset-0 z-50 transition-opacity duration-700 ease-out ${appLoading ? "opacity-100" : "opacity-0 pointer-events-none"}`
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
          `fixed inset-0 transition-opacity duration-700 ease-out ${appLoading ? "opacity-0 pointer-events-none" : "opacity-100"}`
        }
        onClickCapture={(e) => {
          const clickedElement = e.target as HTMLElement;
          const isInteractive =
            clickedElement.closest('button') ||
            clickedElement.closest('a') ||
            clickedElement.closest('input') ||
            clickedElement.closest('aside');

          if (!isInteractive && musicQueue.length > 0) {
            const next = !isPlaying;
            setIsPlaying(next);
            setOverlayIcon(next ? 'play' : 'pause');
            setTimeout(() => setOverlayIcon(null), 1000);
          }
        }}
      >
        <audio
          ref={audioRef}
          src={
            musicQueue[0]?.url
              ? `/api/proxy-audio?url=${encodeURIComponent(musicQueue[0].url)}`
              : undefined
          }
          preload="auto"
          crossOrigin="anonymous"
          className="hidden"
        />

        {/* Background Images */}
        <Background
          imageTaskId={imageTaskId}
          setThemeColor={setThemeColor}
        />

        {/* UI Elements (sidebar, controls, etc.) */}
        <div
          className={
            `${showUI ? "opacity-100 pointer-events-auto z-20" : "opacity-0 pointer-events-none"} transition-opacity duration-500`
          }
        >
          <Sidebar
            themeColor={themeColor}
            favorites={favorites}
            loadingFavorites={loadingFavorites}
            favoritesError={favoritesError}
          />

          {/* Favorite Button */}
          <FavoriteButton
            musicTaskId={musicTaskId}
            imageTaskId={imageTaskId}
            onFavoriteChange={refreshFavorites}
          />

          {/* <Header
            musicTaskId={musicTaskId}
            imageTaskId={imageTaskId}
          /> */}
          <SmallCityWeatherClockWidget />

        </div>


        { /* */}
        <SpectralAnalyzer
          audioRef={audioRef}
          audioSrc={
            musicQueue[0]?.url
              ? `/api/proxy-audio?url=${encodeURIComponent(musicQueue[0].url)}`
              : undefined
          }
        />

      </div>
    </>
  );
}
