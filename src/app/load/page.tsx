// src/app/load/page.tsx
"use client";

import Head from "next/head";

export default function LoadingScreen() {
  return (
    <>
      <Head>
        <link
          href="//fonts.googleapis.com/css?family=Lato:900,400"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="wrapper"></div>

      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: #000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
        }
        .wrapper {
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }
      `}</style>
    </>
  );
}
