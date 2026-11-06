"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, Github, Linkedin, Mail, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const projects = [
  { title: "Network Scanning & Traffic Analysis", bullets: ["Scanned networks and identified open ports and running services using Nmap.", "Analyzed packets and traffic patterns with Wireshark.", "Practised reconnaissance and anomaly identification in lab environments."], tech: ["Nmap", "Wireshark", "Network security"] },
  { title: "Web Application Security Testing", bullets: ["Performed security testing using Burp Suite.", "Explored Cross-Site Scripting (XSS) and SQL Injection.", "Practised identifying web security weaknesses and understanding remediation approaches."], tech: ["Burp Suite", "XSS", "SQL Injection"] },
  { title: "Database Security Assessment", bullets: ["Tested SQL Injection vulnerabilities using SQLMap.", "Studied database security risks and attack techniques.", "Explored mitigations including input validation and parameterized queries."], tech: ["SQLMap", "Database security", "Input validation"] },
  { title: "Ethical Hacking Lab Work", bullets: ["Performed hands-on exercises on Kali Linux.", "Worked through reconnaissance, exploitation, and vulnerability assessment.", "Completed exercises in controlled lab environments."], tech: ["Kali Linux", "Reconnaissance", "Vulnerability assessment"] },
];

const tools = ["Vulnerability Assessment", "Ethical Hacking", "Web Application Security", "Cryptography", "Nmap", "Wireshark", "Burp Suite", "SQLMap", "Nessus", "ISO/IEC 27001:2022", "ISMS", "Risk Assessment", "Risk Management", "Security Policies & Procedures", "NIST Cybersecurity Framework (CSF)", "Kali Linux", "Windows", "Linux", "Basic Python", "Basic C++", "Problem Solving", "Communication", "Teamwork"];
const agents = ["Scout", "Layout", "Typeset", "Motion", "QA", "Deploy", "Copy", "Lint", "Index", "Render", "Palette", "Review"];
const colors = ["#38bdf8", "#fbbf24", "#a3e635", "#fb7185", "#c084fc", "#22d3ee", "#f97316", "#4ade80", "#e879f9", "#60a5fa", "#facc15", "#f472b6"];

type Cursor = { name: string; color: string; x: number; y: number; visible: boolean; target?: DOMRect };

