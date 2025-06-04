//src/app/api/image/result/route.ts

// const ghost_style = "https://i.ibb.co/Cpg0DYSz/GITS-kusanagi.jpg"
// const k_style = "https://i.ibb.co/vxJLL4K2/K-Kanehira-A.jpg"
// const shinkai_style = "https://i.ibb.co/KxSjL5rD/images.jpg"

let counter = 0;
const task_ids = [
  "f6fbe897-a093-489f-9c75-021da61ba425",
  "686ac26c-dd3f-4e21-88f5-9117a8cf1944"
]

const GENERATION_MODE = "fast";

/**
 * Generates an image using the GoAPI AI service.
 * @param timeLabel Description of the time (e.g. 'morning', 'evening').
 * @param weatherDescription Weather description string.
 * @returns The generated task_id from the API or a hardcoded one in dev mode.
 * @throws Error if API key is missing or the request fails.
 */
export async function generateImage(timeLabel: string, weatherDescription: string): Promise<string> {
  // Uncomment below to use real API
  // const apiKey = process.env.GO_API_KEY;
  // if (!apiKey) {
  //   throw new Error('Missing API key');
  // }

  // const headers = {
  //   "x-api-key": apiKey,
  //   "Content-Type": "application/json"
  // };

  // const prompt = `
  //   a young beautiful school teenager using a laptop on a desk lofi, chill, pop, painting, ${timeLabel}, with ${weatherDescription}.`;

  // const payload = {
  //   model: "midjourney",
  //   task_type: "imagine",
  //   input: {
  //     prompt,
  //     aspect_ratio: "16:9",
  //     process_mode: GENERATION_MODE,
  //     skip_prompt_check: false,
  //     bot_id: 0
  //   },
  //   config: {
  //     service_mode: "",
  //     webhook_config: {
  //       endpoint: "",
  //       secret: ""
  //     }
  //   }
  // };

  // const response = await fetch("https://api.goapi.ai/api/v1/task", {
  //   method: "POST",
  //   headers: headers,
  //   body: JSON.stringify(payload),
  // });

  // if (!response.ok) {
  //   throw new Error(`Image API error: ${response.status} ${response.statusText}`);
  // }

  // const result = await response.json();
  // const task_id = result?.data?.task_id;
  // if (!task_id) {
  //   throw new Error("No task_id returned from image API");
  // }
  // return task_id;

  // TEMPORARILY using hardcoded task ids to prevent external API calls
  return task_ids[counter++];
}