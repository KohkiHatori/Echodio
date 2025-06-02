'use client'
import { useEffect, useState } from "react";

export function useLocationAndTime() {
  const [location, setLocation] = useState<null | { lat: number; lon: number }>(null);
  const [time, setTime] = useState<string | null>(null);
  const [locationChecked, setLocationChecked] = useState(false); // to track attempt status

  // Function to refresh location and time
  const refreshLocationAndTime = () => {
    const now = new Date();
    setTime(now.toISOString());
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
          setLocationChecked(true);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocationChecked(true); // still mark as checked even if denied
        }
      );
    } else {
      console.warn("Geolocation not supported");
      setLocationChecked(true);
    }
  };

  // Attempt to get geolocation (runs only once on mount)
  useEffect(() => {
    refreshLocationAndTime();
  }, []);

  return { location, time, locationChecked, refreshLocationAndTime };
}