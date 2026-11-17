"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const VIDEO = "/videos/hero-food-3d.mp4";
const POSTER = "/videos/hero-food-3d-poster.jpg";

/**
 * Looping 3D food carousel for the hero, rendered with Remotion (see /video).
 *
 * The video is square with the dishes kept in its middle, and its edges fade to
 * the hero panel colour (brand-800), so it can be cropped to any shape and
 * still blend in. The poster is always underneath, so the hero looks complete
 * before the video loads, for reduced-motion visitors and on Save-Data
 * connections. The video pauses while scrolled out of view to save battery.
 */
export default function HeroVideo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;

    let visible = true;
    const sync = () => {
      if (reducedMotion.matches || !visible) {
        video.pause();
      } else {
        video.play().catch(() => {
          // Autoplay blocked (e.g. low-power mode): the poster stays visible.
        });
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    reducedMotion.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div aria-hidden="true" className={`overflow-hidden ${className}`}>
      <Image
        src={POSTER}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 690px, 100vw"
        className="object-cover"
      />
      <video
        ref={ref}
        src={VIDEO}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        className="absolute inset-0 size-full object-cover motion-reduce:hidden"
      />
    </div>
  );
}
