// src/components/DateWeatherHeader.tsx
'use client';

import React from 'react';
import { MdWbSunny } from "react-icons/md";

interface DateWeatherHeaderProps {
  month?: string;
  dayNum?: number | string;
  weekday?: string;
  temp?: string;
  feelsLike?: string;
  conditions?: string;
  wind?: string;
  humidity?: string;
  precipitation?: string;
  time?: string;
  battery?: string;
  batteryTime?: string;
}

export default function DateWeatherHeader({
  month = "April",
  dayNum = 17,
  weekday = "Thursday",
  temp = "49°F",
  feelsLike = "47°F",
  conditions = "Clear Sky",
  wind = "5.37 mph W",
  humidity = "64%",
  precipitation = "0.00 in",
  time = "11:10 PM",
  battery = "30%",
  batteryTime = "9.9h",
}: DateWeatherHeaderProps) {
  return (
    <div className="flex bg-gradient-to-br from-black/80 to-zinc-900/70 w-70 rounded-xl p-4 shadow-lg relative overflow-hidden ml-305 mt-3"
      style={{ height: 270 }}
    >
      {/* Vertical month */}
      <div className="flex flex-col items-center justify-center pr-4">
        <div className="flex flex-col h-full">
          <span className="tracking-widest text-white/80 text-base font-light select-none" style={{ writingMode: "vertical-lr", letterSpacing: "0.12em" }}>
            {month}
          </span>
        </div>
        <div className="w-1 h-32 bg-gradient-to-b from-red-500 to-transparent mt-1 rounded" />
      </div>

      {/* Right main content */}
      <div className="flex-1 flex flex-col justify-center space-y-1 text-white pl-3">
        {/* Date and day */}
        <div className="flex flex-col">
          <span className="text-4xl font-thin tracking-tight">{dayNum}</span>
          <span className="text-lg font-light mt-[-0.3rem]">{weekday}</span>
        </div>
        <div className="absolute top-6 right-6 z-10 text-6xl text-yellow-400 drop-shadow-md">
            <MdWbSunny />
        </div>

        {/* Weather summary */}
        <div className="mt-2 text-sm space-y-1 font-light">
          <div>
            <span className="text-zinc-300">Current Temp:</span> <span className="font-semibold">{temp}</span>
          </div>
          <div>
            <span className="text-zinc-300">Conditions:</span> <span className="font-semibold">{conditions}</span>
          </div>
          <div>
            <span className="text-zinc-300">Wind Speed:</span> <span className="font-semibold">{wind}</span>
          </div>
          <div>
            <span className="text-zinc-300">Humidity:</span> <span className="font-semibold">{humidity}</span>
          </div>
        </div>

        {/* Footer: time and battery */}
        <div className="flex items-center mt-2 text-zinc-200/90 gap-3 text-[16px]">
          <div className="flex items-center gap-1">
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}