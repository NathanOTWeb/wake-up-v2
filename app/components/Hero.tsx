export default function Hero({ hero }: { hero: any }) {
  if (!hero) return null;

  const taglines = hero.taglines || [];
  const ctas = hero.ctas || [];

  return (
    <section id="section1" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "4rem 2rem",
      backgroundColor: "var(--bg-color, #fffff0)",
      textAlign: "center",
    }}>
      {hero.logo && (
        <div style={{ marginBottom: "2rem" }}>
          <img src={hero.logo} alt="WAKE UP Logo" style={{ width: "220px", height: "220px" }} />
        </div>
      )}
      <div className="section-content">
        <h1 style={{
          fontFamily: "Cinzel, serif",
          fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
          fontWeight: 700,
          color: "var(--text-dark, #1a1a1a)",
          margin: "0 0 1rem",
          letterSpacing: "0.05em",
        }}>
          {hero.title}
        </h1>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          color: "var(--text-medium, #444444)",
          maxWidth: "600px",
          margin: "0 auto 1.5rem",
          lineHeight: 1.6,
        }}>
          {hero.subtitle}
        </p>
        <div style={{
          margin: "1.5rem 0",
          fontFamily: "Cinzel, serif",
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
          lineHeight: 1.8,
          color: "var(--text-dark, #1a1a1a)",
        }}>
          {taglines.map((t: any, i: number) => (
            <span key={i}>
              {t.text}
              {i < taglines.length - 1 && <br />}
            </span>
          ))}
        </div>
        <p style={{
          fontFamily: "Merriweather, serif",
          fontStyle: "italic",
          fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
          color: "var(--text-light, #666666)",
          maxWidth: "500px",
          margin: "0 auto 2rem",
          lineHeight: 1.6,
        }}>
          {hero.scripture}
          {hero.scriptureRef && <span style={{ marginLeft: "0.5rem" }}>— {hero.scriptureRef}</span>}
        </p>
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}>
          {ctas.map((cta: any, i: number) => (
            <a
              key={i}
              href={cta.href}
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: "1rem",
                fontWeight: 600,
                padding: "0.75rem 2rem",
                borderRadius: "4px",
                textDecoration: "none",
                backgroundColor: cta.primary ? "var(--primary-color, #d4af37)" : "transparent",
                color: cta.primary ? "var(--text-dark, #1a1a1a)" : "var(--primary-color, #d4af37)",
                border: `2px solid var(--primary-color, #d4af37)`,
                transition: "all 0.3s ease",
              }}
            >
              {cta.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}