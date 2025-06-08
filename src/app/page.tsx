// src/app/page.tsx
"use client";

// components
import Background from "@/components/Background";
import FavoriteButton from "@/components/FavoriteButton";
import FullScreenMusicPlayer from "@/components/FullMusicPlyaer";
import Sidebar from "@/components/Sidebar";
import SpectralAnalyzer from "@/components/SpectralAnalyzer";
import { motion } from "framer-motion";

// hooks
import { handleMainUIClickCapture } from "@/app/utils/handleClickCapture";
import SmallCityWeatherClockWidget from "@/components/CityWeatherClockWidget";
import VolumeControl from "@/components/VolumeBar";
import { useAppLoader } from "@/hooks/useAppLoader";
import { useAudioPlaybackManager } from "@/hooks/useAudioPlaybackManager";
import { useGenerate } from "@/hooks/useGenerate";
import { useIdleHideUI } from "@/hooks/useIdleHidUI";
import { useLocationAndTime } from "@/hooks/useLocationAndTime";
import { usePollMusic } from "@/hooks/usePollMusic";
import { useUserFavorites } from "@/hooks/useUserFavorites";
import "@fontsource/space-grotesk/500.css";
import { useEffect, useRef, useState } from "react";
import LoadPage from "./load/page";

interface Song {
  url: string;
  title: string | null;
  task_id: string;
}

export default function Home() {
  const isFadingOut = useRef(false);

  function fadeOut(audio: HTMLAudioElement, duration = 5) {
    if (!audio) return;
    const startVolume = audio.volume;
    const steps = 50;
    const stepTime = (duration * 1000) / steps;
    let currentStep = 0;

    function fade() {
      currentStep++;
      const newVolume = startVolume * (1 - currentStep / steps);
      audio.volume = Math.max(newVolume, 0);
      console.log('FADE STEP:', currentStep, 'volume:', audio.volume, 'currentTime:', audio.currentTime);
      if (currentStep < steps) {
        setTimeout(fade, stepTime);
      }
    }
    fade();
  }

  // TEMP: Instantly drop volume for testing
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      (window as any).testInstantDrop = () => {
        audio.volume = 0.1;
        console.log("Instant drop! Volume now:", audio.volume);
      };
    }
  }, []);

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
  const { location, time, locationChecked, refreshLocationAndTime } = useLocationAndTime();
  const { favorites, loadingFavorites, favoritesError, refreshFavorites } = useUserFavorites();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProgressTime, setShowProgressTime] = useState(true);
  const [widgetPinned, setWidgetPinned] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('Ambient');

  useGenerate({ setImageTaskId, setMusicTaskId, time, location, locationChecked, musicQueue, refreshLocationAndTime, selectedGenre });

  useAudioPlaybackManager({ audioRef, isPlaying, songs: musicQueue, currentIndex, setIsPlaying, setCurrentIndex, setOverlayIcon });

  // Idle-hide UI
  useIdleHideUI(setShowUI);
  useIdleHideUI(setShowProgressTime);

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
          isSidebarOpen={isSidebarOpen}
          showUI={showUI}
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
          onTimeUpdate={() => {
            const audio = audioRef.current;
            if (
              audio &&
              audio.duration &&
              audio.duration - audio.currentTime < 5 &&
              !(audio as any)._fadingOut
            ) {
              (audio as any)._fadingOut = true;
              fadeOut(audio, 5); // fade for the full last 5 seconds
            }
          }}
          onPause={() => {
            const audio = audioRef.current;
            if (audio) {
              (audio as any)._fadingOut = false;
              audio.volume = 1; // restore volume when playback resumes
            }
            setIsPlaying(false);
          }}
          onPlay={() => {
            const audio = audioRef.current;
            if (audio) audio.volume = 1; // always start at full volume
            setIsPlaying(true);
          }}
        />

        {/* Background Images */}
        <Background
          imageTaskId={imageTaskId}
          setThemeColor={setThemeColor}
          currentIndex={currentIndex}
        />

        {/* Weather/Clock Widget: always mounted, controls its own visibility */}
        <div
          className={
            `${widgetPinned || showUI
              ? "opacity-100 pointer-events-auto z-20"
              : "opacity-0 pointer-events-none"} transition-opacity duration-500`
          }
        >
          <SmallCityWeatherClockWidget
            pinned={widgetPinned}
            onPinChange={setWidgetPinned}
          />
        </div>



        {/* UI Elements (sidebar, controls, etc.) */}
        <div
          className={
            `${showUI ? "opacity-100 pointer-events-auto z-20" : "opacity-0 pointer-events-none"} transition-opacity duration-500`
          }
        >
          <Sidebar
            themeColor={themeColor}
            favorites={favorites.map(fav => ({
              ...fav,
              favoritedAt: fav.favoritedAt ? new Date(fav.favoritedAt).getTime() : 0
            }))}
            loadingFavorites={loadingFavorites}
            favoritesError={favoritesError}
            setMusicQueue={setMusicQueue}
            currentIndex={currentIndex}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            onOpenChange={setIsSidebarOpen}
          />

          {musicQueue[currentIndex]?.title && (
            <div
              className="fixed top-6 z-[100] text-white text-xl font-semibold max-w-[30vw] truncate transition-[left] duration-500 flex items-baseline justify-between"
              style={{
                left: isSidebarOpen ? "288px" : "80px", // adjust if your sidebar is not 72 (288px)
                fontFamily: "'Space Grotesk', sans-serif",
                mixBlendMode: "difference"
              }}
            >
              <div className=""
                style={{
                  mixBlendMode: "difference",
                }}>
                {musicQueue[currentIndex].title}
              </div>


            </div>
          )}

          <div className="fixed transition-[left] duration-500"
            style={{
              left: isSidebarOpen ? "388px" : "180px", // adjust if your sidebar is not 72 (288px)
              mixBlendMode: "difference",
            }}>

            <VolumeControl audioRef={audioRef} isSidebarOpen={isSidebarOpen} />
          </div>

          {/* Favorite Button */}
          <FavoriteButton
            musicTaskId={musicQueue[currentIndex]?.task_id ?? null}
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
          isSidebarOpen={isSidebarOpen}
          showProgressTime={showProgressTime}
          themeColor={themeColor}

        />
      </div>
      {/* Centered Logo/Text Block: always mounted, animated on load */}
      <motion.div
        className="fixed top-1/2 left-[46%] -translate-x-1/2 -translate-y-1/2 z-[100] max-w-[50vw] text-center pointer-events-none"
        initial={appLoading ? { scale: 1.6, filter: "blur(6px) brightness(2)", opacity: 0 } : false}
        animate={{
          scale: 1,
          filter: "blur(0px) brightness(1)",
          opacity: 1,
        }}
        style={{ mixBlendMode: "exclusion", }}
        transition={{ type: "spring", duration: 1.2, bounce: 0.25 }}
      >
        <div className="flex flex-row items-center justify-center gap-6">
          <img src="/logo.png" alt="Logo" className="w-48 h-48 object-contain" />
          <motion.p
            className="ml-[-3.5rem] text-white text-4xl font-semibold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            initial={{ y: 50, opacity: 0, filter: "blur(6px)" }}
            animate={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                delay: 1.3,      // Or your preferred delay
                duration: 0.8,   // Or your preferred duration
                type: "spring",
                bounce: 0.35,
              }
            }}
          >
            Echodio
          </motion.p>
        </div>
      </motion.div>
    </>
  );
}