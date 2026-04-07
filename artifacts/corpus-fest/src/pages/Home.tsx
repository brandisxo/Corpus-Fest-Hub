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

// ── Components ────────────────────────────────────────────────────────────────

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
        padding: "20px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(10,10,10,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <span
        style={{
          fontWeight: 800,
          fontSize: "1.1rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "white",
        }}
      >
        CORPUS
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
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
        style={{
          position: "absolute",
          top: 28,
          right: 40,
          background: "none",
          border: "none",
          color: "white",
          fontSize: "1.5rem",
          cursor: "pointer",
          opacity: 0.6,
        }}
      >
        ✕
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
            <span style={{ fontSize: "1.2rem", opacity: 0.5 }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function HeroSection() {
  const [loaded, setLoaded] = useState(true);
  useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);

  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 65% 35%, rgba(139, 95, 50, 0.22) 0%, #0a0a0a 65%)",
      }}
    >
      {/* Vignette */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
        zIndex: 1,
        pointerEvents: "none",
      }} />

      {/* Statue — right side, blended */}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "58%",
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
            mixBlendMode: "luminosity",
            opacity: loaded ? 0.42 : 0,
            filter: "sepia(15%) contrast(1.2) brightness(0.8)",
            maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.6) 75%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.6) 75%, transparent 100%)",
            transition: "opacity 1.5s ease",
          }}
        />
        {/* Warm glow over statue */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 60% 30%, rgba(201,169,110,0.12) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }} />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 clamp(24px, 6vw, 80px)",
          maxWidth: "60%",
        }}
      >
        <p
          className="hero-subtitle"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease 0.3s",
            marginBottom: 20,
          }}
        >
          Medical College Fest '26
        </p>

        <h1
          className="hero-title"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateX(0)" : "translateX(-40px)",
            transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s",
          }}
        >
          COR
          <br />
          PUS
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
          <p style={{ color: "var(--gold-accent)", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            22 – 25 April 2026
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", maxWidth: 340, lineHeight: 1.6 }}>
            Where medicine meets passion. Four days of sports, arts, culture, and academic excellence.
          </p>
        </div>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 16,
            opacity: loaded ? 1 : 0,
            transition: "all 0.8s ease 1.1s",
          }}
        >
          <a
            href="#events"
            style={{
              background: "var(--off-white)",
              color: "var(--deep-black)",
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
            onMouseEnter={e => (e.currentTarget.style.background = "var(--gold-accent)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--off-white)")}
          >
            Explore Events <span>↗</span>
          </a>
          <a
            href="#register"
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              padding: "14px 28px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: 4,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
          >
            Register Now
          </a>
        </div>
      </div>

      {/* Bottom scroll indicator */}
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
          opacity: loaded ? 0.6 : 0,
          transition: "opacity 1s ease 1.5s",
        }}
      >
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>Scroll</p>
        <div className="scroll-line" />
      </div>

      {/* Floating stat pills */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: "5%",
          display: "flex",
          gap: 12,
          zIndex: 3,
          opacity: loaded ? 1 : 0,
          transition: "opacity 1s ease 1.4s",
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
              padding: "12px 20px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--gold-accent)" }}>{s.value}</p>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

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

