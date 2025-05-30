// src/app/page.tsx
"use client";

// components
import DateWeatherHeader from "@/components/DateWeatherHeader";
import FullScreenMusicPlayer from "@/components/FullMusicPlyaer";
import SpectralAnalyzer from "@/components/SpectralAnalyzer";
import Sidebar from "@/components/Sidebar";
import Background from "@/components/Background";
import FavoriteButton from "@/components/FavoriteButton";
import ControlCenter from "@/components/ControlCenter";

// hooks
import { useAppLoader } from "@/hooks/useAppLoader";
import { useIdleHideUI } from "@/hooks/useIdleHidUI";
import { usePollMusic } from "@/hooks/usePollMusic";
import { useUserFavorites } from "@/hooks/useUserFavorites";
import { useEffect, useRef, useState, useCallback } from "react";
import LoadPage from "./load/page";
import SmallCityWeatherClockWidget from "@/components/CityWeatherClockWidget";
import { useLocationAndTime } from "@/hooks/useLocationAndTime";
import { useGenerate } from "@/hooks/useGenerate";
import { useAudioPlaybackManager } from "@/hooks/useAudioPlaybackManager";

interface Song {
  url: string;
  title: string | null;
  task_id: string;
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
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [musicQueue, setMusicQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [overlayIcon, setOverlayIcon] = useState<'play' | 'pause' | null>(null);
  const [themeColor, setThemeColor] = useState<string>('rgb(17, 24, 39)');
  const { location, time, locationChecked } = useLocationAndTime();
  const { favorites, loadingFavorites, favoritesError, refreshFavorites } = useUserFavorites();

  useGenerate({ setImageTaskId, setMusicTaskId, time, location, locationChecked, imageTaskId, musicQueue });

  useAudioPlaybackManager({ audioRef, currentSong, isPlaying });

  // Idle-hide UI
  useIdleHideUI(setShowUI);

  // Automatically hide loader after 5 seconds
  useAppLoader(setAppLoading);

  // Polling hooks
  usePollMusic(musicTaskId, (url, title, task_id) => {
    const newSong = { url, title, task_id };
    // Don't change the current song if the queue already has a song.
    if (musicQueue.length === 0) {
      setCurrentSong(newSong);
    }
    setMusicQueue((prev) => [...prev, newSong]);
    console.log("✅ Song added to queue:", newSong);
  });
  // Callback for FullScreenMusicPlayer to change the current song

  // Background transition on new image

  useEffect(() => {
    console.log("🎵 Updated musicQueue:", musicQueue);
  }, [musicQueue]);

  useEffect(() => {
    console.log("💿 current song:", currentSong);
  }, [currentSong]);


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
          currentSong={currentSong}
          onSongChange={setCurrentSong}
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

          // Prevent toggle if click is in bottom fifth of the screen
          const windowHeight = window.innerHeight;
          const clickY = (e as React.MouseEvent).clientY;
          const isBottomFifth = clickY > windowHeight * 0.8;

          // Prevent toggle if click is on CityWeatherClockWidget
          const isWeatherWidget = clickedElement.closest('.city-weather-clock-widget');

          if (!isInteractive && !isBottomFifth && !isWeatherWidget && currentSong) {
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
            currentSong?.url
              ? `/api/proxy-audio?url=${encodeURIComponent(currentSong.url)}`
              : undefined
          }
          preload="auto"
          crossOrigin="anonymous"
          className="hidden"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
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
          <ControlCenter audioRef={audioRef} />
          <Sidebar
            themeColor={themeColor}
            favorites={favorites}
            loadingFavorites={loadingFavorites}
            favoritesError={favoritesError}
          />

          {/* Favorite Button */}
          <FavoriteButton
            musicTaskId={currentSong?.task_id ?? null}
            imageTaskId={imageTaskId}
            onFavoriteChange={refreshFavorites}
          />

          <SmallCityWeatherClockWidget />


        </div>


        { /* */}
        <SpectralAnalyzer
          audioRef={audioRef}
          audioSrc={
            currentSong?.url
              ? `/api/proxy-audio?url=${encodeURIComponent(currentSong.url)}`
              : undefined
          }
        />
      </div>
      {/* Show current song title if available */}
      {currentSong?.title ? (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] max-w-[90vw] text-center break-words">
          <p className="text-white text-4xl font-semibold font-mono">{currentSong.title}</p>
        </div>
      ) : null}
    </>
  );
}
