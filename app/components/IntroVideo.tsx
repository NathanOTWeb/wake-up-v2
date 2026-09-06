"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "playing" | "fading" | "done";

/** Hard cap so a stalled/undecodable video can never trap the visitor. */
const MAX_MS = 25_000;

/**
 * Full-bleed intro that covers the hero on every page load, plays once, then
 * fades away.
 *
 * - Autoplay requires the video to start muted + inline (browser policy); a
 *   "Tap for sound" control unmutes it.
 * - `object-fit: cover` means: landscape viewports fill the full width and crop
 *   top/bottom; portrait viewports fill the height with a small side crop.
 * - Tap anywhere (or the Skip button, or Esc) to dismiss early.
 * - Never renders inside Tina's editor iframe.
 */
export default function IntroVideo() {
  const [phase, setPhase] = useState<Phase>("playing");
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const dismiss = () => setPhase((p) => (p === "playing" ? "fading" : p));

  // Don't run over the Tina live-preview.
  useEffect(() => {
    if (typeof window !== "undefined" && window.self !== window.top) setPhase("done");
  }, []);

  // Keep the DOM `muted` *property* in sync (React only sets the attribute).
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  // While the intro is up: lock scroll, arm the safety timeout, Esc to skip.
  useEffect(() => {
    if (phase !== "playing") return;

    videoRef.current?.play?.().catch(() => dismiss());

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(dismiss, MAX_MS);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [phase]);

  if (phase === "done") return null;

  const fading = phase === "fading";

  return (
    <div
      role="presentation"
      className="intro-overlay"
      onClick={dismiss}
      onTransitionEnd={() => fading && setPhase("done")}
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 600ms ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* Sizing lives in styles.css: portrait fills the screen (object-fit
          cover); landscape is half the viewport width, centred, with the
          vertical overflow clipped — far less of the frame is lost than a
          full-width crop. */}
      <video
        ref={videoRef}
        className="intro-video"
        src="/media/wake-up-vertical.mp4"
        poster="/media/wake-up-vertical-poster.jpg"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={dismiss}
        onError={dismiss}
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
