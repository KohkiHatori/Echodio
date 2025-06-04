
let counter = 0;
const task_ids = [
  "e3471dc2-d1ea-4cc5-ba65-5911a1f9091a",
  // "7a5b690a-0b13-45f6-8d8a-9cd8b1e7f047",
  "e47d2efc-1a4f-401a-8912-13aaa365df32"
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
  // console.log("🎵 Prompt:", prompt);

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

  // const apiKey = process.env.GO_API_KEY;
  // if (!apiKey) {
  //   throw new Error('Missing GO_API_KEY in environment');
  // }

  // const response = await fetch('https://api.goapi.ai/api/v1/task', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'x-api-key': apiKey,
  //   },
  //   body: JSON.stringify(payload),
  // });

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   console.error('GoAPI error:', errorText);
  //   throw new Error('Failed to generate music: ' + errorText);
  // }

  // const result = await response.json();
  // console.log("📩 GoAPI response body:", result);
  // if (!result.data?.task_id) {
  //   console.error("❌ No task_id found in GoAPI response:", result);
  //   throw new Error("Missing task_id in GoAPI response");
  // }

  // return result.data.task_id;

  // TEMPORALILLY using hardcoded task ids to prevent external API calls
  return task_ids[counter++ % task_ids.length];


}