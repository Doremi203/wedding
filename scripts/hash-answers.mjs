#!/usr/bin/env node
// Конвертер plaintext-ответов гостей → src/data/guests.ts с SHA-256 хэшами.
// Вход: JSON-файл вида data/guests.source.example.json (см. пример), но с реальными
// plaintext-ответами. Реальный файл (data/guests.source.json) не должен попадать в git —
// он в .gitignore. Выход (src/data/guests.ts) содержит только хэши и коммитится.
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const srcPath = process.argv[2] ?? "data/guests.source.json";
const outPath = "src/data/guests.ts";

function normalizeAnswer(raw) {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

function hashAnswer(raw) {
  return createHash("sha256").update(normalizeAnswer(raw), "utf8").digest("hex");
}

async function main() {
  const absSrcPath = path.resolve(srcPath);
  const raw = await readFile(absSrcPath, "utf8");
  const guests = JSON.parse(raw);

  const entries = guests.map((g) => {
    if (!g.id || !g.displayName || !g.gender || !g.question || !Array.isArray(g.answers) || g.answers.length === 0) {
      throw new Error(`Invalid guest entry: ${JSON.stringify(g)}`);
    }
    return {
      id: g.id,
      displayName: g.displayName,
      gender: g.gender,
      question: g.question,
      acceptedAnswerHashes: g.answers.map(hashAnswer),
    };
  });

  const body = entries
    .map(
      (g) => `  {
    id: ${JSON.stringify(g.id)},
    displayName: ${JSON.stringify(g.displayName)},
    gender: ${JSON.stringify(g.gender)},
    question: ${JSON.stringify(g.question)},
    acceptedAnswerHashes: ${JSON.stringify(g.acceptedAnswerHashes)},
  },`,
    )
    .join("\n");

  const output = `// СГЕНЕРИРОВАНО из ${srcPath} скриптом scripts/hash-answers.mjs — не редактировать руками.
// Содержит только SHA-256 хэши ответов, не plaintext. Регенерировать: npm run hash-answers
// TODO: placeholder guest list/answers — заменить реальными данными от заказчика (см. CLAUDE.md → Open Questions).
import type { Guest } from "@/types/guest";

export const guests: Guest[] = [
${body}
];
`;

  await writeFile(path.resolve(outPath), output, "utf8");
  console.log(`Wrote ${entries.length} guests to ${outPath}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
