"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Content stays visible without JavaScript; only off-screen sections are animated. */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || preference.matches || !("IntersectionObserver" in window))
      return;
    const reveal = () => {
      element.classList.remove("reveal-waiting");
    };
    if (element.getBoundingClientRect().top > window.innerHeight)
      element.classList.add("reveal-waiting");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -35px 0px", threshold: 0 },
    );
    observer.observe(element);
    preference.addEventListener("change", reveal);
    element.addEventListener("focusin", reveal);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", reveal);
      element.removeEventListener("focusin", reveal);
    };
  }, []);
  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}
