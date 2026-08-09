"use client";

import type { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./RevealSection.module.css";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
}

export function RevealSection({ children, className }: RevealSectionProps) {
  const [ref, revealed] = useScrollReveal<HTMLDivElement>();
  const classes = [styles.reveal, revealed && styles.revealed, className].filter(Boolean).join(" ");

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}
