"use client";

import Image from "next/image";
import type { Guest } from "@/types/guest";
import { Eyebrow, Fog, Moon } from "@/components/Atmosphere/Atmosphere";
import { useScrollGate } from "@/hooks/useScrollGate";
import styles from "./EntryScreen.module.css";

interface EntryScreenProps {
  guests: Guest[];
  onSelectGuest: (guest: Guest) => void;
}

// Дерево — единая иллюстрация (/images/entry-tree.webp, исходник 793×1983), крона идёт сверху
// вниз одним полотном. 39 слотов под яблоки размещены вручную внутри кроны — %-координаты
// внутри artStage, контейнер точно повторяет пропорции картинки, без кропа.
const APPLE_POSITIONS: { left: number; top: number }[] = [
  { left: 40, top: 5 },
  { left: 60, top: 5 },
  { left: 25, top: 12 },
  { left: 50, top: 12 },
  { left: 75, top: 12 },
  { left: 15, top: 19 },
  { left: 38, top: 19 },
  { left: 62, top: 19 },
  { left: 85, top: 19 },
  { left: 10, top: 26 },
  { left: 37, top: 26 },
  { left: 63, top: 26 },
  { left: 90, top: 26 },
  { left: 9, top: 33 },
  { left: 28, top: 33 },
  { left: 48, top: 33 },
  { left: 68, top: 33 },
  { left: 89, top: 33 },
  { left: 8, top: 40 },
  { left: 27, top: 40 },
  { left: 47, top: 40 },
  { left: 67, top: 40 },
  { left: 90, top: 40 },
  { left: 11, top: 47 },
  { left: 30, top: 47 },
  { left: 50, top: 47 },
  { left: 70, top: 47 },
  { left: 88, top: 47 },
  { left: 15, top: 54 },
  { left: 38, top: 54 },
  { left: 61, top: 54 },
  { left: 84, top: 54 },
  { left: 18, top: 61 },
  { left: 39, top: 61 },
  { left: 60, top: 61 },
  { left: 81, top: 61 },
  { left: 25, top: 68 },
  { left: 49, top: 68 },
  { left: 73, top: 68 },
];

export function EntryScreen({ guests, onSelectGuest }: EntryScreenProps) {
  // Дерево раскрывается, когда его верх поднимается в верхнюю треть экрана (то есть hero
  // уже пролистан), и снова закрывается сплошной заливкой seam-тона башни при обратном
  // скролле наверх — порог работает в обе стороны.
  const [treeRef, treeRevealed] = useScrollGate<HTMLDivElement>("0px 0px -70% 0px");

  return (
    <div className={styles.screen}>
      <div className={styles.hero}>
        <div className={styles.artBackground} aria-hidden="true">
          <Image src="/images/tower-dragons.webp" alt="" fill priority sizes="430px" />
        </div>

        <Fog variant="select" />
        <Moon variant="select" />

        <div className={styles.header}>
          <Eyebrow>Приглашение на свадьбу</Eyebrow>
        </div>

        <div className={styles.titleBlock}>
          <h1 className="sr-only">Добро пожаловать</h1>
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <div className={styles.scrollHintLabel}>Листайте вниз, чтобы найти своё имя среди ветвей</div>
          <div className={styles.scrollHintArrow}>↓</div>
        </div>
      </div>

      <h2 className="sr-only">Список гостей</h2>
      <div
        ref={treeRef}
        className={styles.treeSegment}
        data-revealed={treeRevealed ? "" : undefined}
        inert={!treeRevealed}
      >
        <Image src="/images/entry-tree.webp" alt="" fill sizes="430px" />

        {guests.map((guest, i) => {
          const pos = APPLE_POSITIONS[i % APPLE_POSITIONS.length] ?? { left: 50, top: 50 };
          return (
            <button
              key={guest.id}
              type="button"
              className={styles.apple}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                opacity: treeRevealed ? 1 : 0,
                transform: treeRevealed ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0.4)",
                // Яблоки загораются уже после того, как заливка начала растворяться;
                // при обратном скролле гаснут разом, без каскада и задержки.
                transitionDelay: treeRevealed ? `${0.45 + i * 0.06}s` : "0s",
              }}
              onClick={() => onSelectGuest(guest)}
            >
              <span className={styles.appleImage} aria-hidden="true">
                <Image src="/images/apple.webp" alt="" width={30} height={30} />
              </span>
              <span className={styles.appleLabel}>{guest.displayName}</span>
            </button>
          );
        })}

        {/* Пока не пролистали ниже порога — дерево полностью скрыто заливкой того же тона,
            в который гаснет низ башни: визуально это просто продолжение первого фона. */}
        <div
          className={styles.treeVeil}
          data-lifted={treeRevealed ? "" : undefined}
          aria-hidden="true"
        />
      </div>

      <p className={styles.caption}>Прикоснитесь к яблоку, чтобы найти своё имя</p>
    </div>
  );
}
