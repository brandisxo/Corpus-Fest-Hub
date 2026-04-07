import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const REGIONS = [
  { events: ["Chess", "Debate", "Art", "Academic Quiz"],                           color: "#c9a96e", hex: 0xc9a96e, label: "Frontal Lobe"         },
  { events: ["Badminton", "Table Tennis", "Basketball", "Volleyball"],             color: "#7eb4d4", hex: 0x7eb4d4, label: "Parietal & Occipital" },
  { events: ["Running", "Kho Kho", "Kabbadi", "Football", "Shot Put", "High Jump"],color: "#7aaa8a", hex: 0x7aaa8a, label: "Cerebellum"           },
  { events: ["Dance", "Singing", "Stand-up Comedy", "Fun Events"],                 color: "#c98a6a", hex: 0xc98a6a, label: "Temporal"             },
];

function makeBumpySphere(radius: number, segs: number, amt: number): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(radius, segs, segs);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const l = Math.sqrt(x*x + y*y + z*z) || 1;
    const nx = x/l, ny = y/l, nz = z/l;
    const b = amt * (
      Math.sin(nx*22+0.3)*Math.cos(ny*20) +
      Math.sin(ny*18+1.6)*Math.cos(nz*22) +
      Math.sin(nz*20+0.9)*Math.cos(nx*18) +
      0.35*Math.sin(nx*10+ny*8+0.5)
    );
    p.setXYZ(i, x+nx*b, y+ny*b, z+nz*b);
  }
  g.computeVertexNormals();
  return g;
}

function makeCerebellumGeo(): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(0.42, 52, 52);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const l = Math.sqrt(x*x + y*y + z*z) || 1;
    const nx = x/l, ny = y/l, nz = z/l;
    const b = 0.055 * (
      Math.sin(nx*32+0.5)*Math.cos(ny*28) +
      Math.sin(ny*26+2.1)*Math.cos(nz*30) +
      Math.sin(nz*28+1.2)*Math.cos(nx*26) +
      0.3*Math.sin(ny*14+nz*12+0.8)
    );
    p.setXYZ(i, x+nx*b, y+ny*b, z+nz*b);
  }
  g.computeVertexNormals();
  return g;
}

function getVertexRegion(nx: number, ny: number, nz: number): number {
  if (nz > 0.05 && ny > -0.38) return 0;
  if (ny > -0.18) return 1;
  return 3;
}

