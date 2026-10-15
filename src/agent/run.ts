import { generateText, stepCountIs } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./system/prompt";
import { tools } from "./tools/index.ts";
import { Laminar, getTracer } from '@lmnr-ai/lmnr';


const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});


const MODEL_NAME = "gemini-3.5-flash-lite";
Laminar.initialize({
  projectApiKey: process.env.LMNR_PROJCT_API_KEY
});


export const runAgent = async (userMessage: string) => {
  const { text, steps } = await generateText({
    model: google(MODEL_NAME),
    // prompt: userMessage,
    messages: [],
    system: SYSTEM_PROMPT,
    tools,
    stopWhen: stepCountIs(2), // 👈 Tells AI SDK v5 to run 2 steps!
    experimental_telemetry:{
      isEnabled:true,
      tracer:getTracer(),
    }
  });

  console.log("Steps count:", steps.length);
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    console.log(`\n--- Step ${i + 1} ---`);
    if (step.toolCalls?.length) {
      console.log("👉 Tool called:", step.toolCalls.map((t: any) => t.toolName).join(", "));
    }
    if (step.toolResults?.length) {
      // 👈 Use r.output for AI SDK v5
      console.log(" Tool result:", step.toolResults.map((r: any) => r.output).join(", "));
    }
    if (step.text) {
      console.log(" Model answer:", step.text);
    }
  }

  if (text) {
    console.log("\n Final Answer:", text);
  }
  console.log("done")

};
Laminar.flush();

runAgent("What is the current date and time right now??");