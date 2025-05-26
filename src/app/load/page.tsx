// src/app/loading.tsx
"use client";

import Head from "next/head";
import { useState, useRef } from "react";

interface Splash {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  borderRadius: string;
}

export default function LoadingScreen() {
  const [splashes, setSplashes] = useState<Splash[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = 20 + Math.random() * 80;
    const color = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`;
    const br1 = Math.random() * 50 + 25;
    const br2 = Math.random() * 50 + 25;
    const br3 = Math.random() * 50 + 25;
    const br4 = Math.random() * 50 + 25;
    const borderRadius = `${br1}% ${100 - br1}% ${br2}% ${100 - br2}% / ${br3}% ${100 - br3}% ${br4}% ${100 - br4}%`;
    const id = nextId.current++;
    setSplashes(prev => [...prev, { id, x, y, size, color, borderRadius }]);
  };

  return (
    <>
      <Head>
        <link
          href="//fonts.googleapis.com/css?family=Lato:900,400"
          rel="stylesheet"
          type="text/css"
        />
      </Head>

      <div className="wrapper" ref={wrapperRef} onClick={handleClick}>
        {/* Progress Bar */}
        <div id="progressbar">
          <span id="loading"></span>
          <div id="load">loading</div>
        </div>

        {/* Ink splashes */}
        {splashes.map(({ id, x, y, size, color, borderRadius }) => (
          <span
            key={id}
            className="ink"
            style={{
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius,
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        :root {
          --bg: #EDE8D0;
          --fill: #A67B5B;
        }
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          color: #333;
        }
        .wrapper {
          width: 100vw;
          height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        /* Progress Bar Styles */
        #progressbar {
          height: 26px;
          position: absolute;
          left: 50%;
          top: 50%;
          width: 200px;
          background: #C3B091;
          border-radius: 10px;
          margin: -20px 0 0 -100px;
          padding: 2px;
        }
        #loading {
          transition: all 500ms ease;
          height: 20px;
          width: 2%;
          border-radius: 8px;
          background: #A67B5B;
          position: absolute;
          top: 3px;
          left: 5px;
          display: inline-block;
          animation: load 5s ease forwards;
        }
        #load {
          font-family: Arial;
          font-weight: bold;
          text-align: center;
          margin-top: -26px;
        }
        @keyframes drop {
        0% {
          opacity: 0;
          transform: translateY(-20px) scale(0);
        }
        60% {
          opacity: 0.8;
          transform: translateY(5px) scale(1.2);
        }
        100% {
          opacity: 0.9;
          transform: translateY(0) scale(1);
        }   
      }

        /* Ink Styles */
        @keyframes load {
          0% { width: 2%; }
          100% { width: calc(100% - 10px); }
        }

        .ink {
          position: absolute;
          mix-blend-mode: multiply;
          opacity: 0;
          pointer-events: none;
          transform-origin: center;
          animation: drop 0.6s ease-out forwards;
        }
      `}</style>
    </>
  );
}
