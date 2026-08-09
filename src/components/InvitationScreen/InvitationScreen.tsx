import { RevealSection } from "@/components/RevealSection/RevealSection";
import type { Guest } from "@/types/guest";
import { Hero } from "./Hero";
import { DateTimePlace } from "./DateTimePlace";
import { DressCode } from "./DressCode";
import { Gifts } from "./Gifts";
import { Finale } from "./Finale";
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

      <RevealSection>
        <DateTimePlace />
      </RevealSection>

      <RevealSection>
        <DressCode />
      </RevealSection>

      <RevealSection>
        <Gifts />
      </RevealSection>

      <RevealSection>
        <Finale />
      </RevealSection>
    </div>
  );
}
