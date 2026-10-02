import { evaluatePolicy } from "./policy.mjs";
import { routeAgents } from "./router.mjs";

export function planWorkflow({ agents, task, maxAgents = 4 }) {
  const policy = evaluatePolicy(task);
  if (policy.decision !== "allow") {
    return { policy, steps: [] };
  }

  const selected = routeAgents(agents, task, maxAgents);
  const steps = selected.map((agent, index) => ({
    id: `step-${index + 1}`,
    agent: agent.id,
    division: agent.division,
    objective: index === 0
      ? "Analyze the task and produce the primary work product."
      : "Review, extend, verify, or operationalize the preceding work.",
    dependsOn: index === 0 ? [] : [`step-${index}`]
  }));

  return { policy, steps };
}
