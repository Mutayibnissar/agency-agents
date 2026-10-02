const RULES = [
  {
    id: "secret-exfiltration",
    severity: "block",
    pattern: /(api[_ -]?key|password|private[_ -]?key|secret).{0,40}(send|upload|publish|exfiltrate)/i,
    message: "Potential credential or secret exfiltration request."
  },
  {
    id: "destructive-production",
    severity: "review",
    pattern: /(drop database|delete production|destroy production|rm -rf).{0,60}(prod|production|live)/i,
    message: "Potentially destructive production operation requires human review."
  },
  {
    id: "malware",
    severity: "block",
    pattern: /(ransomware|credential stealer|keylogger|deploy malware|persistence payload)/i,
    message: "Malware or credential-theft behavior is not allowed."
  }
];

export function evaluatePolicy(task) {
  const matches = RULES.filter(rule => rule.pattern.test(task));
  if (matches.some(rule => rule.severity === "block")) {
    return { decision: "block", matches };
  }
  if (matches.length) {
    return { decision: "review", matches };
  }
  return { decision: "allow", matches: [] };
}
