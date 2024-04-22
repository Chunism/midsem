"use server";
import Groq from "groq-sdk";

const groq_key = "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";
const fal_key = "8961de18-583c-48d8-81fe-bcb90fd63dc8:e4526ed7d62c69c2bb88fa2d4f93efc1";

console.log(groq_key)
const groq = new Groq({
  apiKey: groq_key,
});

//These functions are running on our nextJS server. We can make requests to resources
//And securely store our API keys and secrets.
//We can call the Groq API and pass our user prompt, max tokens and system prompt.
// export async function getGroqCompletion(
//   userPrompt: string,
//   max_tokens: number,
//   systemPrompt: string = ""
// ) {
//   const completion = await groq.chat.completions.create({
//     messages: [
//       { role: "system", content: systemPrompt },
//       {
//         role: "user",
//         content: userPrompt,
//       },
//     ],
//     model: "llama3-70b-8192",
//     max_tokens: max_tokens,
//   });

//   return (
//     completion.choices[0]?.message?.content || "Oops, something went wrong."
//   );
// }

//This function makes a request to the FAL api and gets an image.
// https://fal.ai/models/fast-turbo-diffusion-turbo/api
export async function generateImageFal(prompt: string) {
  console.log("Generating image...");

  try {
    const response = await fetch(`https://fal.run/fal-ai/fast-turbo-diffusion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Key ${fal_key}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: "landscape_16_9",
        negative_prompt: "No Western or colonial influences in architecture, clothing, or objects. No anachronistic elements or technologies that do not belong to the specific era. No overly modernized or generic buildings that lack historical character.",
        // model_name: "stabilityai/sdxl-turbo",
        // num_inference_steps: 2,
        // guidance_scale: 1,
        // sync_mode: true,
        // num_images: 1
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    const responseJSON = await response.json();
    return responseJSON?.images[0].url;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

export async function aiReturn(userPrompt: string, max_tokens: number, systemPrompt = "") {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    response_format: { type: "json_object" },
    model: "llama3-70b-8192",
    max_tokens: max_tokens,
  });

  return completion.choices[0]?.message?.content || "Oops, something went wrong.";
}