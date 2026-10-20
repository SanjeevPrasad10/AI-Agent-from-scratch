
import { streamText, type ModelMessage } from "ai";
import { generateText, stepCountIs } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./system/prompt";
import { tools } from "./tools/index.ts";
import { Laminar, getTracer } from '@lmnr-ai/lmnr';
import type { AgentCallbacks, ToolCallInfo } from "../types.ts";
import { filterCompatibleMessages } from "./system/filterMessages.ts"

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});


const MODEL_NAME = "gemini-3.5-flash-lite";
Laminar.initialize({
  projectApiKey: process.env.LMNR_PROJCT_API_KEY
});


export const runAgent = async (userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks,
): Promise<ModelMessage[]> => {
  const workingHistory = filterCompatibleMessages(conversationHistory);

  const messages: ModelMessage[] = [{role: 'system', content: SYSTEM_PROMPT},//The system prompt for the LLM
    ...workingHistory,//the conversation yet so far.
    {role: 'user', content: userMessage}//The new message that the user sent us
  ];
  let fullResponse = "";

  while(true){
    const result = streamText({
      model:google(MODEL_NAME),
      messages,
      tools,
      experimental_telemetry:{
        isEnabled:true,
        tracer: getTracer()
      }
    });

    const toolCalls: ToolCallInfo[] = [];
    let currentText = "";
    let streamError: Error | null = null

    //We are catching the tokens here in a stream way
    try{
      for await (const chunk of result.fullStream){
        if(chunk.type === 'text-delta'){
          currentText += chunk.text;
          callbacks.onToken(chunk.text);
        }
        if(chunk.type === 'tool-call'){
          const input = 'input' in chunk ? chunk.input : {};
          toolCalls.push({
            toolCallId: chunk.toolCallId,
            toolName: chunk.toolName,
            args: input as any,
          });
          callbacks.onToolCallStart(chunk.toolName, input);
        }
      }
    } catch(e){
      streamError = e as Error;
      if(!currentText && !streamError.message.includes('No output generated')){
        throw streamError;
      }
    }
    if(streamError && !currentText){
      fullResponse = 'Sorry about that.';
      callbacks.onToken(fullResponse);
      break;
    }

    const finishReason =  await result.finishReason;
    if (finishReason !== 'tool-calls' || toolCalls.length === 0){
      const responseMessages = await result.response;
      messages.push(...responseMessages.messages);
      break;
    }
    const responseMessages = await result.response;
    messages.push(...responseMessages.messages);
  }
  return messages;
};
