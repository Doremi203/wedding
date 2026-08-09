// Подтверждённый контент — см. CLAUDE.md → Confirmed Content.
// Значения с TODO — правдоподобные placeholder'ы, ждут подтверждения заказчиком
// (см. CLAUDE.md → Open Questions). Найти все: grep -rn "TODO" src/data

export const COUPLE_NAMES = "ИРИНА & МАКСИМ";
export const COUPLE_INITIALS = "И · М";

export const EVENT_DATE_DAY = "13";
export const EVENT_DATE_MONTH = "Сентября";
export const EVENT_DATE_YEAR = "2026";
export const EVENT_DATE_LABEL = "13 сентября 2026";
export const EVENT_DATE_SHORT = "13.09.2026";

export const VENUE_NAME = "Усадьба Братцево";
export const VENUE_CITY = "Москва";
export const VENUE_ADDRESS = "Светлогорский проезд, 13";
// TODO: точное время сбора гостей не подтверждено заказчиком — сейчас правдоподобный placeholder.
export const GATHERING_TIME_TODO = "Сбор гостей — 11:00";

export const MAP_URL = `https://yandex.ru/maps/?text=${encodeURIComponent(
  "Усадьба Братцево, Светлогорский проезд 13, Москва",
)}`;

export const DRESS_CODE_COLORS = [
  { label: "Чёрный", swatchVar: "--color-bg-card" },
  { label: "Графит", swatchVar: "--color-graphite" },
  { label: "Бежевый", swatchVar: "--color-text-secondary" },
  { label: "Айвори", swatchVar: "--color-ivory" },
] as const;

// TODO: полный текст дресс-кода не подтверждён — сейчас только цвета (чёрный/бежевый).
export const DRESS_CODE_INTRO_TODO =
  "Будем благодарны, если в своих образах вы поддержите палитру нашего вечера.";

export const GIFTS_TEXT = {
  main: "Ваше присутствие — главный подарок для нас.",
  noFlowers: "Просим не дарить цветы.",
  envelope: "Если вы захотите сделать нам подарок, мы будем рады конверту.",
};

export const VERIFICATION_ERROR_TEXT =
  "Кажется, воспоминание немного затуманилось. Попробуйте ещё раз.";

export function greetingForGender(gender: "m" | "f"): string {
  return gender === "m" ? "Дорогой" : "Дорогая";
}
