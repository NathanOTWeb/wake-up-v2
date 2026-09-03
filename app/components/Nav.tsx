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
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    }}>
      <div style={{
        display: "flex",
        gap: "2rem",
        alignItems: "center",
        ...(open ? { display: "flex", flexDirection: "column" } : {}),
      }}>
        {links.map((link, i) => (
          <a
            key={i}
            href={link.href}
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