import styles from "./CardShell.module.css";

/**
 * Центрированная "карточка" ограниченной ширины на тёмном фоне — базовый layout
 * всех экранов (см. CLAUDE.md → Layout-решение из прототипа).
 */
export function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.pageBg}>
      <div className={styles.card}>{children}</div>
    </div>
  );
}
