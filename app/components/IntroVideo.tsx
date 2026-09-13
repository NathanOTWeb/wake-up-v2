"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "playing" | "fading" | "done";

/** Fallback cap (used until the real duration is known) so a stalled or
 *  undecodable video can never trap the visitor. Once metadata loads, the
 *  timer is stretched to the clip's own length. */
const MAX_MS = 25_000;
/** Absolute ceiling regardless of clip length. */
const HARD_CAP_MS = 75_000;
/** Linger on the (paused) last frame after the clip ends, before fading. */
const DEFAULT_HOLD_MS = 1_500;

/**
 * Full-bleed intro that covers the page on load, plays once, then fades away.
 *
 * - `variant="hero"` (default, landing page): in landscape it covers only the
 *   left half, over the Lionhead + title.
 * - `variant="center"`: always a centred, letterboxed frame over the whole
 *   viewport.
 * - Autoplay requires the video to start muted + inline (browser policy); a
 *   "Tap for sound" control unmutes it.
 * - Tap anywhere (or the Skip button, or Esc) to dismiss early.
 * - Never renders inside Tina's editor iframe.
 */
export default function IntroVideo({
  src = "/media/wake-up-vertical.mp4",
  poster = "/media/wake-up-vertical-poster.jpg",
  variant = "hero",
  startHoldMs = 0,
  holdMs = DEFAULT_HOLD_MS,
  mobileFocus,
}: {
  src?: string;
  poster?: string;
  variant?: "hero" | "center";
  /** Hold the poster (no playback) for this long before starting the video
   *  — for a clip that opens on text that needs a moment to read. */
  startHoldMs?: number;
  /** Hold the paused last frame for this long after the clip ends, before
   *  fading. Overrides the default 1.5s. */
  holdMs?: number;
  /** Which side to keep in frame when a landscape clip is cropped to cover
   *  a portrait phone screen (variant="center" only). Default center. */
  mobileFocus?: "left" | "center" | "right";
} = {}) {
  const [phase, setPhase] = useState<Phase>("playing");
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const holdRef = useRef<number | null>(null);

  const dismiss = () => setPhase((p) => (p === "playing" ? "fading" : p));

  // When the clip finishes: leave the last frame up a moment, then fade.
  const endWithHold = () => {
    if (holdRef.current) return;
    holdRef.current = window.setTimeout(dismiss, holdMs);
  };

  // Don't run over the Tina live-preview.
  useEffect(() => {
    if (typeof window !== "undefined" && window.self !== window.top) setPhase("done");
  }, []);

  // Backstop for the fade: `onTransitionEnd` is the normal path to "done",
  // but if it never fires (transition interrupted, tab hidden, reduced
  // motion, a browser quirk) the overlay would linger — and anything that
  // waits on the intro clearing would stall. Force it after the fade time.
  useEffect(() => {
    if (phase !== "fading") return;
    const t = window.setTimeout(() => setPhase("done"), 800);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Flag the document while the intro is on screen so the nav can stay
  // hidden until it's gone, then fade in (see .wu-nav / html.intro-active
  // in styles.css).
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("intro-active", phase !== "done");
    return () => root.classList.remove("intro-active");
  }, [phase]);

  // Keep the DOM `muted` *property* in sync (React only sets the attribute).
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  // While the intro is up: lock scroll, arm the safety timeout, Esc to skip.
  useEffect(() => {
    if (phase !== "playing") return;

    const video = videoRef.current;

    // Hold on the poster (no `autoPlay` on the element — we start playback
    // ourselves) for startHoldMs before the clip actually begins.
    const playTimer = window.setTimeout(() => {
      video?.play?.().catch(() => dismiss());
    }, startHoldMs);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let timer = window.setTimeout(dismiss, startHoldMs + MAX_MS);
    // Once we know how long the clip actually is, let it run its full length
    // (plus a little slack) rather than cutting it off at MAX_MS.
    const onMeta = () => {
      const d = video?.duration;
      if (d && Number.isFinite(d)) {
        window.clearTimeout(timer);
        timer = window.setTimeout(
          dismiss,
          Math.min(startHoldMs + d * 1000 + holdMs + 2000, HARD_CAP_MS)
        );
      }
    };
    video?.addEventListener("loadedmetadata", onMeta);
    if (video?.readyState && video.readyState >= 1) onMeta();

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(playTimer);
      window.clearTimeout(timer);
      if (holdRef.current) window.clearTimeout(holdRef.current);
      video?.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("keydown", onKey);
    };
  }, [phase]);

  if (phase === "done") return null;

  const fading = phase === "fading";

  return (
    <div
      role="presentation"
      className={`intro-overlay intro-overlay--${variant}`}
      onClick={dismiss}
      onTransitionEnd={() => fading && setPhase("done")}
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 600ms ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* Sizing lives in styles.css (.intro-overlay--*). */}
      <video
        ref={videoRef}
        className="intro-video"
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        onEnded={endWithHold}
        onError={dismiss}
        style={
          mobileFocus && mobileFocus !== "center"
            ? ({
                "--intro-mobile-focus": `${mobileFocus === "right" ? "70%" : "30%"} center`,
              } as React.CSSProperties)
            : undefined
        }
      />

      <button
        type="button"
        aria-label={muted ? "Turn sound on" : "Mute"}
        onClick={(e) => {
          e.stopPropagation();
          setMuted((m) => !m);
        }}
        style={{
          position: "absolute",
          bottom: "clamp(1.5rem, 6dvh, 3rem)",
          left: "50%",
          transform: "translateX(-50%)",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.7rem 1.4rem",
          borderRadius: "999px",
          border: "2px solid var(--primary-color, #d4af37)",
          background: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.02em",
          cursor: "pointer",
        }}
      >
        {muted ? <SpeakerMuted /> : <SpeakerOn />}
        {muted ? "Tap for sound" : "Sound on"}
      </button>

      <button
        type="button"
        aria-label="Skip intro"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
        style={{
          position: "absolute",
          top: "clamp(1rem, 4dvh, 1.75rem)",
          right: "clamp(1rem, 4vw, 1.75rem)",
          padding: "0.5rem 1rem",
          borderRadius: "999px",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          background: "rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          fontSize: "0.8rem",
          fontWeight: 600,
          letterSpacing: "0.03em",
          cursor: "pointer",
        }}
      >
        Skip ▸
      </button>
    </div>
  );
}

function SpeakerMuted() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function SpeakerOn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
