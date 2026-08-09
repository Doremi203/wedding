"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Guest } from "@/types/guest";
import { Diamond, Eyebrow, Fog, Moon } from "@/components/Atmosphere/Atmosphere";
import styles from "./EntryScreen.module.css";

interface EntryScreenProps {
  guests: Guest[];
  onSelectGuest: (guest: Guest) => void;
}

export function EntryScreen({ guests, onSelectGuest }: EntryScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter((g) => g.displayName.toLowerCase().includes(q));
  }, [guests, searchQuery]);

  return (
    <div className={styles.screen}>
      <div className={styles.artBackground} aria-hidden="true">
        <Image
          src="/images/tower-dragons.webp"
          alt=""
          fill
          priority
          sizes="430px"
        />
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
        <h1 className={styles.title}>Добро пожаловать</h1>
        <div className={styles.subtitle}>Найдите своё имя</div>
        <div className={styles.diamondBottom}>
          <Diamond />
        </div>
      </div>

      <div className={styles.searchWrap}>
        <label htmlFor="guest-search" className="sr-only">
          Поиск по имени
        </label>
        <input
          id="guest-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Введите имя…"
          className={styles.searchInput}
        />
      </div>

      <ul className={styles.list}>
        {filtered.map((guest) => (
          <li key={guest.id}>
            <button
              type="button"
              className={styles.guestItem}
              onClick={() => onSelectGuest(guest)}
            >
              {guest.displayName}
            </button>
            <div className={styles.divider} aria-hidden="true" />
          </li>
        ))}
        {filtered.length === 0 && (
          <li className={styles.noResults}>Имя не найдено среди приглашённых</li>
        )}
      </ul>
    </div>
  );
}
