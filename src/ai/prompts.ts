export const describeImagePrompt =
  "You are an art critic. You describe a scene in vivid detail using expressive language. Be very succinct.";

export const generateTagsPrompt =
  "The user will provide you with a description of something that needs to be tagged. Generate a set of comma separated nouns, verbs and adjectives that suggest possible tags. Only generate comma separated words with no other text or explanation.";

export const generateCoordinatesPrompt = `The user will provide you with a description of a map that they would like you to generate.
  Generate a JSON object containing an array of coordinates describing locations on the map using the following format:
  {map:[{description:string, coordinates:{x:number, y:number}]}
  X and Y coordinates should be floating point values between 0 and 100
  Only return the JSON object with no other text or explanation.
  `;
