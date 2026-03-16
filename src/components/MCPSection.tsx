"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

const DATA_SOURCES = [
  { id: "sap",       label: "SAP ERP",        icon: "⚙️", color: "#0066b3", adapter: "SAP BAPI / RFC"  },
  { id: "bloomberg", label: "Bloomberg Feed",  icon: "📡", color: "#f59e0b", adapter: "BLPAPI v3.x"    },
  { id: "crm",       label: "Salesforce CRM",  icon: "☁️", color: "#00a1e0", adapter: "REST + OAuth2"  },
  { id: "risk",      label: "Risk Database",   icon: "🔴", color: "#ef4444", adapter: "JDBC / ODBC"    },
  { id: "docs",      label: "Compliance Docs", icon: "📋", color: "#8b5cf6", adapter: "SharePoint API" },
];

const STEPS = [
  { id: "problem",   title: "The Problem",       mode: "chaos" as const, desc: "Every new AI agent needs custom integrations. 5 sources × 3 agents = 15 bespoke connectors. Each with its own auth, error handling, and rate limits. A maintenance nightmare." },
  { id: "standard",  title: "One Standard",      mode: "mcp"   as const, desc: "MCP defines a single interface. Build one MCP server per data source. Every AI agent speaks the same language. No custom code per pairing." },
  { id: "security",  title: "Secure by Design",  mode: "mcp"   as const, desc: "AI agents never touch raw credentials or direct DB connections. Every read is permissioned, logged, and auditable. MCP is the secure proxy layer." },
  { id: "scale",     title: "Scale Effortlessly", mode: "mcp"  as const, desc: "New source? One MCP server. All agents get it instantly. New agent? Connects to all existing MCP servers immediately. Compounding network effect." },
];

