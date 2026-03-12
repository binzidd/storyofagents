"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

interface Msg {
  from: string; to: string; text: string;
  color: string; icon: string; delay: number;
  type: "proposal"|"challenge"|"approval"|"log"|"final";
}

const SCENARIOS: {
  id: string;
  title: string;
  description: string;
  trigger: string;
  messages: Msg[];
}[] = [
  {
    id: "fx",
    title: "FX Trade Decision",
    description: "Evaluate a £50M EUR/GBP trade proposal",
    trigger: "Quant recommends £50M EUR/GBP at 0.8734 spot",
    messages: [
      { from:"Quant Agent",      to:"All",          text:"Recommending £50M EUR/GBP at 0.8734 spot. Momentum signal: +2.4σ. Expected holding period 3–5 days. Risk/reward: 1:3.2.",                                                            color:"#3b82f6", icon:"📊", delay:0,    type:"proposal"  },
      { from:"Risk Agent",       to:"Quant Agent",  text:"Flagging: this position consumes 47% of remaining daily VaR budget. Current EUR exposure already £82M. Net position exceeds single-currency limit.",                               color:"#ef4444", icon:"🔴", delay:1400, type:"challenge" },
      { from:"Quant Agent",      to:"Risk Agent",   text:"Acknowledged. Revised proposal: £30M. Reduces VaR impact to 28%. Signal remains valid at smaller size.",                                                                            color:"#3b82f6", icon:"📊", delay:2800, type:"proposal"  },
      { from:"Compliance Agent", to:"All",          text:"Checking FCA position limits and client mandate... £30M EUR/GBP within bounds. No restricted counterparties. Approved with standard monitoring.",                                   color:"#f59e0b", icon:"⚖️", delay:4200, type:"approval"  },
      { from:"Audit Agent",      to:"System",       text:"Decision logged: Trade #FX-2026-0847. Rationale, risk challenge, size revision, and compliance sign-off recorded. Regulatory audit trail: complete.",                               color:"#8b5cf6", icon:"📋", delay:5400, type:"log"       },
      { from:"Execution Agent",  to:"All",          text:"Executing £30M EUR/GBP at 0.8736 (2bp slippage, within tolerance). Confirmation: EXEC-20260313-0091. P&L attribution logged.",                                                    color:"#10b981", icon:"⚡", delay:6600, type:"final"     },
    ],
  },
  {
    id: "monthend",
    title: "Month-End Escalation",
    description: "£2.1M reconciliation break at T+1",
    trigger: "Recon Agent flags £2.1M unmatched item in GL-7821",
    messages: [
      { from:"Recon Agent",    to:"All",        text:"BREAK DETECTED: £2.1M unmatched in Intercompany Settlements (GL-7821). Item aged >24h. Counterparty: FS Dublin. Auto-escalation threshold exceeded.",                         color:"#ef4444", icon:"⚠️", delay:0,    type:"challenge" },
      { from:"Analysis Agent", to:"Recon Agent",text:"Cross-referencing GL-7821 against sub-ledger... Found: Dublin entity booked same item as intercompany receivable on 12-Mar. Timing mismatch — different period postings.",    color:"#3b82f6", icon:"📊", delay:1400, type:"proposal"  },
      { from:"Compliance Agent",to:"All",       text:"Materiality review: £2.1M exceeds FRS 102 auto-post threshold. Senior accountant sign-off required before period close. Cannot auto-resolve.",                                color:"#f59e0b", icon:"⚖️", delay:2800, type:"challenge" },
      { from:"Report Agent",   to:"Controller", text:"HUMAN REVIEW REQUIRED: Routed to Sarah Chen (Group Controller). Summary brief attached: root cause, correcting entry draft, FRS 102 implications. Awaiting approval.",       color:"#8b5cf6", icon:"📋", delay:4200, type:"log"       },
      { from:"Report Agent",   to:"All",        text:"Controller approved at 09:47. Correcting journal posted. GL-7821 cleared. Month-end close unblocked. Board pack generation resuming. T+1 close achieved.",                   color:"#10b981", icon:"✅", delay:5400, type:"final"     },
    ],
  },
];