function EventCard({ event }: { event: typeof SPORTS_EVENTS[0] }) {
  return (
    <div
      className="event-card"
      style={{ padding: 24 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span
          className="cat-badge"
          style={{ color: "var(--gold-accent)", borderColor: "rgba(201,169,110,0.4)", fontSize: "0.6rem" }}
        >
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
          ⏰ {event.time}
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
      <div
        ref={ref}
        className={`fade-up ${visible ? "visible" : ""}`}
        style={{ marginBottom: 60 }}
      >
        <p className="section-label">What's On</p>
        <h2 className="display-text" style={{ color: "white", marginTop: 8, maxWidth: 600 }}>
          20+ Events Across <span style={{ color: "var(--gold-accent)" }}>4 Categories</span>
        </h2>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 12, marginBottom: 48, flexWrap: "wrap" }}>
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

      {/* Events grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
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
            }}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

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
      <h2 className="display-text" style={{ color: "white", marginTop: 8, marginBottom: 48 }}>
        Schedule
      </h2>

      {/* Day tabs */}
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

      {/* Event list */}
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
              <div style={{ display: "flex", gap: 16 }}>
                <span style={{ fontSize: "0.7rem", color: "var(--gold-accent)" }}>⏰ {ev.time}</span>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>📍 {ev.venue}</span>
              </div>
            </div>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "1.2rem" }}>↗</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhatIfSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const items = [
    { keyword: "Fierce", description: "Where athletes push beyond limits in 13 sporting disciplines." },
    { keyword: "Creative", description: "Art, dance, singing, and comedy take center stage." },
    { keyword: "Brilliant", description: "Debate and chess for the sharpest minds of medicine." },
    { keyword: "Legendary", description: "A fest that defines you — long after med school ends." },
  ];

  useEffect(() => {
    const handler = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      const idx = Math.min(items.length - 1, Math.floor(progress * items.length));
      setActiveIdx(idx);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div ref={sectionRef} style={{ height: `${items.length * 90 + 50}vh`, position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", background: "var(--deep-black)" }}>
        <div style={{ padding: "0 clamp(24px,6vw,80px)", width: "100%" }}>
          <h2 style={{ fontSize: "clamp(1rem,2.5vw,1.5rem)", color: "rgba(255,255,255,0.4)", fontWeight: 400, marginBottom: 24 }}>
            What If Corpus Was ...
          </h2>
          <div style={{ position: "relative", height: "clamp(4rem,10vw,8rem)", overflow: "hidden" }}>
            {items.map((item, i) => (
              <div
                key={item.keyword}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  fontSize: "clamp(3rem,8vw,7rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "white",
                  opacity: i === activeIdx ? 1 : 0,
                  transform: i === activeIdx ? "translateY(0)" : i < activeIdx ? "translateY(-100%)" : "translateY(100%)",
                  transition: "all 0.6s cubic-bezier(0.76, 0, 0.24, 1)",
                }}
              >
                {item.keyword}
              </div>
            ))}
          </div>
          <p style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "1rem",
            maxWidth: 400,
            lineHeight: 1.7,
            marginTop: 24,
            opacity: 1,
            transition: "opacity 0.4s ease",
          }}>
            {items[activeIdx].description}
          </p>

          {/* Dot indicators */}
          <div style={{ display: "flex", gap: 8, marginTop: 40 }}>
            {items.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === activeIdx ? 24 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === activeIdx ? "var(--gold-accent)" : "rgba(255,255,255,0.2)",
                  transition: "all 0.4s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SplitInfoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <section
      ref={ref}
      className={`fade-up ${visible ? "visible" : ""}`}
      style={{
        background: "var(--warm-cream)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "70vh",
      }}
    >
      {/* Left */}
      <div style={{
        padding: "80px clamp(24px,6vw,80px)",
        background: "var(--warm-cream)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "var(--deep-black)",
      }}>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--warm-brown)", marginBottom: 16 }}>
          About Corpus
        </p>
        <h2 className="display-text" style={{ color: "var(--deep-black)", marginBottom: 24 }}>
          Where Every Student Shines.
        </h2>
        <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(0,0,0,0.55)", maxWidth: 420 }}>
          Corpus is the annual sports and cultural fest of our medical college — a space where future doctors break free from textbooks and discover their full potential. Four days of competition, creativity, and community.
        </p>
      </div>

      {/* Right */}
      <div style={{
        background: "#1a1008",
        padding: "80px clamp(24px,6vw,80px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 32,
      }}>
        {[
          { icon: "⚡", label: "Sports", desc: "13 competitive sports events from athletics to chess" },
          { icon: "🎨", label: "Arts", desc: "Dance, music, visual arts, and comedy" },
          { icon: "🧠", label: "Academics", desc: "Debate and intellectual challenges" },
          { icon: "🎉", label: "Fun", desc: "Team games and social events for all" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.3rem", marginTop: 2 }}>{item.icon}</span>
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

function RegistrationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const [form, setForm] = useState({ name: "", email: "", phone: "", college: "", events: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="register" style={{ background: "var(--deep-black)", padding: "120px clamp(24px,6vw,80px)" }}>
      <div
        ref={ref}
        className={`fade-up ${visible ? "visible" : ""}`}
      >
        <p className="section-label">Join Us</p>
        <h2 className="display-text" style={{ color: "white", marginTop: 8, marginBottom: 16 }}>
          Register for Corpus <span style={{ color: "var(--gold-accent)" }}>'26</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 60, fontSize: "0.9rem", maxWidth: 500, lineHeight: 1.7 }}>
          Fill in your details and we'll get back to you with event-specific registration instructions.
        </p>

        {submitted ? (
          <div style={{
            maxWidth: 560,
            padding: 48,
            border: "1px solid rgba(201,169,110,0.3)",
            borderRadius: 8,
            textAlign: "center",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>✓</div>
            <h3 style={{ color: "var(--gold-accent)", fontSize: "1.3rem", fontWeight: 700, marginBottom: 12 }}>
              You're registered!
            </h3>
            <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              Thanks, {form.name || "participant"}! We'll reach out with event details soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <input
                className="reg-input"
                type="tel"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
              />
              <input
                className="reg-input"
                type="text"
                placeholder="College / Year *"
                value={form.college}
                onChange={e => setForm({ ...form, college: e.target.value })}
                required
              />
            </div>
            <select
              className="reg-input"
              value={form.events}
              onChange={e => setForm({ ...form, events: e.target.value })}
              required
              style={{ appearance: "none" }}
            >
              <option value="" disabled>Select Event Category *</option>
              <option value="sports">Sports Events</option>
              <option value="arts">Arts & Culture</option>
              <option value="academic">Academic Events</option>
              <option value="fun">Fun Events</option>
              <option value="multiple">Multiple Categories</option>
            </select>

            <div style={{ display: "flex", gap: 16, marginTop: 8, alignItems: "center" }}>
              <button type="submit" className="reg-btn">
                Register Now ↗
              </button>
              <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
                Free to participate • Open to all batches
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "60px clamp(24px,6vw,80px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40 }}>
        <div>
          <p style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "0.1em", color: "white", marginBottom: 8 }}>CORPUS</p>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", maxWidth: 280, lineHeight: 1.6 }}>
            The Annual Sports & Cultural Fest<br />Medical College · 22–25 April 2026
          </p>
        </div>
        <div style={{ display: "flex", gap: 48 }}>
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
              {["Instagram", "WhatsApp", "Email"].map(l => (
                <span key={l} className="footer-link">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 60, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)" }}>© 2026 Corpus. Medical College Annual Fest.</p>
        <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.15)" }}>Made with ♥ by the Fest Committee</p>
      </div>
    </footer>
  );
}

// ── Main Home ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ background: "var(--deep-black)", minHeight: "100vh" }}>
      {/* Film grain texture */}
      <div className="noise-overlay" />

      <Navbar onMenuOpen={() => setMenuOpen(true)} />
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <HeroSection />
      <PreviousEventsCarousel />
      <WhatIfSection />
      <Brain3D />
      <EventsSection />
      <SplitInfoSection />
      <ScheduleSection />
      <RegistrationSection />
      <Footer />
    </div>
  );
}
