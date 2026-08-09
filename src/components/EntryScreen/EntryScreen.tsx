"use client";

import Image from "next/image";
import type { Guest } from "@/types/guest";
import { Diamond, Eyebrow, Fog, Moon } from "@/components/Atmosphere/Atmosphere";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./EntryScreen.module.css";

interface EntryScreenProps {
  guests: Guest[];
  onSelectGuest: (guest: Guest) => void;
}

// Позиции яблок на кроне дерева (layout-деталь, %-координаты внутри treeStage — контейнер точно
// повторяет пропорции entry-tree.webp, без кропа, поэтому координаты соответствуют иллюстрации).
const APPLE_POSITIONS = [
  { left: 68, top: 10 },
  { left: 22, top: 16 },
  { left: 78, top: 29 },
  { left: 15, top: 37 },
  { left: 48, top: 45 },
  { left: 80, top: 54 },
  { left: 14, top: 58 },
];

export function EntryScreen({ guests, onSelectGuest }: EntryScreenProps) {
  const [treeRef, revealed] = useScrollReveal<HTMLDivElement>();

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
          <div className={styles.diamondTop}>
            <Diamond />
          </div>
          <h1 className="sr-only">Добро пожаловать</h1>
          <div className={styles.subtitle}>Найдите своё имя среди ветвей</div>
          <div className={styles.diamondBottom}>
            <Diamond />
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <div className={styles.scrollHintLabel}>Листайте вниз</div>
          <div className={styles.scrollHintArrow}>↓</div>
        </div>
      </div>

      <div ref={treeRef} className={styles.treeStage}>
        <Image src="/images/entry-tree.webp" alt="Готическое дерево" fill sizes="430px" />

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
                opacity: revealed ? 1 : 0,
                transform: revealed ? "scale(1)" : "scale(0.4)",
                transitionDelay: `${i * 0.22}s`,
              }}
              onClick={() => onSelectGuest(guest)}
            >
              <span className={styles.appleImage} aria-hidden="true">
                <Image src="/images/apple.webp" alt="" width={56} height={56} />
              </span>
              <span className={styles.appleLabel}>{guest.displayName}</span>
            </button>
          );
        })}
      </div>

      <p className={styles.caption}>Прикоснитесь к яблоку, чтобы найти своё имя</p>
    </div>
  );
}
