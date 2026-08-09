"use client";

import { useEffect, useState } from "react";
import type { Guest } from "@/types/guest";
import { CardShell } from "@/components/CardShell/CardShell";
import { EntryScreen } from "@/components/EntryScreen/EntryScreen";
import { VerificationModal } from "@/components/VerificationModal/VerificationModal";
import { InvitationScreen } from "@/components/InvitationScreen/InvitationScreen";
import styles from "./WeddingApp.module.css";

const SESSION_STORAGE_KEY = "wedding-unlocked-guest-id";
const TRANSITION_MS = 550;
const MODAL_TRANSITION_MS = 400;

type Screen = "select" | "invite";

interface WeddingAppProps {
  guests: Guest[];
}

export function WeddingApp({ guests }: WeddingAppProps) {
  const [screen, setScreen] = useState<Screen>("select");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Восстановление доступа в рамках browser session — см. CLAUDE.md → INVITATION.
  // sessionStorage недоступен при статическом prerender (SSR-снимок всегда 'select'),
  // поэтому чтение и коррекция состояния возможны только здесь, после монтирования на клиенте.
  useEffect(() => {
    const unlockedId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!unlockedId) return;
    const guest = guests.find((g) => g.id === unlockedId);
    if (guest) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedGuest(guest);
      setScreen("invite");
    }
  }, [guests]);

  function goToInvite(guest: Guest) {
    setOverlayVisible(true);
    setTimeout(() => {
      setScreen("invite");
      setTimeout(() => setOverlayVisible(false), 30);
    }, TRANSITION_MS);
    sessionStorage.setItem(SESSION_STORAGE_KEY, guest.id);
  }

  function goToSelect() {
    setOverlayVisible(true);
    setTimeout(() => {
      setScreen("select");
      setTimeout(() => setOverlayVisible(false), 30);
    }, TRANSITION_MS);
  }

  function handleSelectGuest(guest: Guest) {
    setSelectedGuest(guest);
    setModalOpen(true);
    setTimeout(() => setModalVisible(true), 20);
  }

  function closeModal() {
    setModalVisible(false);
    setTimeout(() => setModalOpen(false), MODAL_TRANSITION_MS);
  }

  function handleVerifySuccess() {
    setModalVisible(false);
    setTimeout(() => {
      setModalOpen(false);
      if (selectedGuest) goToInvite(selectedGuest);
    }, MODAL_TRANSITION_MS);
  }

  return (
    <CardShell>
      <div className={`${styles.overlay} ${overlayVisible ? styles.visible : ""}`} />

      {screen === "select" && <EntryScreen guests={guests} onSelectGuest={handleSelectGuest} />}

      {modalOpen && selectedGuest && (
        <VerificationModal
          key={selectedGuest.id}
          guest={selectedGuest}
          visible={modalVisible}
          onClose={closeModal}
          onSuccess={handleVerifySuccess}
        />
      )}

      {screen === "invite" && selectedGuest && (
        <InvitationScreen
          guestName={selectedGuest.displayName}
          guestGender={selectedGuest.gender}
          onBack={goToSelect}
        />
      )}
    </CardShell>
  );
}
