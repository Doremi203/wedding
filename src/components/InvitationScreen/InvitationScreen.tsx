import { RevealSection } from "@/components/RevealSection/RevealSection";
import type { Guest } from "@/types/guest";
import { Hero } from "./Hero";
import { DateTimePlace } from "./DateTimePlace";
import { DressCode } from "./DressCode";
import { Gifts } from "./Gifts";
import styles from "./InvitationScreen.module.css";

interface InvitationScreenProps {
  guest: Guest;
  onBack: () => void;
}

export function InvitationScreen({ guest, onBack }: InvitationScreenProps) {
  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.backLink} onClick={onBack}>
        ← Имена
      </button>

      <RevealSection>
        <Hero guestName={guest.displayName} guestGender={guest.gender} />
      </RevealSection>

      {/* Арт-секции намеренно без scroll-reveal: фоны-кадры должны быть видны
          сразу и статично, появление здесь читалось как мерцание фона. */}
      <DateTimePlace />
      <DressCode />
      <Gifts />
    </div>
  );
}
