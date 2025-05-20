'use client';

import { useEffect, useState } from 'react';

export default function UserLocationAndTime() {
  const [location, setLocation] = useState<null | { lat: number; lon: number }>(null);
  const [time, setTime] = useState<string | null>(null);
  const [locationChecked, setLocationChecked] = useState(false); // to track attempt status

  // Collect time once
  useEffect(() => {
    const now = new Date();
    setTime(now.toLocaleTimeString());
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
        })
        .catch((err) => {
          console.error("Failed to send content request:", err);
        });
    }
  }, [time, location, locationChecked]);

  return null; // No UI needed
}