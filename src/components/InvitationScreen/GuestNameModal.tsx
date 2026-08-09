"use client";

import { useEffect } from "react";
import type { Guest } from "@/types/guest";
import { greetingForGender, GUEST_TREE_MODAL_TEXT } from "@/data/event";
import { Diamond } from "@/components/Atmosphere/Atmosphere";
import styles from "./GuestNameModal.module.css";

interface GuestNameModalProps {
  guest: Guest;
  visible: boolean;
  onClose: () => void;
}

export function GuestNameModal({ guest, visible, onClose }: GuestNameModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      <div
        className={`${styles.backdrop} ${visible ? styles.visible : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`${styles.panel} ${visible ? styles.visible : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-tree-name"
      >
        <div className={styles.eyebrow}>Дерево имён</div>
        <div className={styles.guestName} id="guest-tree-name">
          {greetingForGender(guest.gender)} {guest.displayName}
        </div>
        <div className={styles.diamond}>
          <Diamond />
        </div>
        <p className={styles.text}>{GUEST_TREE_MODAL_TEXT}</p>

        <button type="button" className={styles.close} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </>
  );
}
