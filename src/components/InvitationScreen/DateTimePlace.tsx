import Image from "next/image";
import { PLACE_ILLUSTRATION_ALT } from "@/data/event";
import styles from "./DateTimePlace.module.css";

export function DateTimePlace() {
  return (
    <section className={styles.section}>
      <div className={styles.background} aria-hidden="true">
        <Image src="/images/castle-wall.webp" alt="" fill sizes="430px" className={styles.wall} />
      </div>

      <div className={styles.content}>
        {/* Дата, время венчания и оба адреса нарисованы внутри иллюстрации —
            этот текст живёт в alt (PLACE_ILLUSTRATION_ALT). */}
        <Image
          src="/images/place-final.webp"
          alt={PLACE_ILLUSTRATION_ALT}
          width={900}
          height={1350}
          sizes="(max-width: 430px) 100vw, 374px"
          className={styles.scroll}
        />
      </div>
    </section>
  );
}
