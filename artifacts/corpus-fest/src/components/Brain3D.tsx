import { Component, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const REGIONS = [
  {
    events: ["Chess", "Debate", "Art", "Academic Quiz"],
    color: "#c9a96e",
    hex: 0xc9a96e,
    label: "Frontal Lobe",
    desc: "Strategy & Creativity",
    tagLine: "Academic & Arts",
  },
  {
    events: ["Badminton", "Table Tennis", "Basketball", "Volleyball"],
    color: "#7eb4d4",
    hex: 0x7eb4d4,
    label: "Parietal Lobe",
    desc: "Coordination & Precision",
    tagLine: "Racket & Court Sports",
  },
  {
    events: ["Running", "Kho Kho", "Kabbadi", "Football", "Shot Put", "High Jump"],
    color: "#8fc99a",
    hex: 0x8fc99a,
    label: "Cerebellum",
    desc: "Power & Endurance",
    tagLine: "Field & Track Events",
  },
  {
    events: ["Dance", "Singing", "Stand-up Comedy", "Fun Events"],
    color: "#d4876a",
    hex: 0xd4876a,
    label: "Temporal Lobe",
    desc: "Expression & Rhythm",
    tagLine: "Performance Arts",
  },
];

// ─── WebGL check ──────────────────────────────────────────────────────────────
function isWebGLAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch { return false; }
}

// ─── Error boundary ───────────────────────────────────────────────────────────
class CanvasBoundary extends Component<{ children: React.ReactNode; fallback: React.ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  componentDidCatch() { this.setState({ crashed: true }); }
  render() { return this.state.crashed ? this.props.fallback : this.props.children; }
}

