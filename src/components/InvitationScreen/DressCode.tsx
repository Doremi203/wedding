import Image from "next/image";
import { DRESS_CODE_COLORS_TEXT, DRESS_CODE_SUBTITLE } from "@/data/event";
import { FloorEdge } from "./FloorEdge";
import styles from "./DressCode.module.css";

export function DressCode() {
  return (
    <section className={styles.section}>
      <div className={styles.background} aria-hidden="true">
        <Image
          src="/images/dresscode-banners.webp"
          alt=""
          fill
          sizes="430px"
          className={styles.banners}
        />
      </div>

      <FloorEdge />

      <div className={styles.content}>
        <h2 className={styles.title}>Дресс-код</h2>
        <p className={styles.subtitle}>{DRESS_CODE_SUBTITLE}</p>
        {/* Сама палитра показана баннерами на иллюстрации — дублируем текстом,
            иначе секция нечитаема скринридером. */}
        <p className="sr-only">{DRESS_CODE_COLORS_TEXT}</p>
      </div>
    </section>
  );
}
