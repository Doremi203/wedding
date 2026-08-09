import { RevealSection } from "@/components/RevealSection/RevealSection";
import type { Gender } from "@/types/guest";
import { Hero } from "./Hero";
import { DateTimePlace } from "./DateTimePlace";
import { DressCode } from "./DressCode";
import { Gifts } from "./Gifts";
import styles from "./InvitationScreen.module.css";

interface InvitationScreenProps {
  guestName: string;
  guestGender: Gender;
  /** Возврат к дереву имён. В упрощённом режиме (`/invitation?n=`) возвращаться некуда — кнопки нет. */
  onBack?: () => void;
}

export function InvitationScreen({ guestName, guestGender, onBack }: InvitationScreenProps) {
  return (
    <div className={styles.wrapper}>
      {onBack && (
        <button type="button" className={styles.backLink} onClick={onBack}>
          ← Имена
        </button>
      )}

      <RevealSection>
        <Hero guestName={guestName} guestGender={guestGender} />
      </RevealSection>

      {/* Арт-секции намеренно без scroll-reveal: фоны-кадры должны быть видны
          сразу и статично, появление здесь читалось как мерцание фона. */}
      <DateTimePlace />
      <DressCode />
      <Gifts />
    </div>
  );
}