export default function Brain3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeRegion, setActiveRegion] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeRef = useRef(0);

  const [webglFailed, setWebglFailed] = useState(false);

  // Store mutable scene objects in a plain ref (no React state)
  const three = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    group: THREE.Group;
    rafId: number;
    cerebrumGeo: THREE.BufferGeometry;
    colorArr: Float32Array;
    cerebellumMat: THREE.MeshStandardMaterial;
    brainstemMat: THREE.MeshStandardMaterial;
    pLights: THREE.PointLight[];
    updateRegion: (idx: number) => void;
  } | null>(null);

  // ── Init Three.js scene ──────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cleanup: (() => void) | null = null;
    let initDone = false;

    function tryInit() {
      if (initDone || !container) return;
      const W = container.clientWidth;
      const H = container.clientHeight;
      if (W < 10) return;
      initDone = true;

      try {
        _doInit(W, H);
      } catch {
        setWebglFailed(true);
      }
    }

    function _doInit(W: number, H: number) {
      if (!container) return;

      // ── Renderer ────────────────────────────────────────────────────────────
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        setWebglFailed(true);
        return;
      }

      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // ── Scene & Camera ──────────────────────────────────────────────────────
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(44, W / H, 0.1, 100);
      camera.position.set(0, 0, 3.4);

      // ── Lights ──────────────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const key = new THREE.DirectionalLight(0xfff8f0, 1.5);
      key.position.set(3, 4, 3);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xc0d8ff, 0.4);
      fill.position.set(-4, 1, -2);
      scene.add(fill);

      const plPositions: [number,number,number][] = [
        [0, 0.3, 2.5], [0, 1.5, -1.5], [0, -1.5, -2.2], [1.2, -1.2, 0.5],
      ];
      const pLights = plPositions.map((pos, i) => {
        const l = new THREE.PointLight(REGIONS[i].hex, 0.25, 6);
        l.position.set(...pos);
        scene.add(l);
        return l;
      });

      // ── Group ───────────────────────────────────────────────────────────────
      const group = new THREE.Group();
      group.scale.set(1.08, 0.93, 1.12);
      scene.add(group);

      // ── Cerebrum with vertex colours ────────────────────────────────────────
      const cerebrumGeo = makeBumpySphere(1.0, 80, 0.06);
      const colorArr = new Float32Array(cerebrumGeo.attributes.position.count * 3);

      function rebuildColors(active: number) {
        const pos = cerebrumGeo.attributes.position as THREE.BufferAttribute;
        const activeC = new THREE.Color(REGIONS[active].hex);
        const dimC = new THREE.Color(0x111111);
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
          const l = Math.sqrt(x*x + y*y + z*z) || 1;
          const region = getVertexRegion(x/l, y/l, z/l);
          const isActive = (region === active && active !== 2);
          const c = isActive ? activeC : dimC;
          colorArr[i*3] = c.r; colorArr[i*3+1] = c.g; colorArr[i*3+2] = c.b;
        }
        cerebrumGeo.setAttribute("color", new THREE.BufferAttribute(colorArr.slice(), 3));
      }

      rebuildColors(0);
      const cerebrumMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75, metalness: 0.05 });
      group.add(new THREE.Mesh(cerebrumGeo, cerebrumMat));

      // ── Cerebellum ──────────────────────────────────────────────────────────
      const cerebellumMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.72, metalness: 0.05 });
      const cMesh = new THREE.Mesh(makeCerebellumGeo(), cerebellumMat);
      cMesh.position.set(0, -0.52, -0.72);
      cMesh.scale.set(1, 0.78, 0.88);
      group.add(cMesh);

      // ── Brainstem ───────────────────────────────────────────────────────────
      const brainstemMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7, metalness: 0.08 });
      const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.085, 0.55, 20), brainstemMat);
      bMesh.position.set(0, -1.0, -0.22);
      bMesh.rotation.x = 0.28;
      group.add(bMesh);

      // ── Corpus callosum ridge ────────────────────────────────────────────────
      const rMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, 20, 8),
        new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.9 })
      );
      rMesh.scale.set(0.62, 0.075, 0.68);
      rMesh.position.set(0, -0.05, -0.05);
      group.add(rMesh);

      // ── Region update function ───────────────────────────────────────────────
      function updateRegion(idx: number) {
        rebuildColors(idx);
        cerebellumMat.color.set(idx === 2 ? REGIONS[2].hex : 0x111111);
        cerebellumMat.emissive.set(idx === 2 ? new THREE.Color(REGIONS[2].hex).multiplyScalar(0.25) : 0x000000);
        brainstemMat.color.set(idx === 3 ? REGIONS[3].hex : 0x111111);
        brainstemMat.emissive.set(idx === 3 ? new THREE.Color(REGIONS[3].hex).multiplyScalar(0.25) : 0x000000);
        pLights.forEach((l, i) => { l.intensity = i === idx ? 2.2 : 0.25; });
      }

      // ── Render loop ──────────────────────────────────────────────────────────
      const t0 = performance.now();
      let rafId = 0;
      function animate() {
        rafId = requestAnimationFrame(animate);
        try {
          group.rotation.y = (performance.now() - t0) / 1000 * 0.13;
          renderer.render(scene, camera);
        } catch {
          cancelAnimationFrame(rafId);
        }
      }
      animate();

      // ── Resize ───────────────────────────────────────────────────────────────
      function onResize() {
        if (!container) return;
        const W2 = container.clientWidth, H2 = container.clientHeight;
        if (W2 < 1 || H2 < 1) return;
        camera.aspect = W2 / H2;
        camera.updateProjectionMatrix();
        renderer.setSize(W2, H2);
      }
      window.addEventListener("resize", onResize);

      three.current = { renderer, scene, camera, group, rafId, cerebrumGeo, colorArr, cerebellumMat, brainstemMat, pLights, updateRegion };

      cleanup = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        three.current = null;
      };
    }

    const ro = new ResizeObserver(tryInit);
    ro.observe(container);
    setTimeout(tryInit, 80);

    return () => {
      ro.disconnect();
      cleanup?.();
    };
  }, []);

  // Update 3D scene when region changes
  useEffect(() => {
    three.current?.updateRegion(activeRegion);
  }, [activeRegion]);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById("brain-section");
      if (!section) return;
      const top = window.scrollY + section.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(1, (window.scrollY - top) / (section.offsetHeight - window.innerHeight)));
      setScrollProgress(progress);
      const idx = Math.min(REGIONS.length - 1, Math.floor(progress * REGIONS.length));
      if (idx !== activeRef.current) { activeRef.current = idx; setActiveRegion(idx); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    setTimeout(onScroll, 100);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const region = REGIONS[activeRegion];

  return (
    <div id="brain-section" ref={sectionRef} style={{ height: `${REGIONS.length * 100 + 80}vh`, position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Ambient color bloom */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 58% 50%, ${region.color}20 0%, transparent 55%)`, transition: "background 1s ease", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: 1100, padding: "0 clamp(16px,4vw,48px)", gap: "clamp(24px,4vw,48px)", zIndex: 5 }}>

          {/* Left panel — events */}
          <div key={activeRegion} style={{ flexShrink: 0, width: "clamp(130px,18vw,220px)", animation: "brainFadeIn 0.5s ease forwards" }}>
            <p style={{ fontSize: "0.48rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 12 }}>
              {region.label}
            </p>
            <div style={{ width: 24, height: 2, background: region.color, marginBottom: 18, borderRadius: 1 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {region.events.map(ev => (
                <span key={ev} style={{ fontSize: "clamp(0.7rem,1.25vw,0.86rem)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: region.color, lineHeight: 1.3 }}>
                  {ev}
                </span>
              ))}
            </div>
          </div>

          {/* 3D canvas container */}
          <div ref={containerRef} style={{ flex: "1 1 auto", maxWidth: "min(520px,56vw)", aspectRatio: "1/1" }} />

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
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
