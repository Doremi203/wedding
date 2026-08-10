// Подтверждённый контент — см. CLAUDE.md → Confirmed Content.
// Значения с TODO — правдоподобные placeholder'ы, ждут подтверждения заказчиком
// (см. CLAUDE.md → Open Questions). Найти все: grep -rn "TODO" src/data

export const COUPLE_NAMES = "ИРИНА & МАКСИМ";

export const EVENT_DATE_LABEL = "13 сентября 2026";

export const CEREMONY_VENUE = "Церковь Покрова Пресвятой Богородицы";
export const CEREMONY_ADDRESS = "Волоколамское шоссе, 52, корпус 1";
export const CEREMONY_TIME = "13:30";

export const VENUE_NAME = "Усадьба Братцево";
export const VENUE_ADDRESS = "Светлогорский проезд, 13";

// Время/адреса венчания и банкета нарисованы прямо в иллюстрации place-final.webp,
// поэтому её alt должен нести тот же текст — это единственный способ прочитать
// содержимое секции скринридером.
export const PLACE_ILLUSTRATION_ALT =
  `Ждём вас в ${CEREMONY_VENUE} на венчание в ${CEREMONY_TIME} ` +
  `(${CEREMONY_ADDRESS}). А затем на банкет в усадьбе Братцево (${VENUE_ADDRESS})`;

export const DRESS_CODE_SUBTITLE = "Палитра нашего вечера";

// Палитра показана баннерами на иллюстрации dresscode-banners.webp — дублируем её
// текстом для скринридеров (см. DressCode.tsx).
export const DRESS_CODE_COLORS_TEXT = "Чёрный и бежевый";

export const GIFTS_TEXT = {
  main: "Ваше присутствие — главный подарок для нас.",
  noFlowers: "Просим не дарить цветы.",
  envelope: "Если вы захотите сделать нам подарок, мы будем рады конверту.",
};

// Текст модалки для гостей без персонального вопроса (не входят в whitelist в data/guests.source.json).
export const WELCOME_MODAL_EYEBROW = "Приглашение";
export const WELCOME_MODAL_TEXT = "Добро пожаловать в наш замок любви";

export const VERIFICATION_ERROR_TEXT =
  "Кажется, воспоминание немного затуманилось. Попробуйте ещё раз.";

export function greetingForGender(gender: "m" | "f"): string {
  return gender === "m" ? "Дорогой" : "Дорогая";
}
