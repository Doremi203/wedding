import { hashAnswer } from "@/lib/answer";
import type { Guest, GuestWithQuestion } from "@/types/guest";

/**
 * Вопрос задан только для гостей из whitelist (в data/guests.source.json есть question + answers).
 * Остальным показывается приветственная модалка без проверки.
 */
export function requiresVerification(guest: Guest): guest is GuestWithQuestion {
  return Boolean(guest.question && guest.acceptedAnswerHashes?.length);
}

/** Не реальная security-граница — атмосферная проверка "свой/чужой". См. CLAUDE.md → Verification & Privacy. */
export async function verifyAnswer(guest: GuestWithQuestion, rawInput: string): Promise<boolean> {
  const hash = await hashAnswer(rawInput);
  return guest.acceptedAnswerHashes.includes(hash);
}
