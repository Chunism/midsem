"use server";
import Groq from "groq-sdk";

const groq_key = "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";
const fal_key = "8b5ba3ca-7f4c-4b8d-a10b-9de0bcd31c39:1fd0191f6ffbcb62113ade446a553ae3";

const groq = new Groq({
  apiKey: groq_key,
  dangerouslyAllowBrowser: true,
});

//These functions are running on our nextJS server. We can make requests to resources
//And securely store our API keys and secrets.
//We can call the Groq API and pass our user prompt, max tokens and system prompt.
export async function getGroqCompletion(
  userPrompt: string,
  max_tokens: number,
  systemPrompt: string = ""
) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    model: "mixtral-8x7b-32768",
    max_tokens: max_tokens,
  });

  return (
    completion.choices[0]?.message?.content || "Oops, something went wrong."
  );
}

//This function makes a request to the FAL api and gets an image.
// https://fal.ai/models/fast-turbo-diffusion-turbo/api
export async function generateImageFal(prompt: string) {
  console.log("Generating image...");

  try {
    const response = await fetch(`https://fal.run/fal-ai/lora`,
                                   // https://fal.run/fal-ai/fast-turbo-diffusion
                                 // https://fal.run/fal-ai/lora

                                 // https://fal.run/fal-ai/fast-sdxl
                                 {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Key ${fal_key}`,
      },
      body: JSON.stringify({
             model_name: "SG161222/Realistic_Vision_V2.0",
             // basic_stabilityai/stable-diffusion-xl-base-1.0
             // "stabilityai/sdxl-turbo"
        // "stabilityai/sd-turbo"

             // "runwayml/stable-diffusion-v1-5"
             // "SG161222/Realistic_Vision_V2.0"
             prompt: prompt,
             seed: 0,
             negative_prompt: "worst quality, low quality, normal quality, easynegative, FastNegativeV2, old photo, realistic, peole, faces, realistic style, real, photography",
             image_size: "landscape_16_9",
             // num_inference_steps: 20,
             // sampler_name: "DPM++ SDE Karras",
            //  guidance_scale: 8,
            //  hd_fix_denoising_strength: 0.4, 
            //  loras: [
            //    {////moon
            //      path: "https://civitai.com/api/download/models/139328?type=Model&format=SafeTensor",

            //      scale: 0.28, 

            //    },

            //     {/////wedding
            //       path: "https://civitai.com/api/download/models/116447?type=Model&format=SafeTensor",
            //       scale: 0.53,
            //     },

            //    {////realistic
            //      path: "https://civitai.com/api/download/models/28913?type=Model&format=SafeTensor&size=full&fp=fp16",
            //      scale: 0.1,
            //    }

            //  ],

             // embeddings: [
             //   {
             //     path: "https://storage.googleapis.com/falserverless/style_lora/emb_our_test_1.safetensors",
             //     tokens: [
             //       "<s0>",
             //       "<s1>"
             //     ]
             //   }
             // ],

             // controlnets: [
             //   {
             //     path: "diffusers/controlnet-canny-sdxl-1.0",
             //     image_url: "https://storage.googleapis.com/falserverless/model_tests/controlnet_sdxl/canny-edge.resized.jpg",
             //     conditioning_scale: 1,
             //     end_percentage: 1
             //   }
             // ],
             // ip_adapter: [
             //   {
             //     ip_adapter_image_url: "https://storage.googleapis.com/falserverless/model_tests/controlnet_sdxl/robot.jpeg",
             //     path: "h94/IP-Adapter",
             //     model_subfolder: "sdxl_models",
             //     weight_name: "ip-adapter-plus_sdxl_vit-h.safetensors",
             //     image_encoder_path: "h94/IP-Adapter",
             //     image_encoder_subpath: "models/image_encoder",
             //     scale: 1
             //   }
             // ],

           }),

    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    const responseJSON = await response.json();
    console.log("API Response:", responseJSON);
    return responseJSON?.images[0].url;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}