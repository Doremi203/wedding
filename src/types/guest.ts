export type Gender = "m" | "f";

interface GuestBase {
  id: string;
  displayName: string;
  gender: Gender;
}

/** Гость из whitelist: в source-файле для него задан персональный вопрос и ответы. */
export interface GuestWithQuestion extends GuestBase {
  question: string;
  /** SHA-256(normalizeAnswer(answer)) hex digests — никогда не plaintext. См. scripts/hash-answers.mjs */
  acceptedAnswerHashes: string[];
}

/** Гость без вопроса — вместо верификации показывается приветственная модалка. */
export interface GuestWithoutQuestion extends GuestBase {
  question?: undefined;
  acceptedAnswerHashes?: undefined;
}

export type Guest = GuestWithQuestion | GuestWithoutQuestion;
