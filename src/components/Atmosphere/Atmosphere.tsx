import styles from "./Atmosphere.module.css";

export function Fog({ variant }: { variant: "select" | "hero" }) {
  const background =
    variant === "select"
      ? "radial-gradient(ellipse at 30% 20%, oklch(0.30 0.02 260 / 0.5), transparent 60%), radial-gradient(ellipse at 80% 70%, oklch(0.22 0.015 250 / 0.6), transparent 55%)"
      : "radial-gradient(ellipse at 50% 15%, oklch(0.30 0.02 260 / 0.5), transparent 55%), radial-gradient(ellipse at 20% 90%, oklch(0.18 0.015 250 / 0.7), transparent 55%)";
  const inset = variant === "select" ? "-10% -20%" : "-15% -25%";
  return (
    <div
      className={`om-fog ${styles.fog}`}
      style={{ background, inset }}
      aria-hidden="true"
    />
  );
}

export function Moon({ variant }: { variant: "select" | "hero" }) {
  const variantClass = variant === "select" ? styles.moonSelect : styles.moonHero;
  return <div className={`om-moon ${styles.moon} ${variantClass}`} aria-hidden="true" />;
}

export function Diamond() {
  return <div className={styles.diamond} aria-hidden="true" />;
}
