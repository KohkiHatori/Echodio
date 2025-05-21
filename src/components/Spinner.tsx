// src/components/Spinner.tsx
"use client";

import React from "react";

export function Spinner() {
  return (
    <div
      className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"
      aria-label="Loading…"
    />
  );
}
