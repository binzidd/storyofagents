"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const DATA_SOURCES = [
  { id: "warehouse", label: "Group Warehouse", icon: "🏛️", color: "#0066b3", adapter: "Snowflake API"     },
  { id: "apra",      label: "APRA Data",       icon: "📡", color: "#f59e0b", adapter: "APRA REST API"    },
  { id: "teams",     label: "MS Teams",         icon: "💬", color: "#6264a7", adapter: "Graph API / OAuth2"},
  { id: "risk",      label: "Risk Database",    icon: "🔴", color: "#ef4444", adapter: "JDBC / ODBC"      },
  { id: "docs",      label: "Compliance Docs",  icon: "📋", color: "#8b5cf6", adapter: "SharePoint API"   },
];

const STEPS = [
  { id: "problem",  title: "The Problem",        mode: "chaos" as const, desc: "Every new AI agent needs custom integrations. 5 sources × 3 agents = 15 bespoke connectors. Each with its own auth, error handling, and rate limits. A maintenance nightmare." },
  { id: "standard", title: "One Standard",       mode: "mcp"   as const, desc: "MCP defines a single interface. Build one MCP server per data source. Every AI agent speaks the same language. No custom code per pairing." },
  { id: "security", title: "Secure by Design",   mode: "mcp"   as const, desc: "AI agents never touch raw credentials or direct DB connections. Every read is permissioned, logged, and auditable. MCP is the secure proxy layer." },
  { id: "scale",    title: "Scale Effortlessly", mode: "mcp"   as const, desc: "New source? One MCP server. All agents get it instantly. New agent? Connects to all existing MCP servers immediately. Compounding network effect." },
];

// ─── MCP Live Demo ────────────────────────────────────────────────────────────

