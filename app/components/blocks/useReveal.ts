"use client";

import { useEffect, useRef, useState } from "react";

/**
 * For opt-in section reveal animations: returns a ref to attach to the
 * section and a `shown` flag that flips true once the section is in view
 * AND any intro overlay has cleared (IntroVideo flags <html> with
 * .intro-active while it's on screen). A 30s safety forces it either way.
 *
 * The CSS keyed on `.wu-anim` / `.is-shown` does the actual animating.
 */
export function useReveal(enabled: boolean | undefined) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const root = document.documentElement;
    let inView = typeof IntersectionObserver === "undefined";
    let forced = false;
    let done = false;
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;
    let safety = 0;

    const maybeReveal = () => {
      if (done) return;
      if (!forced && (!inView || root.classList.contains("intro-active"))) return;
      done = true;
      setShown(true);
      io?.disconnect();
      mo?.disconnect();
      window.clearTimeout(safety);
    };

    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            inView = true;
            maybeReveal();
          }
        },
        { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );
      io.observe(el);
    }

    mo = new MutationObserver(maybeReveal);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });

    safety = window.setTimeout(() => {
      forced = true;
      maybeReveal();
    }, 30_000);

    maybeReveal();

    return () => {
      io?.disconnect();
      mo?.disconnect();
      window.clearTimeout(safety);
    };
  }, [enabled]);

  return { ref, shown };
}
