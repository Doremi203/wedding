import { guests } from "@/data/guests";
import type { Gender } from "@/types/guest";

/**
 * Упрощённый режим (`/invitation?n=Имя`): гость приходит по персональной ссылке,
 * минуя дерево имён и вопрос-верификацию. Имя берётся из URL, поэтому его нужно
 * привести к безопасному для вёрстки виду и определить род для приветствия.
 */
export interface DirectGuest {
  displayName: string;
  gender: Gender;
}

/** Имя из URL не должно ломать вёрстку карточки — заведомо длинное обрезаем. */
const MAX_NAME_LENGTH = 40;

/**
 * Мужские имена (в т.ч. уменьшительные), оканчивающиеся на -а/-я — исключения
 * из правила "окончание -а/-я → женский род". Список заведомо неполный: для
 * любого неугаданного случая род задаётся явно через `?g=m` / `?g=f`.
 */
const MALE_NAMES_ENDING_IN_A = new Set([
  "никита",
  "илья",
  "кузьма",
  "фома",
  "савва",
  "сава",
  "лука",
  "данила",
  "гаврила",
  "саша",
  "паша",
  "миша",
  "гоша",
  "леша",
  "алеша",
  "дима",
  "вова",
  "витя",
  "коля",
  "толя",
  "сережа",
  "андрюша",
  "ваня",
  "костя",
  "петя",
  "боря",
  "гена",
  "рома",
  "слава",
  "юра",
  "жора",
  "тема",
  "сеня",
  "веня",
  "яша",
  "гриша",
  "кеша",
  "кирюша",
]);

function normalizeName(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ").replace(/ё/g, "е");
}

/** "ирина" → "Ирина"; уже написанное с заглавной остаётся как есть. */
function capitalizeFirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function genderFromName(name: string): Gender {
  const normalized = normalizeName(name);
  if (MALE_NAMES_ENDING_IN_A.has(normalized)) return "m";
  return /[ая]$/.test(normalized) ? "f" : "m";
}

function parseGenderParam(raw: string | null): Gender | null {
  if (raw === "m" || raw === "f") return raw;
  return null;
}

/**
 * Собирает гостя из query-параметров ссылки. Имя, совпавшее с гостем из
 * `data/guests`, берёт оттуда каноничное написание и род; всё остальное —
 * произвольное имя из ссылки (финальный список гостей ещё не прислан, см.
 * CLAUDE.md → Open Questions), род определяется по окончанию или параметром `g`.
 *
 * Возвращает `null`, если имя не передано или пустое — вызывающий код в этом
 * случае отправляет гостя на обычный ENTRY.
 */
export function directGuestFromParams(
  nameParam: string | null,
  genderParam: string | null = null,
): DirectGuest | null {
  if (!nameParam) return null;

  const cleaned = nameParam
    // Имя приходит из URL: оставляем только буквы, дефис и апостроф, всё
    // остальное (управляющие символы, разметку, эмодзи) схлопываем в пробел.
    .replace(/[^\p{L}\-'’ ]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAX_NAME_LENGTH)
    .trim();

  if (!cleaned) return null;

  const explicitGender = parseGenderParam(genderParam);
  const known = guests.find((guest) => normalizeName(guest.displayName) === normalizeName(cleaned));

  if (known) {
    return { displayName: known.displayName, gender: explicitGender ?? known.gender };
  }

  return {
    displayName: capitalizeFirst(cleaned),
    gender: explicitGender ?? genderFromName(cleaned),
  };
}
