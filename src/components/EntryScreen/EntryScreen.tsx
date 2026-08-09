"use client";

import Image from "next/image";
import type { Guest } from "@/types/guest";
import { Diamond, Eyebrow, Fog, Moon } from "@/components/Atmosphere/Atmosphere";
import { TreeSegment } from "./TreeSegment";
import styles from "./EntryScreen.module.css";

interface EntryScreenProps {
  guests: Guest[];
  onSelectGuest: (guest: Guest) => void;
}

// Дерево собрано из 6 отдельных иллюстраций-сегментов (top → ... → end), уложенных друг под
// другом сверху вниз — так и сгенерирован арт. Файлы: /images/entry-tree-<segment>.webp.
const TREE_SEGMENT_FILES = ["top", "upper_middle", "middle", "lower_middle", "pre_end", "end"] as const;

// 39 слотов под яблоки (layout-деталь): %-координаты внутри своего сегмента — контейнер сегмента
// точно повторяет пропорции его иллюстрации, без кропа, поэтому координаты соответствуют арту.
// Порядок слотов совпадает с порядком сегментов сверху вниз, т.е. с порядком гостей на дереве.
const APPLE_SLOTS: { segment: number; left: number; top: number }[] = [
  // top
  { segment: 0, left: 68, top: 10 },
  { segment: 0, left: 22, top: 15 },
  { segment: 0, left: 80, top: 26 },
  { segment: 0, left: 12, top: 33 },
  { segment: 0, left: 50, top: 40 },
  { segment: 0, left: 85, top: 50 },
  { segment: 0, left: 15, top: 55 },
  // upper_middle
  { segment: 1, left: 18, top: 10 },
  { segment: 1, left: 78, top: 14 },
  { segment: 1, left: 10, top: 32 },
  { segment: 1, left: 85, top: 38 },
  { segment: 1, left: 28, top: 55 },
  { segment: 1, left: 68, top: 62 },
  // middle
  { segment: 2, left: 12, top: 8 },
  { segment: 2, left: 82, top: 10 },
  { segment: 2, left: 25, top: 24 },
  { segment: 2, left: 75, top: 28 },
  { segment: 2, left: 10, top: 42 },
  { segment: 2, left: 85, top: 48 },
  { segment: 2, left: 45, top: 58 },
  // lower_middle
  { segment: 3, left: 15, top: 9 },
  { segment: 3, left: 80, top: 14 },
  { segment: 3, left: 10, top: 30 },
  { segment: 3, left: 82, top: 36 },
  { segment: 3, left: 32, top: 52 },
  { segment: 3, left: 62, top: 65 },
  // pre_end
  { segment: 4, left: 10, top: 14 },
  { segment: 4, left: 85, top: 17 },
  { segment: 4, left: 20, top: 28 },
  { segment: 4, left: 78, top: 33 },
  { segment: 4, left: 12, top: 48 },
  { segment: 4, left: 83, top: 53 },
  { segment: 4, left: 45, top: 65 },
  // end
  { segment: 5, left: 10, top: 8 },
  { segment: 5, left: 85, top: 10 },
  { segment: 5, left: 10, top: 32 },
  { segment: 5, left: 85, top: 35 },
  { segment: 5, left: 14, top: 58 },
  { segment: 5, left: 84, top: 62 },
];

export function EntryScreen({ guests, onSelectGuest }: EntryScreenProps) {
  const guestsBySegment = TREE_SEGMENT_FILES.map((_, segIdx) =>
    guests
      .map((guest, i) => ({ guest, slot: APPLE_SLOTS[i % APPLE_SLOTS.length] ?? { segment: 0, left: 50, top: 50 } }))
      .filter(({ slot }) => slot.segment === segIdx)
      .map(({ guest, slot }) => ({ guest, left: slot.left, top: slot.top })),
  );

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

      <h2 className="sr-only">Список гостей</h2>
      <div className={styles.treeStage}>
        {TREE_SEGMENT_FILES.map((segment, segIdx) => (
          <TreeSegment
            key={segment}
            src={`/images/entry-tree-${segment}.webp`}
            apples={guestsBySegment[segIdx] ?? []}
            onSelectGuest={onSelectGuest}
            isLast={segIdx === TREE_SEGMENT_FILES.length - 1}
          />
        ))}
      </div>

      <p className={styles.caption}>Прикоснитесь к яблоку, чтобы найти своё имя</p>
    </div>
  );
}
