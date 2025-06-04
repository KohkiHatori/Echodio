import { error } from "console";

let counter = 0;
const task_ids = [
  "e2534c82-9a85-4183-89df-3219b609f996",
  "e33241d0-81dc-463d-96a5-2c9d263c3dbd"
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
  // const prompt = `${selectedGenre}, chil, pop, ${timeLabel}, with ${weatherDescription}`;
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

  // // temporalilly using hardcoded task ids to prevent external api calls
  return task_ids[counter++];


}