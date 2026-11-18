import { useEffect, useRef, useState } from "react";
import photo from "./assets/pilar-session.jpg";
import founder from "./assets/founder.jpg";
import bga from "./assets/bga-logo.png";
import roundtable from "./assets/roundtable.jpg";
import soon from "./assets/coming-soon.jpg";
import logo from "./assets/pilar-logo-sm.png";

/* Paste your Google Form link here when it is ready */
const FORM_URL = ""; // e.g. "https://forms.gle/xxxx"; while empty, the button says it is not available yet

const NAV = [
  ["Home", "#top"], ["Initiatives", "#initiatives"], ["About", "#about"],
  ["Events", "#events"],
];

const INITIATIVES = [
  { href: "#panel-discussions", pic: roundtable, alt: "Panel discussion at a PILAR event", title: "Panel Discussions", text: "Multidisciplinary discussions on current global and legal issues with expert speakers.",
    icon: <><rect x="24" y="8" width="16" height="30" rx="8" /><path d="M16 30c0 10 7 16 16 16s16-6 16-16M32 46v10M22 56h20" /></> },
  { pic: soon, fit: "soon", alt: "Coming soon", title: "PILAR Mock Court", text: "A student competition simulating an international court proceeding.",
    icon: <path d="M32 8v44M12 16h40M12 16l-8 20a8 8 0 0 0 16 0zM52 16l-8 20a8 8 0 0 0 16 0zM20 54h24" /> },
  { pic: soon, fit: "soon", alt: "Coming soon", title: "MUN Workshops", text: "Training sessions to build the skills and confidence needed for Model United Nations conferences.",
    icon: <><circle cx="32" cy="32" r="22" /><ellipse cx="32" cy="32" rx="10" ry="22" /><path d="M10 32h44M14 20h36M14 44h36" /></> },
];

const AREAS = [
  { title: "International Relations", text: "Diplomacy, global politics and the institutions that shape how countries work together.",
    icon: <><circle cx="20" cy="20" r="15" /><ellipse cx="20" cy="20" rx="6" ry="15" /><path d="M5 20h30" /></> },
  { title: "Law", text: "International and domestic law, from court procedure to the principles behind it.",
    icon: <path d="M20 5v28M8 10h24M8 10l-5 12a5 5 0 0 0 10 0zM32 10l-5 12a5 5 0 0 0 10 0zM12 34h16" /> },
  { title: "Economics", text: "Markets, trade and policy, and how they connect to politics and law.",
    icon: <path d="M5 33h30M9 28V18M17 28V12M25 28V20M33 28V8" /> },
];

const EVENTS = [
  { when: "Coming soon", title: "Panel Discussion", note: "Expert speakers, open Q&A", href: "#panel-discussions" },
  { when: "Coming soon", title: "PILAR Mock Court", note: "Team applications open to students" },
  { when: "Coming soon", title: "MUN Workshop", note: "Public speaking, research and resolutions" },
];

/* Adds the "in" class once the element scrolls into view */
function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`}
         style={{ "--d": `${delay}ms` }} {...rest}>{children}</Tag>
  );
}


/* soft warm light that glides after the cursor */
function Glow() {
  const r = useRef(null);
  useEffect(() => {
    const el = r.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = innerWidth * 0.7, ty = innerHeight * 0.3, x = tx, y = ty, raf;
    const loop = () => { x += (tx - x) * 0.08; y += (ty - y) * 0.08; el.style.setProperty("--gx", x + "px"); el.style.setProperty("--gy", y + "px"); raf = requestAnimationFrame(loop); };
    const mv = (e) => { tx = e.clientX; ty = e.clientY; };
    addEventListener("pointermove", mv); raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", mv); };
  }, []);
  return <div ref={r} className="glow" aria-hidden="true" />;
}

/* roman-numeral section index on the left edge */
const SPY = [["I", "home"], ["II", "initiatives"], ["III", "about"], ["IV", "events"]];
function SideIndex() {
  const [cur, setCur] = useState("home");
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setCur(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    SPY.forEach(([, id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return <ul className="side" aria-label="Sections">{SPY.map(([n, id]) => <li key={id}><a href={`#${id}`} className={cur === id ? "on" : ""} aria-label={id}>{n}</a></li>)}</ul>;
}

