"use client";

import { useEffect, useRef, useState } from "react";

/** Milliseconds between reveal steps. Lower = smoother, higher = slower. */
const TICK_MS = 20;

/** Max characters revealed per step, so big bursts don't jump all at once. */
const MAX_STEP = 6;

/**
 * Reveals streamed text gradually, like ChatGPT, instead of drawing each chunk the moment it arrives.
 *
 * @param target - The full text received so far.
 * @param animate - When true, the text starts from empty and types out. When false, the full text shows immediately (used for saved messages).
 * @returns The portion of `target` to display right now.
 */
export function useSmoothText(target: string, animate: boolean) {
  const [count, setCount] = useState(() => (animate ? 0 : target.length));
  const targetRef = useRef(target);

  useEffect(() => {
    targetRef.current = target;
  });

  const behind = count < target.length;

  useEffect(() => {
    if (!behind) return;

    const id = setInterval(() => {
      setCount((current) => {
        const total = targetRef.current.length;
        if (current >= total) return current;

        // Reveal a fraction of the backlog each tick, so it slows down as it catches up.
        const step = Math.min(
          MAX_STEP,
          Math.max(1, Math.ceil((total - current) / 30)),
        );
        return Math.min(total, current + step);
      });
    }, TICK_MS);

    return () => clearInterval(id);
  }, [behind]);

  return target.slice(0, count);
}
