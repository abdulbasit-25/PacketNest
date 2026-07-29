import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Globe, Terminal, Layers, GitBranch, Cpu, ArrowLeft,
  Wifi, Server, Network, BookOpen
} from "lucide-react";
import logo from "@/assets/logo.png";

/* ─── Data ─────────────────────────────────────────────── */
const members = [
  { name: "Komail Khawaja",    reg: "24108180", role: "Network Design & Docs",  icon: <Network size={14}/> },
  { name: "Ali Zaviyar Sheikh", reg: "24108156", role: "CLI-Device Mgmt",     icon: <Terminal size={14}/> },
  { name: "Ibrahim",            reg: "24108184", role: "Simulation Engine",      icon: <Cpu size={14}/> },
  { name: "Abdul Basit",        reg: "24108150", role: "Integration", icon: <Layers size={14}/> },
];

const features = [
  { icon: <Layers size={16}/>,     title: "Topology Designer",  desc: "Drag-and-drop canvas for PCs, switches, and routers." },
  { icon: <Terminal size={16}/>,   title: "Built-in CLI",       desc: "Real command-line configuration per device." },
  { icon: <Cpu size={16}/>,        title: "Packet Simulation",  desc: "Test connectivity and observe packet delivery live." },
  { icon: <GitBranch size={16}/>,  title: "Save & Load",        desc: "Export and import topologies as JSON." },
];

const stack = ["React.js", "Tailwind CSS", "Python", "Node.js", "JSON Storage"];

/* ─── Animated dot grid background ─────────────────────── */
function DotGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle, hsl(173 80% 45% / 0.13) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
  );
}

/* ─── Floating glow orbs ────────────────────────────────── */
function Orbs() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(173 80% 45% / 0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "floatA 9s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(142 70% 45% / 0.10) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "floatB 12s ease-in-out infinite",
        }}
      />
    </>
  );
}

