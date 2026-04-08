import { Component, useEffect, useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const REGIONS = [
  {
    events: ["Chess", "Debate", "Art", "Academic Quiz"],
    color: "#c9a96e",
    hex: 0xc9a96e,
    label: "Frontal Lobe",
    tagLine: "Academic & Arts",
    center: { x: 400, y: 140 },
  },
  {
    events: ["Badminton", "Table Tennis", "Basketball", "Volleyball"],
    color: "#7eb4d4",
    hex: 0x7eb4d4,
    label: "Parietal Lobe",
    tagLine: "Racket & Court Sports",
    center: { x: 252, y: 108 },
  },
  {
    events: ["Running", "Kho Kho", "Kabbadi", "Football", "Shot Put"],
    color: "#8fc99a",
    hex: 0x8fc99a,
    label: "Cerebellum",
    tagLine: "Field & Track Events",
    center: { x: 148, y: 358 },
  },
  {
    events: ["Dance", "Singing", "Stand-up Comedy", "Fun Events"],
    color: "#d4876a",
    hex: 0xd4876a,
    label: "Temporal Lobe",
    tagLine: "Performance Arts",
    center: { x: 278, y: 308 },
  },
];

// Neural impulse paths per region — dots animate along these curves
const NEURAL_PATHS: string[][] = [
  // Frontal (right side of brain, x 318-480 y 60-245)
  [
    "M 352,88 C 392,68 442,76 464,108 C 474,128 470,158 452,172",
    "M 382,118 C 418,106 450,114 464,142 C 472,160 464,182 448,194",
    "M 338,142 C 372,128 410,134 434,150 C 452,164 454,188 440,202",
    "M 365,68 C 405,56 448,62 468,90  C 476,108 470,135 455,148",
  ],
  // Parietal (left-centre area x 185-320 y 35-240)
  [
    "M 202,56 C 238,40 275,46 298,72 C 312,90 312,116 298,132",
    "M 220,86 C 252,72 280,78 298,100 C 308,114 304,138 288,150",
    "M 202,118 C 234,108 264,112 282,130 C 294,146 290,168 275,178",
    "M 215,150 C 248,140 278,144 294,162 C 305,176 300,198 284,208",
  ],
  // Cerebellum (bottom-left ellipse cx148 cy358 rx80 ry62)
  [
    "M 78,332 C 112,318 148,322 182,332 C 204,340 218,358 212,378",
    "M 70,357 C 106,344 148,348 186,358 C 210,366 222,382 216,402",
    "M 84,382 C 118,372 148,376 180,384 C 202,392 214,410 207,428",
    "M 100,340 C 128,328 158,330 182,338 C 200,346 210,362 204,382",
  ],
  // Temporal/brainstem (x 205-360, y 255-375)
  [
    "M 240,268 C 266,256 298,260 320,272 C 336,282 340,304 328,318",
    "M 228,298 C 256,286 290,290 314,302 C 330,312 334,334 320,348",
    "M 234,328 C 260,318 290,322 312,336 C 327,346 330,368 316,378",
    "M 246,250 C 272,240 304,244 326,258 C 342,268 345,290 332,304",
  ],
];

// Spark node positions per region (for glowing pulse dots)
const SPARK_NODES: { x: number; y: number }[][] = [
  [{ x: 395, y: 95 }, { x: 450, y: 128 }, { x: 435, y: 168 }, { x: 370, y: 148 }, { x: 460, y: 80 }],
  [{ x: 218, y: 60 }, { x: 278, y: 52 }, { x: 300, y: 90 }, { x: 255, y: 120 }, { x: 235, y: 145 }],
  [{ x: 100, y: 334 }, { x: 148, y: 325 }, { x: 196, y: 334 }, { x: 148, y: 362 }, { x: 148, y: 398 }],
  [{ x: 260, y: 272 }, { x: 300, y: 262 }, { x: 320, y: 296 }, { x: 278, y: 318 }, { x: 252, y: 348 }],
];

function EventPill({ label, color }: { label: string; color: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px 20px",
        border: `1px solid ${color}`,
        borderRadius: 0,
        fontSize: "0.72rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontFamily: "'DM Sans', sans-serif",
        background: hovered ? color : "transparent",
        color: hovered ? "#000000" : "#ffffff",
        cursor: "default",
        transition: "all 0.25s ease",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

function isWebGLAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch { return false; }
}

class CanvasBoundary extends Component<{ children: React.ReactNode; fallback: React.ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  componentDidCatch() { this.setState({ crashed: true }); }
  render() { return this.state.crashed ? this.props.fallback : this.props.children; }
}

// ── SVG fallback brain with neuron-firing animation ────────────────────────────
function SVGBrain({ active }: { active: number }) {
  const region = REGIONS[active];
  const c = region.center;

  const regionFillPaths = [
    "M 320,60 Q 390,55 430,80 Q 470,110 475,160 Q 475,210 450,245 Q 420,270 380,280 Q 355,275 340,260 Q 320,235 318,200 Q 315,160 318,120 Z",
    "M 200,45 Q 260,35 320,60 Q 318,120 315,160 Q 310,200 305,230 Q 275,240 245,232 Q 210,220 198,195 Q 185,165 185,130 Q 185,80 200,45 Z",
    "M 80,305 Q 110,285 145,282 Q 185,282 215,295 Q 235,310 235,340 Q 232,370 215,390 Q 190,415 155,420 Q 120,420 95,400 Q 68,380 65,350 Q 62,320 80,305 Z",
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
      }}
    >
      <svg viewBox="0 0 520 480" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
        <defs>
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
          {/* Pulsing radial glow at active region center */}
          <radialGradient id="activeGlow" cx={c.x} cy={c.y} r="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={region.color} stopOpacity="0.9" />
            <stop offset="40%" stopColor={region.color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={region.color} stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="strongGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="sparkGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Brain base anatomy ─────────────────────────────────────────── */}
        <path
          d="M 200,45 Q 230,35 270,33 Q 310,32 345,42 Q 385,54 420,76 Q 458,100 473,135 Q 482,160 480,195 Q 478,230 465,258 Q 450,284 428,302 Q 405,320 378,330 Q 358,338 340,340 Q 335,360 330,380 Q 325,395 318,408 Q 308,420 295,425 Q 278,430 262,425 Q 248,420 240,408 Q 232,395 228,380 Q 222,358 218,340 Q 195,338 175,330 Q 148,318 128,302 Q 105,284 90,262 Q 75,238 70,210 Q 64,180 66,152 Q 68,120 80,95 Q 95,68 120,53 Q 155,38 200,45 Z"
          fill="url(#brainBase)" stroke="#8a5a48" strokeWidth="1"
        />
        {/* Gyri sulci lines */}
        {[
          "M 200,45 Q 215,75 210,110 Q 205,140 215,165",
          "M 260,33 Q 265,65 258,100 Q 252,130 262,158",
          "M 315,38 Q 318,72 310,105 Q 303,132 312,160",
          "M 365,55 Q 368,85 358,115 Q 350,138 360,165",
        ].map((d, i) => <path key={i} d={d} fill="none" stroke="#8a5a48" strokeWidth="2" opacity="0.6" />)}
        {[
          "M 85,155 Q 130,148 178,150 Q 225,152 270,148 Q 318,144 360,148 Q 405,152 438,162",
          "M 80,200 Q 130,192 180,195 Q 230,198 278,193 Q 328,188 372,192 Q 412,196 445,208",
          "M 82,240 Q 132,232 182,235 Q 232,238 278,232 Q 325,226 365,232 Q 402,238 430,252",
        ].map((d, i) => <path key={i} d={d} fill="none" stroke="#9a6858" strokeWidth="1.5" opacity="0.5" />)}
        {[
          "M 112,130 Q 138,120 165,122 Q 190,124 210,128",
          "M 228,110 Q 256,100 282,102 Q 308,104 328,108",
          "M 348,100 Q 375,90 402,94 Q 428,98 448,108",
          "M 95,170 Q 128,160 160,162 Q 192,164 218,168",
          "M 218,154 Q 252,145 285,147 Q 318,149 345,153",
          "M 90,212 Q 126,202 162,204 Q 198,206 228,210",
          "M 224,195 Q 260,186 295,188 Q 328,191 355,196",
        ].map((d, i) => <path key={i} d={d} fill="none" stroke="#e8c0ac" strokeWidth="3" opacity="0.35" strokeLinecap="round" />)}
        {/* Corpus callosum */}
        <path d="M 248,210 Q 248,188 260,176 Q 272,164 290,162 Q 310,160 324,172 Q 336,182 337,198" fill="none" stroke="#f0ddd0" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
        {/* Thalamus */}
        <ellipse cx="290" cy="255" rx="28" ry="22" fill="#c09888" stroke="#a07868" strokeWidth="1" opacity="0.85" />
        {/* Brainstem */}
        <path d="M 268,380 Q 268,390 270,400 Q 272,415 278,425 Q 284,435 290,438 Q 298,440 305,436 Q 312,430 316,418 Q 320,405 320,390 Q 320,375 318,365" fill="url(#brainstemBase)" stroke="#8a6050" strokeWidth="1" />
        {/* Cerebellum */}
        <ellipse cx="148" cy="358" rx="80" ry="62" fill="url(#cerebellumBase)" stroke="#9a7060" strokeWidth="1" />
        {Array.from({ length: 18 }).map((_, i) => {
          const y = 308 + i * 6.8;
          const span = Math.sqrt(Math.max(0, 80 * 80 - (y - 358) * (y - 358)));
          if (span < 5) return null;
          return <path key={i} d={`M ${148 - span + 5},${y} Q ${148},${y - 3} ${148 + span - 5},${y}`} fill="none" stroke="#a07868" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />;
        })}

        {/* ── Region highlight fills ─────────────────────────────────────── */}
        {REGIONS.map((r, i) => (
          <path
            key={i}
            d={regionFillPaths[i]}
            fill={i === active ? `${r.color}` : "transparent"}
            fillOpacity={i === active ? 0.22 : 0}
            stroke={i === active ? r.color : "transparent"}
            strokeWidth={i === active ? 2 : 0}
            style={{ transition: "all 0.7s ease" }}
          />
        ))}

        {/* ── Active region: pulsing inner glow ─────────────────────────── */}
        <rect
          x="0" y="0" width="520" height="480"
          fill="url(#activeGlow)"
          className="brain-pulse-glow"
          style={{ transition: "opacity 0.5s ease" }}
        />

        {/* ── Neural impulse paths (visible traces) ─────────────────────── */}
        {NEURAL_PATHS[active].map((d, pi) => (
          <g key={`path-${active}-${pi}`}>
            {/* Faint path trace */}
            <path
              d={d}
              fill="none"
              stroke={region.color}
              strokeWidth="1.5"
              strokeOpacity="0.35"
              strokeLinecap="round"
            />
            {/* Traveling impulse dot — staggered */}
            <circle r="4" fill={region.color} filter="url(#sparkGlow)" opacity="0.95">
              <animateMotion
                dur="1.4s"
                repeatCount="indefinite"
                begin={`${pi * 0.35}s`}
                path={d}
                rotate="auto"
              />
              <animate attributeName="opacity" values="0;0.95;0.95;0" dur="1.4s" begin={`${pi * 0.35}s`} repeatCount="indefinite" />
            </circle>
            {/* Secondary smaller dot (echo) */}
            <circle r="2.5" fill="white" opacity="0.7">
              <animateMotion
                dur="1.4s"
                repeatCount="indefinite"
                begin={`${pi * 0.35 + 0.1}s`}
                path={d}
                rotate="auto"
              />
              <animate attributeName="opacity" values="0;0.7;0.7;0" dur="1.4s" begin={`${pi * 0.35 + 0.1}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* ── Spark nodes — pulsing stationary glow dots ────────────────── */}
        {SPARK_NODES[active].map((pt, si) => (
          <circle
            key={`spark-${active}-${si}`}
            cx={pt.x}
            cy={pt.y}
            r="5"
            fill={region.color}
            filter="url(#sparkGlow)"
          >
            <animate
              attributeName="r"
              values="3;7;3"
              dur={`${1.0 + si * 0.22}s`}
              repeatCount="indefinite"
              begin={`${si * 0.18}s`}
            />
            <animate
              attributeName="opacity"
              values="0.2;0.9;0.2"
              dur={`${1.0 + si * 0.22}s`}
              repeatCount="indefinite"
              begin={`${si * 0.18}s`}
            />
          </circle>
        ))}

        {/* ── Center burst at active region center ─────────────────────── */}
        <circle cx={c.x} cy={c.y} r="18" fill={region.color} filter="url(#strongGlow)" opacity="0">
          <animate attributeName="opacity" values="0;0.6;0" dur="2s" repeatCount="indefinite" />
          <animate attributeName="r" values="12;28;12" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>

      <style>{`
        .brain-pulse-glow {
          animation: brainGlowPulse 1.8s ease-in-out infinite;
        }
        @keyframes brainGlowPulse {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 1.0; }
        }
      `}</style>
    </div>
  );
}

// ── 3D WebGL brain model with lighting ────────────────────────────────────────
const REGION_LIGHT_POS: [number, number, number][] = [
  [1.2, 0.8, 2.2],
  [-0.8, 1.5, 2.0],
  [-0.5, -2.0, 0.5],
  [0.8, -1.0, 2.5],
];

function BrainModelScene({ activeRegion }: { activeRegion: number }) {
  const { scene } = useGLTF("/brain_human.glb");
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const glowRef2 = useRef<THREE.PointLight>(null);
  const arRef = useRef(activeRegion);

  const scaledScene = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) cloned.scale.setScalar(2.6 / maxDim);
    const newBox = new THREE.Box3().setFromObject(cloned);
    const center = newBox.getCenter(new THREE.Vector3());
    cloned.position.sub(center);
    cloned.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xc89880),
          roughness: 0.68,
          metalness: 0.03,
          emissive: new THREE.Color(0x3a1a08),
          emissiveIntensity: 0.4,
        });
      }
    });
    return cloned;
  }, [scene]);

  useEffect(() => { arRef.current = activeRegion; }, [activeRegion]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.16) * 0.3;
      groupRef.current.rotation.x = Math.sin(t * 0.11) * 0.05;
    }
    const ar = arRef.current;
    const target = new THREE.Vector3(...REGION_LIGHT_POS[ar]);
    if (glowRef.current) {
      glowRef.current.position.lerp(target, 0.05);
      glowRef.current.color.set(REGIONS[ar].hex);
      // Strong pulsing "neuron fire" intensity
      glowRef.current.intensity = 6.0 + 4.5 * Math.sin(t * 3.5) * Math.sin(t * 1.3);
    }
    if (glowRef2.current) {
      const t2 = new THREE.Vector3(...REGION_LIGHT_POS[ar]).multiplyScalar(-0.6);
      glowRef2.current.position.lerp(t2, 0.04);
      glowRef2.current.color.set(REGIONS[ar].hex);
      glowRef2.current.intensity = 3.0 + 2.5 * Math.sin(t * 4.2 + 1.5);
    }
    // Update emissive intensity on all meshes
    scaledScene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mat = (node as THREE.Mesh).material as THREE.MeshStandardMaterial;
        mat.emissive.set(REGIONS[ar].hex);
        mat.emissiveIntensity = 0.12 + 0.18 * (0.5 + 0.5 * Math.sin(t * 3.0));
      }
    });
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.8} color={0xfff4ec} />
      <hemisphereLight args={[0xffd8c8, 0x100806, 0.8]} />
      <directionalLight position={[3, 5, 5]} intensity={2.5} color={0xfff0e8} />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color={0xb0a0c0} />
      <pointLight ref={glowRef} position={REGION_LIGHT_POS[0]} distance={8} decay={1.2} intensity={6.0} />
      <pointLight ref={glowRef2} position={[-0.8, -1.5, 1.0]} distance={6} decay={1.5} intensity={3.0} />
      <primitive object={scaledScene} />
    </group>
  );
}

function LoadingFallback() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 1.2; });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.8, 2]} />
      <meshStandardMaterial color="#c9a96e" wireframe />
    </mesh>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
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
        camera={{ position: [0, 0.1, 3.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <BrainModelScene activeRegion={activeRegion} />
        </Suspense>
      </Canvas>
    </CanvasBoundary>
  ) : (
    <SVGBrain active={activeRegion} />
  );

  return (
    <section
      id="brain-section"
      ref={sectionRef}
      style={{ background: "#000000", position: "relative", minHeight: "400vh" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "45% 55%",
          alignItems: "center",
          padding: "0 clamp(20px,5vw,72px) 0 clamp(20px,4vw,56px)",
          gap: "clamp(16px,3vw,48px)",
          overflow: "hidden",
        }}
      >
        {/* Left: Brain visual */}
        <div style={{ position: "relative", height: "clamp(320px,56vh,580px)" }}>
          {brainVisual}
          {/* Per-section progress bar (25 / 50 / 75 / 100%) */}
          <div style={{ position: "absolute", bottom: -14, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1 }}>
            <div style={{
              height: "100%",
              width: `${((activeRegion + 1) / REGIONS.length) * 100}%`,
              background: region.color,
              borderRadius: 1,
              transition: "width 0.6s cubic-bezier(0.25,0.46,0.45,0.94), background 0.6s ease",
            }} />
          </div>
        </div>

        {/* Right: Region info */}
        <div style={{ paddingRight: "clamp(0px,2vw,24px)" }}>
          {/* Label */}
          <p style={{
            fontSize: "0.65rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#a88b5e",
            marginBottom: 20,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            What Is Corpus
          </p>

          {/* Dot navigation */}
          <div style={{ display: "flex", gap: 10, marginBottom: 28, alignItems: "center" }}>
            {REGIONS.map((r, i) => (
              <div
                key={i}
                style={{
                  width: i === activeRegion ? 10 : 8,
                  height: i === activeRegion ? 10 : 8,
                  borderRadius: "50%",
                  background: i === activeRegion ? r.color : "transparent",
                  border: i === activeRegion ? `2px solid ${r.color}` : "2px solid rgba(255,255,255,0.22)",
                  transition: "all 0.5s ease",
                  boxShadow: i === activeRegion ? `0 0 10px ${r.color}88` : "none",
                }}
              />
            ))}
          </div>

          {/* Category headline */}
          <h2
            key={`tag-${activeRegion}`}
            style={{
              fontSize: "clamp(2.2rem,4.5vw,3.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: 28,
              lineHeight: 1.05,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              animation: "fadeSlideIn 0.5s ease both",
            }}
          >
            {region.tagLine}
          </h2>

          {/* Event pills */}
          <div
            key={`events-${activeRegion}`}
            style={{ display: "flex", flexWrap: "wrap", gap: 10, animation: "fadeSlideIn 0.5s ease 0.22s both" }}
          >
            {region.events.map((ev) => (
              <EventPill key={ev} label={ev} color={region.color} />
            ))}
          </div>

          <p style={{
            marginTop: 40,
            fontSize: "0.62rem",
            color: "#4a4a4a",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Scroll to explore regions
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

useGLTF.preload("/brain_human.glb");
