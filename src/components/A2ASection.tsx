"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

interface Msg {
  from: string; to: string; text: string;
  color: string; icon: string; delay: number;
  type: "proposal" | "challenge" | "approval" | "log" | "final";
}

const MESSAGES: Msg[] = [
  { from:"Quant Agent",      to:"All",         text:"Recommending A$75M AUD/USD short at 0.6318 spot. RBA held rates. USD momentum: +2.1\u03c3. Macro regime supports USD strength. Risk/reward: 1:2.9. Holding period: 3-5 days.",       color:"#3b82f6", icon:"📊", delay:0,    type:"proposal"  },
  { from:"Risk Agent",       to:"Quant Agent", text:"Flagging: this position consumes 52% of remaining daily VaR budget. Current AUD short book already A$120M notional. Aggregate exposure breaches single-currency concentration limit.",   color:"#ef4444", icon:"🔴", delay:1400, type:"challenge" },
  { from:"Quant Agent",      to:"Risk Agent",  text:"Acknowledged. Revised proposal: A$45M notional. VaR consumption drops to 31%. Signal integrity maintained at reduced size. Recommending proceeding.",                                   color:"#3b82f6", icon:"📊", delay:2800, type:"proposal"  },
  { from:"Compliance Agent", to:"All",         text:"ASIC position limits reviewed. A$45M AUD/USD within approved mandate. No restricted counterparties. Client suitability confirmed. Approved with standard T+1 reporting.",               color:"#f59e0b", icon:"⚖️", delay:4200, type:"approval"  },
  { from:"Audit Agent",      to:"System",      text:"Decision logged: Trade #FX-2026-1103. Full deliberation chain recorded: initial proposal, risk challenge, size revision, compliance sign-off. APRA audit trail: complete.",            color:"#8b5cf6", icon:"📋", delay:5400, type:"log"       },
  { from:"Execution Agent",  to:"All",         text:"Executing A$45M AUD/USD short at 0.6316 (2bp slippage, within tolerance). Confirmation: EXEC-20260313-0147. P&L attribution and position limits updated in real time.",               color:"#10b981", icon:"⚡", delay:6600, type:"final"     },
];

const AGENTS = [
  { id:"quant",      label:"Quant Agent",     icon:"📊", color:"#3b82f6", role:"Identifies signals and strategies" },
  { id:"risk",       label:"Risk Agent",       icon:"🔴", color:"#ef4444", role:"Challenges exposure and limits"   },
  { id:"compliance", label:"Compliance Agent", icon:"⚖️", color:"#f59e0b", role:"Enforces rules and mandates"      },
  { id:"audit",      label:"Audit Agent",      icon:"📋", color:"#8b5cf6", role:"Records all decisions"            },
  { id:"execution",  label:"Execution Agent",  icon:"⚡", color:"#10b981", role:"Executes and confirms"            },
];

const TYPE_COLORS: Record<string, { bg: string; border: string }> = {
  proposal:  { bg:"#3b82f610", border:"#3b82f630" },
  challenge: { bg:"#ef444410", border:"#ef444430" },
  approval:  { bg:"#10b98110", border:"#10b98130" },
  log:       { bg:"#8b5cf610", border:"#8b5cf630" },
  final:     { bg:"#10b98115", border:"#10b98150" },
};