function MCPDemo() {
  const [phase, setPhase]     = useState(0);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    if (playing) return;
    setPlaying(true);
    setPhase(0);
    [700, 2300, 4000, 5800, 7600].forEach((d, i) =>
      setTimeout(() => setPhase(i + 1), d)
    );
    setTimeout(() => setPlaying(false), 8600);
  };

  const reset = () => { setPhase(0); setPlaying(false); };

  return (
    <div className="light-card rounded-2xl overflow-hidden">
      {/* Mac-style header */}
      <div className="px-5 py-3.5 bg-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-xs font-mono ml-2">MCP Protocol · Live Request</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${playing ? "bg-amber-400 animate-pulse" : phase >= 5 ? "bg-emerald-400" : "bg-gray-500"}`} />
          <span className={`text-xs font-mono ${playing ? "text-amber-400" : phase >= 5 ? "text-emerald-400" : "text-gray-500"}`}>
            {playing ? "routing" : phase >= 5 ? "complete" : "ready"}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-3 min-h-[380px]">
        {phase === 0 && !playing && (
          <div className="flex items-center justify-center h-52 text-gray-400 text-sm">
            Click <span className="mx-1 font-semibold text-cyan-600">Run Demo</span> to see MCP routing in action
          </div>
        )}

        <AnimatePresence>
          {/* Step 1 — Agent sends request */}
          {phase >= 1 && (
            <motion.div key="req" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
              <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                <div className="text-xs text-blue-500 font-semibold mb-0.5">Analysis Agent → MCP Router</div>
                <div className="text-sm text-gray-800">Fetch APRA regulatory submissions for Q3 2025</div>
              </div>
            </motion.div>
          )}

          {/* Step 2 — MCP routing + permission check */}
          {phase >= 2 && (
            <motion.div key="route" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-sm flex-shrink-0">🔗</div>
              <div className="flex-1 bg-cyan-50 border border-cyan-200 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                <div className="text-xs text-cyan-600 font-semibold mb-1">MCP Router · Resolving</div>
                <div className="text-xs text-gray-600 font-mono space-y-0.5">
                  <div>Resolved → <span className="text-cyan-700 font-bold">apra-data-mcp-server</span></div>
                  <div>Checking permissions: Analysis Agent <span className="text-emerald-600">✓</span></div>
                  <div className="text-gray-400">No credentials exposed to agent</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3 — MCP Server fetches */}
          {phase >= 3 && (
            <motion.div key="fetch" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl overflow-hidden border border-amber-200">
              <div className="bg-gray-900 px-3 py-2 flex items-center justify-between">
                <span className="text-amber-400 text-xs font-mono font-bold">📡 APRA Data · MCP Server</span>
                <span className="text-gray-500 text-xs font-mono">permissioned read</span>
              </div>
              <div className="bg-[#1e1e2e] p-3.5 font-mono text-xs leading-relaxed whitespace-pre">
                <span className="text-gray-500"># MCP Server handles auth + fetch{"\n"}</span>
                <span className="text-amber-400">apra_server</span><span className="text-white">.fetch({"\n"}</span>
                <span className="text-white">  </span><span className="text-blue-300">dataset</span><span className="text-white"> = </span><span className="text-green-400">&quot;regulatory_submissions&quot;</span><span className="text-white">,{"\n"}</span>
                <span className="text-white">  </span><span className="text-blue-300">period</span><span className="text-white">  = </span><span className="text-green-400">&quot;Q3-2025&quot;</span><span className="text-white">,{"\n"}</span>
                <span className="text-white">  </span><span className="text-blue-300">entity</span><span className="text-white">  = </span><span className="text-green-400">&quot;CBA Group&quot;</span><span className="text-white">{"\n"}</span>
                <span className="text-white">){"\n"}</span>
                <span className="text-emerald-400"># ✓ Fetched 847 records in 0.3s</span>
              </div>
            </motion.div>
          )}

          {/* Processing indicator */}
          {playing && phase >= 1 && phase < 5 && (
            <motion.div key={`dots-${phase}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-2">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} />
              ))}
              <span className="text-xs text-gray-400 ml-0.5">Routing through MCP...</span>
            </motion.div>
          )}

          {/* Step 4 — structured data returned */}
          {phase >= 4 && (
            <motion.div key="data" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-emerald-200 overflow-hidden">
              <div className="bg-emerald-50 px-3 py-2 flex items-center gap-2 border-b border-emerald-100">
                <span className="text-emerald-600 text-xs font-mono font-bold">✓ MCP Response</span>
                <span className="text-emerald-500 text-xs">847 records · fully permissioned</span>
              </div>
              <div className="bg-white px-3 py-2 space-y-1">
                {[
                  { field: "entity",  value: "CBA Group",            type: "string" },
                  { field: "period",  value: "Q3-2025",               type: "date"   },
                  { field: "records", value: "847 submissions",        type: "array"  },
                  { field: "status",  value: "compliant",              type: "enum"   },
                ].map((row, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 last:border-0">
                    <span className="font-mono text-cyan-700">{row.field}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">{row.value}</span>
                      <span className="text-gray-400 font-mono text-[10px] bg-gray-100 px-1 py-0.5 rounded">{row.type}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5 — agent confirms */}
          {phase >= 5 && (
            <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                <div className="text-xs text-cyan-600 font-semibold mb-0.5">Analysis Agent · Data Ready</div>
                <div className="text-sm text-gray-800 leading-relaxed">
                  Retrieved <strong>847 APRA regulatory submissions</strong> for Q3 2025.
                  No credentials stored. Full audit trail logged. Ready to analyse.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
        <div className="text-xs text-gray-400">zero credential exposure · every request logged</div>
        <div className="flex items-center gap-2">
          {phase > 0 && !playing && (
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Reset</button>
          )}
          <motion.button onClick={playing ? undefined : play}
            whileHover={!playing ? { scale: 1.02 } : {}}
            whileTap={!playing ? { scale: 0.97 } : {}}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              playing      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : phase >= 5 ? "bg-emerald-600 text-white hover:bg-emerald-700"
                           : "bg-cyan-600 text-white hover:bg-cyan-700"
            }`}>
            {playing ? "Routing..." : phase >= 5 ? "▶ Run Again" : "▶ Run Demo"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MCPSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  const [viewMode, setViewMode]         = useState<"chaos"|"mcp">("chaos");
  const [activeStep, setActiveStep]     = useState(0);
  const [activeSource, setActiveSource] = useState<string|null>(null);
  const [standardAnimated, setStandardAnimated] = useState(false);

  const AI_AGENTS = [
    { label: "Analysis Agent", color: "#3b82f6" },
    { label: "Report Agent",   color: "#10b981" },
    { label: "Alert Agent",    color: "#8b5cf6" },
  ];

  return (
    <section id="mcp" ref={ref} className="relative min-h-screen py-28 bg-[#F3F2EF] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-0 left-0 right-0 section-divider" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-300 bg-cyan-50 mb-6">
            <span className="text-cyan-700 text-xs font-semibold tracking-widest uppercase">Phase 03 · MCP Protocol</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            15 point-to-point integrations<br />
            <span className="relative inline-block cursor-pointer" onClick={() => setStandardAnimated(!standardAnimated)}>
              <span className="text-cyan-600">replaced by one standard.</span>
              <motion.span initial={{ scaleX: 0 }} animate={standardAnimated ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
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

        {/* Two-column: visualiser left, demo right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-12">

          {/* Left — toggle + visualiser + step cards */}
          <div className="space-y-6">
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

            {/* Visualiser */}
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
                    <div className="absolute top-0 left-0 right-0 flex justify-around">
                      {AI_AGENTS.map(a => (
                        <div key={a.label} className="rounded-xl px-3 py-1.5 text-xs font-semibold"
                          style={{ background: `${a.color}15`, border: `1.5px solid ${a.color}40`, color: a.color }}>
                          🤖 {a.label}
                        </div>
                      ))}
                    </div>
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
                    <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                      {DATA_SOURCES.map(src => (
                        <motion.button key={src.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                          onClick={() => setActiveSource(activeSource === src.id ? null : src.id)}
                          className="rounded-xl p-2 text-center transition-all"
                          style={{
                            background: activeSource === src.id ? `${src.color}20` : "#F9F8F5",
                            border: `2px solid ${activeSource === src.id ? src.color : "#E5E7EB"}`,
                            minWidth: 64,
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        animate={{ boxShadow: ["0 0 20px #06b6d440","0 0 40px #06b6d480","0 0 20px #06b6d440"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
                        style={{ background: "linear-gradient(135deg,#06b6d420,#3b82f620)", border: "2.5px solid #06b6d4" }}>
                        <div className="text-xl">🔗</div>
                        <div className="text-xs font-black text-cyan-600">MCP</div>
                      </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                      {DATA_SOURCES.map(src => (
                        <motion.button key={src.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                          onClick={() => setActiveSource(activeSource === src.id ? null : src.id)}
                          className="rounded-xl p-2 text-center transition-all"
                          style={{
                            background: activeSource === src.id ? `${src.color}15` : "white",
                            border: `2px solid ${activeSource === src.id ? src.color : "#E5E7EB"}`,
                            boxShadow: activeSource === src.id ? `0 0 12px ${src.color}30` : "0 1px 3px rgba(0,0,0,0.06)",
                            minWidth: 64,
                          }}>
                          <div className="text-lg">{src.icon}</div>
                          <div className="text-xs text-gray-600 font-medium leading-tight">{src.label}</div>
                          {activeSource === src.id && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              className="text-xs mt-1 px-1 py-0.5 rounded-full"
                              style={{ color: src.color, background: `${src.color}15`, border: `1px solid ${src.color}30` }}>
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

            {/* Step-through cards */}
            <div className="grid grid-cols-2 gap-3">
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
                    0{i + 1}
                  </div>
                  <div className="text-sm font-semibold leading-tight">{step.title}</div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeStep}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="light-card rounded-xl p-5 border-l-4 border-cyan-500">
                <div className="font-semibold text-gray-900 mb-2">{STEPS[activeStep].title}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{STEPS[activeStep].desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — live MCP demo */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Live walkthrough</div>
            <MCPDemo />
          </motion.div>
        </div>

        {/* Summary grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          {[
            { before: "15 custom connectors",       after: "5 MCP servers (one per source)", icon: "⚡" },
            { before: "Raw DB credentials in AI",   after: "Permissioned, auditable reads",  icon: "🔒" },
            { before: "Months to add a new source", after: "Days, via one MCP server",        icon: "📅" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="light-card rounded-xl p-4">
              <div className="text-2xl mb-3">{item.icon}</div>
              <div className="text-xs text-red-500 line-through mb-1">{item.before}</div>
              <div className="text-sm font-semibold text-emerald-700">{item.after}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
