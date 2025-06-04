import { getTimePeriodLabel } from "./time";

interface Location {
  lat: number;
  lon: number;
}

/**
 * Fetches weather data for a given location using OpenWeatherMap API.
 * @param location Object with lat and lon properties.
 * @returns Weather data as JSON.
 * @throws Error if location is invalid, API key is missing, or fetch fails.
 */
export async function getWeather(location: Location) {
  if (!location || typeof location.lat !== "number" || typeof location.lon !== "number") {
    throw new Error("Missing or invalid location data");
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing WEATHER_API_KEY in environment");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}
