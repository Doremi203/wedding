"use client";

import { useState } from "react";
import type { Guest } from "@/types/guest";
import { verifyAnswer } from "@/lib/verification";
import { VERIFICATION_ERROR_TEXT } from "@/data/event";
import { Diamond } from "@/components/Atmosphere/Atmosphere";
import styles from "./VerificationModal.module.css";

interface VerificationModalProps {
  guest: Guest;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function VerificationModal({ guest, visible, onClose, onSuccess }: VerificationModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  async function handleSubmit() {
    if (checking || !value.trim()) return;
    setChecking(true);
    const ok = await verifyAnswer(guest, value);
    setChecking(false);
    if (ok) {
      onSuccess();
    } else {
      setError(true);
    }
  }

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
        aria-labelledby="verify-guest-name"
      >
        <div className={styles.eyebrow}>Личный вопрос</div>
        <div className={styles.guestName} id="verify-guest-name">
          {guest.displayName}
        </div>
        <div className={styles.diamond}>
          <Diamond />
        </div>
        <div className={styles.question}>{guest.question}</div>

        <label htmlFor="verify-answer" className="sr-only">
          Ваш ответ
        </label>
        <input
          id="verify-answer"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Ваш ответ"
          className={styles.input}
        />

        {error && (
          <div className={styles.error} role="alert">
            {VERIFICATION_ERROR_TEXT}
          </div>
        )}

        <button type="button" className={styles.submit} onClick={handleSubmit} disabled={checking}>
          Открыть приглашение
        </button>
        <button type="button" className={styles.back} onClick={onClose}>
          Вернуться к именам
        </button>
      </div>
    </>
  );
}
