'use client';
import { WiDaySunny } from "react-icons/wi";
import React from "react";

export default function SmallCityWeatherClockWidget({
  city = "Tokyo",
  date = "Wed, Jul 26",
  time = "12:00",
}) {
  return (
    <div className="relative w-[184px] h-[110px] flex items-center justify-center rounded-[24px] overflow-hidden shadow-lg mt-5 ml-327">
      {/* Gradient BG stripes */}
      <div className="absolute inset-0 z-0 flex">
        <div className="w-1/4 h-full bg-gradient-to-b from-[#bb5021] to-[#ff8c42]" />
        <div className="w-1/4 h-full bg-gradient-to-b from-[#e57c1c] to-[#f4be4f]" />
        <div className="w-1/4 h-full bg-gradient-to-b from-[#e4b42f] to-[#ffe375]" />
        <div className="w-1/4 h-full bg-gradient-to-b from-[#fff375] to-[#ffe375]" />
      </div>

      {/* Inner rounded panel */}
      <div className="relative z-10 w-[88%] h-[84%] bg-black/30 rounded-[16px] flex flex-col justify-between p-2">
        {/* City, date, weather icon row */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="text-white font-bold text-[1rem] leading-tight">{city}</div>
            <div className="text-white text-xs opacity-90">{date}</div>
          </div>
          <WiDaySunny className="text-yellow-300" size={22} />
        </div>
        {/* Time */}
        <div className="flex-1 flex items-end">
          <span className="text-white text-3xl font-bold leading-tight">{time}</span>
        </div>
      </div>
    </div>
  );
}