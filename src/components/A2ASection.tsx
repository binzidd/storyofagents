"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

interface Msg {
  from: string; to: string; text: string;
  color: string; icon: string; delay: number;
  type: "proposal" | "challenge" | "approval" | "log" | "final";
}

const MESSAGES: Msg[] = [
  { from:"Controller Agent", to:"All",               text:"Month-end T+0: Automated reconciliation complete across 847 GL accounts. Preliminary P&L: Revenue A$892M, EBITDA A$241M at 27.0% margin. Three items above variance threshold require review before final journals are posted.",                                               color:"#3b82f6", icon:"🔢", delay:0,    type:"proposal"  },
  { from:"Audit Agent",      to:"Controller Agent",  text:"Challenging: GL-4421 shows A$8.2M credit to Other Income with no supporting schedule. GL-7803 depreciation charge is 34% above prior month without a recorded asset addition. Substantiation required before I can sign off.",                                                   color:"#ef4444", icon:"🔍", delay:1600, type:"challenge" },
  { from:"Controller Agent", to:"Audit Agent",       text:"Substantiated: GL-4421 is a government grant received 13 March — documentation uploaded to audit folder. GL-7803 reflects accelerated depreciation on IT infrastructure per board-approved policy effective Q1 2026. Both items resolved.",                                       color:"#3b82f6", icon:"🔢", delay:3200, type:"proposal"  },
  { from:"CFO Agent",        to:"All",               text:"Revenue A$892M is A$14M below guidance midpoint. EBITDA margin 27.0% vs guidance 28.5%. Variance narrative required: contract renewal delays impacted Q3 top line. Numbers signed off. Reporting Agent to finalise board commentary.",                                           color:"#f59e0b", icon:"🎯", delay:4600, type:"approval"  },
  { from:"Audit Agent",      to:"System",            text:"Sign-off recorded: all 847 accounts reconciled, 3 flagged items resolved with documentation, zero unexplained variances. Board pack cleared for release. AASB 101 and APRA audit trail: complete.",                                                                             color:"#ef4444", icon:"🔍", delay:5800, type:"log"       },
  { from:"Reporting Agent",  to:"All",               text:"Board pack compiled: P&L, balance sheet, cash flow, EBITDA bridge, and revenue variance narrative with CFO commentary. Release: T+2 at 02:14 AEST. Distribution to 11 board members queued. ASIC lodgement checklist: clear.",                                                  color:"#8b5cf6", icon:"📋", delay:7000, type:"final"     },
];

const AGENTS = [
  { id:"controller", label:"Controller Agent", icon:"🔢", color:"#3b82f6", role:"Leads the close and posts journals"    },
  { id:"audit",      label:"Audit Agent",      icon:"🔍", color:"#ef4444", role:"Challenges every material entry"       },
  { id:"cfo",        label:"CFO Agent",        icon:"🎯", color:"#f59e0b", role:"Reviews against guidance and board"    },
  { id:"treasury",   label:"Treasury Agent",   icon:"💰", color:"#10b981", role:"Validates cash and covenants"          },
  { id:"reporting",  label:"Reporting Agent",  icon:"📋", color:"#8b5cf6", role:"Packages the CFO-ready board output"  },
];

const TYPE_COLORS: Record<string, { bg: string; border: string }> = {
  proposal:  { bg:"#3b82f610", border:"#3b82f630" },
  challenge: { bg:"#ef444410", border:"#ef444430" },
  approval:  { bg:"#f59e0b10", border:"#f59e0b30" },
  log:       { bg:"#ef444408", border:"#ef444420" },
  final:     { bg:"#8b5cf610", border:"#8b5cf640" },
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
            Five specialists. Zero meetings.<br /><span className="text-emerald-500">Board pack at T+2.</span>
          </motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.2 }}
            className="text-xl text-gray-500 max-w-3xl mx-auto">
            Specialist agents with defined roles review and challenge each other&apos;s work in real time.
            Disputes are resolved in minutes. Every number is substantiated before it reaches the board.
            Collaborative, auditable, and complete by T+2.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left panel */}
          <div className="lg:col-span-4 space-y-5">

            {/* Agent roster */}
            <div className="light-card rounded-2xl p-5">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">The Council</div>
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
              <div className="text-sm font-semibold text-gray-900 mb-1">Month-End Close Council</div>
              <div className="text-xs text-gray-500 mb-4">T+0: 847 GL accounts locked. Controllers, auditors, and CFO convene.</div>
              <motion.button onClick={running ? undefined : run}
                whileHover={!running?{scale:1.02}:{}} whileTap={!running?{scale:0.97}:{}}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  running ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
                  done    ? "bg-emerald-600 text-white hover:bg-emerald-700" :
                            "bg-violet-600 text-white hover:bg-violet-700 shadow-md"
                }`}>
                {running ? "Council in session..." : done ? "▶ Run Again" : "▶ Convene Council"}
              </motion.button>
              {done && (
                <button onClick={reset} className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Reset
                </button>
              )}
            </div>

            {/* How it works */}
            <div className="light-card rounded-2xl p-5 border border-violet-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">How it works</div>
              <div className="space-y-2.5">
                {[
                  { label: "Orchestration", desc: "Automates the sequential workflow", icon: "🕸", color: "#f59e0b" },
                  { label: "Agent Council", desc: "Specialists audit each other in parallel", icon: "🌐", color: "#8b5cf6" },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                      style={{ background:`${item.color}15`, border:`1px solid ${item.color}30` }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-700">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat feed */}
          <div className="lg:col-span-8">
            <div className="light-card rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Agent Council · Month-End Close</div>
                  <div className="text-xs text-gray-500 mt-0.5">T+0 trigger — sub-ledgers locked, council in session</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${running?"bg-amber-500 animate-pulse":done?"bg-emerald-500":"bg-gray-300"}`} />
                  <span className="text-xs text-gray-500 font-mono">{running?"live":done?"complete":"ready"}</span>
                </div>
              </div>

              <div className="p-5 min-h-[480px] space-y-3">
                {visible.length === 0 && !running && (
                  <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                    Click <span className="mx-1 font-semibold text-violet-600">Convene Council</span> to watch the agents sign off on month-end
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
                    <span className="text-xs text-gray-400">Council deliberating...</span>
                  </div>
                )}

                {done && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    className="rounded-xl p-3 bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                    <span className="text-emerald-600 text-sm font-semibold">Month-end complete</span>
                    <span className="text-gray-500 text-xs">· 847 accounts signed off · board pack released · T+2 achieved</span>
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
