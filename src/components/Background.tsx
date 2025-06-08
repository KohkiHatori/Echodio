'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePollImage } from '@/hooks/usePollImage';
import { getDominantColorKMeans, rgbToCss } from '@/lib/getDominantColor';

interface BackgroundProps {
  imageTaskId: string | null;
  setThemeColor: (color: string) => void;
  currentIndex: number;
}


export default function Background({ imageTaskId, setThemeColor, currentIndex }: BackgroundProps) {

  const [currentBg, setCurrentBg] = useState<string | null>(null);
  const [nextBg, setNextBg] = useState<string | null>(null);
  const [isNextLoaded, setIsNextLoaded] = useState(false);
  const [imageQueue, setImageQueue] = useState<string[]>([]);

  usePollImage(imageTaskId, (url) => {
    setImageQueue((prev) => [...prev, url]);
  });

  useEffect(() => {
    if (isNextLoaded && nextBg) {
      const t = setTimeout(() => {
        setCurrentBg(nextBg);
        setNextBg(null);
        setIsNextLoaded(false);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [isNextLoaded, nextBg]);

  useEffect(() => {
    if (imageQueue.length >= 1) {
      setNextBg(imageQueue[currentIndex]);
      console.log("nextBg", nextBg);
    }
  }, [currentIndex, imageQueue]);

  return (
    <>
      {currentBg && (
        < Image
          src={currentBg}
          alt="Background"
          fill
          priority
          onLoad={async () => {
            console.log("currentBg loaded");
          }}
          className="absolute inset-0 z-0 object-cover transition-opacity duration-500 opacity-100"
        />
      )}
      {
        nextBg && (
          <Image
            src={nextBg}
            alt="Next Background"
            fill
            priority
            onLoad={async () => {
              setIsNextLoaded(true)
              try {
                const rgb = await getDominantColorKMeans(nextBg);
                const cssColor = rgbToCss(rgb);
                console.log("cssColor", cssColor);
                setTimeout(() => setThemeColor(cssColor), 2000);
              } catch (e) {
                console.error("Failed to extract color", e);
              }
            }}
            className={
              `absolute inset-0 z-0 object-cover transition-opacity duration-[2000ms] ${isNextLoaded ? "opacity-100" : "opacity-0"
              }`
            }
          />)
      }
    </>
  );
}