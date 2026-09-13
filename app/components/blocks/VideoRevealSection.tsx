// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import { tinaField } from "tinacms/dist/react";

type Cta = { label?: string; href?: string; primary?: boolean };

type Block = {
  video?: string;
  poster?: string;
  revealHeading?: string;
  revealSubtext?: string;
  revealSubtextEmphasis?: string;
  ctas?: Cta[];
  logo?: string;
  background?: "default" | "gold";
};

const AUTOPLAY_DELAY_MS = 1800;

/**
 * A bordered video viewer (matches founderSection's photo styling) that
 * autoplays muted a beat after it's fully scrolled into view (or on a press
 * of the play button) — a "Tap for sound" pill (same pattern as IntroVideo)
 * lets the viewer opt into audio. Once the clip ends, a final call-to-action
 * fades in over the box: heading/subtext/logo centered, with the two
 * buttons flanking the box on desktop (CSS-only, via transforms) or
 * stacked within the same overlay on mobile. V6 section 12 "Final Call To
 * Action" + the footer lionhead.
 */
export default function VideoRevealSection({
  data,
  index,
  block,
  scope = "page",
}: {
  data: any;
  index: number;
  block: Block;
  scope?: "home" | "page";
}) {
  const path = (field: string) => `${scope}.sections.${index}.${field}`;
  const ctas = block.ctas || [];

  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [played, setPlayed] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const renderRich = (text: string, emphasis?: string) =>
    (text || "").split("\n").map((line, li) => {
      const parts =
        emphasis && line.includes(emphasis)
          ? line.split(emphasis).reduce<React.ReactNode[]>((acc, seg, si) => {
              if (si > 0) acc.push(<span key={`e${si}`} className="wu-emph">{emphasis}</span>);
              acc.push(seg);
              return acc;
            }, [])
          : [line];
      return (
        <span key={li} className="wu-rich-line">
          {parts}
        </span>
      );
    });

  const startPlayback = () => {
    videoRef.current?.play?.().catch(() => {});
  };

  // Autoplay (muted — required for this to work without a click) a beat
  // after the box is fully on screen, once only.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let timer: number | null = null;
    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (done) return;
        if (entries.some((e) => e.intersectionRatio >= 0.9)) {
          done = true;
          timer = window.setTimeout(startPlayback, AUTOPLAY_DELAY_MS);
          io.disconnect();
        }
      },
      { threshold: 0.9 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    setEnded(false);
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  const className = [
    "wu-video-reveal-section",
    block.background === "gold" && "is-gold",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={className}>
      <div className="wu-video-reveal-inner">
        <div ref={boxRef} className="wu-video-reveal-box">
          {block.video && (
            <video
              ref={videoRef}
              className="wu-video-reveal-video"
              src={block.video}
              poster={block.poster}
              controls={!ended}
              muted
              playsInline
              onPlay={() => setPlayed(true)}
              onEnded={() => setEnded(true)}
              data-tina-field={tinaField(data, path("video"))}
            />
          )}

          {!played && (
            <button
              type="button"
              className="wu-video-reveal-play"
              aria-label="Play video"
              onClick={startPlayback}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}

          {played && !ended && (
            <button
              type="button"
              className="wu-video-reveal-sound"
              aria-label={muted ? "Turn sound on" : "Mute"}
              onClick={(e) => {
                e.stopPropagation();
                setMuted((m) => !m);
              }}
            >
              {muted ? <SpeakerMuted /> : <SpeakerOn />}
              {muted ? "Tap for sound" : "Sound on"}
            </button>
          )}

          <div
            className={`wu-video-reveal-overlay${ended ? " is-shown" : ""}`}
            onClick={ended ? replay : undefined}
            role={ended ? "button" : undefined}
            aria-label={ended ? "Replay video" : undefined}
          >
            {block.revealHeading && (
              <h3
                className="wu-video-reveal-heading"
                data-tina-field={tinaField(data, path("revealHeading"))}
              >
                {block.revealHeading}
              </h3>
            )}
            {block.revealSubtext && (
              <p
                className="wu-video-reveal-subtext"
                data-tina-field={tinaField(data, path("revealSubtext"))}
              >
                {renderRich(block.revealSubtext, block.revealSubtextEmphasis)}
              </p>
            )}
            {ctas.length > 0 && (
              <div className="wu-video-reveal-ctas">
                {ctas.map((c, ci) =>
                  c.label ? (
                    <a
                      key={ci}
                      className={`wu-cta-link${c.primary ? " is-primary" : ""}`}
                      href={c.href || "#"}
                      onClick={(e) => e.stopPropagation()}
                      data-tina-field={tinaField(data, `${path("ctas")}.${ci}.label`)}
                    >
                      {c.label}
                    </a>
                  ) : null
                )}
              </div>
            )}
            {block.logo && (
              <img
                className="wu-video-reveal-logo"
                src={block.logo}
                alt=""
                data-tina-field={tinaField(data, path("logo"))}
              />
            )}
          </div>
        </div>
      </div>
    </section>
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
