'use client';

import { useEffect, useState } from 'react';

export default function UserLocationAndTime() {
  const [location, setLocation] = useState<null | { lat: number; lon: number }>(null);
  const [time, setTime] = useState<string | null>(null);

  // Collect time
  useEffect(() => {
    const now = new Date();
    setTime(now.toLocaleTimeString());
  }, []);

  // Collect geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, []);

  // Send data once both are available
  useEffect(() => {
    if (time) {
      if (location) {
        console.log("Time:", time);
        console.log("Location:", location);
        fetch('/api/generate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            time,
            location
          })
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Generated content response:", data);
          })
          .catch((err) => {
            console.error("Failed to send content request:", err);
          });
      } else {

      }
    }
  }, [location, time]);

  return null; // No visual output needed
}