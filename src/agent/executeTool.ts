import { tools } from "./tools/index.ts";
type Toolname = keyof typeof tools;
export const executeTool = async (name:string, args: any)=>{
  const tool = tools[name as Toolname];
  // const tool = tools[name as any];

  if(!tool){
    return "Unknown tool, this is not exists"
  }

  const execute = tool.execute;

  if(!execute){
    return "This is not a registed tool"
  }

  const result = await tool.execute(args, {
    toolCallId: "",
    messages: [],
  })

  return String(result);
};