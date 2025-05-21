// src/app/loading.tsx
"use client";

import Image from "next/image";
import { Spinner } from "@/components/Spinner";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
      {/* blurred background (optional) */}
      <Image
        src="/forest-bg.png"
        alt="Background"
        fill
        className="object-cover blur-md opacity-50 -z-10"
        priority
      />

      {/* logo or title */}
      <h1 className="text-white text-2xl mb-6 font-bold">
        My Music Player
      </h1>

      {/* spinner */}
      <Spinner />

      {/* optional subtitle */}
      <p className="mt-4 text-white/70">Loading, please wait…</p>
    </div>
  );
}