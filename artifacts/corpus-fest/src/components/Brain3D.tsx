import { Component, useEffect, useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
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

function SVGBrain({ active }: { active: number }) {
  const region = REGIONS[active];
  const regionPaths = [
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
        animation: "brainBob 6s ease-in-out infinite",
      }}
    >
      <svg viewBox="0 0 520 480" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", display: "block" }}>
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
          <filter id="regionGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {regionPaths.map((d, i) => (
            <clipPath key={i} id={`lobe${i}`}><path d={d} /></clipPath>
          ))}
        </defs>
        <path
          d="M 200,45 Q 230,35 270,33 Q 310,32 345,42 Q 385,54 420,76 Q 458,100 473,135 Q 482,160 480,195 Q 478,230 465,258 Q 450,284 428,302 Q 405,320 378,330 Q 358,338 340,340 Q 335,360 330,380 Q 325,395 318,408 Q 308,420 295,425 Q 278,430 262,425 Q 248,420 240,408 Q 232,395 228,380 Q 222,358 218,340 Q 195,338 175,330 Q 148,318 128,302 Q 105,284 90,262 Q 75,238 70,210 Q 64,180 66,152 Q 68,120 80,95 Q 95,68 120,53 Q 155,38 200,45 Z"
          fill="url(#brainBase)" stroke="#8a5a48" strokeWidth="1"
        />
        <path d="M 200,45 Q 215,75 210,110 Q 205,140 215,165" fill="none" stroke="#8a5a48" strokeWidth="2" opacity="0.6" />
        <path d="M 260,33 Q 265,65 258,100 Q 252,130 262,158" fill="none" stroke="#8a5a48" strokeWidth="2" opacity="0.6" />
        <path d="M 315,38 Q 318,72 310,105 Q 303,132 312,160" fill="none" stroke="#8a5a48" strokeWidth="1.8" opacity="0.6" />
        <path d="M 365,55 Q 368,85 358,115 Q 350,138 360,165" fill="none" stroke="#8a5a48" strokeWidth="1.8" opacity="0.6" />
        <path d="M 85,155 Q 130,148 178,150 Q 225,152 270,148 Q 318,144 360,148 Q 405,152 438,162" fill="none" stroke="#9a6858" strokeWidth="1.5" opacity="0.5" />
        <path d="M 80,200 Q 130,192 180,195 Q 230,198 278,193 Q 328,188 372,192 Q 412,196 445,208" fill="none" stroke="#9a6858" strokeWidth="1.5" opacity="0.5" />
        <path d="M 82,240 Q 132,232 182,235 Q 232,238 278,232 Q 325,226 365,232 Q 402,238 430,252" fill="none" stroke="#9a6858" strokeWidth="1.5" opacity="0.5" />
        {[
          "M 112,130 Q 138,120 165,122 Q 190,124 210,128",
          "M 228,110 Q 256,100 282,102 Q 308,104 328,108",
          "M 348,100 Q 375,90 402,94 Q 428,98 448,108",
          "M 95,170 Q 128,160 160,162 Q 192,164 218,168",
          "M 218,154 Q 252,145 285,147 Q 318,149 345,153",
          "M 90,212 Q 126,202 162,204 Q 198,206 228,210",
          "M 224,195 Q 260,186 295,188 Q 328,191 355,196",
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#e8c0ac" strokeWidth="3" opacity="0.35" strokeLinecap="round" />
        ))}
        <path d="M 248,210 Q 248,188 260,176 Q 272,164 290,162 Q 310,160 324,172 Q 336,182 337,198" fill="none" stroke="#f0ddd0" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
        <ellipse cx="290" cy="255" rx="28" ry="22" fill="#c09888" stroke="#a07868" strokeWidth="1" opacity="0.85" />
        <path d="M 268,380 Q 268,390 270,400 Q 272,415 278,425 Q 284,435 290,438 Q 298,440 305,436 Q 312,430 316,418 Q 320,405 320,390 Q 320,375 318,365" fill="url(#brainstemBase)" stroke="#8a6050" strokeWidth="1" />
        <ellipse cx="148" cy="358" rx="80" ry="62" fill="url(#cerebellumBase)" stroke="#9a7060" strokeWidth="1" />
        {Array.from({ length: 18 }).map((_, i) => {
          const y = 308 + i * 6.8;
          const span = Math.sqrt(Math.max(0, 80 * 80 - (y - 358) * (y - 358)));
          if (span < 5) return null;
          return <path key={i} d={`M ${148 - span + 5},${y} Q ${148},${y - 3} ${148 + span - 5},${y}`} fill="none" stroke="#a07868" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />;
        })}
        <path d="M 148,298 Q 148,358 148,418" fill="none" stroke="#9a7060" strokeWidth="2.5" opacity="0.5" />
        {REGIONS.map((r, i) => (
          <path key={i} d={regionPaths[i]} fill={i === active ? `${r.color}55` : "transparent"} stroke={i === active ? r.color : "transparent"} strokeWidth={i === active ? 2 : 0} style={{ transition: "all 0.8s ease", filter: i === active ? "url(#regionGlow)" : "none" }} />
        ))}
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

