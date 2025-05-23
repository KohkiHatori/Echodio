

import fs from "fs";
import fetch from "node-fetch";
import path from "path";

const headers = {
  "x-api-key": "",
  "Content-Type": "application/json"
};

const body = JSON.stringify({
  model: "midjourney",
  task_type: "imagine",
  input: {
    prompt: "a girl using a laptop on a desk inside a house, lofi, painting, chil, pop, midnight, with clear sky",
    aspect_ratio: "16:9",
    process_mode: "relax",
    skip_prompt_check: false,
    bot_id: 0
  },
  config: {
    service_mode: "",
    webhook_config: {
      endpoint: "",
      secret: ""
    }
  }
});

async function generateAndDownload() {
  try {
    const response = await fetch("https://api.goapi.ai/api/v1/task", {
      method: 'POST',
      headers: headers,
      body: body
    });

    const result = await response.json();
    console.log("Task Created:", result);

    const taskId = result?.data?.task_id;
    if (!taskId) throw new Error("No task ID returned.");

    // Polling function
    async function poll() {
      const pollResponse = await fetch(`https://api.goapi.ai/api/v1/task/${taskId}`, {
        method: "GET",
        headers
      });

      const pollResult = await pollResponse.json();
      console.log("Polling:", pollResult?.data?.status);

      if (pollResult?.data?.status === "completed") {
        const imageUrl = pollResult?.data?.output?.image_url;
        if (!imageUrl) throw new Error("Image URL not found");

        const imageRes = await fetch(imageUrl);
        const buffer = await imageRes.buffer();

        const outputPath = path.join(__dirname, "output.jpg");
        fs.writeFileSync(outputPath, buffer);
        console.log("Image saved to", outputPath);
      } else if (pollResult?.data?.status === "failed") {
        console.error("Generation failed.");
      } else {
        setTimeout(poll, 3000);
      }
    }

    poll();
  } catch (err) {
    console.error("Error:", err);
  }
}

generateAndDownload();