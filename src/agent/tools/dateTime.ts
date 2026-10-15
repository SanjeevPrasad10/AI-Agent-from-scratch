import { tool } from "ai";
import { z } from "zod";

export const dateTime = tool({
    description:
    "Return the current time and date. Use this tool before any time related tasks.",
    inputSchema: z.object({}),

    execute: async ()=>{
        return new Date().toISOString();
    }
}) 

//tools[dateTime] -> dateTime(index) -> 
//dateTime 