const REGION_LIGHT_POS: [number, number, number][] = [
  [0.5, 0.4, 2.5],
  [0, 2.5, 0.5],
  [0, -1.5, -2.0],
  [2.2, -0.8, 0.5],
];

function BrainModelScene({ activeRegion }: { activeRegion: number }) {
  const { scene } = useGLTF("/brain_human.glb");
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
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
    return cloned;
  }, [scene]);

  useEffect(() => { arRef.current = activeRegion; }, [activeRegion]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.35;
      groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.06;
    }
    if (glowRef.current) {
      const target = new THREE.Vector3(...REGION_LIGHT_POS[arRef.current]);
      glowRef.current.position.lerp(target, 0.04);
      glowRef.current.color.set(REGIONS[arRef.current].hex);
      glowRef.current.intensity = 2.8 + 1.0 * Math.sin(t * 2.0);
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.65} color={0xfff8f0} />
      <hemisphereLight args={[0xffe0d0, 0x3a1a10, 0.75]} />
      <directionalLight position={[3, 5, 5]} intensity={2.8} color={0xfff0e8} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.65} color={0x7080b0} />
      <directionalLight position={[0, -3, 2]} intensity={0.35} color={0xffd8b8} />
      <pointLight ref={glowRef} position={REGION_LIGHT_POS[0]} distance={10} decay={2} intensity={2.8} />
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
      style={{
        background: "var(--deep-black)",
        position: "relative",
        minHeight: "400vh",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          padding: "0 clamp(24px,6vw,80px)",
          gap: "clamp(20px,4vw,60px)",
          overflow: "hidden",
        }}
      >
        {/* Left: Brain visual */}
        <div style={{ position: "relative", height: "clamp(320px,56vh,580px)" }}>
          {brainVisual}
          {/* Scroll progress bar */}
          <div style={{
            position: "absolute",
            bottom: -12,
            left: 0,
            right: 0,
            height: 2,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 1,
          }}>
            <div style={{
              height: "100%",
              width: `${scrollProgress * 100}%`,
              background: region.color,
              borderRadius: 1,
              transition: "width 0.1s linear, background 0.6s ease",
            }} />
          </div>
        </div>

        {/* Right: Region info */}
        <div>
          <p style={{
            fontSize: "0.62rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--gold-accent)",
            marginBottom: 18,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            What Is Corpus
          </p>

          {/* Region indicator pills */}
          <div style={{ display: "flex", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
            {REGIONS.map((r, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: i === activeRegion ? r.color : "rgba(255,255,255,0.12)",
                  transition: "all 0.5s ease",
                  transform: i === activeRegion ? "scale(1.5)" : "scale(1)",
                }}
              />
            ))}
          </div>

          <h2
            key={activeRegion}
            style={{
              fontSize: "clamp(2rem,4.5vw,3.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "white",
              marginBottom: 6,
              lineHeight: 1.05,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              animation: "fadeSlideIn 0.5s ease both",
            }}
          >
            {region.label}
          </h2>
          <p
            key={`tag-${activeRegion}`}
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: region.color,
              marginBottom: 20,
              fontFamily: "'DM Sans', sans-serif",
              animation: "fadeSlideIn 0.5s ease 0.08s both",
            }}
          >
            {region.tagLine}
          </p>
          <p
            key={`desc-${activeRegion}`}
            style={{
              fontSize: "0.88rem",
              color: "rgba(255,255,255,0.38)",
              marginBottom: 28,
              fontFamily: "'DM Sans', sans-serif",
              animation: "fadeSlideIn 0.5s ease 0.15s both",
            }}
          >
            {region.desc}
          </p>

          <div
            key={`events-${activeRegion}`}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              animation: "fadeSlideIn 0.5s ease 0.22s both",
            }}
          >
            {region.events.map((ev) => (
              <span
                key={ev}
                style={{
                  padding: "5px 12px",
                  border: `1px solid ${region.color}44`,
                  borderRadius: 2,
                  fontSize: "0.68rem",
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.04em",
                  background: `${region.color}0d`,
                }}
              >
                {ev}
              </span>
            ))}
          </div>

          <p style={{
            marginTop: 36,
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "0.15em",
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
