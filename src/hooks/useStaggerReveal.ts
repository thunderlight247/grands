"use client";

import { type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Staggered fade-up entrance for elements matching `selector` inside `scope`.
 * Scoped to the container, reverted on unmount and skipped for reduced motion.
 */
export function useStaggerReveal(
  scope: RefObject<HTMLElement | null>,
  selector: string,
  dependencies: unknown[] = [],
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = gsap.utils.toArray<HTMLElement>(selector);
        if (targets.length === 0) return;
        gsap.from(targets, {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: scope.current, start: "top 82%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope, dependencies, revertOnUpdate: true },
  );
}
