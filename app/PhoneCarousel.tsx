"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const phones = [
  {
    src: "/ios/iphone-chats.png",
    label: "Threads",
    alt: "The thread list across two computers",
  },
  {
    src: "/ios/iphone-thread.png",
    label: "Conversation",
    alt: "An agent conversation about fixing a flaky test",
  },
  {
    src: "/ios/iphone-review.png",
    label: "Review",
    alt: "A code diff review of changes against main",
  },
  {
    src: "/ios/iphone-live.jpg",
    label: "Live Activity",
    alt: "A Live Activity on the Lock Screen waiting for approval",
  },
];

/**
 * The four iPhone screenshots glide past one another: the focused phone sits
 * in front and the others tilt away behind it. It advances on its own while
 * visible, pauses on hover or focus, and stays still for reduced motion.
 */
export function PhoneCarousel() {
  const [active, setActive] = useState(1);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    const element = root.current;
    let observer: IntersectionObserver | undefined;
    if (element && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => setVisible(entry.isIntersecting),
        { threshold: 0.35 },
      );
      observer.observe(element);
    }
    return () => {
      preference.removeEventListener("change", sync);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (still || paused || !visible) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % phones.length),
      2800,
    );
    return () => window.clearInterval(timer);
  }, [still, paused, visible]);

  const count = phones.length;
  return (
    <div
      ref={root}
      className="phones"
      data-still={still || undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="phones-track" role="group" aria-label="iPhone screenshots">
        {phones.map((phone, index) => {
          // -2..1 relative to the focused phone, wrapping around.
          const offset = ((index - active + 2 + count * 2) % count) - 2;
          return (
            <button
              type="button"
              key={phone.src}
              className="phone"
              data-offset={offset}
              style={{ ["--o" as string]: offset }}
              aria-label={`Show ${phone.label}`}
              aria-current={offset === 0}
              onClick={() => setActive(index)}
            >
              <span className="phone-body">
                <Image
                  src={phone.src}
                  alt={`Blackcrab on iPhone: ${phone.alt}`}
                  width={782}
                  height={1700}
                  sizes="(max-width: 800px) 46vw, 300px"
                />
              </span>
            </button>
          );
        })}
      </div>
      <div className="phones-dots" role="group" aria-label="Choose a screen">
        {phones.map((phone, index) => (
          <button
            type="button"
            key={phone.src}
            className="phones-dot"
            aria-label={phone.label}
            aria-pressed={index === active}
            onClick={() => setActive(index)}
          >
            <span>{phone.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
