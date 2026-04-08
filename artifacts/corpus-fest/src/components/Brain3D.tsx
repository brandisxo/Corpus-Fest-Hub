import { Component, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import brainImg from "@assets/IMG_6099_1775634258972.jpeg";

const REGIONS = [
  { events: ["Chess", "Debate", "Art", "Academic Quiz"],
    color: "#c9a96e", hex: 0xc9a96e, label: "Frontal Lobe",   desc: "Logic & Creativity"     },
  { events: ["Badminton", "Table Tennis", "Basketball", "Volleyball"],
    color: "#7eb4d4", hex: 0x7eb4d4, label: "Parietal Lobe",  desc: "Coordination & Space"   },
  { events: ["Running", "Kho Kho", "Kabbadi", "Football", "Shot Put", "High Jump"],
    color: "#7aaa8a", hex: 0x7aaa8a, label: "Cerebellum",     desc: "Balance & Motor Control" },
  { events: ["Dance", "Singing", "Stand-up Comedy", "Fun Events"],
    color: "#c98a6a", hex: 0xc98a6a, label: "Temporal Lobe",  desc: "Arts & Performance"     },
];

// ─── Approximate region glow positions over the brain image ──────────────────
// These elliptical areas are positioned over the correct anatomical regions
const REGION_GLOW: Array<{ left: string; top: string; width: string; height: string; borderRadius: string }> = [
  { left: "6%",  top: "12%", width: "36%", height: "70%", borderRadius: "50% 40% 40% 50%" }, // Frontal
  { left: "36%", top: "4%",  width: "32%", height: "48%", borderRadius: "55% 55% 40% 40%" }, // Parietal
  { left: "60%", top: "42%", width: "36%", height: "52%", borderRadius: "45% 45% 50% 50%" }, // Cerebellum
  { left: "8%",  top: "52%", width: "52%", height: "44%", borderRadius: "40% 40% 50% 50%" }, // Temporal
];

// ─── WebGL availability check ─────────────────────────────────────────────────
function isWebGLAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch { return false; }
}

// ─── Error boundary (class component) ────────────────────────────────────────
interface BoundaryProps { children: React.ReactNode; fallback: React.ReactNode }
class CanvasBoundary extends Component<BoundaryProps, { crashed: boolean }> {
  state = { crashed: false };
  componentDidCatch() { this.setState({ crashed: true }); }
  render() { return this.state.crashed ? this.props.fallback : this.props.children; }
}

