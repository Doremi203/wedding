import { Diamond } from "@/components/Atmosphere/Atmosphere";
import { PlaceholderIllustration } from "@/components/PlaceholderIllustration/PlaceholderIllustration";
import {
  EVENT_DATE_DAY,
  EVENT_DATE_MONTH,
  EVENT_DATE_YEAR,
  GATHERING_TIME_TODO,
  MAP_URL,
  VENUE_ADDRESS,
  VENUE_CITY,
  VENUE_NAME,
} from "@/data/event";
import styles from "./DateTimePlace.module.css";

export function DateTimePlace() {
  return (
    <div className={styles.section}>
      <div className={styles.diamond}>
        <Diamond />
      </div>

      <div className={styles.day}>{EVENT_DATE_DAY}</div>
      <div className={styles.monthYear}>{EVENT_DATE_MONTH}</div>
      <div className={styles.monthYear}>{EVENT_DATE_YEAR}</div>

      <div className={styles.venueName}>{VENUE_NAME}</div>
      <div className={styles.venueCity}>{VENUE_CITY}</div>
      <div className={styles.venueAddress}>{VENUE_ADDRESS}</div>
      <div className={styles.gatheringTime}>{GATHERING_TIME_TODO}</div>

      <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className={styles.mapCta}>
        Построить маршрут
      </a>

      <div className={styles.mapPlaceholder}>
        <PlaceholderIllustration
          aspectRatio="4 / 3"
          angle={70}
          label="Иллюстрация · гравированный фрагмент карты усадьбы"
        />
      </div>
    </div>
  );
}
