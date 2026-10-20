# AI Agent from Scratch

An autonomous, streaming **ReAct (Reasoning + Action) Agent runtime** built from first principles in TypeScript, featuring custom tool execution, automated evaluation benchmarking (Evals), and real-time terminal UI streaming.

> **Why build from scratch?**  
> Most agent tutorials rely on heavy abstractions (LangChain, CrewAI) that obscure what happens under the hood. This project implements the core execution loop directly with the Vercel AI SDK, Google Gemini, and Laminar telemetry.

---

## 🏗️ Architecture

```
User Prompt ───────► LLM Stream (Gemini) ──────► Token Stream (Ink UI)
                          │
                   Tool Call Detected?
                     ├── YES ──► Tool Dispatcher (Zod Schema Validation)
                     │             └── Execution (File System, Shell, Code)
                     │                   └── Append to History ──► Next Turn (ReAct)
                     └── NO  ──► Final Answer
```

---

## ✨ Key Features

* **Autonomous ReAct Loop**: Multi-turn execution loop that autonomously plans, executes tools, observes results, and iterates until the goal is solved.
* **Type-Safe Tool Runtime**: Schema-validated tools powered by Zod:
  * **File Tools**: Read, write, list, and patch files in the workspace.
  * **Shell Execution**: Sandboxed CLI commands via `shelljs`.
  * **Code Execution**: Dynamic code evaluation and testing.
  * **Temporal Awareness**: System time and calendar context.
* **Evaluation Pipeline (Evals)**: Automated testing suite measuring agent tool-selection accuracy, error recovery, and multi-turn reasoning using `@lmnr-ai/lmnr`.
* **Interactive Terminal UI**: Built with React in the console using **Ink** (`ink`, `ink-spinner`) for real-time token streaming and status spinners.
* **Observability & Tracing**: Distributed telemetry tracking LLM latency, token usage, and tool payloads.

---

## 🚀 Quickstart

### 1. Clone & Install
```bash
git clone https://github.com/SanjeevPrasad10/AI-Agent-from-scratch.git
cd AI-Agent-from-scratch
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key
LMNR_PROJECT_API_KEY=your_laminar_key # Optional for tracing
```

### 3. Run the Agent
```bash
npm start
```

---

## 🧪 Running Evaluations (Evals)

Benchmark tool selection accuracy against synthetic datasets:

```bash
# Evaluate file-system tools
npm run eval:file-tools

# Evaluate shell execution
npm run eval:shell-tools

# Evaluate multi-turn agent reasoning
npm run eval:agent
```

---

## 💻 Tech Stack

* **Language**: TypeScript, Node.js (ESM)
* **LLM Engine**: `@ai-sdk/google` (Gemini 2.5/3.5 Flash), `ai`
* **Schema Validation**: `zod`
* **Terminal UI**: `react`, `ink`, `ink-spinner`
* **Evals & Tracing**: `@lmnr-ai/lmnr`
* **Tool Runtime**: `shelljs`
