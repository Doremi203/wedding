import Image from "next/image";
import { Fog, Moon } from "@/components/Atmosphere/Atmosphere";
import { COUPLE_NAMES, EVENT_DATE_LABEL, greetingForGender } from "@/data/event";
import type { Gender } from "@/types/guest";
import styles from "./Hero.module.css";

interface HeroProps {
  guestName: string;
  guestGender: Gender;
}

export function Hero({ guestName, guestGender }: HeroProps) {
  return (
    <div className={styles.hero}>
      <div className={styles.artBackground} aria-hidden="true">
        <Image
          src="/images/tower-dragons.webp"
          alt=""
          fill
          priority
          sizes="430px"
        />
      </div>

      <Fog variant="hero" />
      <Moon variant="hero" />

      <div className={styles.content}>
        <div className={styles.eyebrow}>{EVENT_DATE_LABEL}</div>
        <h1 className={styles.title}>
          {greetingForGender(guestGender)} {guestName}
        </h1>
        <p className={styles.lead}>Мы будем счастливы разделить этот день с тобой</p>
        <div className={styles.coupleNames}>{COUPLE_NAMES}</div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <div className={styles.scrollHintLabel}>Листайте вниз</div>
        <div className={styles.scrollHintArrow}>↓</div>
      </div>
    </div>
  );
}
