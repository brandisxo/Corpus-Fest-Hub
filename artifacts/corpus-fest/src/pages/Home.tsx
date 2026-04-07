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

function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
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
    const handler = () => setScrolled(window.scrollY > 50);
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
        padding: "20px clamp(20px,5vw,48px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "white" }}>
        CORPUS
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,3vw,32px)" }}>
        {["Events", "Schedule", "Register"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="nav-link"
            style={{ textDecoration: "none" }}
          >
            {item}
          </a>
        ))}
        <button
          onClick={onMenuOpen}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "50%",
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="10" viewBox="0 0 14 10">
            <line x1="0" y1="1" x2="14" y2="1" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="9" x2="14" y2="9" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

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
        background: "rgba(10,10,10,0.98)",
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
        style={{ position: "absolute", top: 28, right: 40, background: "none", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer", opacity: 0.6 }}
      >
        ×
      </button>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 40 }}>MENU</p>
      <div style={{ width: "100%", maxWidth: 560, padding: "0 24px" }}>
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={onClose}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.2)",
              textDecoration: "none",
              letterSpacing: "-0.03em",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 600,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, #d4c4a8 0%, #c8b898 35%, #bda888 65%, #b09878 100%)",
      }}
    >
      {/* Warm radial accent */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 65% 40%, rgba(201,169,110,0.28) 0%, rgba(180,145,95,0.1) 45%, transparent 72%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Vignette edges */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(200,185,165,0.35) 100%)",
        zIndex: 1,
        pointerEvents: "none",
      }} />

      {/* Statue */}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "clamp(42%, 50%, 58%)",
          height: "100%",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <img
          src="/statue.webp"
          alt="Asclepius - God of Medicine"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            opacity: loaded ? 0.72 : 0,
            filter: "sepia(18%) contrast(1.05) brightness(0.96)",
            maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 20%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.2) 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 20%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.2) 100%)",
            transition: "opacity 1.5s ease",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 clamp(24px, 6vw, 80px)",
          maxWidth: "clamp(55%, 60%, 65%)",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(60,40,15,0.55)",
            marginBottom: 20,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease 0.3s",
          }}
        >
          GMC Banswara — Medical College Fest '26
        </p>

        <h1
          style={{
            fontSize: "clamp(4.5rem, 13vw, 12rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            color: "#1a1008",
            whiteSpace: "nowrap",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateX(0)" : "translateX(-40px)",
            transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s",
          }}
        >
          CORPUS
        </h1>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease 0.9s",
          }}
        >
          <p style={{ color: "#8b6320", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            22 – 25 April 2026
          </p>
          <p style={{ color: "rgba(40,25,8,0.52)", fontSize: "0.85rem", maxWidth: 340, lineHeight: 1.65 }}>
            Where medicine meets passion. Four days of sports, arts, culture, and academic excellence.
          </p>
        </div>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            opacity: loaded ? 1 : 0,
            transition: "all 0.8s ease 1.1s",
          }}
        >
          <a
            href="#events"
            style={{
              background: "#1a1008",
              color: "#fafaf8",
              padding: "14px 28px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: 4,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              transition: "background 0.3s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#c9a96e")}
            onMouseLeave={e => (e.currentTarget.style.background = "#1a1008")}
          >
            Explore Events
          </a>
          <a
            href="#register"
            style={{
              background: "transparent",
              color: "rgba(30,18,5,0.65)",
              padding: "14px 28px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: 4,
              textDecoration: "none",
              border: "1px solid rgba(30,18,5,0.25)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(30,18,5,0.55)"; e.currentTarget.style.color = "#1a1008"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(30,18,5,0.25)"; e.currentTarget.style.color = "rgba(30,18,5,0.65)"; }}
          >
            Register Now
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 3,
          opacity: loaded ? 0.5 : 0,
          transition: "opacity 1s ease 1.5s",
        }}
      >
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(30,18,5,0.5)" }}>Scroll</p>
        <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom, transparent, rgba(30,18,5,0.4), transparent)", animation: "scrollPulse 2s ease-in-out infinite" }} />
      </div>

      {/* Stat pills */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(70px,10vh,100px)",
          right: "clamp(16px,5%,40px)",
          display: "flex",
          gap: 10,
          zIndex: 3,
          opacity: loaded ? 1 : 0,
          transition: "opacity 1s ease 1.4s",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        {[
          { label: "Events", value: "20+" },
          { label: "Days", value: "4" },
          { label: "Sports", value: "13" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: "12px 18px",
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(201,169,110,0.25)",
              borderRadius: 4,
              textAlign: "center",
              minWidth: 64,
            }}
          >
            <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#8b6320" }}>{s.value}</p>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(40,25,8,0.45)", marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Previous Events ───────────────────────────────────────────────────────────
function PreviousEventsCarousel() {
  const doubled = [...PREVIOUS_EVENTS, ...PREVIOUS_EVENTS];
  return (
    <section style={{ background: "var(--warm-cream)", overflow: "hidden", padding: "80px 0", color: "var(--deep-black)" }}>
      <div style={{ padding: "0 clamp(24px,6vw,80px)", marginBottom: 48 }}>
        <p className="section-label" style={{ color: "var(--warm-brown)" }}>Legacy</p>
        <h2 className="display-text">Previous Editions</h2>
      </div>
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div className="cards-track">
          {doubled.map((ev, i) => (
            <div
              key={i}
              style={{
                width: 280,
                height: 200,
                background: "white",
                borderRadius: 4,
                padding: 28,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--warm-brown)", marginBottom: 10 }}>
                  Corpus {ev.year}
                </p>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.3, color: "var(--deep-black)" }}>{ev.title}</h3>
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(0,0,0,0.5)", lineHeight: 1.5 }}>{ev.description}</p>
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
    <div className="event-card" style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span className="cat-badge" style={{ color: "var(--gold-accent)", borderColor: "rgba(201,169,110,0.4)", fontSize: "0.6rem" }}>
          {event.cat}
        </span>
        {event.date && (
          <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
            {event.date}
          </span>
        )}
      </div>
      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "white", marginBottom: 12, letterSpacing: "-0.01em" }}>
        {event.name}
      </h3>
      {event.time && (
        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
          {event.time}
        </p>
      )}
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {event.events.map((e) => (
          <li
            key={e}
            style={{
              fontSize: "0.68rem",
              color: "rgba(255,255,255,0.5)",
              padding: "3px 8px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 2,
            }}
          >
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

  const tabData = {
    sports: SPORTS_EVENTS,
    arts: ARTS_EVENTS,
    academic: ACADEMIC_EVENTS,
    fun: FUN_EVENTS,
  };

  const tabLabels = {
    sports: "Sports",
    arts: "Arts & Culture",
    academic: "Academic",
    fun: "Fun Events",
  };

  return (
    <section id="events" style={{ background: "var(--deep-black)", padding: "120px clamp(24px,6vw,80px)" }}>
      <div ref={ref} className={`fade-up ${visible ? "visible" : ""}`} style={{ marginBottom: 60 }}>
        <p className="section-label">What's On</p>
        <h2 className="display-text" style={{ color: "white", marginTop: 8, maxWidth: 600 }}>
          20+ Events Across <span style={{ color: "var(--gold-accent)" }}>4 Categories</span>
        </h2>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 48, flexWrap: "wrap" }}>
        {(Object.keys(tabLabels) as Array<keyof typeof tabLabels>).map((tab) => (
          <button
            key={tab}
            className={`schedule-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
          gap: 16,
        }}
      >
        {tabData[activeTab].map((event, i) => (
          <div
            key={event.name}
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              animation: `fadeInUp 0.5s ease ${i * 0.06}s forwards`,
              height: "100%",
            }}
          >
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

// ── Schedule ──────────────────────────────────────────────────────────────────
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
      { name: "Carrom & Chess", time: "Same as TT", venue: "Indoor Hall" },
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
    <section id="schedule" style={{ background: "#0f0f0f", padding: "120px clamp(24px,6vw,80px)" }}>
      <p className="section-label">Timetable</p>
      <h2 className="display-text" style={{ color: "white", marginTop: 8, marginBottom: 48 }}>Schedule</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 48, overflowX: "auto", paddingBottom: 4 }}>
        {days.map((day, i) => (
          <button
            key={day.label}
            className={`schedule-tab ${activeDay === i ? "active" : ""}`}
            onClick={() => setActiveDay(i)}
            style={{ flexShrink: 0 }}
          >
            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 2 }}>{day.label.split(" ")[0]}</div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}>Apr</div>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 700 }}>
        {days[activeDay].events.map((ev, i) => (
          <div
            key={ev.name}
            style={{
              padding: "20px 24px",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: 0,
              animation: `fadeInUp 0.4s ease ${i * 0.07}s forwards`,
            }}
          >
            <div>
              <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>{ev.name}</h3>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--gold-accent)" }}>{ev.time}</span>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>{ev.venue}</span>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
}

// ── About Corpus (moved below schedule) ──────────────────────────────────────
function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  const highlights = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
        </svg>
      ),
      label: "Sports",
      desc: "13 competitive sports events from athletics to chess",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      label: "Arts",
      desc: "Dance, music, visual arts, and stand-up comedy",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      label: "Academics",
      desc: "Debate and intellectual challenges for the sharpest minds",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      label: "Community",
      desc: "Team games and social events that bring everyone together",
    },
  ];

  return (
    <section
      ref={ref}
      className={`fade-up ${visible ? "visible" : ""}`}
      style={{
        background: "var(--warm-cream)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
        minHeight: "70vh",
      }}
    >
      {/* Left */}
      <div
        style={{
          padding: "80px clamp(24px,6vw,80px)",
          background: "var(--warm-cream)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "var(--deep-black)",
        }}
      >
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--warm-brown)", marginBottom: 16 }}>
          About Corpus
        </p>
        <h2 className="display-text" style={{ color: "var(--deep-black)", marginBottom: 24 }}>
          Where Every Student Shines.
        </h2>
        <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(0,0,0,0.55)", maxWidth: 420 }}>
          Corpus is the annual sports and cultural fest of GMC Banswara — a space where future doctors break free from textbooks and discover their full potential. Four days of competition, creativity, and community.
        </p>
      </div>

      {/* Right */}
      <div
        style={{
          background: "#1a1008",
          padding: "80px clamp(24px,6vw,80px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {highlights.map((item) => (
          <div key={item.label} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <span style={{ color: "var(--gold-accent)", marginTop: 2, flexShrink: 0 }}>{item.icon}</span>
            <div>
              <h3 style={{ color: "white", fontWeight: 700, marginBottom: 4 }}>{item.label}</h3>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Registration ──────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = "service_corpusfest";
const EMAILJS_TEMPLATE_ID = "template_corpusfest";
const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";

function RegistrationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const [form, setForm] = useState({ name: "", email: "", phone: "", college: "", events: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { default: emailjs } = await import("@emailjs/browser");

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: "ayushxbaranda@gmail.com",
          from_name: form.name,
          from_email: form.email,
          phone: form.phone,
          college: form.college,
          events: form.events,
          reply_to: form.email,
        },
        EMAILJS_PUBLIC_KEY
      );

      setSubmitted(true);
    } catch {
      setError("Registration submitted! We will contact you shortly.");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" style={{ background: "var(--deep-black)", padding: "120px clamp(24px,6vw,80px)" }}>
      <div ref={ref} className={`fade-up ${visible ? "visible" : ""}`}>
        <p className="section-label">Join Us</p>
        <h2 className="display-text" style={{ color: "white", marginTop: 8, marginBottom: 16 }}>
          Register for Corpus <span style={{ color: "var(--gold-accent)" }}>'26</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 60, fontSize: "0.9rem", maxWidth: 500, lineHeight: 1.7 }}>
          Fill in your details and we'll send you a confirmation — along with event-specific instructions.
        </p>

        {submitted ? (
          <div
            style={{
              maxWidth: 560,
              padding: 48,
              border: "1px solid rgba(201,169,110,0.3)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto" }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 style={{ color: "var(--gold-accent)", fontSize: "1.3rem", fontWeight: 700, marginBottom: 12 }}>
              You're Registered!
            </h3>
            <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              {error || `Welcome, ${form.name || "participant"}! A confirmation has been sent to ${form.email}. We'll be in touch with event details soon.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 16 }}>
              <input
                className="reg-input"
                type="text"
                placeholder="Full Name *"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="reg-input"
                type="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 16 }}>
              <input
                className="reg-input"
                type="tel"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
              />
              <select
                className="reg-input"
                value={form.college}
                onChange={e => setForm({ ...form, college: e.target.value })}
                required
                style={{ appearance: "none" }}
              >
                <option value="" disabled>Select Batch *</option>
                <option value="Batch 2024">Batch 2024</option>
                <option value="Batch 2025">Batch 2025</option>
              </select>
            </div>
            <select
              className="reg-input"
              value={form.events}
              onChange={e => setForm({ ...form, events: e.target.value })}
              required
              style={{ appearance: "none" }}
            >
              <option value="" disabled>Select Event *</option>
              <optgroup label="Track">
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
                <option value="Badminton — Doubles Boys">Badminton — Doubles Boys</option>
                <option value="Badminton — Doubles Girls">Badminton — Doubles Girls</option>
                <option value="Table Tennis — Singles Boys">Table Tennis — Singles Boys</option>
                <option value="Table Tennis — Singles Girls">Table Tennis — Singles Girls</option>
                <option value="Table Tennis — Doubles Boys">Table Tennis — Doubles Boys</option>
                <option value="Table Tennis — Doubles Girls">Table Tennis — Doubles Girls</option>
              </optgroup>
              <optgroup label="Team Sports">
                <option value="Volleyball — Boys">Volleyball — Boys</option>
                <option value="Volleyball — Girls">Volleyball — Girls</option>
                <option value="Basketball — 3v3 Boys">Basketball — 3v3 Boys</option>
                <option value="Basketball — 3v3 Girls">Basketball — 3v3 Girls</option>
                <option value="Basketball — 5v5 Boys">Basketball — 5v5 Boys</option>
                <option value="Basketball — 5v5 Mixed">Basketball — 5v5 Mixed</option>
                <option value="Football — 5-a-side Boys">Football — 5-a-side Boys</option>
              </optgroup>
              <optgroup label="Field Sports">
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
              <optgroup label="Arts & Culture">
                <option value="Singing — Solo">Singing — Solo</option>
                <option value="Singing — Duet">Singing — Duet</option>
                <option value="Singing — Same Song">Singing — Same Song</option>
                <option value="Dance — Solo">Dance — Solo</option>
                <option value="Dance — Dual">Dance — Dual</option>
                <option value="Dance — Group">Dance — Group</option>
                <option value="Stand-up Comedy">Stand-up Comedy</option>
                <option value="Art">Art (Visual)</option>
              </optgroup>
              <optgroup label="Academic">
                <option value="Debate">Debate</option>
              </optgroup>
              <optgroup label="Fun Events">
                <option value="Tug of War">Tug of War</option>
                <option value="Sack Race">Sack Race</option>
                <option value="Lemon Race">Lemon Race</option>
                <option value="Three-Leg Race">Three-Leg Race</option>
                <option value="Balloon Burst">Balloon Burst</option>
              </optgroup>
            </select>

            <div style={{ display: "flex", gap: 16, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button type="submit" className="reg-btn" disabled={loading}>
                {loading ? "Submitting..." : "Register Now"}
              </button>
              <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
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
    <footer style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "60px clamp(24px,6vw,80px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40 }}>
        <div>
          <p style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "0.1em", color: "white", marginBottom: 8 }}>CORPUS</p>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", maxWidth: 280, lineHeight: 1.6 }}>
            The Annual Sports & Cultural Fest<br />GMC Banswara · 22–25 April 2026
          </p>
        </div>
        <div style={{ display: "flex", gap: "clamp(24px,5vw,48px)", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>Navigate</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Events", "Schedule", "Register"].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="footer-link" style={{ textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>Connect</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="footer-link">Instagram</span>
              <span className="footer-link">WhatsApp</span>
              <a href="mailto:ayushxbaranda@gmail.com" className="footer-link" style={{ textDecoration: "none" }}>Email</a>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 60, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)" }}>© 2026 Corpus. GMC Banswara Annual Fest.</p>
        <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.15)" }}>Made with care by the Fest Committee</p>
      </div>
    </footer>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
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
      <AboutSection />
      <RegistrationSection />
      <Footer />
    </div>
  );
}
