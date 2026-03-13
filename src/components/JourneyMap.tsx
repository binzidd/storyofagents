"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STOPS = [
  {
    id: "intern",
    number: "01",
    label: "Tool Calling",
    sublabel: "From Conversation to Action",
    icon: "🤖",
    color: "#8b5cf6",
    description: "AI moves beyond answering questions. It reaches into our GL, our Bloomberg terminal, our compliance engine. In plain English.",
  },
  {
    id: "workforce",
    number: "02",
    label: "Agent Architecture",
    sublabel: "Flow vs. Function Agents",
    icon: "🔄",
    color: "#10b981",
    description: "The architecture we choose determines whether AI is a reliable processor or an autonomous problem-solver. Both have a role.",
  },
  {
    id: "langgraph",
    number: "03",
    label: "LangGraph",
    sublabel: "Orchestrated Workflows",
    icon: "🕸",
    color: "#f59e0b",
    description: "Graph-based orchestration with conditional routing, parallel execution, and human-in-the-loop checkpoints. Month-end in 2 days, not 7.",
  },
  {
    id: "mcp",
    number: "04",
    label: "Model Context Protocol",
    sublabel: "Universal Enterprise Connector",
    icon: "🔗",
    color: "#06b6d4",
    description: "One open standard replaces 15 point integrations. Secure, permissioned access to every data source, with a full audit trail.",
  },
  {
    id: "a2a",
    number: "05",
    label: "Agent-to-Agent",
    sublabel: "The Virtual Firm",
    icon: "🌐",
    color: "#8b5cf6",
    description: "Specialised agents that challenge each other, negotiate constraints, and reach consensus. Our best committee. At machine speed.",
  },
  {
    id: "roi",
    number: "06",
    label: "LLM Observability",
    sublabel: "Trust Through Visibility",
    icon: "🔭",
    color: "#6366f1",
    description: "Trace monitoring, LLM-as-judge evaluation, guardrails. In financial services, we cannot deploy what we cannot audit.",
  },
  {
    id: "future",
    number: "→",
    label: "The Competitive Edge",
    sublabel: "What Early Movers Are Building",
    icon: "✨",
    color: "#f59e0b",
    description: "Agentic finance is not a 2027 roadmap item. The firms pulling ahead are building the infrastructure for it today.",
  },
];

