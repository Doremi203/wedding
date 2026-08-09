import Image from "next/image";
import styles from "./FloorEdge.module.css";

/**
 * Декоративная кромка каменного пола на стыке секций: узкий горизонтальный срез
 * floor.webp, выходящий за края карточки. Чисто оформительский слой.
 */
export function FloorEdge() {
  return (
    <div className={styles.edge} aria-hidden="true">
      <Image src="/images/floor.webp" alt="" width={900} height={600} className={styles.image} />
    </div>
  );
}
