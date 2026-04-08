import { useEffect, useRef, useState } from "react";

const REGIONS = [
  {
    events: ["Chess", "Debate", "Art", "Academic Quiz"],
    color: "#c9a96e",
    label: "Frontal Lobe",
    desc: "Logic & Creativity",
  },
  {
    events: ["Badminton", "Table Tennis", "Basketball", "Volleyball"],
    color: "#7eb4d4",
    label: "Parietal Lobe",
    desc: "Coordination & Space",
  },
  {
    events: ["Running", "Kho Kho", "Kabbadi", "Football", "Shot Put", "High Jump"],
    color: "#7aaa8a",
    label: "Cerebellum",
    desc: "Balance & Motor Control",
  },
  {
    events: ["Dance", "Singing", "Stand-up Comedy", "Fun Events"],
    color: "#c98a6a",
    label: "Temporal Lobe",
    desc: "Arts & Performance",
  },
];

const DIM = "#1a1410";
const DIM2 = "#211a12";

function MidsagittalBrain({ active }: { active: number }) {
  const c = (idx: number) => (active === idx ? REGIONS[idx].color : DIM);
  const cs = (idx: number) =>
    active === idx ? REGIONS[idx].color + "55" : "#2a2018";
  const trans = "fill 0.65s ease";

  return (
    <svg
      viewBox="0 0 540 460"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", filter: "drop-shadow(0 4px 32px rgba(0,0,0,0.85))" }}
    >
      <defs>
        {/* ── Cerebrum clip ── */}
        <clipPath id="cc">
          <path d="
            M 54 258
            C 34 232 24 200 24 170
            C 24 140 34 112 52 90
            C 68 70 90 52 116 40
            C 140 28 168 22 200 22
            C 232 22 262 28 290 42
            C 318 56 342 76 360 102
            C 378 126 388 156 388 188
            C 388 216 380 242 364 264
            C 350 282 330 296 308 308
            C 290 318 272 326 256 334
            C 236 342 212 346 188 342
            C 164 338 140 326 118 310
            C 96 296 72 278 54 258 Z
          " />
        </clipPath>

        {/* ── Cerebellum clip ── */}
        <clipPath id="cbc">
          <path d="
            M 310 306
            C 328 294 352 286 378 286
            C 406 286 432 298 452 318
            C 470 336 480 362 476 388
            C 472 412 456 432 434 442
            C 412 452 384 452 360 442
            C 336 432 316 412 308 388
            C 300 364 300 340 310 320
            C 312 314 312 308 310 306 Z
          " />
        </clipPath>

        {/* ── Pons clip ── */}
        <clipPath id="pc">
          <ellipse cx="282" cy="372" rx="30" ry="22" />
        </clipPath>
      </defs>

      {/* ════════════════════════════════════════
          BRAINSTEM (behind cerebrum visually)
      ════════════════════════════════════════ */}
      <path
        d="M 268 312 C 262 332 258 358 258 382 C 258 406 262 426 266 446 L 296 446 C 300 426 304 406 304 382 C 304 358 300 332 294 312 Z"
        fill="#181008"
        stroke="#2e2010"
        strokeWidth="1.5"
      />
      {/* Midbrain taper at top */}
      <path
        d="M 272 308 C 266 318 262 330 260 344 L 302 344 C 300 330 296 318 290 308 Z"
        fill="#1c1208"
      />
      {/* Pons bulge */}
      <ellipse cx="282" cy="372" rx="30" ry="22" fill="#201508" stroke="#2e2010" strokeWidth="1" />
      {/* Medulla tapers slightly */}
      <path
        d="M 262 390 L 264 446 L 300 446 L 302 390 Z"
        fill="#181008"
      />

      {/* ════════════════════════════════════════
          CEREBRUM — colored regions (clipped)
      ════════════════════════════════════════ */}
      <g clipPath="url(#cc)">
        {/* Base */}
        <rect x="0" y="0" width="540" height="460" fill={DIM} />

        {/* ── FRONTAL LOBE (anterior, x < 210, above Sylvian y < 192) ── */}
        <polygon
          points="0,0 212,0 208,192 128,198 0,210"
          fill={c(0)}
          style={{ transition: trans }}
        />

        {/* ── PARIETAL + OCCIPITAL (top-posterior, x > 208) ── */}
        <polygon
          points="212,0 540,0 540,210 318,218 208,192"
          fill={c(1)}
          style={{ transition: trans }}
        />

        {/* ── TEMPORAL LOBE (inferior, below Sylvian) ── */}
        <polygon
          points="0,210 128,198 208,192 318,218 540,210 540,460 0,460"
          fill={c(3)}
          style={{ transition: trans }}
        />

        {/* ── GYRI LINES — frontal ── */}
        <g stroke="rgba(0,0,0,0.28)" strokeWidth="1.6" fill="none">
          <path d="M 44 170 C 60 150 80 138 100 132 C 118 126 136 126 150 132" />
          <path d="M 38 200 C 56 180 78 168 100 163 C 120 158 140 160 155 166" />
          <path d="M 40 228 C 58 210 78 200 98 196 C 116 192 133 193 146 198" />
          <path d="M 50 105 C 66 90 84 78 104 70 C 122 62 142 58 160 60" />
        </g>

        {/* ── GYRI LINES — top (parietal) ── */}
        <g stroke="rgba(0,0,0,0.28)" strokeWidth="1.6" fill="none">
          <path d="M 158 36 C 190 28 222 24 254 26 C 286 28 316 36 342 50" />
          <path d="M 162 58 C 192 48 224 44 256 46 C 288 48 316 58 340 72" />
          <path d="M 168 82 C 196 72 224 68 254 70 C 282 72 308 82 330 96" />
          <path d="M 340 52 C 358 68 372 90 378 114 C 384 136 382 158 374 178" />
          <path d="M 356 74 C 372 92 382 116 386 142 C 388 164 384 186 376 204" />
        </g>

        {/* ── GYRI LINES — temporal ── */}
        <g stroke="rgba(0,0,0,0.28)" strokeWidth="1.6" fill="none">
          <path d="M 70 278 C 90 286 114 290 138 288 C 160 286 180 280 196 270" />
          <path d="M 76 308 C 96 318 120 322 144 320 C 166 318 186 310 200 298" />
        </g>

        {/* ── CORPUS CALLOSUM — white C-shaped band ── */}
        {/* Outer edge (thick) */}
        <path
          d="M 162 206
             C 150 192 144 174 146 156
             C 148 138 160 124 178 116
             C 196 108 220 106 246 108
             C 272 110 294 118 308 132
             C 322 146 326 164 320 180
             C 316 194 306 204 294 210"
          fill="none"
          stroke="rgba(245,235,215,0.92)"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Inner highlight */}
        <path
          d="M 165 204
             C 154 190 149 172 151 155
             C 153 138 164 126 181 118
             C 198 110 222 108 247 110
             C 272 112 293 120 306 134
             C 319 147 322 164 316 179
             C 312 192 303 202 292 208"
          fill="none"
          stroke="rgba(255,248,235,0.45)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* ── THALAMUS ── */}
        <ellipse cx="248" cy="244" rx="42" ry="27" fill="rgba(190,160,115,0.32)" stroke="rgba(210,180,135,0.42)" strokeWidth="1.5" />
        <ellipse cx="248" cy="244" rx="28" ry="18" fill="rgba(200,170,125,0.18)" />

        {/* ── 3RD VENTRICLE (thin slit) ── */}
        <line x1="248" y1="218" x2="248" y2="272" stroke="rgba(160,200,230,0.22)" strokeWidth="4" strokeLinecap="round" />

        {/* ── LATERAL VENTRICLE hint ── */}
        <path
          d="M 175 148 C 198 132 228 126 260 128 C 290 130 312 142 320 158"
          fill="none"
          stroke="rgba(160,200,230,0.20)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* ── CINGULATE GYRUS outline ── */}
        <path
          d="M 158 210
             C 144 194 136 172 138 150
             C 140 128 154 110 175 100
             C 195 90 220 86 248 86
             C 275 86 299 92 316 104
             C 333 116 340 134 337 154
             C 334 172 324 188 310 198"
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="2.5"
        />

        {/* ── CENTRAL SULCUS divider line (subtle) ── */}
        <path
          d="M 212 22 C 210 50 208 85 208 120 C 208 150 210 170 210 192"
          fill="none"
          stroke="rgba(0,0,0,0.45)"
          strokeWidth="2.5"
        />

        {/* ── SYLVIAN FISSURE line (subtle) ── */}
        <path
          d="M 76 208 C 100 198 130 194 162 194 C 192 194 220 196 248 196 C 276 196 302 198 320 208"
          fill="none"
          stroke="rgba(0,0,0,0.45)"
          strokeWidth="2.5"
        />

        {/* ── REGION LABELS inside brain ── */}
        <text x="110" y="118" fontSize="8.5" fill={active === 0 ? REGIONS[0].color : "rgba(255,255,255,0.18)"} textAnchor="middle" fontWeight="700" letterSpacing="1.5" style={{ transition: "fill 0.6s ease", fontFamily: "Inter, sans-serif" }}>FRONTAL</text>
        <text x="300" y="70" fontSize="8.5" fill={active === 1 ? REGIONS[1].color : "rgba(255,255,255,0.18)"} textAnchor="middle" fontWeight="700" letterSpacing="1.5" style={{ transition: "fill 0.6s ease", fontFamily: "Inter, sans-serif" }}>PARIETAL</text>
        <text x="148" y="296" fontSize="8.5" fill={active === 3 ? REGIONS[3].color : "rgba(255,255,255,0.18)"} textAnchor="middle" fontWeight="700" letterSpacing="1.5" style={{ transition: "fill 0.6s ease", fontFamily: "Inter, sans-serif" }}>TEMPORAL</text>
        <text x="248" y="248" fontSize="7" fill="rgba(210,185,140,0.6)" textAnchor="middle" style={{ fontFamily: "Inter, sans-serif" }}>Thalamus</text>
        <text x="240" y="156" fontSize="7" fill="rgba(245,235,215,0.55)" textAnchor="middle" style={{ fontFamily: "Inter, sans-serif" }}>Corpus Callosum</text>
      </g>

      {/* ── CEREBRUM OUTLINE ── */}
      <path
        d="M 54 258
           C 34 232 24 200 24 170
           C 24 140 34 112 52 90
           C 68 70 90 52 116 40
           C 140 28 168 22 200 22
           C 232 22 262 28 290 42
           C 318 56 342 76 360 102
           C 378 126 388 156 388 188
           C 388 216 380 242 364 264
           C 350 282 330 296 308 308
           C 290 318 272 326 256 334
           C 236 342 212 346 188 342
           C 164 338 140 326 118 310
           C 96 296 72 278 54 258 Z"
        fill="none"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="2"
      />

      {/* ════════════════════════════════════════
          CEREBELLUM
      ════════════════════════════════════════ */}
      <path
        d="M 310 306
           C 328 294 352 286 378 286
           C 406 286 432 298 452 318
           C 470 336 480 362 476 388
           C 472 412 456 432 434 442
           C 412 452 384 452 360 442
           C 336 432 316 412 308 388
           C 300 364 300 340 310 320
           C 312 314 312 308 310 306 Z"
        fill={c(2)}
        stroke={cs(2)}
        strokeWidth="1.5"
        style={{ transition: trans }}
      />

      {/* Cerebellum foliation lines (arbor vitae) */}
      <g clipPath="url(#cbc)" stroke="rgba(0,0,0,0.35)" strokeWidth="1.3" fill="none">
        <path d="M 318 318 C 340 308 366 302 390 304 C 414 306 436 318 450 334" />
        <path d="M 312 336 C 334 326 360 320 386 322 C 412 324 435 336 450 352" />
        <path d="M 308 354 C 332 344 358 338 384 340 C 410 342 433 354 448 370" />
        <path d="M 308 372 C 332 362 358 358 384 360 C 410 362 432 372 446 388" />
        <path d="M 312 390 C 336 382 360 378 384 380 C 408 382 428 392 440 406" />
        <path d="M 322 408 C 344 401 366 398 388 400 C 408 402 426 410 436 422" />
        <path d="M 338 424 C 356 419 374 417 394 420 C 410 422 424 430 432 440" />
        {/* Vertical arbor vitae */}
        <path d="M 393 288 C 392 320 390 358 390 395 C 390 415 392 432 393 445" strokeWidth="0.9" stroke="rgba(0,0,0,0.2)" />
        <path d="M 366 292 C 366 324 364 360 364 394 C 364 416 366 432 368 444" strokeWidth="0.9" stroke="rgba(0,0,0,0.2)" />
        <path d="M 420 298 C 419 330 418 364 418 396 C 418 418 419 434 420 445" strokeWidth="0.9" stroke="rgba(0,0,0,0.2)" />
      </g>

      {/* Cerebellum outline */}
      <path
        d="M 310 306
           C 328 294 352 286 378 286
           C 406 286 432 298 452 318
           C 470 336 480 362 476 388
           C 472 412 456 432 434 442
           C 412 452 384 452 360 442
           C 336 432 316 412 308 388
           C 300 364 300 340 310 320
           C 312 314 312 308 310 306 Z"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="2"
      />

      {/* Cerebellum label */}
      <text
        x="392"
        y="374"
        fontSize="8.5"
        fill={active === 2 ? REGIONS[2].color : "rgba(255,255,255,0.18)"}
        textAnchor="middle"
        fontWeight="700"
        letterSpacing="1"
        style={{ transition: "fill 0.6s ease", fontFamily: "Inter, sans-serif" }}
      >
        CEREBELLUM
      </text>

      {/* ── BRAINSTEM OUTLINE ── */}
      <path
        d="M 268 312 C 262 332 258 358 258 382 C 258 406 262 426 266 446 L 296 446 C 300 426 304 406 304 382 C 304 358 300 332 294 312 Z"
        fill="none"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="1.5"
      />
      {/* Pons outline */}
      <ellipse cx="282" cy="372" rx="30" ry="22" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />

      {/* Brainstem label */}
      <text x="282" y="410" fontSize="7" fill="rgba(255,255,255,0.22)" textAnchor="middle" style={{ fontFamily: "Inter, sans-serif" }}>Brainstem</text>
      <text x="282" y="420" fontSize="6.5" fill="rgba(255,255,255,0.14)" textAnchor="middle" style={{ fontFamily: "Inter, sans-serif" }}>(Pons · Medulla)</text>

      {/* ── PITUITARY hint (small circle, inferior hypothalamus) ── */}
      <circle cx="210" cy="262" r="6" fill="rgba(180,150,110,0.25)" stroke="rgba(200,170,130,0.3)" strokeWidth="1" />
      <text x="200" y="278" fontSize="6" fill="rgba(255,255,255,0.18)" textAnchor="middle" style={{ fontFamily: "Inter, sans-serif" }}>Pituitary</text>
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
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / scrollable));
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
    <div id="brain-section" ref={sectionRef} style={{ height: `${REGIONS.length * 100 + 80}vh`, position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
        background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Ambient bloom */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 58% 50%, ${region.color}18 0%, transparent 55%)`,
          transition: "background 1s ease", pointerEvents: "none",
        }} />

        <div style={{
          display: "flex", alignItems: "center", width: "100%", maxWidth: 1100,
          padding: "0 clamp(16px,4vw,48px)", gap: "clamp(24px,4vw,48px)", zIndex: 5,
        }}>
          {/* Left panel */}
          <div key={activeRegion} style={{ flexShrink: 0, width: "clamp(130px,18vw,220px)", animation: "brainFadeIn 0.5s ease forwards" }}>
            <p style={{ fontSize: "0.48rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 12 }}>
              {region.label}
            </p>
            <div style={{ width: 24, height: 2, background: region.color, marginBottom: 18, borderRadius: 1 }} />
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: 16, letterSpacing: "0.05em" }}>
              {region.desc}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {region.events.map(ev => (
                <span key={ev} style={{
                  fontSize: "clamp(0.65rem,1.2vw,0.82rem)", fontWeight: 600,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  color: region.color, lineHeight: 1.3,
                }}>
                  {ev}
                </span>
              ))}
            </div>
          </div>

          {/* Brain SVG */}
          <div style={{ flex: "1 1 auto", maxWidth: "min(500px,56vw)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MidsagittalBrain active={activeRegion} />
          </div>

          {/* Right spacer */}
          <div style={{ flexShrink: 0, width: "clamp(130px,18vw,220px)" }} />
        </div>

        {/* Progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, height: 2,
          width: `${scrollProgress * 100}%`,
          background: region.color,
          transition: "width 0.15s linear, background 0.6s ease",
        }} />

        {/* Scroll hint */}
        {scrollProgress < 0.04 && (
          <div style={{
            position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.3,
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
