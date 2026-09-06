"use client";

import { useState } from "react";

export default function Nav({ links }: { links: Array<{ label: string; href: string }> }) {
  const [open, setOpen] = useState(false);

  return (
    <nav id="mainNav" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "70px",
      backgroundColor: "var(--bg-color, #fffff0)",
      // Gold rule under the bar on desktop (from the V6 design); the mobile
      // media query removes it along with the rest of the visible bar.
      borderBottom: "2px solid var(--primary-color, #d4af37)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    }}>
      <div
        className={`nav-links${open ? " open" : ""}`}
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        {links.map((link, i) => (
          <a
            key={i}
            href={link.href}
            onClick={() => setOpen(false)}
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.9rem",
              color: "var(--text-dark, #1a1a1a)",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
      <button
        id="navToggle"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        style={{
          display: "none",
          position: "absolute",
          right: "1rem",
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
          color: "var(--text-dark, #1a1a1a)",
        }}
        className="nav-toggle"
      >
        &#9776;
      </button>
    </nav>
  );
}
