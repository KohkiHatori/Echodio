//src/app/api/image/result/route.ts

// const ghost_style = "https://i.ibb.co/Cpg0DYSz/GITS-kusanagi.jpg"
// const k_style = "https://i.ibb.co/vxJLL4K2/K-Kanehira-A.jpg"
// const shinkai_style = "https://i.ibb.co/KxSjL5rD/images.jpg"

let counter = 0;
const task_ids = [
  "deb025f2-8a92-4fa7-bcf8-49535a6b28da",
  "7604d820-574c-4786-8085-9302fdf2c251",
  "feab6fc3-5021-4198-a59a-dd1ebfed800e",
  "86c24ad4-0bca-4cf6-94ee-4c09a7563dbc",
  "32c75438-9e3f-4741-8b2f-dd24b1c73584",
  "82c98499-5155-4c98-88be-0b2f355551b1",
]

const colors = [
  "yellow",
  "light green",
  "orange",
  // "light blue",
  "wood brown"
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
  // const apiKey = process.env.GO_API_KEY;
  // if (!apiKey) {
  //   throw new Error('Missing API key');
  // }

  // const headers = {
  //   "x-api-key": apiKey,
  //   "Content-Type": "application/json"
  // };

  // const color = colors[counter++ % colors.length];
  // const prompt = `
  //   a young beautiful school teenager using a laptop on a desk, painting, lofi, chill, pop, ${color} color grading, monochromatic, ${timeLabel}, with ${weatherDescription}.`;

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

  // // TEMPORARILY using hardcoded task ids to prevent external API calls
  return task_ids[counter++ % task_ids.length];
}