"use client";

import { useState } from "react";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Diamond } from "@/components/Atmosphere/Atmosphere";
import type { Guest } from "@/types/guest";
import { COUPLE_INITIALS, EVENT_DATE_SHORT } from "@/data/event";
import { GuestNameModal } from "./GuestNameModal";
import revealStyles from "@/components/RevealSection/RevealSection.module.css";
import styles from "./GuestTree.module.css";

interface GuestTreeProps {
  guests: Guest[];
}

const MODAL_TRANSITION_MS = 400;

// Позиции яблок на дереве (layout-деталь, %-координаты внутри treeFrame с учётом object-fit: cover).
const APPLE_POSITIONS = [
  { left: 26, top: 27 },
  { left: 68, top: 16 },
  { left: 46, top: 40 },
  { left: 85, top: 53 },
  { left: 14, top: 61 },
  { left: 60, top: 73 },
  { left: 33, top: 85 },
];

export function GuestTree({ guests }: GuestTreeProps) {
  const [ref, revealed] = useScrollReveal<HTMLDivElement>();
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  function openModal(guest: Guest) {
    setSelectedGuest(guest);
    setTimeout(() => setModalVisible(true), 20);
  }

  function closeModal() {
    setModalVisible(false);
    setTimeout(() => setSelectedGuest(null), MODAL_TRANSITION_MS);
  }

  return (
    <div ref={ref} className={`${revealStyles.reveal} ${revealed ? revealStyles.revealed : ""} ${styles.section}`}>
      <div className={styles.diamond}>
        <Diamond />
      </div>
      <h2 className={styles.title}>Дерево имён</h2>

      <div className={styles.treeFrame}>
        <Image
          src="/images/guest-tree.webp"
          alt="Готическое дерево с тёмно-красными яблоками"
          fill
          sizes="430px"
        />
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
              onClick={() => openModal(guest)}
              aria-label={`Открыть пожелание для гостя: ${guest.displayName}`}
            >
              <span className={styles.appleDot} aria-hidden="true" />
              <span className={styles.appleLabel}>{guest.displayName}</span>
            </button>
          );
        })}
      </div>

      <p className={styles.caption}>Каждое яблоко хранит имя того, кто рядом с нами в этот день</p>

      <div className={styles.footerDiamond}>
        <Diamond />
      </div>
      <div className={styles.footerNames}>{COUPLE_INITIALS}</div>
      <div className={styles.footerDate}>{EVENT_DATE_SHORT}</div>

      {selectedGuest && <GuestNameModal guest={selectedGuest} visible={modalVisible} onClose={closeModal} />}
    </div>
  );
}