// ─── SVG Anatomical Brain (realistic illustration in SVG) ────────────────────
// Medial sagittal view — detailed enough to look like an actual brain
function SVGBrain({ active }: { active: number }) {
  const region = REGIONS[active];

  // Each clip-path defines the region's anatomical area on the sagittal SVG view
  // ViewBox: 0 0 520 480  (front=right, back=left, top=top, cerebellum=bottom-left)
  const regionPaths = [
    // Frontal lobe — right third of cerebrum
    "M 320,60 Q 390,55 430,80 Q 470,110 475,160 Q 475,210 450,245 Q 420,270 380,280 Q 355,275 340,260 Q 320,235 318,200 Q 315,160 318,120 Z",
    // Parietal lobe — top middle of cerebrum
    "M 200,45 Q 260,35 320,60 Q 318,120 315,160 Q 310,200 305,230 Q 275,240 245,232 Q 210,220 198,195 Q 185,165 185,130 Q 185,80 200,45 Z",
    // Cerebellum — bottom right area
    "M 80,305 Q 110,285 145,282 Q 185,282 215,295 Q 235,310 235,340 Q 232,370 215,390 Q 190,415 155,420 Q 120,420 95,400 Q 68,380 65,350 Q 62,320 80,305 Z",
    // Temporal lobe — bottom of cerebrum + brainstem area
    "M 240,260 Q 295,255 340,260 Q 355,275 360,300 Q 358,330 340,350 Q 315,370 280,375 Q 250,375 228,360 Q 210,345 205,320 Q 200,295 210,270 Q 225,260 240,260 Z",
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
        filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.5))",
        animation: "brainBob 6s ease-in-out infinite",
      }}
    >
      <svg
        viewBox="0 0 520 480"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          {/* Gradient for the base brain tissue */}
          <radialGradient id="brainBase" cx="55%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#deb8a8" />
            <stop offset="40%" stopColor="#c9a090" />
            <stop offset="100%" stopColor="#a87865" />
          </radialGradient>
          <radialGradient id="cerebellumBase" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#d4aa96" />
            <stop offset="100%" stopColor="#b08070" />
          </radialGradient>
          <radialGradient id="brainstemBase" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#c09080" />
            <stop offset="100%" stopColor="#906050" />
          </radialGradient>

          {/* Region glow filter */}
          <filter id="regionGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Clip paths for each lobe */}
          {regionPaths.map((d, i) => (
            <clipPath key={i} id={`lobe${i}`}>
              <path d={d} />
            </clipPath>
          ))}
        </defs>

        {/* ── Outer cerebrum silhouette ───────────────────────────────────── */}
        {/* Main brain body */}
        <path
          d="M 200,45
             Q 230,35 270,33 Q 310,32 345,42 Q 385,54 420,76
             Q 458,100 473,135 Q 482,160 480,195
             Q 478,230 465,258 Q 450,284 428,302
             Q 405,320 378,330 Q 358,338 340,340
             Q 335,360 330,380 Q 325,395 318,408
             Q 308,420 295,425 Q 278,430 262,425
             Q 248,420 240,408 Q 232,395 228,380
             Q 222,358 218,340
             Q 195,338 175,330 Q 148,318 128,302
             Q 105,284 90,262 Q 75,238 70,210
             Q 64,180 66,152 Q 68,120 80,95
             Q 95,68 120,53 Q 155,38 200,45 Z"
          fill="url(#brainBase)"
          stroke="#8a5a48"
          strokeWidth="1"
        />

        {/* ── Sulci (grooves between gyri) — these create the wrinkled look ── */}
        {/* Major sulci — lateral surface folds */}
        <path d="M 200,45 Q 215,75 210,110 Q 205,140 215,165" fill="none" stroke="#8a5a48" strokeWidth="2" opacity="0.6" />
        <path d="M 155,52 Q 175,80 170,115 Q 165,140 178,165" fill="none" stroke="#8a5a48" strokeWidth="1.5" opacity="0.5" />
        <path d="M 260,33 Q 265,65 258,100 Q 252,130 262,158" fill="none" stroke="#8a5a48" strokeWidth="2" opacity="0.6" />
        <path d="M 315,38 Q 318,72 310,105 Q 303,132 312,160" fill="none" stroke="#8a5a48" strokeWidth="1.8" opacity="0.6" />
        <path d="M 365,55 Q 368,85 358,115 Q 350,138 360,165" fill="none" stroke="#8a5a48" strokeWidth="1.8" opacity="0.6" />
        <path d="M 410,82 Q 415,110 406,138 Q 398,160 408,185" fill="none" stroke="#8a5a48" strokeWidth="1.5" opacity="0.5" />
        <path d="M 445,122 Q 450,148 440,172 Q 432,192 442,215" fill="none" stroke="#8a5a48" strokeWidth="1.5" opacity="0.5" />

        {/* Horizontal sulci */}
        <path d="M 85,155 Q 130,148 178,150 Q 225,152 270,148 Q 318,144 360,148 Q 405,152 438,162" fill="none" stroke="#9a6858" strokeWidth="1.5" opacity="0.5" />
        <path d="M 80,200 Q 130,192 180,195 Q 230,198 278,193 Q 328,188 372,192 Q 412,196 445,208" fill="none" stroke="#9a6858" strokeWidth="1.5" opacity="0.5" />
        <path d="M 82,240 Q 132,232 182,235 Q 232,238 278,232 Q 325,226 365,232 Q 402,238 430,252" fill="none" stroke="#9a6858" strokeWidth="1.5" opacity="0.5" />
        <path d="M 95,275 Q 142,268 192,272 Q 240,276 282,270 Q 325,265 358,270 Q 390,275 415,288" fill="none" stroke="#9a6858" strokeWidth="1.5" opacity="0.5" />
        <path d="M 115,308 Q 155,300 198,305 Q 242,310 278,305 Q 315,300 345,306 Q 372,312 392,325" fill="none" stroke="#9a6858" strokeWidth="1.5" opacity="0.5" />

        {/* ── Gyri highlights (ridges between sulci) ──────────────────────── */}
        {/* These lighter stripes on the raised gyri create the folded look */}
        {[
          "M 112,130 Q 138,120 165,122 Q 190,124 210,128",
          "M 170,118 Q 198,108 225,110 Q 252,112 270,116",
          "M 228,110 Q 256,100 282,102 Q 308,104 328,108",
          "M 285,104 Q 312,95 340,97 Q 368,99 390,103",
          "M 348,100 Q 375,90 402,94 Q 428,98 448,108",
          "M 95,170 Q 128,160 160,162 Q 192,164 218,168",
          "M 158,162 Q 192,152 225,154 Q 258,156 282,160",
          "M 218,154 Q 252,145 285,147 Q 318,149 345,153",
          "M 280,146 Q 316,137 348,139 Q 378,142 402,146",
          "M 342,140 Q 375,130 405,133 Q 432,137 452,145",
          "M 90,212 Q 126,202 162,204 Q 198,206 228,210",
          "M 164,203 Q 200,193 235,196 Q 268,199 292,204",
          "M 224,195 Q 260,186 295,188 Q 328,191 355,196",
          "M 288,187 Q 323,178 356,181 Q 386,184 408,190",
          "M 92,252 Q 128,242 165,245 Q 200,248 230,253",
          "M 168,244 Q 204,234 240,237 Q 273,240 300,245",
          "M 232,236 Q 267,226 302,229 Q 334,232 360,238",
          "M 295,228 Q 330,218 362,222 Q 390,226 412,234",
          "M 105,290 Q 138,280 172,283 Q 206,286 235,291",
          "M 173,281 Q 207,272 242,275 Q 275,278 302,284",
          "M 242,272 Q 276,262 310,266 Q 340,270 365,276",
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#e8c0ac" strokeWidth="3" opacity="0.35" strokeLinecap="round" />
        ))}

        {/* ── Corpus callosum (bright white C-arch) ───────────────────────── */}
        <path
          d="M 248,210 Q 248,188 260,176 Q 272,164 290,162 Q 310,160 324,172 Q 336,182 337,198 Q 337,210 328,220 Q 318,230 305,232"
          fill="none" stroke="#f0ddd0" strokeWidth="5" strokeLinecap="round" opacity="0.9"
        />
        <path
          d="M 248,215 Q 248,240 252,255 Q 256,268 268,275 Q 282,282 298,278"
          fill="none" stroke="#e8d0c0" strokeWidth="4" strokeLinecap="round" opacity="0.7"
        />

        {/* ── Thalamus ─────────────────────────────────────────────────────── */}
        <ellipse cx="290" cy="255" rx="28" ry="22" fill="#c09888" stroke="#a07868" strokeWidth="1" opacity="0.85" />
        <ellipse cx="288" cy="253" rx="18" ry="14" fill="#d0a898" opacity="0.7" />

        {/* ── Hypothalamus & pituitary ─────────────────────────────────────── */}
        <ellipse cx="280" cy="292" rx="18" ry="12" fill="#b88878" stroke="#9a7060" strokeWidth="1" opacity="0.8" />
        <ellipse cx="276" cy="312" rx="10" ry="8" fill="#c89888" opacity="0.75" />
        <ellipse cx="274" cy="328" rx="8" ry="6" fill="#b08070" opacity="0.7" />

        {/* ── Midbrain / brainstem connection ─────────────────────────────── */}
        <path
          d="M 268,380 Q 268,390 270,400 Q 272,415 278,425 Q 284,435 290,438 Q 298,440 305,436 Q 312,430 316,418 Q 320,405 320,390 Q 320,375 318,365"
          fill="url(#brainstemBase)"
          stroke="#8a6050"
          strokeWidth="1"
        />
        {/* Brainstem striations */}
        <path d="M 272,385 Q 295,382 316,385" fill="none" stroke="#c09080" strokeWidth="1" opacity="0.5" />
        <path d="M 270,393 Q 294,390 318,393" fill="none" stroke="#c09080" strokeWidth="1" opacity="0.5" />
        <path d="M 271,401 Q 294,398 317,401" fill="none" stroke="#c09080" strokeWidth="1" opacity="0.5" />
        <path d="M 273,410 Q 295,407 315,410" fill="none" stroke="#c09080" strokeWidth="1" opacity="0.5" />
        <path d="M 276,420 Q 295,417 313,420" fill="none" stroke="#c09080" strokeWidth="1" opacity="0.5" />
        <path d="M 280,430 Q 295,427 310,430" fill="none" stroke="#c09080" strokeWidth="1" opacity="0.5" />

        {/* Pons */}
        <path
          d="M 260,360 Q 245,358 235,365 Q 225,375 230,390 Q 235,405 252,410 Q 268,415 285,412 Q 300,410 308,402 Q 318,392 316,375 Q 314,360 295,355 Q 275,350 260,360 Z"
          fill="#b89080"
          stroke="#9a7060"
          strokeWidth="1"
          opacity="0.9"
        />

        {/* ── Cerebellum ───────────────────────────────────────────────────── */}
        {/* Main body */}
        <ellipse cx="148" cy="358" rx="80" ry="62" fill="url(#cerebellumBase)" stroke="#9a7060" strokeWidth="1" />

        {/* Folia — the distinctive horizontal lamellae of cerebellum */}
        {/* Arbor vitae pattern: fine horizontal striations */}
        {Array.from({ length: 18 }).map((_, i) => {
          const y = 308 + i * 6.8;
          const span = Math.sqrt(Math.max(0, 80 * 80 - (y - 358) * (y - 358)));
          if (span < 5) return null;
          return (
            <path
              key={i}
              d={`M ${148 - span + 5},${y} Q ${148},${y - 3} ${148 + span - 5},${y}`}
              fill="none"
              stroke="#a07868"
              strokeWidth="1.5"
              opacity="0.6"
              strokeLinecap="round"
            />
          );
        })}

        {/* Cerebellar highlights (lighter lobes) */}
        <ellipse cx="130" cy="345" rx="32" ry="25" fill="#d4aa96" opacity="0.4" />
        <ellipse cx="168" cy="372" rx="28" ry="22" fill="#d4aa96" opacity="0.35" />

        {/* Central vermis line */}
        <path d="M 148,298 Q 148,318 148,338 Q 148,358 148,378 Q 148,398 148,418" fill="none" stroke="#9a7060" strokeWidth="2.5" opacity="0.5" />

        {/* ── Region highlight overlays ─────────────────────────────────────── */}
        {REGIONS.map((r, i) => (
          <path
            key={i}
            d={regionPaths[i]}
            fill={i === active ? `${r.color}55` : "transparent"}
            stroke={i === active ? r.color : "transparent"}
            strokeWidth={i === active ? 2 : 0}
            style={{ transition: "all 0.8s ease", filter: i === active ? "url(#regionGlow)" : "none" }}
          />
        ))}

        {/* ── Ventricular system (subtle) ──────────────────────────────────── */}
        <path
          d="M 270,175 Q 278,168 290,168 Q 302,168 310,175 Q 318,183 316,193 Q 314,203 305,208 Q 295,212 284,208 Q 273,203 270,193 Q 268,183 270,175 Z"
          fill="#e8d5c5"
          stroke="none"
          opacity="0.5"
        />
      </svg>

      <style>{`
        @keyframes brainBob {
          0%, 100% { transform: perspective(1000px) rotateY(-4deg) rotateX(1deg); }
          50%       { transform: perspective(1000px) rotateY(4deg) rotateX(-1deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Three.js procedural brain (WebGL path) ───────────────────────────────────
function getRegion(nx: number, ny: number, nz: number): number {
  if (nz > 0.22) return 0;   // Frontal
  if (ny > 0.18) return 1;   // Parietal
  if (ny < -0.25) return 3;  // Temporal
  return 3;
}

function buildCerebrumGeo() {
  const SEGS = 128;
  const geo = new THREE.SphereGeometry(1, SEGS, SEGS);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const N = pos.count;
  const dispArr = new Float32Array(N);
  const normArr = new Float32Array(N * 3);

  for (let i = 0; i < N; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const l = Math.sqrt(x * x + y * y + z * z) || 1;
    const nx = x / l, ny = y / l, nz = z / l;
    normArr[i * 3] = nx; normArr[i * 3 + 1] = ny; normArr[i * 3 + 2] = nz;

    // Primary gyri — large rolls
    let b = 0.092 * (
      Math.sin(nx * 7.8 + 0.31) * Math.cos(ny * 7.2 + 0.14) +
      Math.sin(ny * 7.5 + 1.82) * Math.cos(nz * 8.2 + 0.52) +
      Math.sin(nz * 8.3 + 0.91) * Math.cos(nx * 7.0 + 1.10) +
      0.4 * Math.sin(nx * 5.2 + ny * 4.3 + 0.50)
    );
    // Secondary folds
    b += 0.040 * (
      Math.sin(nx * 16 + 0.82) * Math.cos(ny * 15.5 + 0.40) +
      Math.sin(ny * 16 + 2.52) * Math.cos(nz * 17.5 + 1.20) +
      Math.sin(nz * 17 + 1.42) * Math.cos(nx * 15.8 + 0.80)
    );
    // Fine sulci wrinkles
    b += 0.018 * (
      Math.sin(nx * 33 + 1.10) * Math.cos(ny * 29.5 + 0.30) +
      Math.sin(ny * 31 + 0.42) * Math.cos(nz * 31.5 + 0.90)
    );
    dispArr[i] = b;

    // Longitudinal fissure
    const fissure = (Math.abs(nx) < 0.10 && ny > 0.25)
      ? -0.18 * Math.pow(Math.max(0, 1 - Math.abs(nx) / 0.10), 1.5) * Math.min(1, (ny - 0.25) / 0.45)
      : 0;

    const r = l + b + fissure;
    pos.setXYZ(i, nx * r, ny * r, nz * r);
  }
  geo.computeVertexNormals();
  geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  return { geo, dispArr, normArr };
}

function buildCerebellumGeo() {
  const geo = new THREE.SphereGeometry(0.44, 72, 72);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const N = pos.count;
  const dispArr = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const l = Math.sqrt(x * x + y * y + z * z) || 1;
    const nx = x / l, ny = y / l, nz = z / l;
    // Very fine lamellar folia pattern
    const b = 0.055 * (
      Math.sin(ny * 36 + 0.50) * Math.cos(nx * 5.5) +
      Math.sin(ny * 28 + 1.30) * Math.cos(nz * 7.0) +
      0.3 * Math.sin(ny * 48 + 0.80)
    );
    dispArr[i] = b;
    pos.setXYZ(i, nx * (l + b), ny * (l + b), nz * (l + b));
  }
  geo.computeVertexNormals();
  geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  return { geo, dispArr };
}

// Warm anatomical brain colors
function applyColors(
  geo: THREE.BufferGeometry,
  dispArr: Float32Array,
  normArr: Float32Array | null,
  activeRegion: number,
  isCerebellum: boolean,
) {
  const attr = geo.attributes.color as THREE.BufferAttribute;
  const N = attr.count;
  let mn = Infinity, mx = -Infinity;
  for (let i = 0; i < N; i++) { mn = Math.min(mn, dispArr[i]); mx = Math.max(mx, dispArr[i]); }
  const range = mx - mn || 1;
  const activeCol = new THREE.Color(REGIONS[activeRegion].hex);

  // Base brain colour: warm pinkish-tan
  const baseR = 0.78, baseG = 0.58, baseB = 0.50;
  const deepR = 0.55, deepG = 0.38, deepB = 0.32; // darker sulci

  for (let i = 0; i < N; i++) {
    const t = (dispArr[i] - mn) / range; // 0 = deep sulcus, 1 = gyrus crown
    const region = isCerebellum ? 2 : (normArr ? getRegion(normArr[i * 3], normArr[i * 3 + 1], normArr[i * 3 + 2]) : 0);
    const isActive = region === activeRegion;

    if (isActive) {
      // Blend active color with anatomical base
      const blend = 0.45 + 0.35 * t;
      attr.setXYZ(i,
        activeCol.r * blend + baseR * (1 - blend) * (0.6 + 0.4 * t),
        activeCol.g * blend + baseG * (1 - blend) * (0.6 + 0.4 * t),
        activeCol.b * blend + baseB * (1 - blend) * (0.6 + 0.4 * t),
      );
    } else {
      const r = deepR + (baseR - deepR) * t;
      const g = deepG + (baseG - deepG) * t;
      const b = deepB + (baseB - deepB) * t;
      attr.setXYZ(i, r * 0.95, g * 0.95, b * 0.95);
    }
  }
  attr.needsUpdate = true;
}

function BrainScene({ activeRegion }: { activeRegion: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const arRef = useRef(activeRegion);
  const cerebrum = useMemo(() => buildCerebrumGeo(), []);
  const cerebellum = useMemo(() => buildCerebellumGeo(), []);

  useEffect(() => {
    arRef.current = activeRegion;
    applyColors(cerebrum.geo, cerebrum.dispArr, cerebrum.normArr, activeRegion, false);
    applyColors(cerebellum.geo, cerebellum.dispArr, null, activeRegion, true);
  }, [activeRegion, cerebrum, cerebellum]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.35;
      groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.06;
    }
    if (glowRef.current) {
      glowRef.current.color.set(REGIONS[arRef.current].hex);
      glowRef.current.intensity = 1.8 + 0.6 * Math.sin(t * 2.0);
    }
  });

  const scale: [number, number, number] = [1.32, 0.92, 1.12];

  return (
    <group ref={groupRef}>
      {/* Warm skin-toned lighting for realistic brain appearance */}
      <ambientLight intensity={0.5} color={0xfff0e8} />
      <hemisphereLight args={[0xffe8d8, 0x402018, 0.8]} />
      <directionalLight position={[4, 5, 6]} intensity={2.8} color={0xffe0c8} castShadow />
      <directionalLight position={[-5, 2, -5]} intensity={0.7} color={0x8090c0} />
      <directionalLight position={[0, -4, 3]} intensity={0.4} color={0xffd8b8} />
      <pointLight ref={glowRef} position={[0, 0.2, 3.2]} distance={10} decay={2} />

      <mesh geometry={cerebrum.geo} scale={scale}>
        <meshStandardMaterial vertexColors roughness={0.78} metalness={0.03} />
      </mesh>
      {/* Cerebellum */}
      <mesh geometry={cerebellum.geo} position={[0, -0.52, -0.76]} scale={[scale[0] * 0.52, scale[1] * 0.57, scale[2] * 0.52]}>
        <meshStandardMaterial vertexColors roughness={0.80} metalness={0.02} />
      </mesh>
      {/* Brainstem */}
      <mesh position={[0, -0.88 * scale[1], -0.18 * scale[2]]} rotation={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.11 * scale[0], 0.085 * scale[0], 0.55 * scale[1], 24]} />
        <meshStandardMaterial color="#b08070" roughness={0.85} />
      </mesh>
    </group>
  );
}

// ─── Main Brain3D export ──────────────────────────────────────────────────────
export default function Brain3D() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeRegion, setActiveRegion] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeRef = useRef(0);
  const [webglOk] = useState(() => isWebGLAvailable());
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById("brain-section");
      if (!section) return;
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / scrollable));
      setScrollProgress(progress);
      const idx = Math.min(REGIONS.length - 1, Math.floor(progress * REGIONS.length));
      if (idx !== activeRef.current) { activeRef.current = idx; setActiveRegion(idx); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    setTimeout(onScroll, 100);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const region = REGIONS[activeRegion];

  const brainVisual = (!isMobile && webglOk) ? (
    <CanvasBoundary fallback={<SVGBrain active={activeRegion} />}>
      <Canvas
        camera={{ position: [0, 0.1, 3.4], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <BrainScene activeRegion={activeRegion} />
      </Canvas>
    </CanvasBoundary>
  ) : (
    <SVGBrain active={activeRegion} />
  );

  return (
    <div id="brain-section" ref={sectionRef} style={{ height: `${REGIONS.length * 100 + 60}vh`, position: "relative" }}>
      <div style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        background: "#080808",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Ambient color bloom */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${region.color}18 0%, transparent 62%)`,
          transition: "background 1.2s ease",
          pointerEvents: "none",
        }} />

        {/* Section label */}
        <div style={{
          position: "absolute",
          top: "clamp(28px,5vh,48px)",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 5,
        }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold-accent)" }}>
            The Brain Behind Corpus
          </p>
        </div>

        {/* Main layout */}
        <div style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 1100,
          padding: "0 clamp(16px,4vw,52px)",
          gap: "clamp(16px,3vw,40px)",
          zIndex: 5,
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {/* Left — event list */}
          <div
            key={activeRegion}
            style={{
              flexShrink: 0,
              width: "clamp(130px,20vw,220px)",
              animation: "panelFade 0.5s ease forwards",
            }}
          >
            <div style={{ width: 28, height: 2, background: region.color, marginBottom: 20, borderRadius: 1 }} />
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 8 }}>
              {region.tagLine}
            </p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", marginBottom: 20, lineHeight: 1.5 }}>
              {region.desc}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {region.events.map((ev) => (
                <div key={ev} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: region.color, flexShrink: 0 }} />
                  <span style={{
                    fontSize: "clamp(0.68rem,1.3vw,0.85rem)",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: region.color,
                    lineHeight: 1.3,
                  }}>
                    {ev}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Center — brain */}
          <div style={{
            flex: "1 1 auto",
            maxWidth: "min(440px,56vw)",
            minWidth: 220,
            aspectRatio: "1/1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {brainVisual}
          </div>

          {/* Right — scroll guide */}
          <div style={{ flexShrink: 0, width: "clamp(80px,16vw,180px)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {REGIONS.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: i === activeRegion ? 20 : 6,
                    height: 2,
                    background: i === activeRegion ? r.color : "rgba(255,255,255,0.15)",
                    borderRadius: 1,
                    transition: "all 0.5s ease",
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: i === activeRegion ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                    transition: "color 0.5s ease",
                    whiteSpace: "nowrap",
                  }}>
                    {r.tagLine}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar */}
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
            <div style={{
              width: 1,
              height: 48,
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)",
              animation: "scrollPulse 2s ease-in-out infinite",
            }} />
            <p style={{ fontSize: "0.5rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
              Scroll
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes panelFade {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
