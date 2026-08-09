import { Diamond } from "@/components/Atmosphere/Atmosphere";
import { PlaceholderIllustration } from "@/components/PlaceholderIllustration/PlaceholderIllustration";
import { GIFTS_TEXT } from "@/data/event";
import styles from "./Gifts.module.css";

export function Gifts() {
  return (
    <div className={styles.section}>
      <div className={styles.diamond}>
        <Diamond />
      </div>
      <h2 className={styles.title}>Подарки</h2>
      <p className={styles.main}>{GIFTS_TEXT.main}</p>
      <p className={styles.secondary}>{GIFTS_TEXT.noFlowers}</p>
      <p className={styles.secondary}>{GIFTS_TEXT.envelope}</p>
      <div className={styles.illustration}>
        <PlaceholderIllustration
          aspectRatio="16 / 9"
          angle={150}
          label="Иллюстрация · символическая гравюра, конверт среди ветвей"
        />
      </div>
    </div>
  );
}
