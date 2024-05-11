"use server";
import Groq from "groq-sdk";

const groq_key = "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";
const fal_key = "1c1713b8-e3de-442e-bd0f-851041450786:8e6d8879d3f25f9d29918e2e75778791";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI ?? "");

export async function getGeminiVision(prompt: string, base64Image: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const formatted = base64Image.split(",")[1];
  const image = {
    inlineData: {
      data: formatted,
      mimeType: "image/jpeg",
    },
  };

  const result = await model.generateContent([prompt, image]);
  console.log(result.response.text());
  return result.response.text();
}

export async function getGeminiText(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  const result = await model.generateContent([prompt]);
  console.log(result.response.text());
  return result.response.text();
}

const groq = new Groq({
  apiKey: groq_key,
  dangerouslyAllowBrowser: true,
});


// These functions are running on our nextJS server. We can make requests to resources
// And securely store our API keys and secrets.

// We can call the Groq API and pass our user prompt, max tokens and system prompt.
export async function getGroqCompletion(
  userPrompt: string,
  max_tokens: number,
  systemPrompt: string = ""
) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "llama3-70b-8192",
    max_tokens: max_tokens,
  });

  return completion.choices[0]?.message?.content || "Oops, something went wrong.";
}

// This function makes a request to the FAL api and gets an image.
// https://fal.ai/models/fast-turbo-diffusion-turbo/api
export async function generateImageFal(prompt: string) {
  try {
    const response = await fetch(`https://fal.run/fal-ai/fast-turbo-diffusion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Key ${fal_key}`,
      },
      body: JSON.stringify({
        // model_name: "SG161222/Realistic_Vision_V2.0",
        prompt: prompt,
        seed: 0,
        negative_prompt:
          "worst quality, low quality, normal quality, easynegative, FastNegativeV2, old photo, realistic, peole, faces, realistic style, real, photography",
        image_size: "landscape_16_9",
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

export async function generateImageFalSVD(prompt: string, url: string) {
  try {
    const response = await fetch(`https://fal.run/fal-ai/fast-svd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Key ${fal_key}`,
      },
      body: JSON.stringify(
        {
          image_url: url,
          motion_bucket_id: 127,
          cond_aug: 0.02,
          steps: 20,
          deep_cache: "none",
          fps: 3
        }
      ),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    const responseJSON = await response.json();
    return responseJSON?.video
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}



