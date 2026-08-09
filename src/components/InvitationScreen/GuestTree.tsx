"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Diamond } from "@/components/Atmosphere/Atmosphere";
import type { Guest } from "@/types/guest";
import { COUPLE_INITIALS, EVENT_DATE_SHORT } from "@/data/event";
import revealStyles from "@/components/RevealSection/RevealSection.module.css";
import styles from "./GuestTree.module.css";

interface GuestTreeProps {
  guests: Guest[];
}

// Позиции яблок на дереве (layout-деталь прототипа, %-координаты внутри treeFrame).
const APPLE_POSITIONS = [
  { left: 20, top: 16 },
  { left: 64, top: 10 },
  { left: 40, top: 26 },
  { left: 76, top: 36 },
  { left: 14, top: 44 },
  { left: 56, top: 50 },
  { left: 33, top: 60 },
];

export function GuestTree({ guests }: GuestTreeProps) {
  const [ref, revealed] = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={`${revealStyles.reveal} ${revealed ? revealStyles.revealed : ""} ${styles.section}`}>
      <div className={styles.diamond}>
        <Diamond />
      </div>
      <h2 className={styles.title}>Дерево имён</h2>

      <div className={styles.treeFrame}>
        <div className={styles.treeIllustration} role="img" aria-label="Дерево с красными яблоками и змеем вокруг ствола">
          <span aria-hidden="true" style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.05em", color: "oklch(0.60 0.02 78 / 0.85)", textAlign: "center", textTransform: "uppercase" }}>
            Иллюстрация · дерево с красными яблоками и змеем вокруг ствола
          </span>
        </div>
        {guests.map((guest, i) => {
          const pos = APPLE_POSITIONS[i % APPLE_POSITIONS.length] ?? { left: 50, top: 50 };
          return (
            <div
              key={guest.id}
              className={styles.apple}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                opacity: revealed ? 1 : 0,
                transform: revealed ? "scale(1)" : "scale(0.4)",
                transitionDelay: `${i * 0.22}s`,
              }}
            >
              <div className={styles.appleDot} aria-hidden="true" />
              <div className={styles.appleLabel}>{guest.displayName}</div>
            </div>
          );
        })}
      </div>

      <p className={styles.caption}>Каждое яблоко хранит имя того, кто рядом с нами в этот день</p>

      <div className={styles.footerDiamond}>
        <Diamond />
      </div>
      <div className={styles.footerNames}>{COUPLE_INITIALS}</div>
      <div className={styles.footerDate}>{EVENT_DATE_SHORT}</div>
    </div>
  );
}
