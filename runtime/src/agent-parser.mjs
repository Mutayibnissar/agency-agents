import fs from "node:fs/promises";
import path from "node:path";

const NON_DIVISIONS = new Set([
  ".git", ".github", "examples", "integrations", "scripts", "runtime"
]);

function parseFrontmatter(text) {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---", 3);
  if (end < 0) return {};
  const block = text.slice(3, end).trim();
  const result = {};
  for (const line of block.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[match[1]] = value;
  }
  return result;
}

async function walk(dir, root, out) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".") || NON_DIVISIONS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, root, out);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const text = await fs.readFile(full, "utf8");
      const meta = parseFrontmatter(text);
      const relative = path.relative(root, full).replaceAll(path.sep, "/");
      const division = relative.split("/")[0];
      out.push({
        id: meta.name || path.basename(entry.name, ".md"),
        name: meta.name || path.basename(entry.name, ".md"),
        description: meta.description || "",
        division,
        path: relative,
        content: text
      });
    }
  }
}

export async function loadAgents(repoRoot) {
  const root = path.resolve(repoRoot);
  const agents = [];
  await walk(root, root, agents);
  return agents.sort((a, b) => a.name.localeCompare(b.name));
}