/* thin gold reading-progress line */
function Progress() {
  const r = useRef(null);
  useEffect(() => {
    const f = () => { const h = document.documentElement.scrollHeight - innerHeight; r.current.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
    f(); addEventListener("scroll", f, { passive: true }); addEventListener("resize", f);
    return () => { removeEventListener("scroll", f); removeEventListener("resize", f); };
  }, []);
  return <div ref={r} className="progress" aria-hidden="true" />;
}

/* a ring that trails the cursor and swells over links */
function Cursor() {
  const r = useRef(null), d = useRef(null);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ring = r.current, dot = d.current;
    let tx = -100, ty = -100, x = -100, y = -100, s = 1, raf;
    const loop = () => { x += (tx - x) * 0.18; y += (ty - y) * 0.18; ring.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${s})`; raf = requestAnimationFrame(loop); };
    const mv = (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate3d(${tx}px,${ty}px,0) translate(-50%,-50%)`;
      const hot = !!(e.target.closest && e.target.closest("a,button"));
      s = hot ? 2.1 : 1; ring.classList.toggle("hot", hot);
    };
    addEventListener("pointermove", mv); raf = requestAnimationFrame(loop); ring.style.opacity = dot.style.opacity = 1;
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", mv); };
  }, []);
  return <><div ref={r} className="cur-ring" /><div ref={d} className="cur-dot" /></>;
}

/* cards lean toward the cursor */
const tilt = (e) => {
  const el = e.currentTarget, b = el.getBoundingClientRect();
  const px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height;
  el.style.setProperty("--ry", `${((px - 0.5) * 9).toFixed(2)}deg`);
  el.style.setProperty("--rx", `${((0.5 - py) * 7).toFixed(2)}deg`);
  el.style.setProperty("--mx", `${px * 100}%`); el.style.setProperty("--my", `${py * 100}%`);
};
const untilt = (e) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); };
const heroMove = (e) => {
  const el = e.currentTarget, b = el.getBoundingClientRect();
  el.style.setProperty("--px", ((e.clientX - b.left) / b.width - 0.5).toFixed(3));
  el.style.setProperty("--py", ((e.clientY - b.top) / b.height - 0.5).toFixed(3));
};
const DUST = Array.from({ length: 16 }, (_, i) => ({ l: (i * 37 + 11) % 100, s: 2 + (i % 4), t: 12 + ((i * 7) % 14), d: -((i * 5) % 20) }));

