export type Gender = "m" | "f";

export interface Guest {
  id: string;
  displayName: string;
  gender: Gender;
  question: string;
  /** SHA-256(normalizeAnswer(answer)) hex digests — никогда не plaintext. См. scripts/hash-answers.mjs */
  acceptedAnswerHashes: string[];
}
