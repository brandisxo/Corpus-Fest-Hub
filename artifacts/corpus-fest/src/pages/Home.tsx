import { useEffect, useRef, useState } from "react";
import Brain3D from "@/components/Brain3D";

// ── Events data ────────────────────────────────────────────────────────────────
const SPORTS_EVENTS = [
  { name: "Running", date: "22 Apr", time: "9:00 AM", events: ["100M Boys", "100M Girls", "200M Boys", "200M Girls", "400M Boys", "400M Girls", "400M Relay"], cat: "Track" },
  { name: "Chess", date: "22–23 Apr", time: "4:00 PM", events: ["Girls & Boys Mix"], cat: "Board" },
  { name: "Table Tennis", date: "22–23 Apr", time: "4:00 PM", events: ["Singles Boys", "Singles Girls", "Doubles Boys", "Doubles Girls"], cat: "Racket" },
  { name: "Kho Kho", date: "22–23 Apr", time: "4:00 PM", events: ["Boys vs Boys", "Girls vs Girls", "Mix"], cat: "Field" },
  { name: "Kabbadi", date: "23–24 Apr", time: "9:00 AM", events: ["Boys vs Boys", "Girls vs Girls"], cat: "Field" },
  { name: "Shot Put", date: "23 Apr", time: "9:00 AM", events: ["Boys", "Girls"], cat: "Athletics" },
  { name: "High Jump & Long Jump", date: "23–24 Apr", events: ["Boys HJ", "Girls HJ", "Boys LJ"], cat: "Athletics" },
  { name: "Satoliya", date: "24 Apr", events: ["Boys vs Boys", "Girls vs Girls", "Mix"], cat: "Field" },
  { name: "Carrom", date: "23–24 Apr", events: ["Double Boys & Girls"], cat: "Board" },
  { name: "Volleyball", date: "22–23 Apr", time: "4:00–9:00 PM", events: ["Boys vs Boys", "Girls vs Girls"], cat: "Team" },
  { name: "Badminton", date: "22 Apr", time: "12:00 PM", events: ["Singles", "Doubles (Boys & Girls)"], cat: "Racket" },
  { name: "Football", date: "25 Apr", events: ["5-a-side Boys"], cat: "Team" },
  { name: "Basketball", date: "22–23 Apr", time: "12:00 PM", events: ["3v3 Boys", "3v3 Girls", "5v5 Boys", "5v5 Mixed"], cat: "Team" },
];

const ARTS_EVENTS = [
  { name: "Art", date: "23–24 Apr", events: ["Multiple Events (7 formats)"], cat: "Visual Arts" },
  { name: "Singing", date: "23–24 Apr", events: ["Solo", "Same Song Singing", "Random Song", "Duet Singing"], cat: "Music" },
  { name: "Dance", date: "25 Apr", events: ["Solo", "Dual", "Group"], cat: "Performance" },
  { name: "Stand-up Comedy", date: "25 Apr", events: ["Mix"], cat: "Performance" },
];

const ACADEMIC_EVENTS = [
  { name: "Debate", date: "25 Apr", events: ["Rapid Fire Round", "Luck by Chance", "For/Against Motion"], cat: "Academic" },
];

const FUN_EVENTS = [
  { name: "Fun Events", date: "25 Apr", time: "9:00 AM", events: ["Tug of War", "Sack Race", "Lemon Race", "Three-Leg Race", "Balloon Burst"], cat: "Fun" },
];

const PREVIOUS_EVENTS = [
  { title: "Sports Day 2024", description: "200+ participants across 15 sporting events", year: "2024" },
  { title: "Cultural Night", description: "Dance & music performances captivating 500 audiences", year: "2024" },
  { title: "Art Exhibition", description: "Showcasing 60 artworks from talented students", year: "2024" },
  { title: "Sports Championship", description: "Inter-batch competitions in 10 categories", year: "2023" },
  { title: "Talent Show", description: "Students shine with comedy, dance & vocal performances", year: "2023" },
  { title: "Annual Debate", description: "Spirited discussions on contemporary medical topics", year: "2023" },
  { title: "Sports Day 2022", description: "Athletic events with record-breaking performances", year: "2022" },
  { title: "Art & Culture Week", description: "A week-long celebration of student creativity", year: "2022" },
];

