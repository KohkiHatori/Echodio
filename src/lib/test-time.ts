import { getTimePeriodLabel } from './time';

const weather = {
  sys: {
    sunrise: 1747683184, // Unix timestamp (in seconds)
    sunset: 1747734169
  },
  timezone: 32400 // UTC+9 in seconds
};

const testTimes = [
  '2025-05-19T17:30:00Z', // 02:30 am UTC+9
  '2025-05-19T19:30:00Z', // 04:30 am UTC+9
  '2025-05-19T22:00:00Z', // 07:00 am UTC+9
  '2025-05-20T01:00:00Z', // 10:00 am UTC+9
  '2025-05-20T04:30:00Z', // 01:30 pm UTC+9
  '2025-05-20T07:30:00Z', // 04:30 pm UTC+9
  '2025-05-20T09:30:00Z', // 06:30 pm UTC+9
  '2025-05-20T12:00:00Z', // 09:00 pm UTC+9
];

const now = new Date();
console.log(now.toLocaleTimeString());

for (const time of testTimes) {
  const label = getTimePeriodLabel(time, weather);
  console.log(`Time: ${time} → ${label}`);
}