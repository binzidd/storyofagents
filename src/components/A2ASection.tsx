"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

interface Msg {
  from: string; to: string; text: string;
  color: string; icon: string; delay: number;
  type: "request" | "challenge" | "approval" | "log" | "complete";
}

const MESSAGES: Msg[] = [
  { from:"Sales Agent",      to:"Compliance Agent",  text:"New client application: Meridian Capital, A$2.4M mandate. Documents uploaded: ID, source of funds declaration, and signed risk disclosure. Requesting KYC sign-off to proceed.",                                                               color:"#3b82f6", icon:"💼", delay:0,    type:"request"   },
  { from:"Compliance Agent", to:"Sales Agent",        text:"KYC incomplete. Source of funds declaration references an overseas trust structure — supplementary beneficial ownership form required. Application on hold until received.",                                                                 color:"#ef4444", icon:"⚖️", delay:1600, type:"challenge" },
  { from:"Sales Agent",      to:"Compliance Agent",   text:"Beneficial ownership form received and uploaded. Meridian Capital is 100% owned by two Australian residents — full details provided. Ready for re-review.",                                                                                color:"#3b82f6", icon:"💼", delay:3200, type:"request"   },
  { from:"Compliance Agent", to:"Risk Agent",         text:"KYC cleared: identity verified, source of funds confirmed, no PEP or sanctions matches. Passing to Risk for suitability assessment before final approval.",                                                                               color:"#ef4444", icon:"⚖️", delay:4800, type:"approval"  },
  { from:"Risk Agent",       to:"All",                text:"Suitability confirmed: mandate scope aligns with client risk profile. Recommended product set: diversified fixed income and equities. No concentration or mandate breach risk detected. Approved to onboard.",                           color:"#f59e0b", icon:"🛡️", delay:6400, type:"approval"  },
  { from:"Audit Agent",      to:"System",             text:"Onboarding trail complete: KYC signed off, suitability assessed, all documents logged. Meridian Capital account opened. ASIC and AUSTRAC records updated. Full audit trail: 6 documents, 3 agents, zero manual steps.",                 color:"#8b5cf6", icon:"📋", delay:7800, type:"complete"  },
];

const AGENTS = [
  { id:"sales",      label:"Sales Agent",      icon:"💼", color:"#3b82f6", role:"Submits application and documents"    },
  { id:"compliance", label:"Compliance Agent", icon:"⚖️", color:"#ef4444", role:"Verifies KYC and AML requirements"    },
  { id:"risk",       label:"Risk Agent",       icon:"🛡️", color:"#f59e0b", role:"Assesses client suitability"          },
  { id:"audit",      label:"Audit Agent",      icon:"📋", color:"#8b5cf6", role:"Logs the full onboarding trail"       },
];

const TYPE_COLORS: Record<string, { bg: string; border: string }> = {
  request:   { bg:"#3b82f610", border:"#3b82f630" },
  challenge: { bg:"#ef444410", border:"#ef444430" },
  approval:  { bg:"#f59e0b10", border:"#f59e0b30" },
  log:       { bg:"#ef444408", border:"#ef444420" },
  complete:  { bg:"#8b5cf610", border:"#8b5cf640" },
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
            Four specialists. Zero emails.<br /><span className="text-emerald-500">Client onboarded in minutes.</span>
          </motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.2 }}
            className="text-xl text-gray-500 max-w-3xl mx-auto">
            Each agent owns a defined role. They challenge each other, escalate blockers, and hand off cleanly.
            No chasing emails. No missed steps. Every decision logged.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left panel */}
          <div className="lg:col-span-4 space-y-5">

            {/* Agent roster */}
            <div className="light-card rounded-2xl p-5">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">The Team</div>
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
              <div className="text-sm font-semibold text-gray-900 mb-1">New Client Onboarding</div>
              <div className="text-xs text-gray-500 mb-4">A$2.4M mandate. Compliance, risk, and audit agents review in parallel.</div>
              <motion.button onClick={running ? undefined : run}
                whileHover={!running?{scale:1.02}:{}} whileTap={!running?{scale:0.97}:{}}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  running ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
                  done    ? "bg-emerald-600 text-white hover:bg-emerald-700" :
                            "bg-violet-600 text-white hover:bg-violet-700 shadow-md"
                }`}>
                {running ? "Processing application..." : done ? "▶ Run Again" : "▶ Submit Application"}
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
                  { label: "Defined roles", desc: "Each agent owns one domain, no overlap", icon: "🎯", color: "#3b82f6" },
                  { label: "Challenge loops", desc: "Agents block and escalate when criteria fail", icon: "⚡", color: "#ef4444" },
                  { label: "Automatic handoff", desc: "Approval flows to the next agent instantly", icon: "🔗", color: "#8b5cf6" },
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
                  <div className="font-semibold text-gray-900 text-sm">Onboarding Council · Meridian Capital</div>
                  <div className="text-xs text-gray-500 mt-0.5">A$2.4M mandate · KYC, suitability, and audit in sequence</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${running?"bg-amber-500 animate-pulse":done?"bg-emerald-500":"bg-gray-300"}`} />
                  <span className="text-xs text-gray-500 font-mono">{running?"live":done?"complete":"ready"}</span>
                </div>
              </div>

              <div className="p-5 min-h-[480px] space-y-3">
                {visible.length === 0 && !running && (
                  <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                    Click <span className="mx-1 font-semibold text-violet-600">Submit Application</span> to watch the agents onboard a new client
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
                    <span className="text-xs text-gray-400">Agents reviewing...</span>
                  </div>
                )}

                {done && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    className="rounded-xl p-3 bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                    <span className="text-emerald-600 text-sm font-semibold">Onboarding complete</span>
                    <span className="text-gray-500 text-xs">· KYC cleared · suitability approved · audit trail logged · zero manual steps</span>
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
