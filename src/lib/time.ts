interface WeatherSys {
  sunrise?: number;
  sunset?: number;
}

interface WeatherData {
  timezone?: number;
  sys?: WeatherSys;
}

export function getTimePeriodLabel(currentTime: string, weather: WeatherData): string {
  const currentDate = new Date(currentTime); // UTC current time
  const timezoneOffsetSec = weather?.timezone || 0;
  const sunriseUnix = weather?.sys?.sunrise; // UTC Unix timestamp
  const sunsetUnix = weather?.sys?.sunset; // UTC Unix timestamp

  if (!sunriseUnix || !sunsetUnix) return "unknown time";

  const currentSeconds = Math.floor(currentDate.getTime() / 1000) + timezoneOffsetSec; // Local Unix timestamp of current time in seconds
  const sunriseSeconds = sunriseUnix + timezoneOffsetSec; // Local Unix timestamp of sunrise in seconds
  const sunsetSeconds = sunsetUnix + timezoneOffsetSec; // Local Unix timestamp of sunset in seconds
  const buffer = 30 * 60;


  if (currentSeconds < sunriseSeconds - buffer) return "midnight";
  if (currentSeconds >= sunriseSeconds - buffer && currentSeconds < sunriseSeconds + buffer)
    return "sunrise";

  const noonToday = new Date(currentDate);
  noonToday.setUTCHours(12, 0, 0, 0);
  const noonSeconds = Math.floor(noonToday.getTime() / 1000); // Noon in seconds in UTC


  if (currentSeconds >= sunriseSeconds + buffer && currentSeconds < noonSeconds)
    return "morning";
  if (currentSeconds >= noonSeconds && currentSeconds < sunsetSeconds - buffer)
    return "afternoon";
  if (currentSeconds >= sunsetSeconds - buffer && currentSeconds < sunsetSeconds + buffer)
    return "sunset";

  const endOfDay = new Date(currentDate);
  endOfDay.setUTCHours(23, 59, 59, 999);
  const endOfDaySeconds = Math.floor(endOfDay.getTime() / 1000); // End of the day in seconds in UTC

  if (currentSeconds >= sunsetSeconds + buffer && currentSeconds <= endOfDaySeconds)
    return "night";

  return "night";
}