export default function A2ASection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  const [running, setRunning] = useState(false);
  const [visible, setVisible] = useState<number[]>([]);
  const [done, setDone]       = useState(false);

  const run = () => {
    if (running) return;
    setRunning(true); setVisible([]); setDone(false);
    MESSAGES.forEach((msg, i) => {
      setTimeout(() => {
        setVisible(prev => [...prev, i]);
        if (i === MESSAGES.length - 1) { setRunning(false); setDone(true); }
      }, msg.delay + 300);
    });
  };

  const reset = () => { setVisible([]); setRunning(false); setDone(false); };

  return (
    <section id="a2a" ref={ref} className="relative min-h-screen py-28 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
      <div className="absolute top-0 left-0 w-2/5 h-full bg-gradient-to-r from-violet-50 to-transparent pointer-events-none" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-200 bg-violet-50 mb-6">
            <span className="text-violet-600 text-xs font-semibold tracking-widest uppercase">Phase 05 · Agent-to-Agent</span>
          </motion.div>
          <motion.h2 initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.8 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Our best risk committee.<br /><span className="text-violet-600">Available 24/7.</span>
          </motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.2 }}
            className="text-xl text-gray-500 max-w-3xl mx-auto">
            Specialised agents challenge each other&apos;s assumptions, stress-test constraints,
            and reach defensible consensus. Decisions that would take a committee hours happen in seconds,
            with a complete audit trail.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left panel */}
          <div className="lg:col-span-4 space-y-5">

            {/* Agent roster */}
            <div className="light-card rounded-2xl p-5">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">The Virtual Team</div>
              <div className="space-y-2">
                {AGENTS.map(agent => {
                  const isActive = visible.some(idx =>
                    MESSAGES[idx]?.from.toLowerCase().includes(agent.id) ||
                    MESSAGES[idx]?.to.toLowerCase().includes(agent.id)
                  );
                  return (
                    <motion.div key={agent.id}
                      animate={{ background: isActive ? `${agent.color}08` : "transparent" }}
                      className="flex items-center gap-3 p-2.5 rounded-xl border transition-all"
                      style={{ borderColor: isActive ? `${agent.color}30` : "transparent" }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background:`${agent.color}15`, border:`1.5px solid ${agent.color}30` }}>
                        {agent.icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{agent.label}</div>
                        <div className="text-xs text-gray-500">{agent.role}</div>
                      </div>
                      {isActive && (
                        <motion.div animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:1.5, repeat:Infinity }}
                          className="ml-auto w-2 h-2 rounded-full flex-shrink-0" style={{ background:agent.color }} />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Scenario trigger */}
            <div className="light-card rounded-2xl p-5">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Scenario</div>
              <div className="text-sm font-semibold text-gray-900 mb-1">AUD/USD Trade Decision</div>
              <div className="text-xs text-gray-500 mb-4">A$75M position proposal. Quant triggers agent council</div>
              <motion.button onClick={running ? undefined : run}
                whileHover={!running?{scale:1.02}:{}} whileTap={!running?{scale:0.97}:{}}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  running ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
                  done    ? "bg-emerald-600 text-white hover:bg-emerald-700" :
                            "bg-violet-600 text-white hover:bg-violet-700 shadow-md"
                }`}>
                {running ? "Agents deliberating..." : done ? "▶ Run Again" : "▶ Run Scenario"}
              </motion.button>
              {done && (
                <button onClick={reset} className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Chat feed */}
          <div className="lg:col-span-8">
            <div className="light-card rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Agent Council · FX Trade Decision</div>
                  <div className="text-xs text-gray-500 mt-0.5">Quant recommends A$75M AUD/USD short at 0.6318 spot</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${running?"bg-amber-500 animate-pulse":done?"bg-emerald-500":"bg-gray-300"}`} />
                  <span className="text-xs text-gray-500 font-mono">{running?"live":done?"complete":"ready"}</span>
                </div>
              </div>

              <div className="p-5 min-h-[420px] space-y-3">
                {visible.length === 0 && !running && (
                  <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                    Click <span className="mx-1 font-semibold text-violet-600">Run Scenario</span> to watch the agent council deliberate
                  </div>
                )}
                <AnimatePresence>
                  {visible.map(idx => {
                    const msg = MESSAGES[idx];
                    const c   = TYPE_COLORS[msg.type] ?? { bg:"#f3f4f6", border:"#e5e7eb" };
                    return (
                      <motion.div key={idx}
                        initial={{ opacity:0, y:10, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
                        transition={{ duration:0.3 }}
                        className="rounded-xl p-4"
                        style={{ background:c.bg, border:`1px solid ${c.border}` }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                            style={{ background:`${msg.color}15`, border:`1px solid ${msg.color}30` }}>
                            {msg.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-bold" style={{ color:msg.color }}>{msg.from}</span>
                              <span className="text-xs text-gray-400">to</span>
                              <span className="text-xs text-gray-500">{msg.to}</span>
                              <span className="text-xs px-1.5 py-0.5 rounded-full font-medium capitalize"
                                style={{ color:msg.color, background:`${msg.color}10`, border:`1px solid ${msg.color}20` }}>
                                {msg.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{msg.text}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {running && visible.length < MESSAGES.length && (
                  <div className="flex items-center gap-2 px-2">
                    {[0,1,2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400"
                        animate={{ opacity:[0.3,1,0.3], scale:[0.8,1.2,0.8] }}
                        transition={{ duration:1.2, repeat:Infinity, delay:i*0.2 }} />
                    ))}
                    <span className="text-xs text-gray-400">Agents deliberating...</span>
                  </div>
                )}

                {done && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    className="rounded-xl p-3 bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                    <span className="text-emerald-600 text-sm font-semibold">Scenario complete</span>
                    <span className="text-gray-500 text-xs">· {MESSAGES.length} interactions · full audit trail logged · APRA compliant</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
