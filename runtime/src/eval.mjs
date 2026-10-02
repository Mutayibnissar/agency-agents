export function evaluateRun({ expected = [], actual = [], requiredAgents = [] }) {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  const requiredSet = new Set(requiredAgents);

  const matched = [...expectedSet].filter(item => actualSet.has(item));
  const missing = [...expectedSet].filter(item => !actualSet.has(item));
  const requiredMissing = [...requiredSet].filter(item => !actualSet.has(item));

  const coverage = expectedSet.size ? matched.length / expectedSet.size : 1;
  return {
    pass: requiredMissing.length === 0 && coverage >= 0.8,
    coverage,
    matched,
    missing,
    requiredMissing
  };
}
