import Image from "next/image";
import { GIFTS_TEXT } from "@/data/event";
import { FloorEdge } from "./FloorEdge";
import styles from "./Gifts.module.css";

export function Gifts() {
  return (
    <section className={styles.section}>
      <div className={styles.background} aria-hidden="true">
        <Image src="/images/library.webp" alt="" fill sizes="430px" className={styles.library} />
      </div>

      <FloorEdge />

      <div className={styles.content}>
        <h2 className={styles.title}>Подарки</h2>
        <p className={styles.main}>{GIFTS_TEXT.main}</p>
        <p className={styles.secondary}>{GIFTS_TEXT.noFlowers}</p>
        <p className={styles.secondary}>{GIFTS_TEXT.envelope}</p>

        <Image
          src="/images/envelope.webp"
          alt="Конверт с сургучной печатью"
          width={900}
          height={600}
          sizes="(max-width: 430px) 100vw, 374px"
          className={styles.envelope}
        />
      </div>
    </section>
  );
}
