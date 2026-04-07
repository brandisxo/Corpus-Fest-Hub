import { useEffect, useRef, useState } from "react";

interface BrainRegion {
  name: string;
  description: string;
  events: string[];
  color: string;
}

const BRAIN_REGIONS: BrainRegion[] = [
  {
    name: "Cerebrum",
    description: "Higher Thinking & Strategy",
    events: ["Chess", "Debate", "Quiz", "Art"],
    color: "#c9a96e",
  },
  {
    name: "Cerebellum",
    description: "Coordination & Precision",
    events: ["Badminton", "Table Tennis", "Basketball", "Volleyball"],
    color: "#9b7fa8",
  },
  {
    name: "Brainstem",
    description: "Core Strength & Endurance",
    events: ["Running", "Kho Kho", "Kabbadi", "Shot Put"],
    color: "#7a9e8a",
  },
  {
    name: "Frontal Lobe",
    description: "Expression & Performance",
    events: ["Dance", "Singing", "Stand-up Comedy", "Fun Events"],
    color: "#c97b5a",
  },
];

// CSS-based 3D brain render using SVG + transforms
function BrainCanvas({ activeRegion }: { activeRegion: number }) {
  const region = BRAIN_REGIONS[activeRegion];
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      setAngle(a => (a + 0.3) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const rad = (angle * Math.PI) / 180;
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);

  // 3D coordinates for brain parts — projected with simple perspective
  const project = (x: number, y: number, z: number) => {
    const rotX = x * cosA - z * sinA;
    const rotZ = x * sinA + z * cosA;
    const fov = 500;
    const scale = fov / (fov + rotZ + 250);
    return { px: rotX * scale, py: y * scale, scale };
  };

  // Brain region centers
  const regions = [
    { x: 0, y: -40, z: 30, rx: 110, ry: 75 }, // Cerebrum — large oval
    { x: 60, y: 40, z: -70, rx: 60, ry: 45 }, // Cerebellum — smaller back
    { x: 10, y: 80, z: -20, rx: 25, ry: 55 }, // Brainstem — elongated
    { x: -60, y: -20, z: 50, rx: 55, ry: 50 }, // Frontal Lobe — front
  ];

  const colors = BRAIN_REGIONS.map(r => r.color);
  const baseColors = ["#c4a882", "#a89ab5", "#c4afd0", "#c8a89a"];

  return (
    <svg
      viewBox="-220 -180 440 380"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softblur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        {/* Radial gradients for each region */}
        {regions.map((_, i) => {
          const isActive = i === activeRegion;
          return (
            <radialGradient key={i} id={`grad${i}`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor={isActive ? colors[i] : baseColors[i]} stopOpacity="0.9" />
              <stop offset="60%" stopColor={isActive ? colors[i] : baseColors[i]} stopOpacity="0.7" />
              <stop offset="100%" stopColor={isActive ? "#1a0f05" : "#150d0a"} stopOpacity="0.85" />
            </radialGradient>
          );
        })}
        <radialGradient id="bgGrad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#1a1008" />
          <stop offset="100%" stopColor="#050302" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <ellipse cx={0} cy={-10} rx={160} ry={120} fill="url(#bgGrad)" opacity={0.6} />

      {/* Gyri surface lines on cerebrum */}
      {[0, 1, 2, 3, 4].map(i => {
        const p = project(0, -40 + i * 12, 30 + Math.sin(i) * 20);
        const width = 90 + Math.abs(cosA) * 30;
        return (
          <ellipse
            key={`gyri${i}`}
            cx={p.px}
            cy={p.py}
            rx={width * p.scale * 0.9}
            ry={8 * p.scale}
            fill="none"
            stroke={activeRegion === 0 ? "rgba(201,169,110,0.3)" : "rgba(150,130,110,0.15)"}
            strokeWidth={1.5}
          />
        );
      })}

      {/* Render each brain region */}
      {regions.map((reg, i) => {
        const p = project(reg.x, reg.y, reg.z);
        const isActive = i === activeRegion;
        const rxScaled = reg.rx * p.scale;
        const ryScaled = reg.ry * p.scale;
        const isBrainstem = i === 2;

        return (
          <g key={i} style={{ transition: "opacity 0.4s ease" }}>
            {/* Shadow */}
            <ellipse
              cx={p.px + 4}
              cy={p.py + 6}
              rx={rxScaled * 0.85}
              ry={ryScaled * 0.6}
              fill="rgba(0,0,0,0.35)"
              filter="url(#softblur)"
            />
            {/* Main shape */}
            {isBrainstem ? (
              <rect
                x={p.px - rxScaled * 0.5}
                y={p.py - ryScaled}
                width={rxScaled}
                height={ryScaled * 2}
                rx={rxScaled * 0.4}
                fill={`url(#grad${i})`}
                stroke={isActive ? colors[i] : "rgba(255,255,255,0.06)"}
                strokeWidth={isActive ? 2 : 1}
                style={{ filter: isActive ? "drop-shadow(0 0 12px " + colors[i] + ")" : "none", transition: "all 0.5s ease" }}
              />
            ) : (
              <ellipse
                cx={p.px}
                cy={p.py}
                rx={rxScaled}
                ry={ryScaled}
                fill={`url(#grad${i})`}
                stroke={isActive ? colors[i] : "rgba(255,255,255,0.06)"}
                strokeWidth={isActive ? 2.5 : 1}
                style={{ filter: isActive ? "drop-shadow(0 0 16px " + colors[i] + ")" : "none", transition: "all 0.5s ease" }}
              />
            )}
            {/* Active highlight ring */}
            {isActive && (
              <ellipse
                cx={p.px}
                cy={p.py}
                rx={rxScaled + 8}
                ry={ryScaled + 6}
                fill="none"
                stroke={colors[i]}
                strokeWidth={1}
                opacity={0.35}
                strokeDasharray="4 3"
              />
            )}
            {/* Surface texture lines */}
            {!isBrainstem && [0, 1, 2].map(j => (
              <ellipse
                key={j}
                cx={p.px + (j - 1) * rxScaled * 0.25}
                cy={p.py - ryScaled * 0.1}
                rx={rxScaled * (0.6 - j * 0.1)}
                ry={ryScaled * 0.15}
                fill="none"
                stroke={isActive ? `${colors[i]}55` : "rgba(255,255,255,0.05)"}
                strokeWidth={1}
              />
            ))}
          </g>
        );
      })}

      {/* Fissure line */}
      {(() => {
        const p1 = project(0, -120, 40);
        const p2 = project(0, 20, 15);
        return (
          <line
            x1={p1.px} y1={p1.py}
            x2={p2.px} y2={p2.py}
            stroke="rgba(10,5,2,0.8)"
            strokeWidth={2.5}
          />
        );
      })()}

      {/* Corpus callosum arc */}
      {(() => {
        const c = project(0, 0, 5);
        return (
          <ellipse
            cx={c.px}
            cy={c.py}
            rx={85 * c.scale}
            ry={22 * c.scale}
            fill="rgba(210,195,168,0.18)"
            stroke="rgba(210,195,168,0.25)"
            strokeWidth={1}
          />
        );
      })()}

      {/* Active region label inside canvas */}
      <text
        x={0}
        y={160}
        textAnchor="middle"
        fill={region.color}
        fontSize={11}
        letterSpacing={3}
        fontFamily="Inter, sans-serif"
        style={{ textTransform: "uppercase" as const }}
        opacity={0.8}
      >
        {region.name.toUpperCase()}
      </text>

      {/* Rotation particles */}
      {[0, 60, 120, 180, 240, 300].map(offset => {
        const a = rad + (offset * Math.PI) / 180;
        const px = Math.cos(a) * 170;
        const pz = Math.sin(a) * 170;
        const pp = project(px, 10, pz);
        return (
          <circle
            key={offset}
            cx={pp.px}
            cy={pp.py}
            r={2 * pp.scale}
            fill={region.color}
            opacity={0.35 + 0.2 * pp.scale}
          />
        );
      })}
    </svg>
  );
}

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

      const regionIndex = Math.min(
        BRAIN_REGIONS.length - 1,
        Math.floor(progress * BRAIN_REGIONS.length)
      );

      if (regionIndex !== activeRef.current) {
        activeRef.current = regionIndex;
        setActiveRegion(regionIndex);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial call
    setTimeout(onScroll, 200);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const region = BRAIN_REGIONS[activeRegion];

  return (
    <div
      id="brain-section"
      ref={sectionRef}
      style={{ height: `${BRAIN_REGIONS.length * 100 + 100}vh`, position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "var(--deep-black)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 50%, ${region.color}18 0%, transparent 65%)`,
            transition: "background 0.8s ease",
            pointerEvents: "none",
          }}
        />

        {/* Top label */}
        <div style={{ position: "absolute", top: 48, left: "50%", transform: "translateX(-50%)", textAlign: "center", zIndex: 5 }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
            Explore the Fest
          </p>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.5rem)", fontWeight: 800, color: "white", letterSpacing: "-0.03em" }}>
            What Is <span style={{ color: "var(--gold-accent)" }}>Corpus</span>?
          </h2>
        </div>

        {/* SVG Brain — center */}
        <div
          style={{
            position: "relative",
            width: "min(500px, 55vw)",
            height: "min(420px, 50vh)",
            zIndex: 2,
          }}
        >
          <BrainCanvas activeRegion={activeRegion} />
        </div>

        {/* Left info panel */}
        <div
          style={{
            position: "absolute",
            left: "max(24px, 5vw)",
            top: "50%",
            transform: "translateY(-50%)",
            maxWidth: 280,
            zIndex: 10,
          }}
        >
          <div
            key={activeRegion}
            style={{ animation: "fadeInLeft 0.4s ease forwards" }}
          >
            <p style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: region.color,
              marginBottom: 10,
            }}>
              {region.name}
            </p>
            <p style={{
              fontSize: "clamp(1.1rem,2.2vw,1.5rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.2,
              marginBottom: 20,
            }}>
              {region.description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {region.events.map(ev => (
                <span
                  key={ev}
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "5px 11px",
                    border: `1px solid ${region.color}`,
                    borderRadius: 2,
                    color: region.color,
                    transition: "all 0.3s ease",
                  }}
                >
                  {ev}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right dots nav */}
        <div
          style={{
            position: "absolute",
            right: 32,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            zIndex: 10,
          }}
        >
          {BRAIN_REGIONS.map((r, i) => (
            <div
              key={i}
              title={r.name}
              style={{
                width: i === activeRegion ? 8 : 5,
                height: i === activeRegion ? 8 : 5,
                borderRadius: "50%",
                background: i === activeRegion ? r.color : "rgba(255,255,255,0.2)",
                transition: "all 0.4s ease",
                boxShadow: i === activeRegion ? `0 0 10px ${r.color}` : "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* Bottom progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 2,
            width: `${scrollProgress * 100}%`,
            background: region.color,
            boxShadow: `0 0 8px ${region.color}`,
            transition: "width 0.2s ease, background 0.5s ease",
          }}
        />

        {/* Scroll hint */}
        {scrollProgress < 0.05 && (
          <div style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: 0.4,
          }}>
            <div className="scroll-line" />
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Scroll
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
