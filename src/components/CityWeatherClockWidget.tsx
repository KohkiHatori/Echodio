'use client';
import React, { useState, useRef, useEffect } from "react";

type WeatherData = {
  name: string;
  weather: { icon: string }[];
  sys: { country: string };
  timezone: number;
  dt: number;
};

export default function SmallCityWeatherClockWidget() {
  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  // Data state
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [localTime, setLocalTime] = useState<Date | null>(null);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
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

  return (
    <div
      className="city-weather-clock-widget relative w-[184px] h-[110px] flex items-center justify-center rounded-[24px] overflow-hidden shadow-lg mt-5 ml-315 cursor-move"
      style={{ left: position.x, top: position.y, position: 'fixed', zIndex: 100 }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative z-10 w-[88%] h-[84%] bg-black/30 rounded-[16px] flex flex-col justify-between p-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full w-full text-white">
            Loading...
          </div>
        ) : weather && localTime ? (
          <>
            {/* City, date, weather icon row */}
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="text-white font-bold text-[1rem] leading-tight">
                  {city}
                </div>
                <div className="text-white text-xs opacity-90">{dateStr}</div>
              </div>
              {weatherIcon && (
                <img
                  src={weatherIcon}
                  alt=""
                  width={22}
                  height={22}
                  style={{ filter: "drop-shadow(0 0 2px #fff6)" }}
                />
              )}
            </div>
            {/* Time */}
            <div className="flex-1 flex items-end">
              <span className="text-white text-3xl font-bold leading-tight">{timeStr}</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full text-white">
            Failed to load
          </div>
        )}
      </div>
    </div>
  );
}