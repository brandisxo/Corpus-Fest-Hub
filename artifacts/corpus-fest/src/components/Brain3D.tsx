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
    events: ["Chess", "Debate", "Art"],
    color: "#c9a96e",
  },
  {
    name: "Frontal Lobe",
    description: "Expression & Performance",
    events: ["Dance", "Singing", "Stand-up Comedy"],
    color: "#c97b5a",
  },
  {
    name: "Cerebellum",
    description: "Coordination & Precision",
    events: ["Badminton", "Table Tennis", "Basketball"],
    color: "#9b7fa8",
  },
  {
    name: "Brainstem",
    description: "Core Strength & Endurance",
    events: ["Running", "Kho Kho", "Kabbadi"],
    color: "#7a9e8a",
  },
];

function RealisticBrainSVG({ activeRegion }: { activeRegion: number }) {
  const [angle, setAngle] = useState(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    let last = 0;
    const animate = (t: number) => {
      if (t - last > 16) {
        setAngle((a) => (a + 0.25) % 360);
        last = t;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const rad = (angle * Math.PI) / 180;
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);

  const project = (x: number, y: number, z: number) => {
    const rotX = x * cosA - z * sinA;
    const rotZ = x * sinA + z * cosA;
    const fov = 600;
    const scale = fov / (fov + rotZ + 300);
    return { px: rotX * scale, py: y * scale, scale };
  };

  const colors = BRAIN_REGIONS.map((r) => r.color);
  const isActive = (i: number) => i === activeRegion;

  const pulseScale = 1 + Math.sin(angle * 0.08) * 0.012;

  return (
    <svg
      viewBox="-240 -200 480 400"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <filter id="brainGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="innerGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Gradients for each brain region */}
        {BRAIN_REGIONS.map((r, i) => (
          <radialGradient key={`g${i}`} id={`rgrad${i}`} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor={isActive(i) ? lighten(r.color, 0.35) : lighten(r.color, 0.05)} stopOpacity="1" />
            <stop offset="45%" stopColor={r.color} stopOpacity={isActive(i) ? "0.95" : "0.7"} />
            <stop offset="80%" stopColor={darken(r.color, 0.4)} stopOpacity="0.85" />
            <stop offset="100%" stopColor={darken(r.color, 0.65)} stopOpacity="0.9" />
          </radialGradient>
        ))}

        {/* Main brain body gradient */}
        <radialGradient id="cerebBody" cx="42%" cy="35%" r="60%">
          <stop offset="0%" stopColor={isActive(0) ? "#e8c87a" : "#c8a878"} stopOpacity="1" />
          <stop offset="40%" stopColor={isActive(0) ? "#b89060" : "#a07848"} stopOpacity="0.95" />
          <stop offset="80%" stopColor="#6b4c2a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3d2510" stopOpacity="1" />
        </radialGradient>

        <radialGradient id="cerebBodyR" cx="55%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#c0946a" stopOpacity="1" />
          <stop offset="50%" stopColor="#9b6840" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3d2510" stopOpacity="1" />
        </radialGradient>

        <radialGradient id="cerebGrad" cx="42%" cy="30%" r="70%">
          <stop offset="0%" stopColor={isActive(1) ? "#e09070" : "#c07868"} stopOpacity="0.9" />
          <stop offset="55%" stopColor={isActive(1) ? "#a06050" : "#886050"} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3a2018" stopOpacity="0.9" />
        </radialGradient>

        <radialGradient id="cerebellumGrad" cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor={isActive(2) ? "#c0a0d0" : "#a888b8"} stopOpacity="1" />
          <stop offset="50%" stopColor={isActive(2) ? "#9070a8" : "#806090"} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3a2848" stopOpacity="0.9" />
        </radialGradient>

        <radialGradient id="stemGrad" cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor={isActive(3) ? "#90b8a0" : "#789080"} stopOpacity="1" />
          <stop offset="55%" stopColor={isActive(3) ? "#608870" : "#507060"} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1e3828" stopOpacity="0.95" />
        </radialGradient>

        <radialGradient id="ccGrad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#d4b88a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8a6840" stopOpacity="0.4" />
        </radialGradient>

        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors[activeRegion]} stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow */}
      <ellipse cx={0} cy={0} rx={220} ry={170} fill="url(#bgGlow)" />

      {/* Ground shadow */}
      <ellipse
        cx={5}
        cy={145}
        rx={140}
        ry={22}
        fill="rgba(0,0,0,0.45)"
        filter="url(#softShadow)"
      />

      {/* ── RIGHT HEMISPHERE (back, rendered first) ── */}
      <g transform={`scale(${pulseScale})`}>
        {/* Right hemisphere main body */}
        <path
          d={`M 8,-135 
              C 35,-148 80,-140 115,-118
              C 148,-96 162,-65 160,-32
              C 158,8 145,40 125,62
              C 105,84 78,95 52,96
              C 30,97 12,88 8,75
              Z`}
          fill="url(#cerebBodyR)"
          stroke="rgba(80,50,20,0.4)"
          strokeWidth={1}
          opacity={0.88}
        />

        {/* Right gyri lines */}
        {[
          "M 30,-120 C 60,-105 95,-95 120,-78",
          "M 20,-95 C 55,-82 90,-72 118,-58",
          "M 15,-68 C 50,-58 85,-50 115,-38",
          "M 12,-42 C 48,-34 82,-28 112,-18",
          "M 18,-15 C 50,-8 82,-2 108,10",
          "M 28,12 C 58,18 86,22 108,30",
          "M 42,38 C 68,44 90,46 108,52",
          "M 58,58 C 76,62 90,64 102,68",
        ].map((d, i) => (
          <path
            key={`rgyri${i}`}
            d={d}
            fill="none"
            stroke={isActive(0) ? "rgba(201,169,110,0.35)" : "rgba(120,90,55,0.22)"}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* ── LEFT HEMISPHERE (front, main) ── */}
      <g transform={`scale(${pulseScale})`}>
        {/* Left hemisphere main body */}
        <path
          d={`M -8,-135 
              C -35,-148 -80,-140 -115,-118
              C -148,-96 -162,-65 -160,-32
              C -158,8 -145,40 -125,62
              C -105,84 -78,95 -52,96
              C -30,97 -12,88 -8,75
              Z`}
          fill="url(#cerebBody)"
          stroke="rgba(80,50,20,0.5)"
          strokeWidth={1}
          filter={isActive(0) ? "url(#brainGlow)" : "none"}
          style={{ transition: "filter 0.6s ease" }}
        />

        {/* LEFT gyri — primary sulci (deep grooves) */}
        {[
          "M -30,-120 C -60,-105 -95,-95 -120,-78",
          "M -20,-95 C -55,-82 -90,-72 -118,-58",
          "M -15,-68 C -50,-58 -85,-50 -115,-38",
          "M -12,-42 C -48,-34 -82,-28 -112,-18",
          "M -18,-15 C -50,-8 -82,-2 -108,10",
          "M -28,12 C -58,18 -86,22 -108,30",
          "M -42,38 C -68,44 -90,46 -108,52",
          "M -58,58 C -76,62 -90,64 -102,68",
        ].map((d, i) => (
          <path
            key={`lgyri${i}`}
            d={d}
            fill="none"
            stroke={isActive(0) ? "rgba(201,169,110,0.4)" : "rgba(120,90,55,0.25)"}
            strokeWidth={2}
            strokeLinecap="round"
          />
        ))}

        {/* Secondary sulci */}
        {[
          "M -25,-108 C -50,-96 -78,-88 -100,-74",
          "M -18,-81 C -45,-70 -72,-62 -98,-48",
          "M -14,-55 C -42,-46 -70,-40 -96,-28",
          "M -12,-28 C -40,-20 -68,-14 -94,-4",
          "M -16,0 C -42,6 -68,10 -90,20",
          "M -25,26 C -50,32 -72,36 -92,44",
          "M -38,50 C -60,55 -78,56 -96,62",
        ].map((d, i) => (
          <path
            key={`lgyri2${i}`}
            d={d}
            fill="none"
            stroke={isActive(0) ? "rgba(201,169,110,0.2)" : "rgba(100,72,40,0.14)"}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        ))}

        {/* Frontal lobe highlight (region 1) */}
        <path
          d={`M -8,-135
              C -30,-148 -65,-142 -95,-126
              C -120,-112 -138,-90 -145,-68
              C -150,-48 -148,-28 -138,-12
              C -128,4 -110,14 -92,18
              C -72,22 -50,16 -35,6
              C -20,-4 -10,-20 -8,-40
              Z`}
          fill={isActive(1) ? "rgba(201,123,90,0.45)" : "rgba(180,110,80,0.08)"}
          stroke={isActive(1) ? "rgba(201,123,90,0.6)" : "none"}
          strokeWidth={1.5}
          style={{ transition: "all 0.6s ease", filter: isActive(1) ? "drop-shadow(0 0 12px rgba(201,123,90,0.5))" : "none" }}
        />

        {/* Frontal gyri detail */}
        {isActive(1) && [
          "M -20,-128 C -45,-115 -75,-105 -100,-88",
          "M -15,-105 C -42,-93 -70,-85 -95,-70",
          "M -12,-80 C -40,-70 -65,-63 -88,-50",
        ].map((d, i) => (
          <path
            key={`fgyri${i}`}
            d={d}
            fill="none"
            stroke="rgba(201,123,90,0.45)"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* ── INTERHEMISPHERIC FISSURE ── */}
      <path
        d={`M 0,-148 C 2,-80 3,0 1,90`}
        fill="none"
        stroke="rgba(15,8,3,0.9)"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d={`M 0,-148 C -1,-80 -2,0 0,90`}
        fill="none"
        stroke="rgba(15,8,3,0.7)"
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* ── CORPUS CALLOSUM ── */}
      <g transform={`scale(${pulseScale})`}>
        <path
          d={`M -55,5 C -55,-18 -35,-28 0,-28 C 35,-28 55,-18 55,5 C 55,22 35,28 0,28 C -35,28 -55,22 -55,5 Z`}
          fill="url(#ccGrad)"
          stroke="rgba(180,150,100,0.3)"
          strokeWidth={0.8}
          opacity={0.7}
        />
      </g>

      {/* ── CEREBELLUM ── */}
      <g transform={`scale(${pulseScale})`}>
        <ellipse
          cx={0}
          cy={118}
          rx={72}
          ry={48}
          fill="url(#cerebellumGrad)"
          stroke={isActive(2) ? "rgba(155,127,168,0.7)" : "rgba(80,50,90,0.3)"}
          strokeWidth={1.2}
          filter={isActive(2) ? "url(#brainGlow)" : "none"}
          style={{ transition: "all 0.6s ease" }}
        />
        {/* Cerebellum folia (characteristic horizontal lines) */}
        {[-30, -20, -10, 0, 10, 20, 30, 40].map((yOff, i) => (
          <path
            key={`folia${i}`}
            d={`M ${-58 + Math.abs(yOff) * 0.6},${108 + yOff * 0.8} C 0,${100 + yOff * 0.8} 0,${100 + yOff * 0.8} ${58 - Math.abs(yOff) * 0.6},${108 + yOff * 0.8}`}
            fill="none"
            stroke={isActive(2) ? "rgba(155,127,168,0.5)" : "rgba(100,75,115,0.3)"}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        ))}
        {/* Vermis (center fold) */}
        <path
          d={`M 0,70 C 2,85 3,100 2,150`}
          fill="none"
          stroke={isActive(2) ? "rgba(155,127,168,0.4)" : "rgba(90,65,105,0.25)"}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </g>

      {/* ── BRAINSTEM ── */}
      <g transform={`scale(${pulseScale})`}>
        <path
          d={`M -22,60 C -24,80 -24,110 -18,148 L 18,148 C 24,110 24,80 22,60 Z`}
          fill="url(#stemGrad)"
          stroke={isActive(3) ? "rgba(122,158,138,0.7)" : "rgba(50,80,60,0.3)"}
          strokeWidth={1.2}
          strokeLinejoin="round"
          filter={isActive(3) ? "url(#brainGlow)" : "none"}
          style={{ transition: "all 0.6s ease" }}
        />
        {/* Pons detail */}
        <path
          d={`M -22,72 C -8,68 8,68 22,72`}
          fill="none"
          stroke={isActive(3) ? "rgba(122,158,138,0.5)" : "rgba(90,120,100,0.25)"}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d={`M -22,84 C -8,80 8,80 22,84`}
          fill="none"
          stroke={isActive(3) ? "rgba(122,158,138,0.4)" : "rgba(90,120,100,0.2)"}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Medulla detail */}
        <path
          d={`M -18,110 C -6,106 6,106 18,110`}
          fill="none"
          stroke={isActive(3) ? "rgba(122,158,138,0.4)" : "rgba(90,120,100,0.18)"}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
        <path
          d={`M -18,122 C -6,118 6,118 18,122`}
          fill="none"
          stroke={isActive(3) ? "rgba(122,158,138,0.35)" : "rgba(90,120,100,0.15)"}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      </g>

      {/* ── ACTIVE HIGHLIGHT RING ── */}
      {activeRegion === 0 && (
        <ellipse
          cx={-15}
          cy={-25}
          rx={168}
          ry={128}
          fill="none"
          stroke={colors[0]}
          strokeWidth={1.2}
          opacity={0.3}
          strokeDasharray="6 4"
        />
      )}
      {activeRegion === 1 && (
        <path
          d={`M -8,-145
              C -30,-158 -70,-152 -100,-136
              C -128,-120 -148,-96 -155,-72
              C -162,-48 -158,-26 -146,-8
              C -134,10 -116,20 -96,24
              Z`}
          fill="none"
          stroke={colors[1]}
          strokeWidth={1.2}
          opacity={0.4}
          strokeDasharray="5 3"
        />
      )}
      {activeRegion === 2 && (
        <ellipse
          cx={0}
          cy={118}
          rx={84}
          ry={58}
          fill="none"
          stroke={colors[2]}
          strokeWidth={1.2}
          opacity={0.4}
          strokeDasharray="5 3"
        />
      )}
      {activeRegion === 3 && (
        <path
          d={`M -30,55 L 30,55 L 28,155 L -28,155 Z`}
          fill="none"
          stroke={colors[3]}
          strokeWidth={1.2}
          opacity={0.4}
          strokeDasharray="5 3"
          rx={4}
        />
      )}

      {/* Orbital particles */}
      {[0, 72, 144, 216, 288].map((offset) => {
        const a = rad + (offset * Math.PI) / 180;
        const px = Math.cos(a) * 195;
        const pz = Math.sin(a) * 195;
        const pp = project(px, 5, pz);
        return (
          <circle
            key={offset}
            cx={pp.px}
            cy={pp.py}
            r={2.2 * pp.scale}
            fill={colors[activeRegion]}
            opacity={0.3 + 0.25 * pp.scale}
          />
        );
      })}
    </svg>
  );
}

function lighten(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + Math.round(255 * amount));
  const g = Math.min(255, ((n >> 8) & 0xff) + Math.round(255 * amount));
  const b = Math.min(255, (n & 0xff) + Math.round(255 * amount));
  return `rgb(${r},${g},${b})`;
}

