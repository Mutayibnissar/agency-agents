import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePolicy } from "../src/policy.mjs";
import { routeAgents } from "../src/router.mjs";
import { planWorkflow } from "../src/workflow.mjs";
import { evaluateRun } from "../src/eval.mjs";

const agents = [
  { id: "frontend", name: "Frontend Developer", division: "engineering", description: "Build React and frontend interfaces.", content: "React TypeScript UI accessibility" },
  { id: "security", name: "Security Engineer", division: "security", description: "Application security reviews.", content: "OWASP threat modeling vulnerabilities" },
  { id: "growth", name: "Growth Marketer", division: "marketing", description: "Acquisition, lifecycle and experimentation.", content: "funnels retention SEO experiments" }
];

test("routes a task to semantically related agents", () => {
  const result = routeAgents(agents, "Review React frontend accessibility");
  assert.equal(result[0].id, "frontend");
});

test("blocks explicit malware requests", () => {
  assert.equal(evaluatePolicy("deploy malware and credential stealer").decision, "block");
});

test("flags destructive production requests for review", () => {
  assert.equal(evaluatePolicy("drop database in production").decision, "review");
});

test("builds a dependent workflow", () => {
  const plan = planWorkflow({ agents, task: "Build a React frontend and review security" });
  assert.equal(plan.steps[0].dependsOn.length, 0);
  assert.equal(plan.steps[1].dependsOn[0], "step-1");
});

test("evaluates expected capabilities", () => {
  const result = evaluateRun({
    expected: ["research", "review", "deliverable"],
    actual: ["research", "review", "deliverable"],
    requiredAgents: ["research"]
  });
  assert.equal(result.pass, true);
  assert.equal(result.coverage, 1);
});
