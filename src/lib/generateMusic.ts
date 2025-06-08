import { error } from "console";

let counter = 0;
const task_ids = [
  "ef5deaa3-98d1-489f-a7b8-2a889816b46d",
  "840590c2-abca-4deb-8bc2-7d889e5d57c9",
  "6a93c8dc-73d1-492f-99ed-c9a0d18c8459",
  "7e2209f7-443c-4db7-82bd-247c3c42f87f",
  "aacd5856-a7d7-4a29-83b1-4180b5633c8a",
  "175e5059-55e4-48ba-91db-e8cb9fdbd57f",
]

/**
 * Generates music using the GoAPI AI service.
 * @param timeLabel Description of the time (e.g. 'morning', 'evening').
 * @param weatherDescription Weather description string.
 * @param lyricsType Type of lyrics to generate.
 * @param negativeTags Tags to avoid in generation.
 * @param selectedGenre The genre of music to generate.
 * @returns The generated task_id from the API.
 * @throws Error if API key is missing or the request fails.
 */
export async function generateMusic(
  timeLabel: string,
  weatherDescription: string,
  lyricsType: string,
  negativeTags: string,
  selectedGenre: string
): Promise<string> {
  // const prompt = `${selectedGenre}, chill, ${timeLabel}, with ${weatherDescription}`;
  // console.log("🎵 prompt:", prompt);

  // const payload = {
  //   model: "music-u",
  //   task_type: "generate_music",
  //   input: {
  //     gpt_description_prompt: prompt,
  //     negative_tags: negativeTags,
  //     lyrics_type: lyricsType,
  //     seed: -1,
  //   },
  //   config: {
  //     service_mode: "public",
  //     webhook_config: {
  //       endpoint: "",
  //       secret: "",
  //     },
  //   },
  // };

  // const apikey = process.env.GO_API_KEY;
  // if (!apikey) {
  //   throw new Error('missing go_api_key in environment');
  // }

  // const response = await fetch('https://api.goapi.ai/api/v1/task', {
  //   method: 'post',
  //   headers: {
  //     'content-type': 'application/json',
  //     'x-api-key': apikey,
  //   },
  //   body: JSON.stringify(payload),
  // });

  // if (!response.ok) {
  //   const errortext = await response.text();
  //   console.error('goapi error:', errortext);
  //   throw new Error('failed to generate music: ' + errortext);
  // }

  // const result = await response.json();
  // console.log("📩 goapi response body:", result);
  // if (!result.data?.task_id) {
  //   console.error("❌ no task_id found in goapi response:", result);
  //   throw new Error("missing task_id in goapi response");
  // }

  // return result.data.task_id;

  // temporalilly using hardcoded task ids to prevent external api calls
  return task_ids[counter++ % task_ids.length];


}