export default function MCPSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-15%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  const [viewMode, setViewMode]     = useState<"chaos"|"mcp">("chaos");
  const [activeStep, setActiveStep] = useState(0);
  const [activeSource, setActiveSource] = useState<string|null>(null);
  const [standardAnimated, setStandardAnimated] = useState(false);

  const AI_AGENTS = [
    { label: "Analysis Agent", color: "#3b82f6" },
    { label: "Report Agent",   color: "#10b981" },
    { label: "Alert Agent",    color: "#8b5cf6" },
  ];

  // suppress unused warning — isInView used for future enhancements
  void isInView;

  return (
    <section id="mcp" ref={ref} className="relative min-h-screen py-28 bg-[#F3F2EF] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-0 left-0 right-0 section-divider" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-300 bg-cyan-50 mb-6">
            <span className="text-cyan-700 text-xs font-semibold tracking-widest uppercase">Phase 05 · MCP Protocol</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            15 point-to-point integrations<br />
            <span className="relative inline-block cursor-pointer" onClick={() => setStandardAnimated(!standardAnimated)}>
              <span className="text-cyan-600">replaced by one standard.</span>
              <motion.span initial={{ scaleX:0 }} animate={standardAnimated ? { scaleX:1 } : { scaleX:0 }}
                transition={{ duration:0.8, ease:"easeOut" }}
                className="absolute bottom-1 left-0 h-[4px] bg-cyan-500 rounded-full origin-left block" />
            </span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 max-w-3xl mx-auto">
            Every new AI agent used to require bespoke engineering for every data source.
            Model Context Protocol ended that. One open standard, secure, permissioned, and auditable,
            <strong className="text-gray-800"> connects every enterprise system to every AI agent.</strong>
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 gap-1">
              <button onClick={() => { setViewMode("chaos"); setActiveSource(null); }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === "chaos" ? "bg-red-500 text-white shadow" : "text-gray-500 hover:text-gray-700"
                }`}>😤 Without MCP</button>
              <button onClick={() => { setViewMode("mcp"); setActiveSource(null); }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === "mcp" ? "bg-cyan-500 text-white shadow" : "text-gray-500 hover:text-gray-700"
                }`}>✨ With MCP</button>
            </div>
          </div>

          {/* Visual */}
          <div className="light-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className={`w-2 h-2 rounded-full animate-pulse ${viewMode === "chaos" ? "bg-red-500" : "bg-cyan-500"}`} />
              <span className="text-sm font-semibold text-gray-700">
                {viewMode === "chaos"
                  ? "15 custom connectors: click a source to see its adapter"
                  : "Click any data source to see how MCP connects it"}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === "chaos" ? (
                <motion.div key="chaos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="relative h-64">
                  {/* AI agents row */}
                  <div className="absolute top-0 left-0 right-0 flex justify-around">
                    {AI_AGENTS.map(a => (
                      <div key={a.label} className="rounded-xl px-3 py-1.5 text-xs font-semibold"
                        style={{ background: `${a.color}15`, border: `1.5px solid ${a.color}40`, color: a.color }}>
                        🤖 {a.label}
                      </div>
                    ))}
                  </div>
                  {/* Messy lines via SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {DATA_SOURCES.map((src, si) =>
                      AI_AGENTS.map((_, ai) => {
                        const x1 = (si / (DATA_SOURCES.length - 1)) * 80 + 10;
                        const x2 = (ai / (AI_AGENTS.length - 1)) * 80 + 10;
                        return (
                          <line key={`${si}-${ai}`}
                            x1={`${x1}%`} y1="85%" x2={`${x2}%`} y2="12%"
                            stroke={activeSource === src.id ? src.color : "#ef4444"}
                            strokeWidth={activeSource === src.id ? 2 : 1}
                            strokeOpacity={activeSource === src.id ? 0.8 : 0.15}
                            strokeDasharray="3 2"
                          />
                        );
                      })
                    )}
                  </svg>
                  {/* Data sources row */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                    {DATA_SOURCES.map(src => (
                      <motion.button key={src.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveSource(activeSource === src.id ? null : src.id)}
                        className="rounded-xl p-2 text-center transition-all"
                        style={{
                          background: activeSource === src.id ? `${src.color}20` : "#F9F8F5",
                          border: `2px solid ${activeSource === src.id ? src.color : "#E5E7EB"}`,
                          minWidth: 70,
                        }}>
                        <div className="text-lg">{src.icon}</div>
                        <div className="text-xs text-gray-600 font-medium leading-tight">{src.label}</div>
                        {activeSource === src.id && (
                          <div className="text-xs mt-1 font-mono" style={{ color: src.color }}>{src.adapter}</div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-red-50 text-red-500 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                      {DATA_SOURCES.length} × {AI_AGENTS.length} = {DATA_SOURCES.length * AI_AGENTS.length} connectors
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="mcp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="relative h-64">
                  {/* AI agents row */}
                  <div className="absolute top-0 left-0 right-0 flex justify-around">
                    {AI_AGENTS.map(a => (
                      <div key={a.label} className="rounded-xl px-3 py-1.5 text-xs font-semibold"
                        style={{ background: `${a.color}15`, border: `1.5px solid ${a.color}40`, color: a.color }}>
                        🤖 {a.label}
                      </div>
                    ))}
                  </div>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <marker id="arr" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                        <polygon points="0 0,6 2.5,0 5" fill="#06b6d4" />
                      </marker>
                    </defs>
                    {/* Sources → MCP hub */}
                    {DATA_SOURCES.map((src, si) => {
                      const x = (si / (DATA_SOURCES.length - 1)) * 80 + 10;
                      return (
                        <line key={src.id}
                          x1={`${x}%`} y1="85%" x2="50%" y2="55%"
                          stroke={activeSource === src.id ? src.color : "#06b6d4"}
                          strokeWidth={activeSource === src.id ? 2.5 : 1.5}
                          strokeOpacity={activeSource === src.id ? 1 : 0.4}
                          markerEnd="url(#arr)"
                        />
                      );
                    })}
                    {/* AI agents → MCP hub */}
                    {AI_AGENTS.map((_, ai) => {
                      const x = (ai / (AI_AGENTS.length - 1)) * 80 + 10;
                      return (
                        <line key={ai}
                          x1={`${x}%`} y1="15%" x2="50%" y2="42%"
                          stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.5"
                          strokeDasharray="4 2"
                        />
                      );
                    })}
                  </svg>
                  {/* MCP hub */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{ boxShadow: ["0 0 20px #06b6d440","0 0 40px #06b6d480","0 0 20px #06b6d440"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
                      style={{ background:"linear-gradient(135deg,#06b6d420,#3b82f620)", border:"2.5px solid #06b6d4" }}>
                      <div className="text-xl">🔗</div>
                      <div className="text-xs font-black text-cyan-600">MCP</div>
                    </motion.div>
                  </div>
                  {/* Data sources row */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                    {DATA_SOURCES.map(src => (
                      <motion.button key={src.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveSource(activeSource === src.id ? null : src.id)}
                        className="rounded-xl p-2 text-center transition-all"
                        style={{
                          background: activeSource === src.id ? `${src.color}15` : "white",
                          border: `2px solid ${activeSource === src.id ? src.color : "#E5E7EB"}`,
                          boxShadow: activeSource === src.id ? `0 0 12px ${src.color}30` : "0 1px 3px rgba(0,0,0,0.06)",
                          minWidth: 70,
                        }}>
                        <div className="text-lg">{src.icon}</div>
                        <div className="text-xs text-gray-600 font-medium leading-tight">{src.label}</div>
                        {activeSource === src.id && (
                          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                            className="text-xs mt-1 px-1 py-0.5 rounded-full"
                            style={{ color:src.color, background:`${src.color}15`, border:`1px solid ${src.color}30` }}>
                            ✓ MCP Server
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step-through */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STEPS.map((step, i) => (
              <motion.button key={step.id}
                onClick={() => { setActiveStep(i); setViewMode(step.mode); setActiveSource(null); }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className={`rounded-xl p-4 text-left transition-all ${
                  activeStep === i
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-cyan-300"
                }`}>
                <div className={`text-xs font-black mb-1 ${activeStep === i ? "text-cyan-100" : "text-cyan-600"}`}>
                  0{i+1}
                </div>
                <div className="text-sm font-semibold leading-tight">{step.title}</div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeStep}
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
              transition={{ duration: 0.3 }}
              className="light-card rounded-xl p-5 border-l-4 border-cyan-500">
              <div className="font-semibold text-gray-900 mb-2">{STEPS[activeStep].title}</div>
              <p className="text-gray-600 text-sm leading-relaxed">{STEPS[activeStep].desc}</p>
            </motion.div>
          </AnimatePresence>

          {/* Summary grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { before:"15 custom connectors",       after:"5 MCP servers (one per source)", icon:"⚡" },
              { before:"Raw DB credentials in AI",   after:"Permissioned, auditable reads",  icon:"🔒" },
              { before:"Months to add a new source", after:"Days, via one MCP server",        icon:"📅" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i*0.1 }}
                className="light-card rounded-xl p-4">
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className="text-xs text-red-500 line-through mb-1">{item.before}</div>
                <div className="text-sm font-semibold text-emerald-700">{item.after}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
