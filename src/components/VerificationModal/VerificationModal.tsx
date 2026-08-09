"use client";

import { useState } from "react";
import Image from "next/image";
import type { Guest } from "@/types/guest";
import { verifyAnswer } from "@/lib/verification";
import { VERIFICATION_ERROR_TEXT } from "@/data/event";
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

  const hasAnswer = value.trim().length > 0;

  async function handleSubmit() {
    if (checking || !hasAnswer) return;
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
        <Image
          src="/images/modal-frame.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="348px"
          // модалка монтируется уже во вьюпорте — lazy тут только задерживает рамку
          loading="eager"
          className={styles.frame}
        />

        <div className={styles.head}>
          <div className={styles.eyebrow}>Личный вопрос</div>
          <div className={styles.guestName} id="verify-guest-name">
            {guest.displayName}
          </div>
        </div>

        <div className={styles.body}>
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

          {/* CTA проявляется только когда есть ввод — так задано в дизайне.
              disabled (вместо pointer-events) держит невидимую кнопку вне таб-порядка. */}
          <button
            type="button"
            className={styles.submit}
            onClick={handleSubmit}
            disabled={!hasAnswer || checking}
          >
            Открыть приглашение
          </button>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.back} onClick={onClose}>
            Вернуться к именам
          </button>
        </div>
      </div>
    </>
  );
}
