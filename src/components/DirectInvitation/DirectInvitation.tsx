"use client";

import { useEffect, useState } from "react";
import { CardShell } from "@/components/CardShell/CardShell";
import { InvitationScreen } from "@/components/InvitationScreen/InvitationScreen";
import { directGuestFromParams, type DirectGuest } from "@/lib/directGuest";
import styles from "./DirectInvitation.module.css";

/**
 * Упрощённый режим для гостей, которым проще открыть готовую ссылку:
 * `/invitation?n=Ирина` (опционально `&g=m|f`) сразу показывает INVITATION —
 * без дерева имён и без вопроса-верификации.
 *
 * Query-параметры недоступны при статическом пререндере (`output: 'export'`),
 * поэтому читаем их из `window.location` после монтирования; до этого момента
 * рендерится пустая тёмная карточка, затем контент проявляется.
 */
export function DirectInvitation() {
  const [guest, setGuest] = useState<DirectGuest | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsed = directGuestFromParams(params.get("n"), params.get("g"));

    if (!parsed) {
      // Без имени персонального приглашения нет — отправляем гостя на обычный ENTRY.
      window.location.replace("/");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGuest(parsed);
  }, []);

  return (
    <CardShell>
      {guest && (
        <div className={styles.fadeIn}>
          <InvitationScreen guestName={guest.displayName} guestGender={guest.gender} />
        </div>
      )}
    </CardShell>
  );
}
