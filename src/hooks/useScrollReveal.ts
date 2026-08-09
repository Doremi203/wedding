"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Секция считается revealed при пересечении viewport (once) либо сразу — при reduced motion.
 * `rootMargin` позволяет сдвинуть границу срабатывания (например, требовать, чтобы элемент
 * поднялся выше середины экрана, а не просто показался краем).
 */
export function useScrollReveal<T extends HTMLElement>(
  rootMargin = "0px 0px -15% 0px",
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [observed, setObserved] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setObserved(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, rootMargin]);

  return [ref, reducedMotion || observed];
}
