"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

function FlowAgentViz({ playing, done }: { playing: boolean; done: boolean }) {
  const [phase, setPhase] = useState(0); // 0=idle, 1=receive, 2=check, 3=decision, 4=branch, 5=done

  useEffect(() => {
    if (!playing) { if (!done) setPhase(0); return; }
    const delays = [200, 900, 1700, 2600, 3500];
    delays.forEach((d, i) => setTimeout(() => setPhase(i + 1), d));
  }, [playing, done]);

  const lit = (n: number) => phase >= n;

  return (
    <div>
      <div className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wide">Example: invoice approval pipeline</div>

      <div className="space-y-1.5">
        {/* Step 1 */}
        <motion.div animate={{ background: lit(1) ? "#3b82f610" : "transparent", borderColor: lit(1) ? "#3b82f640" : "#E5E7EB" }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl border">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
            style={{ background: lit(1) ? "#3b82f620" : "#F3F4F6", border: `1px solid ${lit(1) ? "#3b82f640" : "#E5E7EB"}` }}>
            {lit(2) ? "✓" : "📥"}
          </div>
          <span className={`text-xs font-medium flex-1 ${lit(1) ? "text-gray-800" : "text-gray-400"}`}>Invoice received</span>
          {lit(1) && <span className="text-xs font-mono text-blue-500">trigger</span>}
        </motion.div>

        <motion.div className="ml-7 w-px h-2" animate={{ background: lit(1) ? "#3b82f640" : "#E5E7EB" }} />

        {/* Step 2 */}
        <motion.div animate={{ background: lit(2) ? "#3b82f610" : "transparent", borderColor: lit(2) ? "#3b82f640" : "#E5E7EB" }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl border">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
            style={{ background: lit(2) ? "#3b82f620" : "#F3F4F6", border: `1px solid ${lit(2) ? "#3b82f640" : "#E5E7EB"}` }}>
            {lit(3) ? "✓" : "⚙️"}
          </div>
          <span className={`text-xs font-medium flex-1 ${lit(2) ? "text-gray-800" : "text-gray-400"}`}>
            Run policy checks
          </span>
          <div className="flex items-center gap-1.5">
            {phase === 2 && <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-500" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity }} />}
            {lit(2) && <span className="text-xs font-mono text-blue-500">auto</span>}
          </div>
        </motion.div>

        <motion.div className="ml-7 w-px h-2" animate={{ background: lit(2) ? "#3b82f640" : "#E5E7EB" }} />

        {/* Decision diamond */}
        <AnimatePresence>
          {lit(3) && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-1 py-1">
              <div className="px-4 py-2 rounded-xl border-2 border-amber-400 bg-amber-50 text-center">
                <div className="text-xs font-black text-amber-600">◆ DECISION</div>
                <div className="text-xs text-gray-700 mt-0.5">Amount over A$10,000?</div>
              </div>
              <div className="flex gap-8 text-xs font-medium mt-1">
                <span className="text-red-500">Yes → manager approval</span>
                <span className="text-emerald-600">No → auto-approve</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Branch outcomes */}
        <AnimatePresence>
          {lit(4) && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-2">
              <div className="rounded-xl px-3 py-2.5 border border-red-200 bg-red-50">
                <div className="text-xs font-bold text-red-500 mb-1">Route A</div>
                <div className="text-xs text-gray-600">Notifies manager</div>
                <div className="text-xs text-gray-500">Awaits approval</div>
              </div>
              <div className="rounded-xl px-3 py-2.5 border border-emerald-200 bg-emerald-50">
                <div className="text-xs font-bold text-emerald-600 mb-1">Route B</div>
                <div className="text-xs text-gray-600">Auto-approved</div>
                <div className="text-xs text-gray-500">Payment scheduled</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {lit(5) && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-500">✓</span>
              <span className="text-xs font-medium text-emerald-700">Invoice processed · audit trail complete</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          Every step is <strong className="text-gray-700">pre-defined and auditable</strong>. The same input always produces the same output. No surprises.
        </p>
      </div>
    </div>
  );
}

function FunctionAgentViz({ playing, done }: { playing: boolean; done: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!playing) { if (!done) setPhase(0); return; }
    [300, 1000, 1800, 2800].forEach((d, i) => setTimeout(() => setPhase(i + 1), d));
  }, [playing, done]);

  const tasks = [
    { label: "Task Agent", task: "Check GL data", found: "A$9M cost overrun", color: "#3b82f6" },
    { label: "Task Agent", task: "Review headcount", found: "12 hires above plan", color: "#f59e0b" },
    { label: "Task Agent", task: "Analyse vendor spend", found: "3 contracts up 18%", color: "#8b5cf6" },
  ];

  return (
    <div>
      <div className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wide">Example: why did costs spike this quarter?</div>

      {/* Principal Agent */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={playing || done ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.4 }}
        className="mb-3">
        <motion.div
          animate={(playing || done) && phase >= 1 ? { boxShadow: ["0 0 0px #8b5cf620", "0 0 16px #8b5cf440", "0 0 0px #8b5cf620"] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-2xl px-4 py-3 border-2 text-center mx-auto max-w-[220px]"
          style={{ background: "#8b5cf610", borderColor: phase >= 1 ? "#8b5cf660" : "#E5E7EB" }}>
          <div className="text-xs font-black text-violet-600 mb-0.5">🧠 Principal Agent</div>
          <div className="text-xs text-gray-700 font-medium">&ldquo;Why did costs spike?&rdquo;</div>
          {phase >= 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-xs text-violet-500 mt-1">
              {phase < 3 ? "Delegating to task agents..." : phase < 4 ? "Collecting findings..." : "Synthesising answer ✓"}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Delegation arrows */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-around px-4 mb-1">
            {tasks.map((_, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: 20 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
                className="w-px" style={{ background: tasks[i].color + "60" }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Agents */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {tasks.map((task, i) => (
          <motion.div key={task.task}
            initial={{ opacity: 0, y: 10 }}
            animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: i * 0.15, duration: 0.35 }}
            className="rounded-xl p-2.5 border text-center"
            style={{ background: `${task.color}10`, borderColor: `${task.color}30` }}>
            <div className="text-xs font-bold mb-1" style={{ color: task.color }}>Task Agent</div>
            <div className="text-xs text-gray-600 leading-tight">{task.task}</div>
            <AnimatePresence>
              {phase >= 3 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  className="mt-1.5 pt-1.5 border-t text-xs font-medium leading-tight overflow-hidden"
                  style={{ color: task.color, borderColor: `${task.color}30` }}>
                  {task.found}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Return arrows */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-around px-4 mb-1">
            {tasks.map((_, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: 20 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
                className="w-px" style={{ background: tasks[i].color + "60" }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Synthesis */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl px-3 py-2.5 border border-violet-200 bg-violet-50 text-center">
            <div className="text-xs font-semibold text-violet-700">Synthesis complete</div>
            <div className="text-xs text-gray-600 mt-0.5">Costs up A$9M: headcount, GL overruns, vendor contracts</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          The principal agent <strong className="text-gray-700">plans and delegates</strong>. Task agents work in parallel. No fixed steps — it adapts to the problem.
        </p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function TheWorkforce() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const [flowPlaying, setFlowPlaying] = useState(false);
  const [flowDone, setFlowDone] = useState(false);
  const [funcPlaying, setFuncPlaying] = useState(false);
  const [funcDone, setFuncDone] = useState(false);
  const [toolJobAnimated, setToolJobAnimated] = useState(false);
  const playFlow = () => {
    if (flowPlaying) return;
    setFlowPlaying(true);
    setFlowDone(false);
    setTimeout(() => { setFlowPlaying(false); setFlowDone(true); }, 3500);
  };

  const resetFlow = () => {
    setFlowPlaying(false);
    setFlowDone(false);
  };

  const playFunc = () => {
    if (funcPlaying) return;
    setFuncPlaying(true);
    setFuncDone(false);
    setTimeout(() => { setFuncPlaying(false); setFuncDone(true); }, 2800);
  };

  const resetFunc = () => {
    setFuncPlaying(false);
    setFuncDone(false);
  };

  return (
    <section id="workforce" ref={ref} className="relative py-32 overflow-hidden bg-[#F9F8F5]">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 mb-6">
            <span className="text-emerald-700 text-xs font-medium tracking-widest uppercase">Phase 02</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Understanding Architecture.<br />
            <span className="relative inline-block cursor-pointer" onClick={() => setToolJobAnimated(!toolJobAnimated)}>
              <span className="text-emerald-500">Right tool. Right job.</span>
              <motion.span initial={{ scaleX: 0 }} animate={toolJobAnimated ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute bottom-1 left-0 h-[4px] bg-emerald-400 rounded-full origin-left block" />
            </span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flow Agents bring auditability and compliance certainty.
            Function Agents bring reasoning and adaptability.
            The firms getting this right are deploying both, precisely where each one excels.
          </motion.p>
        </div>

        {/* Flow vs Function split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Flow Agents */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }} className="light-card rounded-2xl p-8 border border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">🔄</div>
              <div>
                <div className="text-gray-900 font-bold text-xl">Flow Agents</div>
                <div className="text-blue-400 text-sm">Deterministic Processors</div>
              </div>
              <div className="ml-auto px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">Predictable</div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Like a well-engineered assembly line. Every step is defined, auditable, and repeatable.
              <span className="text-gray-900"> Step A always precedes Step B.</span>
              Regulators love them. Auditors can trace every decision.
            </p>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs text-gray-500 font-medium uppercase">Watch the flow</div>
              <div className="flex items-center gap-2">
                {flowDone && <button onClick={resetFlow} className="text-xs text-gray-400 hover:text-gray-600">Reset</button>}
                <motion.button onClick={playFlow}
                  whileHover={!flowPlaying ? { scale: 1.02 } : {}}
                  whileTap={!flowPlaying ? { scale: 0.97 } : {}}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${flowPlaying ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                    : flowDone ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}>
                  {flowPlaying ? "Running..." : flowDone ? "▶ Again" : "▶ Play"}
                </motion.button>
              </div>
            </div>
            <FlowAgentViz playing={flowPlaying} done={flowDone} />
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-widest">Best For</div>
              <div className="flex flex-wrap gap-2">
                {["KYC/AML Routing", "Month-End Close", "Trade Confirmation", "Regulatory Reporting"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs border border-blue-200">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Function Agents */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }} className="light-card rounded-2xl p-8 border border-violet-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-2xl">🧠</div>
              <div>
                <div className="text-gray-900 font-bold text-xl">Function Agents</div>
                <div className="text-violet-400 text-sm">Autonomous Problem Solvers</div>
              </div>
              <div className="ml-auto px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium">Adaptive</div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Give them a goal. They figure out the steps.
              <span className="text-gray-900"> Tell them what to achieve, not how to achieve it.</span> A principal agent plans the work, delegates to specialist task agents running in parallel, and synthesises the answer.
            </p>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs text-gray-500 font-medium uppercase">Watch the delegation</div>
              <div className="flex items-center gap-2">
                {funcDone && <button onClick={resetFunc} className="text-xs text-gray-400 hover:text-gray-600">Reset</button>}
                <motion.button onClick={playFunc}
                  whileHover={!funcPlaying ? { scale: 1.02 } : {}}
                  whileTap={!funcPlaying ? { scale: 0.97 } : {}}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${funcPlaying ? "bg-violet-100 text-violet-400 cursor-not-allowed"
                    : funcDone ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-violet-600 text-white hover:bg-violet-700"
                    }`}>
                  {funcPlaying ? "Running..." : funcDone ? "▶ Again" : "▶ Play"}
                </motion.button>
              </div>
            </div>
            <FunctionAgentViz playing={funcPlaying} done={funcDone} />
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-widest">Best For</div>
              <div className="flex flex-wrap gap-2">
                {["Earnings Analysis", "M&A Due Diligence", "Budget Variance", "Scenario Modelling"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs border border-violet-200">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Strategic Choice callout */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="light-card rounded-2xl p-6 border border-gray-200 text-center max-w-3xl mx-auto mb-32">
          <div className="text-gray-900 font-semibold mb-2">The Hybrid Advantage</div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Leading financial institutions are not choosing between Flow and Function.
            They are deploying <span className="text-gray-900">hybrid architectures</span> where
            Flow agents handle the regulated core and Function agents tackle the complex edge cases humans used to own.
          </p>
        </motion.div>


      </motion.div>
    </section>
  );
}
