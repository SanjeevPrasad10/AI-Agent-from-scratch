# AI Agent From Scratch

An autonomous AI agent built from scratch using TypeScript, Vercel AI SDK, and Google Gemini.

## Features
- **ReAct Agent Loop**: Autonomous reasoning and tool-calling workflow.
- **Custom Tools**: Type-safe tool declarations with Zod schemas.
- **Evaluation Pipeline**: Single-turn and multi-turn evaluation suites for measuring tool selection accuracy.
- **Observability**: Distributed tracing and telemetry powered by Laminar (`@lmnr-ai/lmnr`).

## Running the Project

```bash
# Run the agent
npx tsx --env-file=.env src/agent/run.ts

# Run file tools evaluation
npm run eval:file-tools
```