function darken(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - Math.round(255 * amount));
  const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (n & 0xff) - Math.round(255 * amount));
  return `rgb(${r},${g},${b})`;
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
            background: `radial-gradient(ellipse at 50% 50%, ${region.color}16 0%, transparent 65%)`,
            transition: "background 0.8s ease",
            pointerEvents: "none",
          }}
        />

        {/* Top label */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            zIndex: 5,
            whiteSpace: "nowrap",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: 6,
            }}
          >
            Explore the Fest
          </p>
          <h2
            style={{
              fontSize: "clamp(1.4rem,3vw,2.5rem)",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.03em",
            }}
          >
            What Is <span style={{ color: "var(--gold-accent)" }}>Corpus</span>?
          </h2>
        </div>

        {/* Brain SVG */}
        <div
          style={{
            position: "relative",
            width: "min(480px, 52vw)",
            height: "min(420px, 52vh)",
            zIndex: 2,
            minWidth: 260,
            minHeight: 240,
          }}
        >
          <RealisticBrainSVG activeRegion={activeRegion} />
        </div>

        {/* Left info panel */}
        <div
          style={{
            position: "absolute",
            left: "max(20px, 4vw)",
            top: "50%",
            transform: "translateY(-50%)",
            maxWidth: "clamp(180px, 22vw, 300px)",
            zIndex: 10,
          }}
        >
          <div
            key={activeRegion}
            style={{ animation: "brainFadeIn 0.45s ease forwards" }}
          >
            <p
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: region.color,
                marginBottom: 10,
              }}
            >
              Region Active
            </p>
            <p
              style={{
                fontSize: "clamp(1rem,2vw,1.5rem)",
                fontWeight: 700,
                color: "white",
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              {region.description}
            </p>
            <p
              style={{
                fontSize: "0.7rem",
                color: region.color,
                letterSpacing: "0.08em",
                fontWeight: 600,
                marginBottom: 16,
                textTransform: "uppercase",
              }}
            >
              {region.name}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {region.events.map((ev) => (
                <span
                  key={ev}
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "5px 12px",
                    border: `1px solid ${region.color}60`,
                    borderRadius: 2,
                    color: region.color,
                    background: `${region.color}0f`,
                  }}
                >
                  {ev}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right dot nav */}
        <div
          style={{
            position: "absolute",
            right: 28,
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
          <div
            style={{
              position: "absolute",
              bottom: 36,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              opacity: 0.4,
            }}
          >
            <div className="scroll-line" />
            <p
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Scroll
            </p>
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