/* ─── Stagger reveal hook ───────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Card wrapper with reveal ─────────────────────────── */
function Card({ children, delay = 0, className = "" }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-md shadow-sm transition-all duration-700 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Main component ────────────────────────────────────── */
export default function About() {
  return (
    <>
      <style>{`
        @keyframes floatA {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(24px, 18px) scale(1.08); }
        }
        .about-scrollbar-hide {
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .about-scrollbar-hide::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        @keyframes floatB {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-18px, -14px) scale(1.06); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink {
          0%,100% { opacity:1; } 50% { opacity:0; }
        }
        .glow-border {
          box-shadow: 0 0 0 1px hsl(173 80% 45% / 0.25), 0 0 18px hsl(173 80% 45% / 0.08);
        }
        .glow-border:hover {
          box-shadow: 0 0 0 1px hsl(173 80% 45% / 0.5), 0 0 28px hsl(173 80% 45% / 0.15);
        }
        .tag-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: hsl(173 80% 45% / 0.1);
          border: 1px solid hsl(173 80% 45% / 0.2);
          color: hsl(173 80% 55%);
          border-radius: 999px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.03em;
          transition: background 0.2s, border-color 0.2s;
        }
        .tag-chip:hover {
          background: hsl(173 80% 45% / 0.18);
          border-color: hsl(173 80% 45% / 0.4);
        }
        .member-card:hover {
          background: hsl(220 18% 14%);
          border-color: hsl(173 80% 45% / 0.3);
        }
        .feature-card:hover {
          border-color: hsl(173 80% 45% / 0.3);
        }
        .feature-card:hover .feat-icon {
          color: hsl(173 80% 55%);
          filter: drop-shadow(0 0 6px hsl(173 80% 45% / 0.5));
        }
        .cursor-blink::after {
          content:'▋';
          animation: blink 1s step-end infinite;
          color: hsl(173 80% 45%);
          margin-left: 2px;
        }
      `}</style>

      <div className="relative h-screen overflow-y-auto overflow-x-hidden bg-background text-foreground about-scrollbar-hide">
        <DotGrid />
        <Orbs />

        {/* Scanline effect */}
        <div
          aria-hidden
          style={{
            position: "fixed", top: 0, left: 0, right: 0, height: "2px",
            background: "linear-gradient(90deg, transparent, hsl(173 80% 45% / 0.15), transparent)",
            animation: "scanline 8s linear infinite",
            pointerEvents: "none", zIndex: 0,
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">

          {/* ── Hero Header ── */}
          <Card delay={0} className="glow-border p-0">
            <div className="p-8 sm:p-10">
              {/* Top row */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: "hsl(220 18% 12%)",
                      border: "1px solid hsl(173 80% 45% / 0.3)",
                      boxShadow: "0 0 16px hsl(173 80% 45% / 0.15)",
                    }}
                  >
                    <img src={logo} alt="PacketNest" className="w-9 h-9 object-contain" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-1">
                      Network Simulation
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight cursor-blink">
                      PacketNest
                    </h1>
                  </div>
                </div>

                <a
                  href="https://packetnest.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start sm:self-center inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-200"
                  style={{
                    background: "hsl(173 80% 45% / 0.1)",
                    border: "1px solid hsl(173 80% 45% / 0.3)",
                    boxShadow: "0 0 12px hsl(173 80% 45% / 0.1)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "hsl(173 80% 45% / 0.18)";
                    e.currentTarget.style.boxShadow = "0 0 20px hsl(173 80% 45% / 0.2)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "hsl(173 80% 45% / 0.1)";
                    e.currentTarget.style.boxShadow = "0 0 12px hsl(173 80% 45% / 0.1)";
                  }}
                >
                  <Globe size={14} /> Live Demo
                </a>
              </div>

              {/* Description */}
              <p className="mt-6 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                A lightweight, browser-based network simulator inspired by Cisco Packet Tracer — built so
                students can design topologies, configure devices via CLI, and test packet communication
                without any physical hardware.
              </p>

              {/* Stack chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                {stack.map((s) => (
                  <span key={s} className="tag-chip">{s}</span>
                ))}
              </div>
            </div>

            {/* Bottom meta bar */}
            <div
              className="border-t border-border px-8 sm:px-10 py-3.5 flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted-foreground"
              style={{ background: "hsl(220 18% 8% / 0.6)" }}
            >
              <span><span className="text-foreground/60 mr-1">Course</span> Computer Networks Lab</span>
              <span><span className="text-foreground/60 mr-1">Instructor</span> Ahsan Abbas</span>
              <span><span className="text-foreground/60 mr-1">Program</span> BS(AI) · 4B · SZABIST ISB</span>
            </div>
          </Card>

          {/* ── Main grid ── */}
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

            {/* Left */}
            <div className="space-y-6">

              {/* Why section */}
              <Card delay={80} className="p-7 glow-border">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <BookOpen size={15} className="text-primary" /> Why PacketNest?
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Physical networking hardware is expensive and often unavailable in academic settings.
                  Most existing simulators either demand powerful machines or overwhelm newcomers with
                  complexity. PacketNest strips that away — giving students a clean, fast, visual workspace
                  to actually <em>learn</em> networking by doing it.
                </p>
              </Card>

              {/* Features grid */}
              <Card delay={150} className="p-7 glow-border">
                <h2 className="text-base font-semibold mb-4">Core Features</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {features.map((f) => (
                    <div
                      key={f.title}
                      className="feature-card rounded-xl border border-border bg-muted/60 p-4 transition-all duration-200"
                    >
                      <div className="feat-icon flex items-center gap-2 text-muted-foreground mb-1.5 transition-all duration-200">
                        {f.icon}
                        <span className="text-sm font-semibold text-foreground">{f.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Objectives strip */}
              <Card delay={220} className="p-7 glow-border">
                <h2 className="text-base font-semibold mb-4">Objectives</h2>
                <ul className="space-y-2">
                  {[
                    "Graphical simulation environment for educational use",
                    "Drag-and-drop topology design and device management",
                    "Simulate PC, switch, and router communication",
                    "Built-in CLI for real command-based configuration",
                    "Save, load, and manage topologies efficiently",
                  ].map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span
                        className="mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
                        style={{
                          background: "hsl(173 80% 45% / 0.12)",
                          color: "hsl(173 80% 55%)",
                          border: "1px solid hsl(173 80% 45% / 0.2)",
                        }}
                      >
                        {i + 1}
                      </span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Right */}
            <div className="space-y-6">

              {/* Members */}
              <Card delay={100} className="p-6 glow-border">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Server size={14} className="text-primary" /> Group Members
                </h2>
                <div className="space-y-2.5">
                  {members.map((m) => (
                    <div
                      key={m.reg}
                      className="member-card rounded-xl border border-border bg-muted/50 px-4 py-3 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold leading-tight">{m.name}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">{m.reg}</p>
                        </div>
                        <span
                          className="shrink-0 flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold"
                          style={{
                            background: "hsl(173 80% 45% / 0.1)",
                            color: "hsl(173 80% 55%)",
                            border: "1px solid hsl(173 80% 45% / 0.2)",
                          }}
                        >
                          {m.icon} {m.role.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Links */}
              <Card delay={200} className="p-6 glow-border">
                <h2 className="text-base font-semibold mb-4">Links</h2>
                <div className="space-y-2.5">
                  <Link
                    to="/"
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/30 hover:text-primary"
                  >
                    <ArrowLeft size={14} /> Return to Simulator
                  </Link>
                  <a
                    href="https://packetnest.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/30 hover:text-primary"
                  >
                    <Globe size={14} /> packetnest.vercel.app
                  </a>
                </div>
              </Card>

              {/* Department badge */}
              <Card delay={280} className="p-6">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="block font-semibold text-foreground/80 mb-1">Department</span>
                  Robotics &amp; Artificial Intelligence
                  <span className="block mt-1">SZABIST University, Islamabad</span>
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}