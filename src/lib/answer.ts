/** trim + toLowerCase + схлопывание повторяющихся пробелов. Без fuzzy matching. */
export function normalizeAnswer(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function hashAnswer(raw: string): Promise<string> {
  const normalized = normalizeAnswer(raw);
  const bytes = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
