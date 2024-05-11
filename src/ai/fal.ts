"use server";

import * as fal from "@fal-ai/serverless-client";
const fal_key = process.env.FAL;

fal.config({
  credentials: fal_key, // or a function that returns a string
});

type Image = {
  url: string;
  file_name: string;
  file_size: number;
};
type Result = {
  images: Image[];
};

// This function makes a request to the FAL api and gets an image.
export async function generateImageFal(
  prompt: string,
  image_size: string,
  model:
    | "fast-turbo-diffusion"
    | "hyper-sdxl"
    | "fast-sdxl" = "fast-turbo-diffusion",
  negativePrompt: string = "cartoon, illustration, animation, face, male, female, ugly"
) {
  const result: Result = await fal.run(`fal-ai/${model}`, {
    input: {
      prompt: prompt,
      negativePrompt: negativePrompt,
      image_size: image_size,
      sync_mode: true,
    },
  });
  return result.images[0].url;
}

//speaker_url should be a link to a 30 second clip of audio
export async function generateVoice(
  text: string,
  speaker_url: string = "https://cdn.themetavoice.xyz/speakers/bria.mp3"
) {
  const response = await fetch(`https://fal.run/fal-ai/metavoice-v1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Key ${fal_key}`,
    },
    body: JSON.stringify({
      text: text,
      audio_url: speaker_url,
      speech_stability: 10,
      speaker_similarity: 4,
    }),
  });

  const responseJSON = await response.json();
  console.log(responseJSON)

  return responseJSON?.audio_url?.url;
}

//Speech to text with Whisper
export async function speechToText(audio_url: string = "") {
  const response = await fetch(`https://fal.run/fal-ai/whisper`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Key ${fal_key}`,
    },
    body: JSON.stringify({
      audio_url: audio_url,
      task: "transcribe",
      chunk_level: "segment",
      version: "3",
      batch_size: 64,
    }),
  });

  const responseJSON = await response.json();

  return responseJSON?.chunks;
}
