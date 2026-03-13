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
    description: "Evaluate an A$75M AUD/USD position proposal",
    trigger: "Quant recommends A$75M AUD/USD short at 0.6318 spot",
    messages: [
      { from:"Quant Agent",      to:"All",          text:"Recommending A$75M AUD/USD short at 0.6318 spot. RBA held rates — USD momentum: +2.1σ. Macro regime supports USD strength. Risk/reward: 1:2.9. Holding period: 3–5 days.",        color:"#3b82f6", icon:"📊", delay:0,    type:"proposal"  },
      { from:"Risk Agent",       to:"Quant Agent",  text:"Flagging: this position consumes 52% of remaining daily VaR budget. Current AUD short book already A$120M notional. Aggregate exposure breaches single-currency concentration limit.",  color:"#ef4444", icon:"🔴", delay:1400, type:"challenge" },
      { from:"Quant Agent",      to:"Risk Agent",   text:"Acknowledged. Revised proposal: A$45M notional. VaR consumption drops to 31%. Signal integrity maintained at reduced size. Recommending proceeding.",                               color:"#3b82f6", icon:"📊", delay:2800, type:"proposal"  },
      { from:"Compliance Agent", to:"All",          text:"ASIC position limits reviewed. A$45M AUD/USD within approved mandate. No restricted counterparties. Client suitability confirmed. Approved with standard T+1 reporting.",            color:"#f59e0b", icon:"⚖️", delay:4200, type:"approval"  },
      { from:"Audit Agent",      to:"System",       text:"Decision logged: Trade #FX-2026-1103. Full deliberation chain recorded — initial proposal, risk challenge, size revision, compliance sign-off. APRA audit trail: complete.",         color:"#8b5cf6", icon:"📋", delay:5400, type:"log"       },
      { from:"Execution Agent",  to:"All",          text:"Executing A$45M AUD/USD short at 0.6316 (2bp slippage, within tolerance). Confirmation: EXEC-20260313-0147. P&L attribution and position limits updated in real time.",             color:"#10b981", icon:"⚡", delay:6600, type:"final"     },
    ],
  },
  {
    id: "monthend",
    title: "Month-End Escalation",
    description: "A$3.1M reconciliation break at T+1",
    trigger: "Recon Agent flags A$3.1M unmatched item in GL-7821",
    messages: [
      { from:"Recon Agent",    to:"All",        text:"BREAK DETECTED: A$3.1M unmatched in Intercompany Settlements (GL-7821). Item aged >24h. Counterparty: FS Singapore entity. Auto-escalation threshold exceeded. Period close at risk.", color:"#ef4444", icon:"⚠️", delay:0,    type:"challenge" },
      { from:"Analysis Agent", to:"Recon Agent",text:"Cross-referencing GL-7821 against sub-ledger... Root cause identified: Singapore entity posted same transaction as intercompany receivable on 12-Mar. Period cut-off timing mismatch.",  color:"#3b82f6", icon:"📊", delay:1400, type:"proposal"  },
      { from:"Compliance Agent",to:"All",       text:"Materiality assessment: A$3.1M exceeds AASB 101 auto-post threshold for this entity. Senior accountant approval required prior to period close. Cannot auto-resolve.",                  color:"#f59e0b", icon:"⚖️", delay:2800, type:"challenge" },
      { from:"Report Agent",   to:"Controller", text:"HUMAN REVIEW REQUIRED: Escalated to Sarah Chen (Group Controller). Brief attached: root cause, draft correcting journal, AASB 101 materiality assessment. Awaiting sign-off.",          color:"#8b5cf6", icon:"📋", delay:4200, type:"log"       },
      { from:"Report Agent",   to:"All",        text:"Controller approved at 09:52. Correcting journal posted. GL-7821 cleared. Month-end close unblocked. Board pack generation resumed. T+1 close achieved.",                              color:"#10b981", icon:"✅", delay:5400, type:"final"     },
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
            Your best risk committee.<br /><span className="text-violet-600">Available 24/7.</span>
          </motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.2 }}
            className="text-xl text-gray-500 max-w-3xl mx-auto">
            Specialised agents don&apos;t just execute — they
            <strong className="text-gray-800"> challenge each other&apos;s assumptions</strong>, stress-test constraints,
            and reach defensible consensus. Decisions that would take your committee hours happen in seconds —
            with a complete audit trail.
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
