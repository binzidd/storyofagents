"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type StopType = "start" | "section" | "finish";

interface Stop {
  id: string;
  type: StopType;
  number?: string;
  label: string;
  sublabel?: string;
  icon: string;
  color: string;
  href?: string;
  row: 1 | 2;
  reversed?: boolean;
}

const STOPS: Stop[] = [
  // Row 1 (left → right)
  { id: "start-sq", type: "start", label: "START", icon: "▶", color: "#22c55e", row: 1 },
  { id: "hero", type: "section", number: "01", label: "The Spark", sublabel: "Transformers & ChatGPT", icon: "⚡", color: "#3b82f6", href: "#hero", row: 1 },
  { id: "intern", type: "section", number: "02", label: "Tool Calling", sublabel: "Copilot Phase", icon: "🤖", color: "#8b5cf6", href: "#intern", row: 1 },
  { id: "workforce", type: "section", number: "03", label: "Flow Agents", sublabel: "The Workforce", icon: "🔄", color: "#10b981", href: "#workforce", row: 1 },
  // Row 2 (right → left, so reversed visually)
  { id: "langgraph", type: "section", number: "04", label: "LangGraph", sublabel: "Graph Workflows", icon: "🕸", color: "#f59e0b", href: "#langgraph", row: 2, reversed: true },
  { id: "mcp", type: "section", number: "05", label: "MCP Protocol", sublabel: "Universal Layer", icon: "🔗", color: "#06b6d4", href: "#mcp", row: 2, reversed: true },
  { id: "a2a", type: "section", number: "06", label: "Agent-to-Agent", sublabel: "Virtual Firm", icon: "🌐", color: "#8b5cf6", href: "#a2a", row: 2, reversed: true },
  { id: "roi", type: "section", number: "07", label: "Business ROI", sublabel: "The Returns", icon: "💰", color: "#10b981", href: "#roi", row: 2, reversed: true },
  { id: "finish-sq", type: "finish", label: "FINISH", icon: "★", color: "#f59e0b", row: 2, reversed: true },
];

const ROW1 = STOPS.filter(s => s.row === 1);
const ROW2 = STOPS.filter(s => s.row === 2);

function Square({
  stop,
  isActive,
  onClick,
}: {
  stop: Stop;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col items-center justify-center cursor-pointer select-none"
      style={{
        width: 110,
        minHeight: 90,
        background: isActive ? `${stop.color}22` : "#E8DCC8",
        border: `2.5px solid ${isActive ? stop.color : "#1a1a1a"}`,
        transition: "background 0.4s, border-color 0.4s",
        flexShrink: 0,
      }}
    >
      {/* Active glow */}
      {isActive && (
        <motion.div
          layoutId="active-glow"
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: `0 0 24px ${stop.color}80, inset 0 0 12px ${stop.color}30` }}
        />
      )}

      {/* Token sits on top */}
      {isActive && (
        <motion.div
          layoutId="game-token"
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-20"
          style={{ background: stop.color }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <span className="text-xs">🎯</span>
        </motion.div>
      )}

      {/* Number badge */}
      {stop.number && (
        <div
          className="text-xs font-black mb-0.5 leading-none"
          style={{ color: isActive ? stop.color : "#333", fontFamily: "monospace" }}
        >
          {stop.number}
        </div>
      )}

      {/* Icon */}
      <div className="text-xl leading-none mb-0.5">{stop.icon}</div>

      {/* Label */}
      <div
        className="text-xs font-black text-center leading-tight px-1"
        style={{
          color: isActive ? stop.color : "#1a1a1a",
          fontFamily: "'Inter', sans-serif",
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
        }}
      >
        {stop.label}
      </div>

      {/* Sublabel */}
      {stop.sublabel && (
        <div
          className="text-xs text-center px-1 mt-0.5 leading-tight"
          style={{ color: isActive ? `${stop.color}cc` : "#555", fontSize: "0.6rem" }}
        >
          {stop.sublabel}
        </div>
      )}

      {/* START / FINISH styling */}
      {stop.type === "start" && (
        <div
          className="absolute bottom-1 text-xs font-black tracking-widest"
          style={{ color: "#22c55e", fontFamily: "monospace" }}
        >
          ▶ START
        </div>
      )}
    </motion.div>
  );
}