function Icon({ children, size = 64, box = 64, ...p }) {
  return (
    <svg viewBox={`0 0 ${box} ${box}`} width={size} height={size} fill="none"
         stroke="currentColor" strokeWidth="2" aria-hidden="true" {...p}>{children}</svg>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => { removeEventListener("keydown", esc); document.body.classList.remove("menu-open"); };
  }, [open]);
  return (
    <header className={scrolled || open ? "scrolled" : ""}>
      <div className="wrap nav">
        <a className="brand" href="#top" aria-label="PILAR home"><b>PILAR</b><img src={logo} alt="" /><i /></a>
        <nav aria-label="Main">
          <button className="burger" aria-expanded={open} aria-controls="menu"
                  onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
          <ul id="menu" className={open ? "open" : ""}>
            {NAV.map(([label, href]) => (
              <li key={label}><a href={href} onClick={() => setOpen(false)}>{label}</a></li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

const PEOPLE = [["Tamta Gelashvili", "Advocate"], ["Otar Antia", "Economist"], ["Gizo Chelidze", "International Relations Expert"]];
function PilarIBody() {
  return (
    <div className="more-in">
      <img src={roundtable} alt="Panel discussion at PILAR I" loading="lazy" />
      <div>
        <ul className="meta"><li>7 October</li><li>British-Georgian Academy, Tbilisi</li><li>Grades 10–11</li></ul>
        <p>PILAR I marked the launch of our academic journey with an interdisciplinary panel discussion that brought together experts from international relations, economics, and law. The event aimed to encourage students to examine contemporary issues from multiple perspectives and to understand how these fields intersect in shaping the world around us.</p>
        <p>Designed for students in Grades 10 and 11, the discussion offered a unique opportunity to engage with distinguished professionals, explore real-world questions, and gain insight into the broader connections between politics, economics, and law.</p>
      </div>
      <div className="speakers"><h4>Our Guest Speakers</h4>{PEOPLE.map(([n, r]) => <div key={n}><b>{n}</b><em>{r}</em></div>)}</div>
    </div>
  );
}

function FormButton() {
  const [msg, setMsg] = useState(false);
  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(false), 5000); return () => clearTimeout(t); }, [msg]);
  if (FORM_URL) return <a className="btn gold" href={FORM_URL} target="_blank" rel="noopener noreferrer">Register via Google Form <span className="go">→</span></a>;
  return (
    <>
      <button type="button" className="btn gold" onClick={() => setMsg(true)}>Register via Google Form <span className="go">→</span></button>
      <p className={`notice ${msg ? "show" : ""}`} role="status">{msg ? "Registration isn’t available yet. Please check back soon." : ""}</p>
    </>
  );
}

/* separate page: #panel-discussions */
function PanelPage() {
  return (
    <main className="rt" id="top">
      <div className="wrap rt-head">
        <a className="back intro" href="#initiatives">← Back to Initiatives</a>
        <span className="eyebrow intro" style={{ "--d": "100ms" }}>Our Initiatives</span>
        <h1 className="intro" style={{ "--d": "200ms" }}>Panel Discussions</h1>
        <p className="tagline intro" style={{ "--d": "350ms" }}>Multidisciplinary discussions on current global and legal issues with expert speakers.</p>
      </div>
      <div className="wrap rt-ev">
        <Reveal className="rt-label"><span className="eyebrow">Past event · 7 October 2026</span><h2>PILAR I</h2></Reveal>
        <Reveal><PilarIBody /></Reveal>
      </div>
      <div className="wrap rt-soon">
        <Reveal className="head"><h2>Upcoming panel discussions</h2></Reveal>
        <div className="cards two">
          {["PILAR II", "PILAR III"].map((t, i) => (
            <Reveal key={t} className="card" delay={i * 120}>
              <div className="img pic soon"><img src={soon} alt="Coming soon" loading="lazy" /></div>
              <div className="body"><span className="eyebrow">Coming soon</span><h3>{t}</h3><p>Date and speakers to be announced.</p></div>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="wrap rt-team">
        <Reveal className="head"><h2>Our Team</h2></Reveal>
        <div className="team">
          {[["Anastasia Datiashvili", "PR & Media"], ["Nini Kalandarishvili", "Academic Content & Research Coordinator"], ["Kyril Iyashin", "Photographer"], ["Nitsa Nakopia", "Moderator"]].map(([n, r], i) => (
            <Reveal key={n} delay={i * 100}><b>{n}</b><em>{r}</em></Reveal>
          ))}
        </div>
      </div>
      <section id="join">
        <div className="wrap">
          <Reveal as="h2">Get Involved</Reveal>
          <Reveal as="p" delay={120}>Join us as a participant. Tell us what interests you and we’ll help you find your place in our community.</Reveal>
          <Reveal className="btns" delay={240}>
            <FormButton />
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function useHash() {
  const [h, setH] = useState(typeof location !== "undefined" ? location.hash : "");
  useEffect(() => { const f = () => setH(location.hash); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f); }, []);
  return h;
}

function Hero() {
  return (
    <div className="hero" id="home" onPointerMove={heroMove}>
      <div className="hero-bg" style={{ backgroundImage: `url(${photo})` }} aria-hidden="true" />
      <div className="dust" aria-hidden="true">{DUST.map((p, i) => <i key={i} style={{ left: `${p.l}%`, width: p.s, height: p.s, animationDuration: `${p.t}s`, animationDelay: `${p.d}s` }} />)}</div>
      <div className="wrap hero-grid">
        <div className="hero-text">
          <p className="crumbs intro" style={{ "--d": "100ms" }}>Politics <i>/</i> International Relations <i>/</i> Law <i>/</i> Economics</p>
          <h1 aria-label="PILAR">{[..."PILAR"].map((c, i) => <span key={i} className="ltr" aria-hidden="true" style={{ "--i": i }}>{c}</span>)}</h1>
          <span className="gold-rule intro" style={{ "--d": "400ms" }} />
          <p className="tagline intro" style={{ "--d": "500ms" }}>A student-led forum for dialogue, research, and opportunity.</p>
          <div className="btns intro" style={{ "--d": "650ms" }}>
            <a className="btn gold" href="#initiatives">Our Initiatives <span className="go">→</span></a>
            <a className="btn line-btn" href="#about">About Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const hash = useHash();
  const page = hash === "#panel-discussions" || hash === "#roundtables" ? "rt" : "home";
  useEffect(() => {
    if (page === "rt") { window.scrollTo(0, 0); return; }
    const t = hash && document.querySelector(hash);
    requestAnimationFrame(() => (t ? t.scrollIntoView() : window.scrollTo(0, 0)));
  }, [page]);
  useEffect(() => {
    const move = (e) => {
      const b = e.target.closest && e.target.closest(".btn");
      if (!b) return;
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
    };
    const out = (e) => { const b = e.target.closest && e.target.closest(".btn"); if (b) b.style.transform = ""; };
    document.addEventListener("pointermove", move); document.addEventListener("pointerout", out);
    return () => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerout", out); };
  }, []);
  return (
    <>
      <Glow />
      <Progress />
      <Cursor />
      {page === "home" && <SideIndex />}
      <Header />
      {page === "rt" ? <PanelPage /> : <main id="top">
        <Hero />

        <section id="initiatives">
          <div className="wrap">
            <Reveal className="head">
              <h2>Our Initiatives</h2>
              <span className="sub">Programmes, competitions and academic platforms</span>
            </Reveal>
            <div className="cards">
              {INITIATIVES.map((c, i) => (
                <Reveal as="a" key={c.title} href={c.href || "#events"} className="card" delay={i * 120} onPointerMove={tilt} onPointerLeave={untilt}>
                  <div className={`img ${c.pic ? "pic" : ""} ${c.fit || ""}`}>{c.pic ? <img src={c.pic} alt={c.alt} loading="lazy" /> : <Icon>{c.icon}</Icon>}</div>
                  <div className="body">
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                    <span className="arrow">→</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="about">
          <div className="ab-banner">
                        <div className="wrap"><h2>About PILAR</h2></div>
          </div>

          <div className="ab-who">
            <div className="wrap">
              <Reveal className="ab-left">
                <span className="ab-label">Who we are</span>
                <p className="ab-lead">PILAR is a student-led academic initiative dedicated to connecting students with ideas, perspectives, and opportunities across politics, international relations, law, economics, and beyond.</p>
              </Reveal>
              <Reveal className="ab-right" delay={140}>
                <p>As a recently established initiative, PILAR seeks to create a space where students can engage in meaningful discussions, learn from experienced professionals, and explore subjects beyond traditional classroom learning.</p>
                <p>At its core, PILAR is built on the belief that academic disciplines are deeply interconnected. By encouraging interdisciplinary thinking and bringing together different perspectives, we aim to help students develop a broader and more comprehensive understanding of the world around them.</p>
              </Reveal>
            </div>
          </div>

          <div className="ab-band">
            <div className="wrap">
              <Reveal className="ab-col">
                <Icon size={36} box={24} strokeWidth="1.3"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /><path d="M12 12l7-7M17 3v3h3" /></Icon>
                <div><h3>Our Mission</h3><p>To make meaningful academic engagement more accessible to students by creating opportunities for interdisciplinary learning, critical thinking, and constructive dialogue.</p></div>
              </Reveal>
              <Reveal className="ab-col" delay={120}>
                <Icon size={36} box={24} strokeWidth="1.3"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Icon>
                <div><h3>Our Vision</h3><p>To grow into a collaborative academic community that connects students across schools and, eventually, across borders, through events, competitions, research and educational programmes.</p></div>
              </Reveal>
              <Reveal className="ab-col" delay={240}>
                <Icon size={36} box={24} strokeWidth="1.3"><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /><path d="M3 17.5l9 5 9-5" /></Icon>
                <div><h3>Our Values</h3><p className="vals"><span>Intellectual Curiosity</span><span>Critical Thinking</span><span>Constructive Dialogue</span><span>Academic Accessibility</span><span>Collaboration</span></p></div>
              </Reveal>
            </div>
          </div>

          <div className="ab-founder">
            <div className="wrap">
              <Reveal className="ab-photo"><img src={founder} alt="Tarana Karakhmazli speaking at the first PILAR session" loading="lazy" /></Reveal>
              <Reveal className="ab-msg" delay={140}>
                <span className="ab-label">A message from the founder</span>
                <h3>Tarana Karakhmazli</h3>
                <em>Founder &amp; Co-Organizer of PILAR</em>
                <p>My main goal with PILAR is to show students that they are not limited to a single field of study. Politics, international relations, law and economics are not separate areas, but deeply interconnected fields that together help us better understand the world around us.</p>
                <p>To achieve this, I hope to further expand PILAR in the future, introducing new academic areas and creating even more opportunities for interdisciplinary learning and dialogue.</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="events">
          <div className="wrap">
            <Reveal className="head"><h2>Events</h2><span className="sub">Upcoming and recent</span></Reveal>
            <div className="rows">
              {EVENTS.map((e, i) => (
                <Reveal key={e.title} as={e.href ? "a" : "div"} href={e.href} className={`row ${e.href ? "link" : ""}`} delay={i * 120}>
                  <time>{e.when}</time>
                  <div><h3>{e.title}</h3><small>{e.note}</small></div>
                  <span className="pill">{e.href ? "View page →" : "Details soon"}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>}

      <footer>
        <div className="wrap">
          <div className="foot-brand">
            <div className="brand"><img src={logo} alt="" /><b>PILAR</b></div>
            <span className="bga"><img src={bga} alt="BGA logo" /><span>British-Georgian Academy</span></span>
          </div>
          <div>© 2026 PILAR Society
            <span className="mail">pilarsociety1@gmail.com</span>
            <a href="#about">About</a><a href="#initiatives">Initiatives</a><a href="#events">Events</a>
            <a className="ig" href="https://www.instagram.com/pilar_society/?hl=ru" target="_blank" rel="noopener noreferrer" aria-label="PILAR Society on Instagram">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
