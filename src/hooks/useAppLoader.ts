'use client'
import { useEffect } from "react";

export function useAppLoader(setAppLoading: (v: boolean) => void) {
  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);
}