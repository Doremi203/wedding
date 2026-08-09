import { Diamond } from "@/components/Atmosphere/Atmosphere";
import { DRESS_CODE_COLORS, DRESS_CODE_INTRO_TODO } from "@/data/event";
import styles from "./DressCode.module.css";

export function DressCode() {
  return (
    <div className={styles.section}>
      <div className={styles.diamond}>
        <Diamond />
      </div>
      <h2 className={styles.title}>Дресс-код</h2>
      <p className={styles.intro}>{DRESS_CODE_INTRO_TODO}</p>
      <div className={styles.swatches}>
        {DRESS_CODE_COLORS.map((color) => (
          <div key={color.label} className={styles.swatchItem}>
            <div className={styles.swatch} style={{ background: `var(${color.swatchVar})` }} />
            <div className={styles.swatchLabel}>{color.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
