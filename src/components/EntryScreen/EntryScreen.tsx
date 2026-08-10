"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Guest } from "@/types/guest";
import { Diamond, Fog, Moon } from "@/components/Atmosphere/Atmosphere";
import { useScrollGate } from "@/hooks/useScrollGate";
import styles from "./EntryScreen.module.css";

interface EntryScreenProps {
  guests: Guest[];
  onSelectGuest: (guest: Guest) => void;
}

// Дерево — единая иллюстрация (/images/entry-tree.webp, исходник 793×1983), крона идёт сверху
// вниз одним полотном. 38 слотов под яблоки размещены вручную внутри кроны — %-координаты
// внутри artStage, контейнер точно повторяет пропорции картинки, без кропа.
//
// Раскладка не произвольная и жёстко связана с порядком гостей в data/guests: i-й гость
// садится на i-й слот. Левая половина кроны (первый 21 слот) — род жениха, правая
// (оставшиеся 17) — род невесты, в обеих сверху вниз по убыванию близости: родители →
// бабушки и дедушки → дяди и тёти → братья и сёстры с парами → друзья. Пары стоят в одном
// ряду рядом друг с другом. Отсюда правило при любой правке списка: менять порядок в
// data/guests.source.json и координаты здесь нужно синхронно, иначе имена «переедут».
// Ряды идут с шагом 6 % высоты (≈64 px на карточке 430 px) — больше, чем высота яблока с
// подписью, поэтому соседние ряды не наезжают друг на друга; горизонтальный зазор между
// соседями в ряду — не меньше 20 %, чтобы не сталкивались самые длинные подписи.
const APPLE_POSITIONS: { left: number; top: number }[] = [
  // Сторона жениха — левая половина кроны.
  { left: 38, top: 4 }, // мама
  { left: 26, top: 10 }, // папа
  { left: 16, top: 16 }, // бабушка и дедушка по маминой линии
  { left: 36, top: 16 },
  { left: 12, top: 22 }, // бабушка и дедушка по папиной линии
  { left: 33, top: 22 },
  { left: 10, top: 28 }, // дядя и тётя
  { left: 31, top: 28 },
  { left: 9, top: 34 }, // двоюродный брат с женой
  { left: 30, top: 34 },
  { left: 9, top: 40 }, // двоюродная сестра с мужем
  { left: 30, top: 40 },
  { left: 10, top: 46 }, // друзья
  { left: 31, top: 46 },
  { left: 11, top: 52 },
  { left: 34, top: 52 },
  { left: 14, top: 58 },
  { left: 34, top: 58 },
  { left: 17, top: 64 },
  { left: 36, top: 64 },
  { left: 30, top: 70 },
  // Сторона невесты — правая половина кроны.
  { left: 62, top: 4 }, // мама
  { left: 74, top: 10 }, // папа
  { left: 64, top: 16 }, // бабушка и дедушка
  { left: 84, top: 16 },
  { left: 67, top: 22 }, // брат с девушкой
  { left: 88, top: 22 },
  { left: 69, top: 28 }, // дядя и тётя
  { left: 90, top: 28 },
  { left: 91, top: 34 }, // двоюродный брат с женой
  { left: 67, top: 34 },
  { left: 70, top: 40 }, // двоюродная сестра с парнем
  { left: 91, top: 40 },
  // Друзей у невесты вдвое меньше, чем у жениха, поэтому они идут не двумя колонками, как
  // слева, а зигзагом — иначе правая нижняя часть кроны оставалась бы пустой.
  { left: 70, top: 46 },
  { left: 81, top: 52 },
  { left: 66, top: 58 },
  { left: 76, top: 64 },
  { left: 62, top: 70 },
];

export function EntryScreen({ guests, onSelectGuest }: EntryScreenProps) {
  // Дерево раскрывается, когда его верх поднимается в верхнюю треть экрана (то есть hero
  // уже пролистан), и снова закрывается сплошной заливкой seam-тона башни при обратном
  // скролле наверх — порог работает в обе стороны.
  const [treeRef, treeRevealed] = useScrollGate<HTMLDivElement>("0px 0px -70% 0px");
  // Подсказка «Листайте вниз» живёт только в нетронутом первом экране: дерево заходит под низ
  // hero, и, останься она на месте, крона проявлялась бы прямо за ней. Порог намеренно ранний —
  // подпись успевает уйти задолго до того, как сработает гейт дерева. Не через useScrollGate:
  // тот при reduced motion открыт всегда, то есть подсказка исчезла бы, не показавшись.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.screen}>
      <div className={styles.hero}>
        <div className={styles.artBackground} aria-hidden="true">
          <Image src="/images/tower-dragons.webp" alt="" fill priority sizes="430px" />
        </div>

        <Fog variant="select" />
        <Moon variant="select" />

        {/* Титул — не мелкий eyebrow под шапкой, а центральный блок кадра: две строки
            в обрамлении линий и ромбов, ровно по центру между драконами. */}
        <div className={styles.titleBlock}>
          <div className={styles.rule} aria-hidden="true" />
          <Diamond />
          <h1 className={styles.title}>
            <span className={styles.titleLine}>Приглашение</span>
            <span className={styles.titleLine}>на свадьбу</span>
          </h1>
          <Diamond />
          <div className={styles.rule} aria-hidden="true" />
        </div>

        <div className={styles.scrollHint} data-hidden={scrolled ? "" : undefined} aria-hidden="true">
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
                <Image src="/images/apple.webp" alt="" width={33} height={33} />
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

        {/* Оверлей поверх картинки, а не отдельный блок под ней — экран заканчивается
            ровно там же, где заканчивается сама иллюстрация дерева. */}
        <p className={styles.caption}>Прикоснитесь к яблоку, чтобы найти своё имя</p>
      </div>
    </div>
  );
}
