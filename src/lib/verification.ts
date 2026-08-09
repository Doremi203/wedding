import { hashAnswer } from "@/lib/answer";
import type { Guest } from "@/types/guest";

/** Не реальная security-граница — атмосферная проверка "свой/чужой". См. CLAUDE.md → Verification & Privacy. */
export async function verifyAnswer(guest: Guest, rawInput: string): Promise<boolean> {
  const hash = await hashAnswer(rawInput);
  return guest.acceptedAnswerHashes.includes(hash);
}
