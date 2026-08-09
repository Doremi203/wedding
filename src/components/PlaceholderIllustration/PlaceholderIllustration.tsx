import type { CSSProperties, ReactNode } from "react";
import styles from "./PlaceholderIllustration.module.css";

interface PlaceholderIllustrationProps {
  aspectRatio: string;
  angle?: number;
  label: string;
  children?: ReactNode;
}

/**
 * Заглушка для арта, который ещё не создан (карта усадьбы, конверт среди ветвей, дерево).
 * См. CLAUDE.md — эти иллюстрации существуют в прототипе только как текстовые placeholder'ы.
 */
export function PlaceholderIllustration({ aspectRatio, angle, label, children }: PlaceholderIllustrationProps) {
  const style = { aspectRatio, "--angle": angle ? `${angle}deg` : undefined } as CSSProperties;
  return (
    <div className={styles.placeholder} style={style} role="img" aria-label={label}>
      <div className={styles.label} aria-hidden="true">
        {label}
      </div>
      {children}
    </div>
  );
}