// Connector between squares on same row
function Connector({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: 0,
        height: 90,
        borderLeft: `2.5px ${active ? "solid" : "dashed"} #1a1a1a`,
        opacity: 0.5,
        flexShrink: 0,
      }}
    />
  );
}

export default function JourneyMap() {
  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    const sectionIds = ["hero", "intern", "workforce", "langgraph", "mcp", "a2a", "roi"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (stop: Stop) => {
    if (!stop.href) return;
    const el = document.querySelector(stop.href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Dark grid bg */}
      <div className="absolute inset-0 bg-[#050814]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-4">
            <span className="text-gray-400 text-xs font-medium tracking-widest uppercase">Your Journey</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
            The Evolution Map
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Seven stops. From a research paper to a virtual trading floor. Click any square to jump ahead.
          </p>
        </motion.div>

        {/* Board game track */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Row 1: left → right */}
          <div className="flex items-stretch justify-center" style={{ gap: 0 }}>
            {ROW1.map((stop, i) => (
              <div key={stop.id} className="flex items-stretch">
                <Square
                  stop={stop}
                  isActive={activeId === stop.id || (stop.type === "start" && activeId === "hero")}
                  onClick={() => scrollTo(stop)}
                />
                {i < ROW1.length - 1 && <Connector active={false} />}
              </div>
            ))}
            {/* Corner right */}
            <div className="flex flex-col" style={{ width: 60 }}>
              <div style={{ flex: 1 }} />
              <div
                style={{
                  width: 60,
                  height: 90,
                  borderTop: "2.5px solid #1a1a1a",
                  borderRight: "2.5px solid #1a1a1a",
                  borderTopRightRadius: 50,
                  background: "#E8DCC8",
                }}
              />
            </div>
          </div>

          {/* Vertical connector on right */}
          <div className="flex justify-end pr-0" style={{ marginRight: 0 }}>
            <div
              style={{
                width: 60,
                height: 32,
                borderRight: "2.5px solid #1a1a1a",
                background: "transparent",
              }}
            />
          </div>

          {/* Row 2: right → left (visually reversed) */}
          <div className="flex items-stretch justify-center flex-row-reverse" style={{ gap: 0 }}>
            {ROW2.map((stop, i) => (
              <div key={stop.id} className="flex items-stretch">
                <Square
                  stop={stop}
                  isActive={activeId === stop.id}
                  onClick={() => scrollTo(stop)}
                />
                {i < ROW2.length - 1 && <Connector active={false} />}
              </div>
            ))}
            {/* Corner left */}
            <div className="flex flex-col" style={{ width: 60 }}>
              <div
                style={{
                  width: 60,
                  height: 90,
                  borderBottom: "2.5px solid #1a1a1a",
                  borderLeft: "2.5px solid #1a1a1a",
                  borderBottomLeftRadius: 50,
                  background: "#E8DCC8",
                }}
              />
              <div style={{ flex: 1 }} />
            </div>
          </div>

          {/* Direction arrows overlay */}
          <div className="absolute top-2 left-1/4 text-gray-600 text-xs font-mono pointer-events-none select-none">
            ——→
          </div>
          <div className="absolute bottom-2 right-1/4 text-gray-600 text-xs font-mono pointer-events-none select-none">
            ←——
          </div>
        </motion.div>

        {/* Current section label */}
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-10"
        >
          {(() => {
            const s = STOPS.find(s => s.id === activeId || (s.id === "hero" && activeId === "hero"));
            if (!s) return null;
            return (
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}40` }}
              >
                <span>{s.icon}</span>
                Currently viewing: {s.label}
              </span>
            );
          })()}
        </motion.div>
      </div>
    </section>
  );
}
