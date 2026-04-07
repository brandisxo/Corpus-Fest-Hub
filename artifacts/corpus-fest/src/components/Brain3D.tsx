import { useEffect, useRef, useState } from "react";

const REGIONS = [
  {
    events: ["Chess", "Debate", "Art", "Academic Quiz"],
    color: "#c9a96e",
    // Frontal lobe — front/left of mid-sagittal view
    clipPath: "M 108,68 C 80,50 58,80 48,120 C 36,165 34,220 40,275 C 46,328 62,370 88,400 C 112,428 142,445 172,450 C 192,420 194,385 186,346 C 178,308 166,272 170,235 C 174,204 188,180 212,160 C 236,140 262,126 278,112 C 250,88 216,72 176,66 C 153,63 128,64 108,68 Z",
  },
  {
    events: ["Badminton", "Table Tennis", "Basketball", "Volleyball"],
    color: "#8b9fc7",
    // Parietal + Occipital — top and back of dome
    clipPath: "M 278,112 C 308,95 358,76 418,66 C 478,56 540,64 588,90 C 632,114 662,150 670,196 C 678,244 660,288 628,316 C 598,340 560,350 522,350 C 498,328 478,300 466,270 C 452,237 446,204 454,172 C 462,146 480,128 496,118 C 440,104 358,98 278,112 Z",
  },
  {
    events: ["Running", "Kho Kho", "Kabbadi", "Football", "Shot Put", "High Jump"],
    color: "#7aaa8a",
    // Cerebellum — lower right cauliflower structure
    clipPath: "M 522,350 C 556,348 596,360 630,382 C 664,402 690,436 690,472 C 690,508 670,534 640,546 C 610,558 574,548 546,526 C 518,504 504,470 508,440 C 512,416 526,392 522,370 L 522,350 Z",
  },
  {
    events: ["Dance", "Singing", "Stand-up Comedy", "Fun Events"],
    color: "#c97b6a",
    // Brainstem + temporal — lower center
    clipPath: "M 466,270 C 480,308 488,348 488,382 C 488,416 476,448 458,468 C 438,490 408,500 382,492 C 354,484 334,462 326,434 C 316,402 326,368 346,348 C 366,326 392,316 416,314 C 444,312 460,292 466,270 Z",
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
      style={{ height: `${REGIONS.length * 100 + 80}vh`, position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Ambient glow behind brain */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 60% 50%, ${region.color}18 0%, transparent 55%)`,
          transition: "background 0.9s ease",
          pointerEvents: "none",
        }} />

        {/* Layout: events left | brain center | spacer right */}
        <div style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 1100,
          padding: "0 clamp(16px,4vw,48px)",
          gap: "clamp(24px,4vw,56px)",
          zIndex: 5,
        }}>

          {/* Left — event list */}
          <div
            key={activeRegion}
            style={{
              flexShrink: 0,
              width: "clamp(130px,18vw,220px)",
              animation: "brainFadeIn 0.45s ease forwards",
            }}
          >
            <div style={{ width: 24, height: 2, background: region.color, marginBottom: 20, borderRadius: 1 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {region.events.map((ev) => (
                <span
                  key={ev}
                  style={{
                    fontSize: "clamp(0.7rem,1.3vw,0.88rem)",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: region.color,
                    lineHeight: 1.4,
                  }}
                >
                  {ev}
                </span>
              ))}
            </div>
          </div>

          {/* Center — brain image + SVG highlights */}
          <div style={{
            flex: "1 1 auto",
            position: "relative",
            maxWidth: "min(540px, 58vw)",
            aspectRatio: "780 / 560",
          }}>
            {/* Brain image — desaturated base */}
            <img
              src="/brain-sagittal.jpg"
              alt="Mid-sagittal brain section"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                filter: "brightness(0.6) contrast(1.15) saturate(0.35)",
              }}
            />

            {/* SVG overlay — all region highlights */}
            <svg
              viewBox="0 0 730 560"
              preserveAspectRatio="xMidYMid meet"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
              <defs>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="10" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {REGIONS.map((r, i) => (
                <path
                  key={i}
                  d={r.clipPath}
                  fill={r.color}
                  fillOpacity={i === activeRegion ? 0.52 : 0.03}
                  stroke={r.color}
                  strokeWidth={i === activeRegion ? 2.5 : 0.5}
                  strokeOpacity={i === activeRegion ? 0.9 : 0.12}
                  filter={i === activeRegion ? "url(#glow)" : undefined}
                  style={{ transition: "fill-opacity 0.7s ease, stroke-opacity 0.7s ease" }}
                />
              ))}
            </svg>
          </div>

          {/* Right spacer for balance */}
          <div style={{ flexShrink: 0, width: "clamp(130px,18vw,220px)" }} />
        </div>

        {/* Bottom progress bar */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          width: `${scrollProgress * 100}%`,
          background: region.color,
          transition: "width 0.15s linear, background 0.6s ease",
        }} />

        {/* Scroll hint */}
        {scrollProgress < 0.04 && (
          <div style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: 0.3,
          }}>
            <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)", animation: "scrollPulse 2s ease-in-out infinite" }} />
            <p style={{ fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>Scroll</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes brainFadeIn {
          from { opacity: 0; transform: translateX(-14px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
