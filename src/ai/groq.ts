"use server";
import Groq from "groq-sdk";

const groq_key = process.env.GROQ;

const groq = new Groq({
  apiKey: groq_key,
});

export type Message = {
  content: string;
  role: "user" | "assistant" | "system";
};

type GroqRequest = {
  response_format?: { type: "json_object" };
  messages: Message[];
  max_tokens: number;
  model: string;
};

//We can call the Groq API and pass our user prompt, max tokens and system prompt.
export async function getGroqCompletion(
  userPrompt: string,
  max_tokens: number,
  systemPrompt: string = "",
  jsonOnly: boolean = false
) {
  const body = {
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    model: "llama3-70b-8192",
    max_tokens: max_tokens,
  } as GroqRequest;
  if (jsonOnly) body.response_format = { type: "json_object" };

  const completion = await groq.chat.completions.create(body);
  return (
    completion.choices[0]?.message?.content || "Oops, something went wrong."
  );
}

//We can call the Groq API and pass our user prompt, max tokens and system prompt.
export async function getGroqChat(max_tokens: number, messages: Message[]) {
  const completion = await groq.chat.completions.create({
    messages: messages,
    model: "mixtral-8x7b-32768",
    max_tokens: max_tokens,
  });
  return (
    completion.choices[0]?.message?.content || "Oops, something went wrong."
  );
}

export async function getGroqCompletionParallel(
  userPrompts: string[],
  max_tokens: number,
  systemPrompts: string[],
  jsonOnly: boolean = false
) {
  //Iterate over the longer of the two arrays
  const iterator =
    systemPrompts.length > userPrompts.length ? systemPrompts : userPrompts;
  const completions = await Promise.all(
    iterator.map(async (p, i) => {
      const userPrompt = userPrompts[Math.min(i, userPrompts.length - 1)];
      const systemPrompt = systemPrompts[Math.min(i, systemPrompts.length - 1)];

      const body = {
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        model: "llama3-8b-8192",
        max_tokens: max_tokens,
      } as GroqRequest;
      if (jsonOnly) body.response_format = { type: "json_object" };
      return groq.chat.completions.create(body);
    })
  );

  return completions.map(
    (c) => c.choices[0]?.message?.content || "No response."
  );
}
