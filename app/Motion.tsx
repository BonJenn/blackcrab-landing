"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps an animated scene. Without JavaScript the scene shows its final,
 * fully composed state. Once mounted it is "armed" so the CSS keyframes apply,
 * and it only plays while it is on screen, so off-screen loops cost nothing.
 * Reduced-motion visitors keep the static state (see globals.css).
 */
export function Stage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    element.dataset.armed = "true";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) element.dataset.playing = "true";
        else delete element.dataset.playing;
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.armed;
      delete element.dataset.playing;
    };
  }, []);
  return (
    <div ref={ref} className={`scene ${className}`}>
      {children}
    </div>
  );
}
