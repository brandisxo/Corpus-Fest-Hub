import { useEffect, useRef, useState } from "react";

// 4 regions: each maps to events shown as the user scrolls
const REGIONS = [
  {
    events: ["Chess", "Debate", "Art", "Academic"],
    color: "#c9a96e",
    label: "Academic",
    // Frontal lobe — left/front of the brain
    path: "M 118,108 C 72,145 50,205 54,278 C 57,348 80,402 122,432 C 158,458 202,460 237,446 C 215,418 200,385 197,350 C 192,310 204,272 230,244 C 258,213 276,192 278,170 C 272,148 256,125 236,108 C 200,82 154,76 118,108 Z",
  },
  {
    events: ["Badminton", "Table Tennis", "Basketball", "Volleyball"],
    color: "#9b7fa8",
    label: "Racket & Court",
    // Parietal + occipital — top and back
    path: "M 236,108 C 282,80 362,54 444,54 C 515,54 578,80 618,122 C 652,158 662,204 648,250 C 628,298 592,332 558,356 C 528,375 498,380 472,368 C 445,338 428,302 418,266 C 402,226 394,192 398,162 C 398,142 406,126 418,114 C 360,95 296,90 236,108 Z",
  },
  {
    events: ["Running", "Kho Kho", "Kabbadi", "Shot Put"],
    color: "#7a9e8a",
    label: "Field & Track",
    // Cerebellum — lower right
    path: "M 558,356 C 594,356 634,368 668,390 C 702,412 722,446 716,480 C 710,514 690,538 654,548 C 618,557 578,546 546,520 C 514,494 500,458 506,422 C 512,392 532,368 558,356 Z",
  },
  {
    events: ["Dance", "Singing", "Stand-up Comedy", "Fun Events"],
    color: "#c97b5a",
    label: "Performance",
    // Brainstem — lower center
    path: "M 418,266 C 434,300 448,342 452,378 C 456,414 450,446 440,466 C 420,496 390,510 368,505 C 342,500 320,482 314,456 C 306,422 312,386 326,360 C 340,336 360,316 380,308 C 400,300 412,284 418,266 Z",
  },
];

export default function Brain3D() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeRegion, setActiveRegion] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById("brain-section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrolled = window.scrollY - sectionTop;
      const sectionH = section.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrolled / sectionH));
      setScrollProgress(progress);
      const idx = Math.min(REGIONS.length - 1, Math.floor(progress * REGIONS.length));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActiveRegion(idx);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    setTimeout(onScroll, 100);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const region = REGIONS[activeRegion];

  return (
    <div
      id="brain-section"
      ref={sectionRef}
      style={{ height: `${REGIONS.length * 100 + 100}vh`, position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Subtle ambient glow */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 55% 50%, ${region.color}12 0%, transparent 60%)`,
          transition: "background 0.8s ease",
          pointerEvents: "none",
        }} />

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 24, zIndex: 5 }}>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 6 }}>
            Explore the Fest
          </p>
          <h2 style={{ fontSize: "clamp(1.4rem,3vw,2.4rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em" }}>
            What Is <span style={{ color: "var(--gold-accent)" }}>Corpus</span>?
          </h2>
        </div>

        {/* Brain + Events layout */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(16px, 4vw, 60px)",
          padding: "0 clamp(20px, 5vw, 60px)",
          width: "100%",
          maxWidth: 1000,
          zIndex: 5,
        }}>

          {/* Event tags — left */}
          <div
            key={activeRegion}
            style={{
              flexShrink: 0,
              width: "clamp(140px, 20vw, 240px)",
              animation: "brainFadeIn 0.4s ease forwards",
            }}
          >
            <div
              style={{
                width: 28,
                height: 2,
                background: region.color,
                marginBottom: 16,
                borderRadius: 1,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {region.events.map((ev) => (
                <span
                  key={ev}
                  style={{
                    fontSize: "clamp(0.72rem, 1.4vw, 0.9rem)",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: region.color,
                    padding: "6px 0",
                    borderBottom: `1px solid ${region.color}25`,
                  }}
                >
                  {ev}
                </span>
              ))}
            </div>
          </div>

          {/* Brain image + SVG overlay */}
          <div
            style={{
              position: "relative",
              flex: "1 1 auto",
              maxWidth: "min(520px, 55vw)",
              aspectRatio: "4/3",
            }}
          >
            {/* Actual brain image */}
            <img
              src="/brain-sagittal.jpg"
              alt="Mid-sagittal brain section"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                filter: "brightness(0.72) contrast(1.1) saturate(0.7)",
              }}
            />

            {/* SVG overlay — colored region highlights */}
            <svg
              viewBox="0 0 775 580"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <defs>
                <filter id="regionGlow">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {REGIONS.map((r, i) => (
                <path
                  key={i}
                  d={r.path}
                  fill={r.color}
                  fillOpacity={i === activeRegion ? 0.48 : 0.04}
                  stroke={r.color}
                  strokeWidth={i === activeRegion ? 2 : 0.5}
                  strokeOpacity={i === activeRegion ? 0.8 : 0.15}
                  filter={i === activeRegion ? "url(#regionGlow)" : undefined}
                  style={{ transition: "fill-opacity 0.6s ease, stroke-opacity 0.6s ease" }}
                />
              ))}
            </svg>
          </div>

          {/* Spacer right — keeps brain centered */}
          <div style={{ flexShrink: 0, width: "clamp(140px, 20vw, 240px)" }} />
        </div>

        {/* Bottom progress line */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          width: `${scrollProgress * 100}%`,
          background: region.color,
          transition: "width 0.2s ease, background 0.5s ease",
        }} />

        {/* Scroll hint */}
        {scrollProgress < 0.05 && (
          <div style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: 0.35,
          }}>
            <div className="scroll-line" />
            <p style={{ fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>Scroll</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes brainFadeIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
