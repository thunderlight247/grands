"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Height of the sticky navbar, so anchor jumps don't hide headings under it. */
const NAV_OFFSET = -72;

const LenisContext = createContext<Lenis | null>(null);

/** The active Lenis instance, or null when reduced motion disables smoothing. */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      lerp: 0.1,
      anchors: { offset: NAV_OFFSET },
      autoRaf: false,
    });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Image and font loading shifts layout; recompute trigger positions after.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    // Exposed through context so the cart drawer can pause page scrolling.
    queueMicrotask(() => setLenis(instance));

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
