import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./system/prompt";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-3.8-flash";
export const runAgent = async (
  userMessage: string,
) => {
  const { text } = await generateText({
    model: google(MODEL_NAME),//Attaches your API key with the model specified
    prompt: userMessage,
    system: SYSTEM_PROMPT,
  });

  console.log(text);
};

runAgent('What is my name , do you remember?');