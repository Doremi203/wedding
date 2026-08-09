import { Diamond } from "@/components/Atmosphere/Atmosphere";
import { COUPLE_INITIALS, EVENT_DATE_SHORT } from "@/data/event";
import styles from "./Finale.module.css";

export function Finale() {
  return (
    <div className={styles.section}>
      <div className={styles.diamond}>
        <Diamond />
      </div>
      <div className={styles.names}>{COUPLE_INITIALS}</div>
      <div className={styles.date}>{EVENT_DATE_SHORT}</div>
    </div>
  );
}
