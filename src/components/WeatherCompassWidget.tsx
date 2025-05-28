'use client';
import { FiSun } from "react-icons/fi";
import React from "react";

export default function MinimalWeatherCompassWidget({
  temp = 7,
  time = "14:03",
}) {
  return (
    <div
      className="relative w-[160px] h-[160px] flex items-center justify-center shadow-xl mt-5 ml-333"
      style={{
        background: "rgba(0,0,0,0.44)",
        borderRadius: "50%",
        backdropFilter: "blur(1.5px)",
        WebkitBackdropFilter: "blur(1.5px)",
      }}
    >
      {/* Circle border */}
      <svg className="absolute top-0 left-0" width={160} height={160}>
        <circle
          cx={80}
          cy={80}
          r={72}
          fill="none"
          stroke="#fff"
          strokeWidth={1.1}
          opacity={0.23}
        />
        {/* Cardinal directions */}
        <text x={80} y={20} fill="#fff" fontSize={12} textAnchor="middle" opacity="0.7">N</text>
        <text x={145} y={84} fill="#fff" fontSize={12} textAnchor="middle" opacity="0.7">E</text>
        <text x={80} y={148} fill="#fff" fontSize={12} textAnchor="middle" opacity="0.7">S</text>
        <text x={17}  y={84} fill="#fff" fontSize={12} textAnchor="middle" opacity="0.7">W</text>
      </svg>

      {/* Weather icon at top center */}
      <div className="absolute left-1/2 mt-4" style={{ top: 18, transform: "translateX(-50%)"}}>
        <FiSun size={23} className="text-white opacity-90" />
      </div>
      {/* Main temperature and time */}
      <div className="flex flex-col items-center justify-center w-full h-full pt-2">
        <div className="text-3xl font-extralight text-white mt-5">{temp}°C</div>
        <div className="text-1.5xs text-white/80 font-light mt-0.5">{time}</div>
      </div>
    </div>
  );
}