export default function Home() {
  const [agentsOn, setAgentsOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const [booted, setBooted] = useState(false);
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [touring, setTouring] = useState(false);
  const revealed = useRef(new Set<HTMLElement>());
  const pausedRef = useRef(false);
  const touringRef = useRef(false);
  const queueRef = useRef<HTMLElement[]>([]);
  const processing = useRef(false);

  const reveal = useCallback((el: HTMLElement, withAgents = true) => {
    if (revealed.current.has(el)) return;
    revealed.current.add(el);
    if (!withAgents) { el.classList.add("is-built"); return; }
    queueRef.current.push(el);
  }, []);

  const stopTour = useCallback(() => { touringRef.current = false; setTouring(false); }, []);

  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("agents");
    const stored = localStorage.getItem("portfolio-agents");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enabled = query === "on" || (query !== "off" && stored !== "off" && !reduce);
    setAgentsOn(enabled);
    document.documentElement.classList.toggle("agents-off", !enabled);
    const timer = window.setTimeout(() => { setBooted(true); document.documentElement.classList.add("build-ready"); }, 750);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!booted) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-build]"));
    const immediate = () => elements.filter((el) => el.getBoundingClientRect().bottom < 0).forEach((el) => reveal(el, false));
    immediate();
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) reveal(entry.target as HTMLElement, agentsOn);
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [booted, agentsOn, reveal]);

  useEffect(() => {
    if (!booted) return;
    let frame = 0;
    const process = () => {
      if (!pausedRef.current && !processing.current && queueRef.current.length) {
        processing.current = true;
        const batch = queueRef.current.splice(0, Math.min(window.innerWidth < 640 ? 6 : 12, 6));
        const actors = batch.map((el, i) => {
          const rect = el.getBoundingClientRect();
          return { name: agents[i % agents.length], color: colors[i % colors.length], x: window.innerWidth * .5, y: window.innerHeight * .54, visible: true, target: rect };
        });
        setCursors(actors);
        window.setTimeout(() => setCursors(actors.map((c) => ({ ...c, x: Math.min(c.target!.right - 14, window.innerWidth - 30), y: Math.min(c.target!.top + 18, window.innerHeight - 30) }))), 30);
        window.setTimeout(() => batch.forEach((el) => {
          el.classList.add("is-built");
          if (el.dataset.build === "type" && el.childElementCount === 0) {
            const full = el.dataset.fullText ?? el.textContent ?? "";
            el.dataset.fullText = full;
            el.textContent = "";
            [...full].forEach((character, index) => window.setTimeout(() => { el.textContent += character; }, index * 9));
          }
        }), 520);
        window.setTimeout(() => { setCursors([]); processing.current = false; }, 860);
      }
      frame = requestAnimationFrame(process);
    };
    frame = requestAnimationFrame(process);
    return () => cancelAnimationFrame(frame);
  }, [booted]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "p") setPaused((v) => !v);
      if (event.key.toLowerCase() === "a") setAgentsOn((v) => { localStorage.setItem("portfolio-agents", v ? "off" : "on"); return !v; });
      if (event.key.toLowerCase() === "t") startTour();
      if (event.key === "Escape") stopTour();
    };
    const interrupt = () => touringRef.current && stopTour();
    addEventListener("keydown", key); addEventListener("wheel", interrupt, { passive: true }); addEventListener("touchstart", interrupt, { passive: true });
    return () => { removeEventListener("keydown", key); removeEventListener("wheel", interrupt); removeEventListener("touchstart", interrupt); };
  });

  function toggleAgents() { setAgentsOn((value) => { const next = !value; localStorage.setItem("portfolio-agents", next ? "on" : "off"); document.documentElement.classList.toggle("agents-off", !next); if (!next) queueRef.current.splice(0).forEach((el) => el.classList.add("is-built")); return next; }); }
  function startTour() { if (touringRef.current) return; window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); touringRef.current = true; setTouring(true); window.setTimeout(() => { const start = performance.now(); const duration = Math.max(11000, document.documentElement.scrollHeight * 4); const tick = (now: number) => { if (!touringRef.current) return; const p = Math.min(1, (now - start) / duration); const eased = p < .15 ? 3.33 * p * p : p > .85 ? 1 - 3.33 * (1 - p) * (1 - p) : p; window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * eased); if (p < 1) requestAnimationFrame(tick); else stopTour(); }; requestAnimationFrame(tick); }, 2500); }

  return <main>
    {!booted && <div className="boot"><span className="boot-dot" />Booting portfolio systems</div>}
    <nav className="nav"><a href="#top" className="brand">SP<span>.</span></a><div><a href="#work">Work</a><a href="#record">Record</a><a href="#contact">Contact</a></div></nav>
    <section id="top" className="hero section">
      <div className="portfolio-word" data-build="wipe">PORTFOLIO</div>
      <div className="hero-grid">
        <div className="hero-copy"><p className="hello" data-build="type">Hello, I&apos;m</p><h1 data-build="wipe">Shubham<br />Patidar</h1><p className="role" data-build="type">Cybersecurity &amp; GRC Intern Candidate</p><p className="lede" data-build="type">BCA student specializing in Cybersecurity, Computer Networking, and Governance, Risk &amp; Compliance (GRC).</p><a className="button" href="#work" data-build="pop">View work <ArrowDown size={16} /></a><p className="based" data-build="type">Based in Indore, Madhya Pradesh, India</p></div>
        <div className="portrait" data-build="pop"><div className="portrait-glow" /><Image src="/headshot.png" alt="Shubham Patidar" width={1500} height={2300} priority /></div>
        <aside className="hero-stats">{[["04", "Professional certifications"], ["2024-27", "BCA at DAVV"], ["05", "Security tools"]].map(([n, l]) => <div data-build="pop" key={l}><strong>{n}</strong><span>{l}</span></div>)}</aside>
      </div>
    </section>

    <section id="work" className="section work"><div className="section-head"><div><p className="eyebrow" data-build="type">01 / Work</p><h2 data-build="wipe">Work that ships</h2></div><p data-build="type">Security lab practice across network, web, database, and ethical hacking assessments.</p><div className="work-stats" data-build="pop"><b>04</b><span>practical areas</span><b>05</b><span>security tools</span><b>02</b><span>framework</span></div></div><div className="projects">{projects.map((p, i) => <article className="project" data-build="pop" key={p.title}><p className="project-index">0{i + 1}</p><h3>{p.title}</h3><ul>{p.bullets.map((b) => <li key={b}><Check size={14} />{b}</li>)}</ul><div className="chips">{p.tech.map((t) => <span key={t}>{t}</span>)}</div></article>)}</div></section>

    <section className="stack section"><p className="eyebrow" data-build="type">02 / Stack</p><h2 data-build="wipe">Tools in the kit</h2><div className="marquee" data-build="pop"><div className="marquee-track">{[...tools, ...tools].map((tool, i) => <span key={`${tool}-${i}`}>{tool}<i>✦</i></span>)}</div></div></section>

    <section id="record" className="section record"><p className="eyebrow" data-build="type">03 / Record</p><h2 data-build="wipe">Built through practice</h2><div className="timeline"><div data-build="pop"><p>2024 - 2027</p><h3>Bachelor of Computer Applications (BCA)</h3><span>Shri RGP Gujarati Professional Institute · Devi Ahilya Vishwavidyalaya (DAVV)</span></div><div data-build="pop"><p>Practical experience</p><h3>Cybersecurity labs &amp; security projects</h3><span>Network scanning, traffic analysis, web application security, database security, and ethical hacking lab work.</span></div><div data-build="pop"><p>Certifications</p><h3>Four professional certifications</h3><span>CyberOps Associate - Cisco Networking Academy · Junior GRC Analyst (JGA) - Vibe Security · Certified LLM Security Expert (CLLMSE) · ISO/IEC 27001:2022 Information Security Associate - SkillFront</span></div></div></section>

    <section className="section about"><p className="eyebrow" data-build="type">04 / About</p><div className="about-grid"><div><h2 data-build="wipe">Security-minded, always learning.</h2><p data-build="type">I am building practical cybersecurity capability through labs and security assessment exercises, alongside my BCA studies.</p><p data-build="type">My focus spans ISO/IEC 27001:2022, NIST CSF, ISMS, risk assessment, vulnerability assessment, and security operations.</p></div><div className="skill-grid">{["Vulnerability Assessment", "Web Application Security", "Risk Management", "NIST CSF", "ISO/ISE 27001:2022", "Python"].map((x) => <span data-build="pop" key={x}>{x}</span>)}</div></div><div className="principles">{["Learn through controlled labs", "Assess before assuming", "Understand remediation approaches", "Work with security frameworks"].map((p, i) => <div data-build="pop" key={p}><b>0{i + 1}</b><span>{p}</span></div>)}</div></section>

    <section id="contact" className="section contact"><p className="eyebrow" data-build="type">05 / Contact</p><div className="contact-card" data-build="pop"><Sparkles size={20} /><h2>Let&apos;s talk security.</h2><p>Open to applying security assessment techniques and GRC knowledge in a professional environment.</p><a className="button light" href="mailto:shubhampatidar2006@gmail.com">Email Shubham <ArrowUpRight size={16} /></a></div><div className="socials" data-build="type"><a href="mailto:shubhampatidar2006@gmail.com"><Mail size={16} />shubhampatidar2006@gmail.com</a><a href="https://www.linkedin.com/in/shubham-patidar-476559382/" target="_blank" rel="noreferrer"><Linkedin size={16} />LinkedIn</a><a href="https://github.com/shubhamPatidar930" target="_blank" rel="noreferrer"><Github size={16} />GitHub</a></div></section>
    <footer><span>© {new Date().getFullYear()} Shubham Patidar</span><span>Cybersecurity · GRC · Practical learning</span></footer>
    {cursors.map((c, i) => <div className="agent" key={c.name} style={{ left: c.x, top: c.y, "--agent": c.color } as CSSProperties}><div className="robot"><i /><i /><em /></div><span>{c.name}</span><b>↖</b>{c.target && <div className="wire" style={{ width: Math.min(c.target.width, 150), height: Math.min(c.target.height, 90) }}><i /><i /><i /><i /><label>{c.target.width.toFixed(0)} × {c.target.height.toFixed(0)}</label></div>}</div>)}
    <div className="dock"><button onClick={() => setPaused((v) => !v)} aria-label="Pause animation">{paused ? <Play size={15} /> : <Pause size={15} />}{paused ? "Resume" : "Pause"}</button><button onClick={toggleAgents} aria-pressed={agentsOn}>{agentsOn ? "Agents on" : "Agents off"}</button><button onClick={startTour} disabled={touring}>{touring ? "Touring" : <><RotateCcw size={15} />Tour</>}</button></div>
  </main>;
}
