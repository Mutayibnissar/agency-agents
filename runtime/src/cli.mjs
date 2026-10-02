#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadAgents } from "./agent-parser.mjs";
import { routeAgents } from "./router.mjs";
import { evaluatePolicy } from "./policy.mjs";
import { planWorkflow } from "./workflow.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../..");
const [command, ...args] = process.argv.slice(2);

const agents = await loadAgents(repoRoot);

if (command === "list") {
  console.log(JSON.stringify({
    agents: agents.length,
    divisions: [...new Set(agents.map(a => a.division))].sort()
  }, null, 2));
} else if (command === "route") {
  const task = args.join(" ");
  console.log(JSON.stringify(routeAgents(agents, task), null, 2));
} else if (command === "plan") {
  const task = args.join(" ");
  console.log(JSON.stringify(planWorkflow({ agents, task }), null, 2));
} else if (command === "policy") {
  const task = args.join(" ");
  console.log(JSON.stringify(evaluatePolicy(task), null, 2));
} else {
  console.error("Usage: node runtime/src/cli.mjs <list|route|plan|policy> [task]");
  process.exit(1);
}
