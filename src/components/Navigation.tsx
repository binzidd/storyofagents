"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const sections = [
  { id: "hero",      label: "Intro",         color: "#3b82f6" },
  { id: "journey",   label: "Overview",      color: "#64748b" },
  { id: "intern",    label: "Tool Calling",  color: "#8b5cf6" },
  { id: "workforce", label: "Agents",        color: "#10b981" },
  { id: "mcp",       label: "MCP",           color: "#06b6d4" },
  { id: "a2a",       label: "A2A",           color: "#8b5cf6" },
  { id: "roi",       label: "Observability", color: "#6366f1" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("hero");
  const [hovered, setHovered]   = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const ids = sections.map(s => s.id);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && window.scrollY >= el.offsetTop - 300) { setActive(ids[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const activeIdx   = sections.findIndex(s => s.id === active);
  const activeColor = sections[activeIdx]?.color ?? "#3b82f6";

  return (
    <>
      {/* Top bar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-xs font-black">FS</span>
            </div>
            <div>
              <div className="font-bold text-sm leading-none text-gray-900">AI Briefing</div>
              <div className="text-xs leading-none mt-0.5 text-blue-600">March 2026</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-0.5">
            {sections.filter(s => s.id !== "journey").map(s => (
              <button key={s.id} onClick={() => go(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active === s.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:block text-xs font-medium text-gray-400">By Binay</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </motion.nav>

      {/* Right-side progress dots */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3">
        <div className="absolute top-0 bottom-0 w-px bg-gray-200 left-1/2 -translate-x-1/2" />
        <motion.div
          className="absolute top-0 w-px left-1/2 -translate-x-1/2 origin-top"
          style={{
            background: activeColor,
            height: `${(activeIdx / (sections.length - 1)) * 100}%`,
            transition: "height 0.5s ease, background 0.3s",
          }}
        />
        {sections.map((s, i) => {
          const isPast   = i <= activeIdx;
          const isActive = s.id === active;
          return (
            <div key={s.id} className="relative z-10">
              <button
                onClick={() => go(s.id)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex items-center justify-center"
              >
                <motion.div
                  animate={{ width: isActive ? 12 : 8, height: isActive ? 12 : 8, background: isPast ? s.color : "#E5E7EB" }}
                  transition={{ duration: 0.3 }}
                  className="rounded-full border-2 border-white shadow-sm"
                  style={{ borderColor: isPast ? s.color : "#D1D5DB" }}
                />
                {isActive && (
                  <motion.div className="absolute rounded-full pointer-events-none"
                    style={{ background: `${s.color}30` }}
                    animate={{ width: 24, height: 24, opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </button>
              <AnimatePresence>
                {hovered === s.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg pointer-events-none"
                  >
                    {s.label}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
}
