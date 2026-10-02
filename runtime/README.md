# Agency Runtime

The original repository is a large catalog of specialized agent prompts. **Agency Runtime** adds the missing execution layer without changing those source agents.

## What it adds

- **Discovery** — scans the existing division folders and parses agent frontmatter.
- **Routing** — ranks agents against a task using deterministic lexical/metadata signals.
- **Policy** — blocks or pauses high-risk requests before an agent is selected.
- **Workflow planning** — turns a task into a small dependency graph of specialist steps.
- **Evaluation** — checks expected capabilities, required agents and coverage.
- **Model neutrality** — the runtime does not hard-code OpenAI, Anthropic, Google or another provider. Your application can execute the selected agent with any model adapter.

## CLI

From the repository root:

```bash
node runtime/src/cli.mjs list
node runtime/src/cli.mjs route "Build a React dashboard and review security"
node runtime/src/cli.mjs plan "Research a market, build the product and create a launch plan"
node runtime/src/cli.mjs policy "drop the production database"
```

## Architecture

```
Task
  ↓
Policy Gate
  ↓
Agent Discovery → Router
  ↓
Workflow Planner
  ↓
Model / Tool Adapter
  ↓
Agent Execution
  ↓
Evaluation
  ↓
Artifacts + Trace
```

The adapter boundary is intentional: this repository remains a reusable agent library instead of becoming locked to a single inference provider.
