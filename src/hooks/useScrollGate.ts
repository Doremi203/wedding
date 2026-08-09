"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Двусторонний порог скролла: в отличие от `useScrollReveal` состояние не фиксируется
 * навсегда — элемент «открыт», пока пересекает суженную через `rootMargin` область
 * viewport, и снова «закрывается», когда уходит из неё при обратном скролле.
 * При reduced motion — всегда открыт.
 */
export function useScrollGate<T extends HTMLElement>(
  rootMargin: string,
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setOpen(entry.isIntersecting);
      },
      { threshold: 0, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, rootMargin]);

  return [ref, reducedMotion || open];
}