// ── Utility hooks ──────────────────────────────────────────────────────────────
function useInView(ref: React.RefObject<Element | null>, threshold = 0.12) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 80,
        padding: "20px clamp(20px,5vw,52px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(5,5,5,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "white", fontFamily: "'DM Sans', sans-serif" }}>
        CORPUS
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2.5vw,28px)" }}>
        {["Events", "Schedule", "Register"].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="nav-link" style={{ textDecoration: "none" }}>
            {item}
          </a>
        ))}
        <button
          onClick={onMenuOpen}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            flexShrink: 0,
          }}
        >
          <svg width="13" height="9" viewBox="0 0 13 9">
            <line x1="0" y1="1" x2="13" y2="1" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="4.5" x2="13" y2="4.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

// ── Menu overlay ───────────────────────────────────────────────────────────────
function MenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const items = [
    { label: "Home", href: "#hero" },
    { label: "Events", href: "#events" },
    { label: "Schedule", href: "#schedule" },
    { label: "Register", href: "#register" },
  ];
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,8,8,0.98)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: isOpen ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      <button
        onClick={onClose}
        style={{ position: "absolute", top: 24, right: 36, background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "1.6rem", cursor: "pointer", lineHeight: 1 }}
      >
        &times;
      </button>
      <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 36 }}>
        MENU
      </p>
      <div style={{ width: "100%", maxWidth: 520, padding: "0 28px" }}>
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={onClose}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "18px 0",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              fontSize: "clamp(2rem,6vw,3.5rem)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.18)",
              textDecoration: "none",
              letterSpacing: "-0.03em",
              transition: "color 0.3s ease",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.18)")}
          >
            {item.label}
            <span style={{ fontSize: "1.5rem", opacity: 0.4 }}>&#8599;</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(145deg, #1a1208 0%, #130d05 50%, #0d0803 100%)",
      }}
    >
      {/* Dark vignette left edge to blend text area */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to right, rgba(10,6,2,0.92) 0%, rgba(10,6,2,0.6) 40%, rgba(10,6,2,0.1) 70%, transparent 100%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />
      {/* Bottom fade */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "30%",
        background: "linear-gradient(to top, rgba(8,5,1,0.85), transparent)",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Statue — screen blend on dark bg makes it glow like marble */}
      <div style={{
        position: "absolute",
        right: 0,
        bottom: 0,
        width: "clamp(52%,58%,66%)",
        height: "100%",
        zIndex: 0,
        overflow: "hidden",
      }}>
        <img
          src="/statue.webp"
          alt="Asclepius"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            opacity: loaded ? 0.55 : 0,
            mixBlendMode: "screen",
            filter: "sepia(30%) contrast(1.15) brightness(0.9) saturate(0.65)",
            maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.85) 38%, rgba(0,0,0,0.8) 72%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.85) 38%, rgba(0,0,0,0.8) 72%, transparent 100%)",
            transition: "opacity 1.8s ease",
          }}
        />
      </div>

      {/* Gold grain overlay for texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 65% 50%, rgba(201,169,110,0.06) 0%, transparent 65%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        padding: "120px clamp(24px,6vw,80px) 80px",
        width: "100%",
        maxWidth: "clamp(58%,65%,72%)",
      }}>
        {/* Eyebrow label */}
        <p style={{
          fontSize: "0.7rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(201,169,110,0.7)",
          marginBottom: 24,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.8s ease 0.2s",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          GMC Banswara — Annual Fest '26
        </p>

        {/* Main title */}
        <h1
          style={{
            fontSize: "clamp(4.2rem, 13.5vw, 14rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            color: "#f0e8d8",
            whiteSpace: "nowrap",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateX(0)" : "translateX(-50px)",
            transition: "all 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
          }}
        >
          Corpus
        </h1>

        {/* Thin rule */}
        <div style={{
          width: loaded ? 80 : 0,
          height: 1,
          background: "rgba(201,169,110,0.5)",
          marginTop: 28,
          marginBottom: 20,
          transition: "width 1s ease 0.9s",
        }} />

        {/* Date + tagline */}
        <div style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(14px)",
          transition: "all 0.8s ease 0.8s",
        }}>
          <p style={{ color: "var(--gold-accent)", fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
            22 – 25 April 2026
          </p>
          <p style={{ color: "rgba(240,220,190,0.5)", fontSize: "0.92rem", maxWidth: 340, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            Where medicine meets passion. Four days of sports, arts, culture, and academic excellence.
          </p>
        </div>

        {/* CTAs */}
        <div style={{
          marginTop: 36,
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          opacity: loaded ? 1 : 0,
          transition: "all 0.8s ease 1.0s",
        }}>
          <a
            href="#events"
            style={{
              background: "#f0e8d8",
              color: "#0d0803",
              padding: "13px 28px",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: 3,
              textDecoration: "none",
              transition: "background 0.3s ease, color 0.3s ease",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#c9a96e"; e.currentTarget.style.color = "#0d0803"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f0e8d8"; e.currentTarget.style.color = "#0d0803"; }}
          >
            Explore Events
          </a>
          <a
            href="#register"
            style={{
              background: "transparent",
              color: "rgba(240,220,190,0.65)",
              padding: "13px 28px",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: 3,
              textDecoration: "none",
              border: "1px solid rgba(240,220,190,0.25)",
              transition: "all 0.3s ease",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,169,110,0.7)"; e.currentTarget.style.color = "#c9a96e"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(240,220,190,0.25)"; e.currentTarget.style.color = "rgba(240,220,190,0.65)"; }}
          >
            Register Now
          </a>
        </div>

        {/* Stats */}
        <div style={{
          marginTop: 52,
          display: "flex",
          gap: "clamp(16px,4vw,40px)",
          flexWrap: "wrap",
          opacity: loaded ? 1 : 0,
          transition: "all 0.8s ease 1.2s",
        }}>
          {[{ label: "Events", value: "20+" }, { label: "Days", value: "4" }, { label: "Sports", value: "13" }].map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: "clamp(1.6rem,4vw,2.5rem)", fontWeight: 800, color: "#f0e8d8", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'DM Sans', sans-serif" }}>
                {s.value}
              </span>
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,220,190,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute",
        bottom: 36,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        zIndex: 3,
        opacity: loaded ? 0.45 : 0,
        transition: "opacity 1s ease 1.6s",
      }}>
        <p style={{ fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(201,169,110,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
          Scroll
        </p>
        <div style={{ width: 1, height: 55, background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.5), transparent)", animation: "scrollPulse 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

// ── Previous Events Carousel ──────────────────────────────────────────────────
function PreviousEventsCarousel() {
  const doubled = [...PREVIOUS_EVENTS, ...PREVIOUS_EVENTS];
  return (
    <section style={{ background: "#0a0a0a", overflow: "hidden", padding: "96px 0", color: "white", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ padding: "0 clamp(24px,6vw,80px)", marginBottom: 52 }}>
        <p className="section-label">Legacy</p>
        <h2 className="display-text" style={{ color: "white", marginTop: 10 }}>Previous Editions</h2>
      </div>
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div className="cards-track">
          {doubled.map((ev, i) => (
            <div
              key={i}
              style={{
                width: 268,
                height: 188,
                background: "rgba(255,255,255,0.03)",
                borderRadius: 4,
                padding: 26,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div>
                <p style={{ fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-accent)", marginBottom: 12 }}>
                  Corpus {ev.year}
                </p>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.3, color: "white", fontFamily: "'DM Sans', sans-serif" }}>{ev.title}</h3>
              </div>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.55 }}>{ev.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ event }: { event: typeof SPORTS_EVENTS[0] }) {
  return (
    <div className="event-card" style={{ padding: 24, height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <span className="cat-badge" style={{ color: "var(--gold-accent)", borderColor: "rgba(201,169,110,0.35)", fontSize: "0.58rem" }}>
          {event.cat}
        </span>
        {event.date && (
          <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.05em" }}>
            {event.date}
          </span>
        )}
      </div>
      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "white", marginBottom: 12, letterSpacing: "-0.01em", fontFamily: "'DM Sans', sans-serif" }}>
        {event.name}
      </h3>
      {event.time && (
        <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>
          {event.time}
        </p>
      )}
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {event.events.map((e) => (
          <li key={e} style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.45)", padding: "3px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Events Section ────────────────────────────────────────────────────────────
function EventsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const [activeTab, setActiveTab] = useState<"sports" | "arts" | "academic" | "fun">("sports");

  const tabData = { sports: SPORTS_EVENTS, arts: ARTS_EVENTS, academic: ACADEMIC_EVENTS, fun: FUN_EVENTS };
  const tabLabels = { sports: "Sports", arts: "Arts & Culture", academic: "Academic", fun: "Fun Events" };

  return (
    <section id="events" style={{ background: "var(--deep-black)", padding: "110px clamp(24px,6vw,80px)" }}>
      <div ref={ref} className={`fade-up ${visible ? "visible" : ""}`} style={{ marginBottom: 56 }}>
        <p className="section-label">What's On</p>
        <h2 className="display-text" style={{ color: "white", marginTop: 10, maxWidth: 560 }}>
          20+ Events Across <span style={{ color: "var(--gold-accent)" }}>4 Categories</span>
        </h2>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 44, flexWrap: "wrap" }}>
        {(Object.keys(tabLabels) as Array<keyof typeof tabLabels>).map((tab) => (
          <button key={tab} className={`schedule-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tabLabels[tab]}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))", gap: 14, gridAutoRows: "1fr", alignItems: "stretch" }}>
        {tabData[activeTab].map((event, i) => (
          <div key={event.name} style={{ opacity: 0, transform: "translateY(18px)", animation: `fadeInUp 0.45s ease ${i * 0.06}s forwards`, height: "100%" }}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  );
}

// ── Schedule Section ──────────────────────────────────────────────────────────
function ScheduleSection() {
  const [activeDay, setActiveDay] = useState(0);
  const days = [
    { label: "22 Apr", name: "Day 1", events: [
      { name: "Opening Ceremony", time: "8:00 – 9:00 AM", venue: "Main Auditorium" },
      { name: "Running Events", time: "9:00 AM onwards", venue: "Sports Complex" },
      { name: "Badminton", time: "12:00 PM", venue: "Indoor Court" },
      { name: "Volleyball", time: "4:00 – 9:00 PM", venue: "Volleyball Court" },
      { name: "Chess & Table Tennis", time: "4:00 PM", venue: "Indoor Hall" },
      { name: "Basketball", time: "12:00 PM", venue: "Basketball Court" },
    ]},
    { label: "23 Apr", name: "Day 2", events: [
      { name: "Kabbadi", time: "9:00 AM", venue: "Ground" },
      { name: "Shot Put", time: "9:00 AM", venue: "Athletics Ground" },
      { name: "High Jump & Long Jump", time: "Morning", venue: "Athletics Ground" },
      { name: "Art (Daily)", time: "All Day", venue: "Art Room" },
      { name: "Carrom & Chess", time: "Afternoon", venue: "Indoor Hall" },
    ]},
    { label: "24 Apr", name: "Day 3", events: [
      { name: "Satoliya", time: "Morning", venue: "Ground" },
      { name: "Art (Main)", time: "All Day", venue: "Art Room" },
      { name: "Singing Events", time: "Afternoon", venue: "Auditorium" },
      { name: "Basketball Finals", time: "12:00 PM", venue: "Basketball Court" },
    ]},
    { label: "25 Apr", name: "Day 4", events: [
      { name: "Fun Events", time: "9:00 AM", venue: "Ground" },
      { name: "Debate", time: "Morning", venue: "Lecture Hall" },
      { name: "Dance Competition", time: "Evening", venue: "Main Stage" },
      { name: "Stand-up Comedy", time: "Evening", venue: "Auditorium" },
      { name: "Football", time: "Afternoon", venue: "Football Ground" },
      { name: "Closing Ceremony", time: "Evening", venue: "Main Stage" },
    ]},
  ];

  return (
    <section id="schedule" style={{ background: "#0d0d0d", padding: "110px clamp(24px,6vw,80px)" }}>
      <p className="section-label">Timetable</p>
      <h2 className="display-text" style={{ color: "white", marginTop: 10, marginBottom: 48 }}>Schedule</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 48, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
        {days.map((day, i) => (
          <button
            key={day.label}
            className={`schedule-tab ${activeDay === i ? "active" : ""}`}
            onClick={() => setActiveDay(i)}
            style={{ flexShrink: 0, minWidth: 72, textAlign: "center" }}
          >
            <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 2 }}>{day.label.split(" ")[0]}</div>
            <div style={{ fontSize: "0.58rem", letterSpacing: "0.1em" }}>Apr</div>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 680 }}>
        {days[activeDay].events.map((ev, i) => (
          <div
            key={ev.name}
            style={{
              padding: "18px 22px",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
              opacity: 0,
              animation: `fadeInUp 0.4s ease ${i * 0.07}s forwards`,
            }}
          >
            <div>
              <h3 style={{ color: "white", fontSize: "0.95rem", fontWeight: 600, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{ev.name}</h3>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.68rem", color: "var(--gold-accent)" }}>{ev.time}</span>
                <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>{ev.venue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── About / Split Info ────────────────────────────────────────────────────────
function SplitInfoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const pillars = [
    { icon: "→", label: "Sports", desc: "13 competitive events from athletics to chess" },
    { icon: "→", label: "Arts", desc: "Dance, music, visual arts, and comedy" },
    { icon: "→", label: "Academics", desc: "Debate and intellectual challenges" },
    { icon: "→", label: "Fun", desc: "Team games and social events for all" },
  ];
  return (
    <section
      ref={ref}
      className={`fade-up ${visible ? "visible" : ""}`}
      style={{ background: "var(--warm-cream)", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "65vh" }}
    >
      <div style={{
        padding: "80px clamp(24px,6vw,72px)",
        background: "var(--warm-cream)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "var(--deep-black)",
      }}>
        <p style={{ fontSize: "0.62rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--warm-brown)", marginBottom: 18, fontFamily: "'DM Sans', sans-serif" }}>
          About Corpus
        </p>
        <h2 className="display-text" style={{ color: "var(--deep-black)", marginBottom: 22, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
          Where Every Student Shines.
        </h2>
        <p style={{ fontSize: "0.92rem", lineHeight: 1.78, color: "rgba(0,0,0,0.52)", maxWidth: 400, fontFamily: "'DM Sans', sans-serif" }}>
          Corpus is the annual sports and cultural fest of GMC Banswara — a space where future doctors break free from textbooks and discover their full potential. Four days of competition, creativity, and community.
        </p>
      </div>
      <div style={{ background: "#100c06", padding: "80px clamp(24px,6vw,72px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
        {pillars.map((item) => (
          <div key={item.label} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <span style={{ color: "var(--gold-accent)", fontSize: "1rem", marginTop: 1, fontWeight: 600, flexShrink: 0 }}>{item.icon}</span>
            <div>
              <h3 style={{ color: "white", fontWeight: 700, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{item.label}</h3>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Registration ──────────────────────────────────────────────────────────────
function RegistrationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const [form, setForm] = useState({ name: "", email: "", phone: "", batch: "", events: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, college: form.batch }),
      });
      if (!res.ok) throw new Error("Registration failed. Please try again.");
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" style={{ background: "var(--deep-black)", padding: "110px clamp(24px,6vw,80px)" }}>
      <div ref={ref} className={`fade-up ${visible ? "visible" : ""}`}>
        <p className="section-label">Join Us</p>
        <h2 className="display-text" style={{ color: "white", marginTop: 10, marginBottom: 14, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
          Register for Corpus <span style={{ color: "var(--gold-accent)" }}>2026</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.38)", marginBottom: 52, fontSize: "0.88rem", maxWidth: 480, lineHeight: 1.72, fontFamily: "'DM Sans', sans-serif" }}>
          Fill in your details. You'll receive a confirmation email and event-specific instructions from us.
        </p>

        {submitted ? (
          <div style={{ maxWidth: 520, padding: "44px 40px", border: "1px solid rgba(201,169,110,0.28)", borderRadius: 6, textAlign: "center" }}>
            <div style={{ width: 44, height: 44, border: "1.5px solid var(--gold-accent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <span style={{ color: "var(--gold-accent)", fontSize: "1.2rem" }}>&#10003;</span>
            </div>
            <h3 style={{ color: "var(--gold-accent)", fontSize: "1.2rem", fontWeight: 700, marginBottom: 12, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
              Registration Received
            </h3>
            <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontSize: "0.88rem", fontFamily: "'DM Sans', sans-serif" }}>
              Thank you, {form.name}! Check your inbox for a confirmation email. We'll be in touch with event details soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ maxWidth: 540, display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="reg-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <input className="reg-input" type="text" placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="reg-input" type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="reg-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <input className="reg-input" type="tel" placeholder="Phone Number *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              <select
                className="reg-input"
                value={form.batch}
                onChange={e => setForm({ ...form, batch: e.target.value })}
                required
                style={{ appearance: "none", cursor: "pointer" }}
              >
                <option value="" disabled>Batch *</option>
                <option value="Batch 2024">Batch 2024</option>
                <option value="Batch 2025">Batch 2025</option>
              </select>
            </div>
            <select
              className="reg-input"
              value={form.events}
              onChange={e => setForm({ ...form, events: e.target.value })}
              required
              style={{ appearance: "none", cursor: "pointer" }}
            >
              <option value="" disabled>Select Event *</option>
              <optgroup label="Track Events">
                <option value="Running — 100M Boys">Running — 100M Boys</option>
                <option value="Running — 100M Girls">Running — 100M Girls</option>
                <option value="Running — 200M Boys">Running — 200M Boys</option>
                <option value="Running — 200M Girls">Running — 200M Girls</option>
                <option value="Running — 400M Boys">Running — 400M Boys</option>
                <option value="Running — 400M Girls">Running — 400M Girls</option>
                <option value="Running — 400M Relay">Running — 400M Relay</option>
              </optgroup>
              <optgroup label="Athletics">
                <option value="Shot Put — Boys">Shot Put — Boys</option>
                <option value="Shot Put — Girls">Shot Put — Girls</option>
                <option value="High Jump — Boys">High Jump — Boys</option>
                <option value="High Jump — Girls">High Jump — Girls</option>
                <option value="Long Jump — Boys">Long Jump — Boys</option>
              </optgroup>
              <optgroup label="Racket Sports">
                <option value="Badminton — Singles">Badminton — Singles</option>
                <option value="Badminton — Doubles">Badminton — Doubles</option>
                <option value="Table Tennis — Singles Boys">Table Tennis — Singles Boys</option>
                <option value="Table Tennis — Singles Girls">Table Tennis — Singles Girls</option>
                <option value="Table Tennis — Doubles Boys">Table Tennis — Doubles Boys</option>
                <option value="Table Tennis — Doubles Girls">Table Tennis — Doubles Girls</option>
              </optgroup>
              <optgroup label="Team Sports">
                <option value="Basketball — 3v3 Boys">Basketball — 3v3 Boys</option>
                <option value="Basketball — 3v3 Girls">Basketball — 3v3 Girls</option>
                <option value="Basketball — 5v5 Boys">Basketball — 5v5 Boys</option>
                <option value="Basketball — 5v5 Mixed">Basketball — 5v5 Mixed</option>
                <option value="Volleyball — Boys">Volleyball — Boys</option>
                <option value="Volleyball — Girls">Volleyball — Girls</option>
                <option value="Football — 5-a-side Boys">Football — 5-a-side Boys</option>
                <option value="Kho Kho — Boys">Kho Kho — Boys</option>
                <option value="Kho Kho — Girls">Kho Kho — Girls</option>
                <option value="Kho Kho — Mix">Kho Kho — Mix</option>
                <option value="Kabbadi — Boys">Kabbadi — Boys</option>
                <option value="Kabbadi — Girls">Kabbadi — Girls</option>
                <option value="Satoliya — Boys">Satoliya — Boys</option>
                <option value="Satoliya — Girls">Satoliya — Girls</option>
                <option value="Satoliya — Mix">Satoliya — Mix</option>
              </optgroup>
              <optgroup label="Board Games">
                <option value="Chess">Chess</option>
                <option value="Carrom — Doubles">Carrom — Doubles</option>
              </optgroup>
              <optgroup label="Arts & Music">
                <option value="Singing — Solo">Singing — Solo</option>
                <option value="Singing — Same Song">Singing — Same Song</option>
                <option value="Singing — Random Song">Singing — Random Song</option>
                <option value="Singing — Duet">Singing — Duet</option>
                <option value="Dance — Solo">Dance — Solo</option>
                <option value="Dance — Dual">Dance — Dual</option>
                <option value="Dance — Group">Dance — Group</option>
                <option value="Art — Visual Arts">Art — Visual Arts</option>
                <option value="Stand-up Comedy">Stand-up Comedy</option>
              </optgroup>
              <optgroup label="Academic">
                <option value="Debate — Rapid Fire Round">Debate — Rapid Fire Round</option>
                <option value="Debate — Luck by Chance">Debate — Luck by Chance</option>
                <option value="Debate — For/Against Motion">Debate — For/Against Motion</option>
              </optgroup>
              <optgroup label="Fun Events">
                <option value="Tug of War">Tug of War</option>
                <option value="Sack Race">Sack Race</option>
                <option value="Lemon Race">Lemon Race</option>
                <option value="Three-Leg Race">Three-Leg Race</option>
                <option value="Balloon Burst">Balloon Burst</option>
              </optgroup>
            </select>

            {error && (
              <p style={{ color: "#e07070", fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 16, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button type="submit" className="reg-btn" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? "Submitting..." : "Register Now"}
              </button>
              <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>
                Free to participate · Open to all batches
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "56px clamp(24px,6vw,80px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 36 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: "1.4rem", letterSpacing: "0.08em", color: "white", marginBottom: 10, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
            Corpus
          </p>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.28)", maxWidth: 260, lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>
            The Annual Sports & Cultural Fest<br />GMC Banswara · 22–25 April 2026
          </p>
        </div>
        <div style={{ display: "flex", gap: 44 }}>
          <div>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>Navigate</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Events", "Schedule", "Register"].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="footer-link" style={{ textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>Connect</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Instagram", "WhatsApp", "Email"].map(l => (
                <span key={l} className="footer-link">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 52, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.18)", fontFamily: "'DM Sans', sans-serif" }}>
          © 2026 Corpus. GMC Banswara Annual Fest.
        </p>
        <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.12)", fontFamily: "'DM Sans', sans-serif" }}>
          Made with care by the Fest Committee
        </p>
      </div>
    </footer>
  );
}

// ── Home ───────────────────────────────────────────────────────────────────────
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ background: "var(--deep-black)", minHeight: "100vh" }}>
      <div className="noise-overlay" />
      <Navbar onMenuOpen={() => setMenuOpen(true)} />
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <HeroSection />
      <PreviousEventsCarousel />
      <Brain3D />
      <EventsSection />
      <ScheduleSection />
      <SplitInfoSection />
      <RegistrationSection />
      <Footer />
    </div>
  );
}