// ─────────────────────────────────────────────────────────────────────────────
//  IMAGE FALLBACK — illustrated midsagittal brain + glowing region overlay
// ─────────────────────────────────────────────────────────────────────────────
function ImageBrain({ active }: { active: number }) {
  return (
    <div style={{ position: "relative", width: "100%", userSelect: "none" }}>
      {/* Base brain illustration, slightly dimmed */}
      <img
        src={brainImg}
        alt="Midsagittal brain section"
        draggable={false}
        style={{ width: "100%", display: "block", borderRadius: 12, filter: "brightness(0.72) saturate(0.8)" }}
      />

      {/* Region glow overlays */}
      {REGIONS.map((r, i) => {
        const g = REGION_GLOW[i];
        const isActive = i === active;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              ...g,
              background: isActive ? `${r.color}38` : "transparent",
              boxShadow: isActive ? `0 0 40px 12px ${r.color}55, inset 0 0 30px 6px ${r.color}28` : "none",
              border: isActive ? `1.5px solid ${r.color}66` : "none",
              transition: "all 0.7s ease",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Active region label badge */}
      <div style={{
        position: "absolute",
        bottom: 14,
        right: 14,
        padding: "6px 12px",
        background: "rgba(10,10,10,0.80)",
        border: `1px solid ${REGIONS[active].color}55`,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        gap: 8,
        backdropFilter: "blur(6px)",
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: REGIONS[active].color }} />
        <span style={{ fontSize: "0.62rem", color: REGIONS[active].color, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {REGIONS[active].label}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  THREE.JS — 3D procedural brain (only rendered when WebGL is available)
// ─────────────────────────────────────────────────────────────────────────────
function getRegion(nx: number, ny: number, nz: number): number {
  if (ny < -0.28) return 3;   // Temporal (inferior)
  if (nz > 0.18)  return 0;   // Frontal  (anterior)
  if (ny > 0.12)  return 1;   // Parietal (superior)
  return 3;
}

function buildCerebrumGeo() {
  const SEGS = 112;
  const geo  = new THREE.SphereGeometry(1, SEGS, SEGS);
  const pos  = geo.attributes.position as THREE.BufferAttribute;
  const N    = pos.count;
  const dispArr = new Float32Array(N);
  const normArr = new Float32Array(N * 3);

  for (let i = 0; i < N; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const l = Math.sqrt(x*x + y*y + z*z) || 1;
    const nx = x/l, ny = y/l, nz = z/l;
    normArr[i*3] = nx; normArr[i*3+1] = ny; normArr[i*3+2] = nz;

    // Large primary gyri
    let b = 0.082 * (
      Math.sin(nx*8.1+0.31)*Math.cos(ny*7.2+0.14) +
      Math.sin(ny*7.5+1.82)*Math.cos(nz*8.2+0.52) +
      Math.sin(nz*8.3+0.91)*Math.cos(nx*7.0+1.10) +
      0.4*Math.sin(nx*5.2+ny*4.3+0.50)
    );
    // Secondary folds
    b += 0.033 * (
      Math.sin(nx*17+0.82)*Math.cos(ny*15.5+0.40) +
      Math.sin(ny*16+2.52)*Math.cos(nz*17.5+1.20) +
      Math.sin(nz*17+1.42)*Math.cos(nx*15.8+0.80)
    );
    // Fine wrinkles
    b += 0.015 * (
      Math.sin(nx*31+1.10)*Math.cos(ny*29.5+0.30) +
      Math.sin(ny*30+0.42)*Math.cos(nz*31.5+0.90)
    );
    dispArr[i] = b;

    // Longitudinal fissure (interhemispheric groove)
    const fissure = (Math.abs(nx) < 0.13 && ny > 0.22)
      ? -0.15 * Math.pow(Math.max(0, 1 - Math.abs(nx)/0.13), 1.5) * Math.min(1, (ny-0.22)/0.50)
      : 0;

    const r = l + b + fissure;
    pos.setXYZ(i, nx*r, ny*r, nz*r);
  }

  geo.computeVertexNormals();
  const colorArr = new Float32Array(N * 3);
  geo.setAttribute("color", new THREE.BufferAttribute(colorArr, 3));
  return { geo, dispArr, normArr };
}

function buildCerebellumGeo() {
  const geo = new THREE.SphereGeometry(0.44, 64, 64);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const N   = pos.count;
  const dispArr = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const l = Math.sqrt(x*x + y*y + z*z) || 1;
    const nx = x/l, ny = y/l;
    const b = 0.058 * (
      Math.sin(ny*30+0.50)*Math.cos(nx*5.5) +
      Math.sin(ny*25+1.30)*Math.cos((z/l)*7.0) +
      0.35*Math.sin(ny*40+0.80)
    );
    dispArr[i] = b;
    const r = l + b;
    pos.setXYZ(i, nx*r, ny*r, (z/l)*r);
  }

  geo.computeVertexNormals();
  const colorArr = new Float32Array(N * 3);
  geo.setAttribute("color", new THREE.BufferAttribute(colorArr, 3));
  return { geo, dispArr };
}

function applyColors(
  geo: THREE.BufferGeometry,
  dispArr: Float32Array,
  normArr: Float32Array | null,
  activeRegion: number,
  isCerebellum: boolean,
) {
  const attr = geo.attributes.color as THREE.BufferAttribute;
  const N    = attr.count;
  let mn = Infinity, mx = -Infinity;
  for (let i = 0; i < N; i++) { mn = Math.min(mn, dispArr[i]); mx = Math.max(mx, dispArr[i]); }
  const range = mx - mn || 1;
  const col = new THREE.Color(REGIONS[activeRegion].hex);

  for (let i = 0; i < N; i++) {
    const cf = 0.30 + 0.70 * ((dispArr[i] - mn) / range); // cavity factor
    const region = isCerebellum ? 2 : (normArr ? getRegion(normArr[i*3], normArr[i*3+1], normArr[i*3+2]) : 0);

    if (region === activeRegion) {
      attr.setXYZ(i, col.r*(0.50+0.50*cf), col.g*(0.50+0.50*cf), col.b*(0.50+0.50*cf));
    } else {
      const base = 0.030 + 0.028*cf;
      attr.setXYZ(i, base*1.08, base, base*0.92);
    }
  }
  attr.needsUpdate = true;
}

function BrainScene({ activeRegion }: { activeRegion: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef  = useRef<THREE.PointLight>(null);
  const arRef    = useRef(activeRegion);

  const cerebrum   = useMemo(() => buildCerebrumGeo(),   []);
  const cerebellum = useMemo(() => buildCerebellumGeo(), []);

  useEffect(() => {
    arRef.current = activeRegion;
    applyColors(cerebrum.geo,   cerebrum.dispArr,   cerebrum.normArr,   activeRegion, false);
    applyColors(cerebellum.geo, cerebellum.dispArr, null,               activeRegion, true);
  }, [activeRegion, cerebrum, cerebellum]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.11;
    if (glowRef.current) {
      glowRef.current.color.set(REGIONS[arRef.current].hex);
      glowRef.current.intensity = 1.6 + 0.5*Math.sin(t*2.2);
    }
  });

  const scale: [number,number,number] = [1.35, 0.90, 1.15];

  return (
    <group ref={groupRef}>
      <hemisphereLight args={[0xfff8f0, 0x201510, 0.65]} />
      <directionalLight position={[3, 4, 5]}   intensity={2.4} color={0xffe8d0} />
      <directionalLight position={[-4, 1, -4]} intensity={0.55} color={0x8090c0} />
      <directionalLight position={[0, -3, 2]}  intensity={0.30} color={0xfff0e0} />
      <pointLight ref={glowRef} position={[0, 0.2, 2.8]} distance={9} decay={2} />

      <mesh geometry={cerebrum.geo} scale={scale}>
        <meshStandardMaterial vertexColors roughness={0.85} metalness={0.02} />
      </mesh>
      <mesh geometry={cerebellum.geo} position={[0,-0.50,-0.74]} scale={[scale[0]*0.52, scale[1]*0.56, scale[2]*0.52]}>
        <meshStandardMaterial vertexColors roughness={0.82} metalness={0.02} />
      </mesh>
      <mesh position={[0,-0.86*scale[1],-0.20*scale[2]]} rotation={[0.28,0,0]}>
        <cylinderGeometry args={[0.10*scale[0], 0.08*scale[0], 0.52*scale[1], 20]} />
        <meshStandardMaterial color="#0d0a06" roughness={0.88} />
      </mesh>
    </group>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Brain3D() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeRegion, setActiveRegion] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeRef = useRef(0);

  // Detect WebGL once on mount (stable across renders)
  const [webglOk] = useState(() => isWebGLAvailable());

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

  const brainVisual = webglOk ? (
    <CanvasBoundary fallback={<ImageBrain active={activeRegion} />}>
      <Canvas
        camera={{ position: [0, 0.1, 3.3], fov: 44 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <BrainScene activeRegion={activeRegion} />
      </Canvas>
    </CanvasBoundary>
  ) : (
    <ImageBrain active={activeRegion} />
  );

  return (
    <div id="brain-section" ref={sectionRef} style={{ height: `${REGIONS.length * 100 + 80}vh`, position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Ambient colour bloom */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 58% 50%, ${region.color}1c 0%, transparent 58%)`, transition: "background 1s ease", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: 1100, padding: "0 clamp(16px,4vw,48px)", gap: "clamp(24px,4vw,48px)", zIndex: 5 }}>

          {/* Left info panel */}
          <div key={activeRegion} style={{ flexShrink: 0, width: "clamp(130px,18vw,220px)", animation: "brainFadeIn 0.5s ease forwards" }}>
            <p style={{ fontSize: "0.48rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 12 }}>
              {region.label}
            </p>
            <div style={{ width: 24, height: 2, background: region.color, marginBottom: 18, borderRadius: 1 }} />
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: 16, letterSpacing: "0.05em" }}>{region.desc}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {region.events.map(ev => (
                <span key={ev} style={{ fontSize: "clamp(0.65rem,1.2vw,0.82rem)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: region.color, lineHeight: 1.3 }}>
                  {ev}
                </span>
              ))}
            </div>
          </div>

          {/* Brain visual */}
          <div style={{ flex: "1 1 auto", maxWidth: "min(500px,54vw)", aspectRatio: "1/1", display: "flex", alignItems: "center" }}>
            {brainVisual}
          </div>

          {/* Right spacer */}
          <div style={{ flexShrink: 0, width: "clamp(130px,18vw,220px)" }} />
        </div>

        {/* Progress bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, width: `${scrollProgress * 100}%`, background: region.color, transition: "width 0.15s linear, background 0.6s ease" }} />

        {/* Scroll hint */}
        {scrollProgress < 0.04 && (
          <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.3 }}>
            <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)", animation: "scrollPulse 2s ease-in-out infinite" }} />
            <p style={{ fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>Scroll</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes brainFadeIn {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
      `}</style>
    </div>
  );
}
