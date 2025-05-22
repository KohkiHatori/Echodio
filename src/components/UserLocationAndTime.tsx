//src/components/UserLocationAndTime.tsx
'use client';

import { useEffect, useState } from 'react';

interface Props {
  onContentLoaded?: (data: any) => void;
}

export default function UserLocationAndTime({ onContentLoaded }: Props) {
  const [location, setLocation] = useState<null | { lat: number; lon: number }>(null);
  const [time, setTime] = useState<string | null>(null);
  const [locationChecked, setLocationChecked] = useState(false); // to track attempt status

  // Collect time once
  useEffect(() => {
    const now = new Date();
    setTime(now.toISOString());
  }, []);

  // Attempt to get geolocation (runs only once)
  useEffect(() => {
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
  }, []);

  // Send to API once time is ready and location permission was handled
  useEffect(() => {
    if (time && locationChecked) {
      console.log(time);
      fetch('http://localhost:3000/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time,
          ...(location && { location }) // only include if location exists
        })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Generated content response:", data);
          if (onContentLoaded) onContentLoaded(data);
        })
        .catch((err) => {
          console.error("Failed to send content request:", err);
        });
    }
  }, [locationChecked]);

  return null; // No UI needed
}