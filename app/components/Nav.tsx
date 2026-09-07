"use client";

import { useState } from "react";

type Link = { label: string; href: string };

export default function Nav({
  links = [],
  logo,
}: {
  links?: Link[];
  logo?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Layout + responsive behaviour live in styles.css (.wu-nav*).
  // Desktop: brand (lionhead + wordmark) pinned left, links centred.
  // Mobile:  bar shows only the floating hamburger; the brand lives inside
  //          the dropdown — lionhead above the links, "WAKE UP" home link
  //          below them.
  return (
    <nav id="mainNav" className="wu-nav">
      <a className="wu-nav-brand" href="/" aria-label="WAKE UP — home">
        {logo && <img className="wu-nav-brand-logo" src={logo} alt="" />}
        <span className="wu-nav-brand-name">WAKE UP</span>
      </a>

      <div className={`nav-links${open ? " open" : ""}`}>
        {logo && (
          <a className="nav-menu-logo" href="/" onClick={close} aria-label="WAKE UP — home">
            <img src={logo} alt="" />
          </a>
        )}

        {links.map((link, i) => (
          <a key={i} href={link.href} onClick={close}>
            {link.label}
          </a>
        ))}

        <a className="nav-menu-home" href="/" onClick={close}>
          WAKE UP
        </a>
      </div>

      <button
        id="navToggle"
        className="nav-toggle"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        &#9776;
      </button>
    </nav>
  );
}
