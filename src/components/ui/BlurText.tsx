"use client";

import { useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface BlurTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
}

/**
 * Word-by-word blur-in reveal, adapted from the React Bits "BlurText" pattern.
 * The full sentence stays in the DOM for screen readers and search engines.
 */
export default function BlurText({ text, as: Tag = "h1", className, delay = 0.1 }: BlurTextProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-word]", {
          autoAlpha: 0,
          y: 14,
          filter: "blur(10px)",
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.06,
          delay,
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden="true" data-word className="inline-block">
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