const AGENTS = [
  { id:"quant",      label:"Quant Agent",      icon:"📊", color:"#3b82f6", role:"Identifies signals & strategies" },
  { id:"risk",       label:"Risk Agent",        icon:"🔴", color:"#ef4444", role:"Challenges exposure & limits"   },
  { id:"compliance", label:"Compliance Agent",  icon:"⚖️", color:"#f59e0b", role:"Enforces rules & mandates"      },
  { id:"audit",      label:"Audit Agent",       icon:"📋", color:"#8b5cf6", role:"Records all decisions"          },
  { id:"execution",  label:"Execution Agent",   icon:"⚡", color:"#10b981", role:"Executes & confirms"            },
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

  const [activeScenario, setActiveScenario] = useState(0);
  const [running, setRunning]   = useState(false);
  const [visible, setVisible]   = useState<number[]>([]);
  const [done, setDone]         = useState(false);

  const scenario = SCENARIOS[activeScenario];

  const run = () => {
    if (running) return;
    setRunning(true); setVisible([]); setDone(false);
    scenario.messages.forEach((msg, i) => {
      setTimeout(() => {
        setVisible(prev => [...prev, i]);
        if (i === scenario.messages.length - 1) { setRunning(false); setDone(true); }
      }, msg.delay + 300);
    });
  };

  const reset = () => { setVisible([]); setRunning(false); setDone(false); };
  const switchScenario = (i: number) => { reset(); setActiveScenario(i); };

  // suppress unused warning
  useEffect(() => {}, []);

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
            <span className="text-violet-600 text-xs font-semibold tracking-widest uppercase">Phase 06 · Agent-to-Agent</span>
          </motion.div>
          <motion.h2 initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.8 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            The virtual<br /><span className="text-violet-600">firm.</span>
          </motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.2 }}
            className="text-xl text-gray-500 max-w-3xl mx-auto">
            Specialised agents don&apos;t just use tools — they
            <strong className="text-gray-800"> challenge each other</strong>, negotiate constraints,
            and reach consensus. The way your best committees do. At machine speed.
          </motion.p>
        </div>

        {/* Evolution row */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-14">
          {[
            { era:"LLM + Tools", icon:"🔧", desc:"One analyst, 50 tools.",          color:"gray"   },
            { era:"MCP",         icon:"🔗", desc:"Standard data pipeline.",          color:"cyan"   },
            { era:"A2A",         icon:"🌐", desc:"Specialised agents. Virtual firm.", color:"violet" },
          ].map((item,i) => (
            <motion.div key={item.era} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: i*0.15 }}
              className={`rounded-xl p-4 text-center ${
                item.color==="violet" ? "bg-violet-50 border-2 border-violet-300 shadow-md" :
                item.color==="cyan"   ? "bg-cyan-50 border border-cyan-200" :
                                        "bg-gray-50 border border-gray-200"
              }`}>
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className={`font-bold text-sm mb-1 ${item.color==="violet"?"text-violet-700":item.color==="cyan"?"text-cyan-700":"text-gray-600"}`}>
                {item.era}
              </div>
              <div className="text-xs text-gray-500">{item.desc}</div>
              {i===2 && <div className="mt-1.5 text-xs text-violet-600 font-semibold">← We are here</div>}
            </motion.div>
          ))}
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
                    scenario.messages[idx]?.from.toLowerCase().includes(agent.id) ||
                    scenario.messages[idx]?.to.toLowerCase().includes(agent.id)
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
                          className="ml-auto w-2 h-2 rounded-full flex-shrink-0" style={{ background: agent.color }} />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Scenario selector */}
            <div className="light-card rounded-2xl p-5">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Choose Scenario</div>
              <div className="space-y-2 mb-4">
                {SCENARIOS.map((s, i) => (
                  <button key={s.id} onClick={() => switchScenario(i)}
                    className={`w-full text-left rounded-xl p-3.5 border transition-all ${
                      activeScenario===i
                        ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-violet-300"
                    }`}>
                    <div className={`text-sm font-semibold ${activeScenario===i?"text-violet-700":"text-gray-800"}`}>{s.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.description}</div>
                  </button>
                ))}
              </div>
              <motion.button onClick={running ? undefined : run}
                whileHover={!running?{scale:1.02}:{}} whileTap={!running?{scale:0.97}:{}}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  running     ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
                  done        ? "bg-emerald-600 text-white hover:bg-emerald-700" :
                                "bg-violet-600 text-white hover:bg-violet-700 shadow-md"
                }`}>
                {running ? "⏳ Agents deliberating…" : done ? "▶ Run Again" : "▶ Run Scenario"}
              </motion.button>
            </div>
          </div>

          {/* Chat feed */}
          <div className="lg:col-span-8">
            <div className="light-card rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Agent Council · {scenario.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{scenario.trigger}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${running?"bg-amber-500 animate-pulse":done?"bg-emerald-500":"bg-gray-300"}`} />
                  <span className="text-xs text-gray-500 font-mono">{running?"live":done?"complete":"ready"}</span>
                </div>
              </div>

              <div className="p-5 min-h-[420px] space-y-3">
                {visible.length === 0 && !running && (
                  <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                    Click <span className="mx-1 font-semibold text-violet-600">Run Scenario</span> to watch agents collaborate in real time
                  </div>
                )}
                <AnimatePresence>
                  {visible.map(idx => {
                    const msg = scenario.messages[idx];
                    const c   = TYPE_COLORS[msg.type] ?? { bg: "#f3f4f6", border: "#e5e7eb" };
                    return (
                      <motion.div key={idx}
                        initial={{ opacity:0, y:10, scale:0.97 }}
                        animate={{ opacity:1, y:0, scale:1 }}
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
                              <span className="text-xs text-gray-400">→</span>
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
                {running && visible.length < scenario.messages.length && (
                  <div className="flex items-center gap-2 px-2">
                    {[0,1,2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400"
                        animate={{ opacity:[0.3,1,0.3], scale:[0.8,1.2,0.8] }}
                        transition={{ duration:1.2, repeat:Infinity, delay:i*0.2 }} />
                    ))}
                    <span className="text-xs text-gray-400">Agents deliberating…</span>
                  </div>
                )}
                {done && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    className="rounded-xl p-3 bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                    <span className="text-emerald-600 text-sm font-semibold">✓ Scenario complete</span>
                    <span className="text-gray-500 text-xs">· {scenario.messages.length} interactions · full audit trail logged</span>
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