export default function JourneyMap() {
  const [activeId, setActiveId] = useState("intern");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const sectionIds = STOPS.filter(s => s.id !== "future").map(s => s.id);
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeIdx = STOPS.findIndex(s => s.id === activeId);

  return (
    <section id="journey" className="relative py-20 bg-[#F3F2EF] overflow-hidden scroll-mt-16">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-0 left-0 right-0 section-divider" />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300 bg-white mb-5">
            <span className="text-gray-500 text-xs font-semibold tracking-widest uppercase">Agenda</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
            Six Capabilities.<br />One Strategic Briefing.
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mb-8">
            From tool-augmented AI to autonomous agent networks, each chapter builds on the last.
            Click any stop to navigate, or scroll to explore.
          </p>

          {/* Journey progress arrow */}
          <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay:0.3 }}
            className="flex items-center justify-center gap-1.5 flex-wrap">
            {[
              { label:"Chat AI",          icon:"💬", color:"#64748b" },
              { label:"Tool Use",         icon:"🔧", color:"#8b5cf6" },
              { label:"Agent Networks",   icon:"🤖", color:"#10b981" },
              { label:"Orchestration",    icon:"🕸", color:"#f59e0b" },
              { label:"AI Finance",       icon:"🏦", color:"#3b82f6" },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium"
                  style={{ color: step.color }}>
                  <span>{step.icon}</span>
                  <span className="text-gray-700">{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-gray-300 text-sm font-bold">›</span>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Vertical timeline */}
        <div className="relative pl-16">

          {/* The vertical line */}
          <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gray-200" />

          {/* Progress fill */}
          <motion.div
            className="absolute left-6 top-3 w-0.5 origin-top bg-gradient-to-b from-blue-500 via-violet-500 to-emerald-500"
            style={{
              height: activeIdx <= 0
                ? "0%"
                : `${(activeIdx / (STOPS.length - 1)) * 100}%`,
              transition: "height 0.6s ease",
            }}
          />

          {/* Stops */}
          <div className="space-y-0">
            {STOPS.map((stop, i) => {
              const isActive   = stop.id === activeId;
              const isPast     = i <= activeIdx;
              const isExpanded = expandedId === stop.id;
              const isFuture   = stop.id === "future";

              return (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="relative flex items-start gap-6 group pb-8 last:pb-0"
                >
                  {/* Dot on the timeline */}
                  <div className="absolute left-[18px] -translate-x-1/2 mt-3 flex items-center justify-center flex-shrink-0 z-10">
                    {isActive ? (
                      <motion.div className="relative flex items-center justify-center">
                        <motion.div
                          className="absolute rounded-full"
                          style={{ background: `${stop.color}30` }}
                          animate={{ width: 28, height: 28, opacity: [0.4, 0, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-md relative z-10"
                          style={{ background: stop.color }}
                        />
                      </motion.div>
                    ) : (
                      <div
                        className="w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-300 group-hover:scale-125"
                        style={{
                          background: isPast ? stop.color : "#E5E7EB",
                          borderColor: isPast ? stop.color : "#D1D5DB",
                        }}
                      />
                    )}
                  </div>

                  {/* Horizontal connector */}
                  <div
                    className="absolute left-6 mt-4 h-px transition-all duration-300"
                    style={{
                      width: "28px",
                      background: isPast ? `${stop.color}60` : "#E5E7EB",
                    }}
                  />

                  {/* Content card */}
                  <div className="ml-6 flex-1">
                    <motion.button
                      onClick={() => {
                        if (!isFuture) scrollTo(stop.id);
                        setExpandedId(isExpanded ? null : stop.id);
                      }}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full text-left rounded-2xl p-4 border transition-all duration-200 ${
                        isActive
                          ? "border-2 shadow-md"
                          : "border bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                      style={isActive ? {
                        borderColor: stop.color,
                        background: `${stop.color}08`,
                        boxShadow: `0 4px 16px ${stop.color}20`,
                      } : {}}
                    >
                      <div className="flex items-center gap-3">
                        {/* Number badge */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 transition-all"
                          style={{
                            background: isActive || isPast ? `${stop.color}15` : "#F3F4F6",
                            color: isActive || isPast ? stop.color : "#9CA3AF",
                            border: `1.5px solid ${isActive || isPast ? `${stop.color}30` : "#E5E7EB"}`,
                          }}
                        >
                          {isFuture ? "✨" : stop.number}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-bold text-sm ${isActive ? "text-gray-900" : "text-gray-700"}`}>
                              {stop.label}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: isActive ? `${stop.color}15` : "#F3F4F6",
                                color: isActive ? stop.color : "#9CA3AF",
                              }}>
                              {stop.sublabel}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                            {stop.description}
                          </div>
                        </div>

                        {/* Icon */}
                        <div className="text-xl flex-shrink-0">{stop.icon}</div>

                        {/* Active indicator */}
                        {isActive && (
                          <div
                            className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={{ background: `${stop.color}15`, color: stop.color }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: stop.color }} />
                            Now
                          </div>
                        )}
                      </div>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t flex items-center justify-between"
                              style={{ borderColor: `${stop.color}20` }}>
                              <span className="text-xs text-gray-500">
                                {isFuture ? "The next wave is already building." : `Click to jump to this section →`}
                              </span>
                              {!isFuture && (
                                <span className="text-xs font-semibold" style={{ color: stop.color }}>
                                  Jump ↓
                                </span>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Active section callout */}
        <motion.div key={activeId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-10 text-center">
          {(() => {
            const s = STOPS.find(s => s.id === activeId);
            if (!s) return null;
            return (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
                <span>{s.icon}</span>
                Now viewing: {s.label}
              </span>
            );
          })()}
        </motion.div>
      </div>
    </section>
  );
}
