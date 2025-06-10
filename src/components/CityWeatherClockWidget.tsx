'use client';
import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePushpin, AiFillPushpin } from "react-icons/ai";
import { setWeatherWidgetResizing } from '../app/utils/handleClickCapture';
import { MdPushPin } from "react-icons/md";


type WeatherData = {
  name: string;
  weather: { icon: string }[];
  sys: { country: string };
  timezone: number;
  dt: number;
};

export default function SmallCityWeatherClockWidget({ onPinChange, pinned }: { onPinChange?: (pinned: boolean) => void, pinned?: boolean }) {

  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  // Resize state
  const [size, setSize] = useState({ width: 184, height: 110 });
  const [resizing, setResizing] = useState(false);
  const resizeStart = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // Data state
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [localTime, setLocalTime] = useState<Date | null>(null);

  // Calculate scale factor for contents
  const minWidth = 184;
  const minHeight = 110;
  const maxWidth = 368;
  const maxHeight = 220;
  const scale = size.width / minWidth;

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {

    // Prevent drag if resizing
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return;
    setDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: position.x,
      offsetY: position.y,
    };
    document.body.style.userSelect = 'none';
  };
  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition({
        x: dragStart.current.offsetX + dx,
        y: dragStart.current.offsetY + dy,
      });
    };
    const handleMouseUp = () => {
      setDragging(false);
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  // Resize handlers
  useEffect(() => {
    if (!resizing) return;
    const aspectRatio = 184 / 110;
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStart.current) return;
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      // Calculate new width and height while maintaining aspect ratio
      let newWidth = resizeStart.current.width + dx;
      let newHeight = resizeStart.current.height + dy;
      // Determine which delta is larger in terms of aspect ratio
      if (Math.abs(dx) > Math.abs(dy * aspectRatio)) {
        // Width change dominates
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        newHeight = Math.max(minHeight, Math.min(maxHeight, newWidth / aspectRatio));
      } else {
        // Height change dominates
        newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
        newWidth = Math.max(minWidth, Math.min(maxWidth, newHeight * aspectRatio));
      }
      setSize({
        width: newWidth,
        height: newHeight,
      });
    };
    const handleMouseUp = () => {
      document.body.style.userSelect = '';
      setResizing(false);
      window.__weatherWidgetJustResized = true;
      // setTimeout to clear the flag after the event loop, so click/capture can see it
      setTimeout(() => {
        window.__weatherWidgetJustResized = false;
      }, 0);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      setWeatherWidgetResizing(false);
    };
  }, [resizing]);

  // Fetch geolocation & weather
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        fetch('/api/weather', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location: coords }),
        })
          .then((res) => res.json())
          .then((data: WeatherData) => {
            setWeather(data);
            // Always use Japan time (JST: UTC+9)
            const now = new Date();
            const utc = now.getTime() + now.getTimezoneOffset() * 60000;
            const jst = new Date(utc + 9 * 60 * 60000);
            setLocalTime(jst);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      },
      () => setLoading(false)
    );
  }, []);

  // This keeps the JST clock updating every second
  useEffect(() => {
    if (!weather) return;
    const interval = setInterval(() => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const jst = new Date(utc + 9 * 60 * 60000);
      setLocalTime(jst);
    }, 1000);
    return () => clearInterval(interval);
  }, [weather]);

  // Formatters
  const city = weather?.name
    ? weather.name.charAt(0).toUpperCase() + weather.name.slice(1)
    : "";
  const dateStr = localTime
    ? localTime.toLocaleDateString('en-US', {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Tokyo",
    })
    : "";
  const timeStr = localTime
    ? localTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: "Asia/Tokyo" })
    : "";
  const weatherIcon = weather?.weather[0]?.icon
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`
    : null;

  // SVGs for pin icon

  return (
    <div
      className="city-weather-clock-widget relative flex items-center justify-center rounded-[24px] overflow-hidden shadow-lg mt-5 ml-315 cursor-move"
      style={{
        left: position.x,
        top: position.y,
        position: 'fixed',
        zIndex: 100,
        width: size.width,
        height: size.height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative z-10 w-[88%] h-[84%] bg-black/30 rounded-[16px] flex flex-col justify-between p-2" style={{ fontSize: `${scale}em` }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full w-full text-white" style={{ fontSize: `${1 * scale}em` }}>
            Loading...
          </div>
        ) : weather && localTime ? (
          <>
            {/* City, date, pin, weather icon row */}
            <div className="flex items-start justify-between mb-1">
              {/* Left: city, date, weather icon */}
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-white font-bold leading-tight" style={{ fontSize: `${1 * scale}rem` }}>
                    {city}
                  </div>
                  <div className="text-white opacity-90 flex items-center gap-1" style={{ fontSize: `${0.75 * scale}rem` }}>
                    {dateStr}
                  </div>
                </div>
                {weatherIcon && (
                  <img
                    src={weatherIcon}
                    alt=""
                    width={40 * scale}
                    height={40 * scale}
                    style={{ filter: "drop-shadow(0 0 2px #fff6)", userSelect: 'none' }}
                    draggable={false}
                  />
                )}
              </div>
              {/* Right: push pin icon */}
              <button
                type="button"
                aria-label={pinned ? "Unpin widget" : "Pin widget"}
                tabIndex={0}
                className={`ml-1 focus:outline-none ${pinned ? 'text-yellow-400' : 'text-white'} hover:scale-110 transition-transform`}
                style={{ background: 'none', border: 'none', padding: 0, lineHeight: 0, display: 'flex', alignItems: 'center' }}
                onClick={e => {
                  e.stopPropagation();
                  if (onPinChange) onPinChange(!pinned);
                }}
              >
                {pinned ? (
                  <AiFillPushpin className="w-5*scale h-5*scale text-yellow-400" />
                ) : (
                  <AiOutlinePushpin className="w-5*scale h-5*scale text-white" />
                )}
              </button>
            </div>
            {/* Time */}
            <div className="flex-1 flex items-end">
              <span
                className="text-white font-bold leading-tight"
                style={{ fontSize: `${1.8 * scale}rem` }}
              >
                {timeStr}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full text-white" style={{ fontSize: `${1 * scale}em` }}>
            Failed to load
          </div>
        )}
      </div>
      {/* Resize handle */}
      <div
        className="resize-handle absolute right-1 bottom-1 w-4 h-4 bg-white/50 rounded cursor-nwse-resize z-20"
        onMouseDown={e => {
          e.stopPropagation();
          document.body.style.userSelect = 'none';
          setResizing(true);
          setWeatherWidgetResizing(true);
          resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height,
          };
        }}
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
}