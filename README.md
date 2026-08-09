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

Результат — статическая директория `out/`. Она целиком заливается в бакет, созданный терраформом (`terraform/`), через S3-совместимый API Object Storage.

```bash
make release   # npm run build + деплой
# или по отдельности:
make build
make deploy    # эквивалент ./scripts/deploy.sh — используй, если out/ уже собран
```

### Разовая настройка кредов (`wedding-s3` профиль)

`scripts/deploy.sh` не тянет креды из `terraform output` — стейт лежит в S3-бэкенде, и чтобы его прочитать, terraform сам уже должен быть авторизован теми же кредами (циклическая зависимость). Вместо этого креды один раз кладутся в AWS CLI профиль `wedding-s3` (`~/.aws/credentials`), а `deploy.sh` берёт их оттуда автоматически (либо использует уже экспортированные `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`, если они заданы).

Выполнить один раз, у кого есть доступ `yc` (авторизован `yc init`) к каталогу с сервисным аккаунтом `wedding-storage-admin`:

```bash
KEY_JSON=$(yc iam access-key create \
  --service-account-name wedding-storage-admin \
  --description "Local deploy key ($(whoami)@$(hostname -s))" \
  --format json)

aws configure set aws_access_key_id     "$(echo "$KEY_JSON" | jq -r '.access_key.key_id')" --profile wedding-s3
aws configure set aws_secret_access_key "$(echo "$KEY_JSON" | jq -r '.secret')"              --profile wedding-s3
aws configure set region ru-central1 --profile wedding-s3

unset KEY_JSON
```

Ключ выпускается отдельно от терраформ-стейта (не через `terraform output`) — можно смело выпускать по одному на человека/машину и отзывать через `yc iam access-key delete <id>`, не трогая ресурс `yandex_iam_service_account_static_access_key.storage_admin_key` в terraform.

Креды (`AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`) не нужно экспортировать вручную — `scripts/deploy.sh` сам подтягивает их через `terraform output -raw` из применённого стейта в `terraform/`. Если стейта нет локально или `terraform` не установлен, скрипт падает с понятной ошибкой; в этом случае креды можно передать через переменные окружения самостоятельно (тогда автоматический lookup пропускается).

`scripts/deploy.sh` заливает `_next/static/**` (хэшированные, immutable-ассеты) с длинным кэшем, а всё остальное (`index.html`, `robots.txt`, картинки из `public/`) — с `must-revalidate`, и синкает с `--delete`, чтобы удалённые файлы пропадали из бакета.

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
