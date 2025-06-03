// src/app/load/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";

export default function LoadingScreen() {
  const [showSplash, setShowSplash] = useState(true);

  // Auto end splash after animation
  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 2600);
    return () => clearTimeout(timeout);
  }, []);

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

      <div className="wrapper">
        {/* Splash Animation */}
        <AnimatePresence>
          {showSplash && (
            <motion.div
              className="fixed top-1/2 left-[46%] -translate-x-1/2 -translate-y-1/2 z-[99999] max-w-[50vw] text-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              style={{ pointerEvents: "none" }}
            >
              <motion.div
                className="flex flex-row items-center justify-center gap-6"
                initial={{}}
                animate={{}}
              >
                <motion.img
                  src="/logo.png"
                  alt="Logo"
                  className="w-48 h-48 object-contain"
                  initial={{ scale: 1.6, filter: "blur(6px) brightness(2)", opacity: 0 }}
                  animate={{
                    scale: 1,
                    filter: "blur(0px) brightness(1)",
                    opacity: 1,
                    transition: { type: "spring", duration: 1.2, bounce: 0.25 },
                  }}
                />
                <motion.p
                  className="ml-[-3.5rem] text-white text-4xl font-semibold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: {
                      delay: 1.3,
                      duration: 0.8,
                      type: "spring",
                      bounce: 0.35,
                    },
                  }}
                >
                  Echodio
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
