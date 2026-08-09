"use client";

import Image from "next/image";
import type { Guest } from "@/types/guest";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./EntryScreen.module.css";

interface TreeSegmentApple {
  guest: Guest;
  left: number;
  top: number;
}

interface TreeSegmentProps {
  src: string;
  apples: TreeSegmentApple[];
  onSelectGuest: (guest: Guest) => void;
  isLast?: boolean;
}

export function TreeSegment({ src, apples, onSelectGuest, isLast }: TreeSegmentProps) {
  const [ref, revealed] = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={`${styles.treeSegment} ${isLast ? styles.treeSegmentLast : ""}`}>
      <Image src={src} alt="" fill sizes="430px" />

      {apples.map(({ guest, left, top }, i) => (
        <button
          key={guest.id}
          type="button"
          className={styles.apple}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0.4)",
            transitionDelay: `${i * 0.15}s`,
          }}
          onClick={() => onSelectGuest(guest)}
        >
          <span className={styles.appleImage} aria-hidden="true">
            <Image src="/images/apple.webp" alt="" width={44} height={44} />
          </span>
          <span className={styles.appleLabel}>{guest.displayName}</span>
        </button>
      ))}
    </div>
  );
}
