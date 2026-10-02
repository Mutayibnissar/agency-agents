function tokens(text) {
  return new Set(
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter(token => token.length > 2)
  );
}

export function scoreAgent(agent, task) {
  const query = tokens(task);
  const corpus = tokens([
    agent.name,
    agent.description,
    agent.division,
    agent.content.slice(0, 12000)
  ].join(" "));
  let score = 0;
  for (const token of query) {
    if (corpus.has(token)) score += 1;
  }
  const division = String(agent.division).toLowerCase();
  const taskText = String(task).toLowerCase();
  if (taskText.includes(division)) score += 3;
  return score;
}

export function routeAgents(agents, task, limit = 5) {
  if (!task?.trim()) return [];
  return agents
    .map(agent => ({ ...agent, score: scoreAgent(agent, task) }))
    .filter(agent => agent.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit);
}
