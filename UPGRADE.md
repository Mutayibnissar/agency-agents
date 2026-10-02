# Agency Agents — V2 Upgrade

This fork is now more than a prompt catalog.

The existing upstream agent library remains intact, while this fork adds an execution-oriented runtime under `runtime/`.

## V2 layers

1. **Agent catalog** — existing specialist agents remain the source of domain expertise.
2. **Discovery** — automatically discovers Markdown agents instead of maintaining a second hard-coded roster.
3. **Router** — selects specialists for a task using deterministic, inspectable scoring.
4. **Policy gate** — screens requests before execution.
5. **Workflow planner** — creates dependency-aware specialist steps.
6. **Evaluation** — measures capability coverage and required-agent participation.
7. **Provider adapter boundary** — model execution can be connected later without changing the agent catalog.

## Design principle

The runtime deliberately does not claim to be a fully autonomous production agent platform yet. It is the control plane around the existing prompts. A production deployment should add a model adapter, tool permissions, persistent state, tracing, rate limits and human approval for consequential actions.

## Suggested next layer

Connect the runtime to an application adapter with:

- OpenAI / Anthropic / Gemini / local-model adapters
- MCP tool discovery
- persistent task state
- structured artifacts
- OpenTelemetry-compatible traces
- budget and token policies
- human approval checkpoints
- sandboxed execution
- webhooks / queues for long-running workflows

The result is a path from **prompt library → agent runtime → governed multi-agent platform**.
