# Свадебное приглашение — Ирина & Максим

Приватный сайт-приглашение. Next.js 16 (App Router, TypeScript), статический экспорт для ручной заливки в S3-совместимое хранилище (сейчас — Yandex Object Storage, см. `terraform/`).

Подробности архитектуры, дизайн-токенов и продуктовых решений — в [`CLAUDE.md`](./CLAUDE.md).

## Требования

- Node.js 20+ (проверялось на Node 26)
- npm

## Установка

```bash
npm install
```

## Запуск локально (dev-сервер)

```bash
npm run dev
```

Открыть http://localhost:3000.

Флоу для проверки: ENTRY (найти своё имя в списке) → VERIFICATION (модалка с личным вопросом) → INVITATION (скролл через hero/дату/дресс-код/подарки/дерево имён).

Сейчас у всех гостей-placeholder'ов (см. `src/data/guests.ts`) один и тот же ответ на вопрос «Где мы впервые встретились?» — **москва** (или **moscow**). Это временные данные, ждут реальных от заказчика (см. `CLAUDE.md` → Open Questions).

## Проверки перед коммитом/PR

```bash
npm run typecheck   # tsc --noEmit
npm run lint         # eslint .
npm run build        # next build — собирает статику в out/
```

`npm run build` обязателен для проверки, что проект вообще собирается в статику (dev-сервер этого не гарантирует).

## Сборка для продакшена

```bash
npm run build
```

Результат — статическая директория `out/`. Она целиком заливается в бакет (see `terraform/`), например:

```bash
aws s3 sync out/ s3://<bucket-name> --delete
```

(или аналогичная команда для Yandex Object Storage — `yc storage s3` совместим с S3 API).

Сервер (`next start`) не используется — прод полностью статичен (`output: 'export'` в `next.config.ts`), никакого server-side рантайма (Route Handlers, Server Actions, middleware) на проде нет.

## Обновление данных гостей

Реальные ответы гостей никогда не хранятся в открытом виде в коде — только SHA-256-хэши.

1. Отредактировать (или создать) `data/guests.source.json` — plaintext-формат, см. пример в `data/guests.source.example.json`. Этот файл в `.gitignore`, не коммитится.
2. Перегенерировать хэши:

   ```bash
   npm run hash-answers
   ```

   Это перезапишет `src/data/guests.ts` (коммитится — содержит только хэши, не сам текст ответов).

## Структура проекта

```
src/
  app/            — App Router: layout, страница, globals.css, metadata (robots: noindex)
  components/      — React-компоненты (CSS Modules рядом с каждым)
  data/            — гости (сгенерировано) + контент события (даты, адрес, тексты)
  hooks/           — useReducedMotion, useScrollReveal
  lib/             — normalizeAnswer/hashAnswer, verifyAnswer
  types/           — общие TypeScript-типы
public/            — статические ассеты (оптимизированный hero-арт, robots.txt)
scripts/           — hash-answers.mjs (генератор src/data/guests.ts)
data/              — источник ответов гостей (plaintext, gitignored) + пример формата
terraform/         — инфраструктура деплоя (Yandex Object Storage + DNS + сертификат)
Wedding Invitation.dc.html, support.js — исходный прототип (reference only, не production-код)
```

## Известные ограничения (первая версия)

- Guest list и ответы на личный вопрос — placeholder, не финальные.
- Иллюстрации карты усадьбы, конверта и дерева — текстовые заглушки (`PlaceholderIllustration`), арт ещё не создан.
- Точное время сбора гостей, полный текст дресс-кода и другие детали — не подтверждены заказчиком.

Полный список открытых вопросов — в `CLAUDE.md` → Open Questions.
