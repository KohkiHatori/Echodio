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
import { handleMainUIClickCapture } from "@/app/utils/handleClickCapture";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [musicQueue, setMusicQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [overlayIcon, setOverlayIcon] = useState<'play' | 'pause' | null>(null);
  const [themeColor, setThemeColor] = useState<string>('rgb(17, 24, 39)');
  const { location, time, locationChecked } = useLocationAndTime();
  const { favorites, loadingFavorites, favoritesError, refreshFavorites } = useUserFavorites();

  useGenerate({ setImageTaskId, setMusicTaskId, time, location, locationChecked, imageTaskId, musicQueue });

  useAudioPlaybackManager({ audioRef, isPlaying, songs: musicQueue, currentIndex, setIsPlaying, setCurrentIndex, setOverlayIcon });

  // Idle-hide UI
  useIdleHideUI(setShowUI);

  // Automatically hide loader after 5 seconds
  useAppLoader(setAppLoading);

  // Polling hooks
  usePollMusic(musicTaskId, (url, title, task_id) => {
    const newSong = { url, title, task_id };
    // If the queue is empty, set current song and start playing
    if (musicQueue.length === 0) {
      setIsPlaying(true); // Start playing automatically
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
    console.log("💿 current song:", musicQueue[currentIndex]);
  }, [currentIndex]);


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
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          length={musicQueue.length}
          overlayIcon={overlayIcon}
        />

      )}

      {/* Main UI Container */}
      <div
        className={
          `fixed inset-0 transition-opacity duration-700 ease-out ${appLoading ? "opacity-0 pointer-events-none" : "opacity-100"}`
        }
        onClickCapture={(e) =>
          handleMainUIClickCapture(e, {
            setIsPlaying,
            setOverlayIcon,
            musicQueue,
            currentIndex,
          })
        }
      >
        <audio
          ref={audioRef}
          src={
            musicQueue[currentIndex]?.url
              ? `/api/proxy-audio?url=${encodeURIComponent(musicQueue[currentIndex].url)}`
              : undefined
          }
          preload="auto"
          crossOrigin="anonymous"
          className="hidden"
          // Not strictly necessary, but it's a good practice to set isPlaying to true when the audio starts playing
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

          <SmallCityWeatherClockWidget />

          {/* Favorite Button */}
          <FavoriteButton
            musicTaskId={musicQueue[currentIndex]?.task_id ?? null}
            imageTaskId={imageTaskId}
            onFavoriteChange={refreshFavorites}
          />




        </div>


        { /* */}
        <SpectralAnalyzer
          audioRef={audioRef}
          audioSrc={
            musicQueue[currentIndex]?.url
              ? `/api/proxy-audio?url=${encodeURIComponent(musicQueue[currentIndex].url)}`
              : undefined
          }
        />
      </div>
      {/* Show current song title if available */}
      {musicQueue[currentIndex]?.title ? (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] max-w-[50vw] text-left break-words">
          <div className="flex items-center gap-1">
            <img src="/logo.png" alt="Logo" className="w-48 h-48 object-contain" />
            <p className="ml-[-2rem] text-white text-4xl font-semibold font-mono break-words whitespace-pre-line">
              {(() => {
                const words = musicQueue[currentIndex].title?.split(" ") || [];
                const mid = Math.ceil(words.length / 2);
                const firstLine = words.slice(0, mid).join(" ");
                const secondLine = words.slice(mid).join(" ");
                return (
                  <>
                    {firstLine}
                    <br />
                    {secondLine}
                  </>
                );
              })()}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
