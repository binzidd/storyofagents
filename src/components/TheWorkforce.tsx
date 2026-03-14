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
            {phase === 2 && <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-500" animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:0.9, repeat:Infinity }} />}
            {lit(2) && <span className="text-xs font-mono text-blue-500">auto</span>}
          </div>
        </motion.div>

        <motion.div className="ml-7 w-px h-2" animate={{ background: lit(2) ? "#3b82f640" : "#E5E7EB" }} />

        {/* Decision diamond */}
        <AnimatePresence>
          {lit(3) && (
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
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
            <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
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
            <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
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
    { label: "Task Agent", task: "Check GL data",      found: "A$9M cost overrun", color: "#3b82f6" },
    { label: "Task Agent", task: "Review headcount",   found: "12 hires above plan", color: "#f59e0b" },
    { label: "Task Agent", task: "Analyse vendor spend",found: "3 contracts up 18%",  color: "#8b5cf6" },
  ];

  return (
    <div>
      <div className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wide">Example: why did costs spike this quarter?</div>

      {/* Principal Agent */}
      <motion.div initial={{ opacity:0, y:-8 }} animate={playing || done?{opacity:1,y:0}:{opacity:0,y:-8}}
        transition={{ duration:0.4 }}
        className="mb-3">
        <motion.div
          animate={(playing || done) && phase>=1 ? { boxShadow:["0 0 0px #8b5cf620","0 0 16px #8b5cf440","0 0 0px #8b5cf620"] } : {}}
          transition={{ duration:2, repeat:Infinity }}
          className="rounded-2xl px-4 py-3 border-2 text-center mx-auto max-w-[220px]"
          style={{ background:"#8b5cf610", borderColor: phase>=1 ? "#8b5cf660" : "#E5E7EB" }}>
          <div className="text-xs font-black text-violet-600 mb-0.5">🧠 Principal Agent</div>
          <div className="text-xs text-gray-700 font-medium">&ldquo;Why did costs spike?&rdquo;</div>
          {phase >= 1 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}}
              className="text-xs text-violet-500 mt-1">
              {phase < 3 ? "Delegating to task agents..." : phase < 4 ? "Collecting findings..." : "Synthesising answer ✓"}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Delegation arrows */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex justify-around px-4 mb-1">
            {tasks.map((_, i) => (
              <motion.div key={i} initial={{height:0}} animate={{height:20}}
                transition={{delay: i*0.15, duration:0.3}}
                className="w-px" style={{background: tasks[i].color + "60"}} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Agents */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {tasks.map((task, i) => (
          <motion.div key={task.task}
            initial={{ opacity:0, y:10 }}
            animate={phase>=1 ? {opacity:1,y:0} : {opacity:0,y:10}}
            transition={{ delay: i * 0.15, duration:0.35 }}
            className="rounded-xl p-2.5 border text-center"
            style={{ background:`${task.color}10`, borderColor:`${task.color}30` }}>
            <div className="text-xs font-bold mb-1" style={{color:task.color}}>Task Agent</div>
            <div className="text-xs text-gray-600 leading-tight">{task.task}</div>
            <AnimatePresence>
              {phase >= 3 && (
                <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
                  transition={{delay: i*0.1, duration:0.3}}
                  className="mt-1.5 pt-1.5 border-t text-xs font-medium leading-tight overflow-hidden"
                  style={{color:task.color, borderColor:`${task.color}30`}}>
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
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex justify-around px-4 mb-1">
            {tasks.map((_, i) => (
              <motion.div key={i} initial={{height:0}} animate={{height:20}}
                transition={{delay: i*0.15, duration:0.3}}
                className="w-px" style={{background: tasks[i].color + "60"}} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Synthesis */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
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

// ─── LangGraph Section ───────────────────────────────────────────────────────

interface GraphNode { id: string; label: string; sublabel: string; icon: string; color: string; x: number; y: number; type: "process"|"decision"|"human"|"output"; }
interface GraphEdge { from: string; to: string; label?: string; conditional?: boolean; }

const GRAPH_NODES: GraphNode[] = [
  { id:"start",     label:"Trigger",           sublabel:"Month-end T+0",      icon:"📅", color:"#3b82f6", x:50, y:5,  type:"process"  },
  { id:"collect",   label:"Collect Data",      sublabel:"ERP + sub-ledgers",  icon:"🗄️", color:"#3b82f6", x:50, y:22, type:"process"  },
  { id:"recon",     label:"Auto-Reconcile",    sublabel:"Cross-system match", icon:"⚙️", color:"#06b6d4", x:50, y:39, type:"process"  },
  { id:"check",     label:"Exceptions?",       sublabel:"Threshold check",    icon:"❓", color:"#f59e0b", x:50, y:55, type:"decision" },
  { id:"human",     label:"Human Review",      sublabel:"Accountant gate",    icon:"👤", color:"#ef4444", x:18, y:68, type:"human"    },
  { id:"journal",   label:"Post Journals",     sublabel:"Auto-entries",       icon:"📒", color:"#10b981", x:78, y:68, type:"process"  },
  { id:"variance",  label:"Variance Analysis", sublabel:"vs budget & prior",  icon:"📈", color:"#8b5cf6", x:50, y:82, type:"process"  },
  { id:"boardpack", label:"Board Pack",        sublabel:"CFO-ready output",   icon:"📊", color:"#10b981", x:50, y:96, type:"output"   },
];

const GRAPH_EDGES: GraphEdge[] = [
  { from:"start",   to:"collect" },
  { from:"collect", to:"recon"   },
  { from:"recon",   to:"check"   },
  { from:"check",   to:"human",   label:"Exceptions", conditional:true },
  { from:"check",   to:"journal", label:"Clean",      conditional:true },
  { from:"human",   to:"journal" },
  { from:"journal", to:"variance" },
  { from:"variance",to:"boardpack" },
];

function LangGraphViz({ playing, done }: { playing: boolean; done: boolean }) {
  const [step, setStep] = useState(-1);
  const [hoveredNode, setHoveredNode] = useState<string|null>(null);

  useEffect(() => {
    if (done && !playing) { setStep(GRAPH_NODES.length); return; }
    if (!playing) { setStep(-1); return; }
    setStep(0);
    GRAPH_NODES.forEach((_, i) => {
      setTimeout(() => setStep(i + 1), (i + 1) * 700);
    });
  }, [playing, done]);

  const nodeActive  = (i: number) => step > i;
  const nodeCurrent = (i: number) => step === i;

  const toX = (p: number) => (p / 100) * 400;
  const toY = (p: number) => (p / 100) * 420;

  return (
    <div className="relative w-full" style={{ maxWidth: 400, margin: "0 auto" }}>
      <svg viewBox="0 0 400 420" className="w-full h-auto" style={{ overflow: "visible" }}>
        <defs>
          <marker id="lg-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#555" /></marker>
          <marker id="lg-arrow-cond" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#f59e0b" /></marker>
        </defs>

        {GRAPH_EDGES.map((edge, i) => {
          const fromNode  = GRAPH_NODES.find(n => n.id === edge.from)!;
          const toNode    = GRAPH_NODES.find(n => n.id === edge.to)!;
          const fromIdx   = GRAPH_NODES.indexOf(fromNode);
          const isActive  = nodeActive(fromIdx);
          const x1 = toX(fromNode.x), y1 = toY(fromNode.y) + 14;
          const x2 = toX(toNode.x),   y2 = toY(toNode.y)   - 14;
          return (
            <g key={i}>
              <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={edge.conditional ? "#f59e0b" : "#444"} strokeWidth={1.5}
                strokeDasharray={edge.conditional ? "5 3" : "none"}
                markerEnd={edge.conditional ? "url(#lg-arrow-cond)" : "url(#lg-arrow)"}
                animate={isActive
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: step === -1 ? 0.12 : 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {edge.label && isActive && (
                <motion.text x={(x1+x2)/2+(edge.conditional?(x2<x1?-8:8):0)} y={(y1+y2)/2-4}
                  textAnchor="middle" fill={edge.conditional?"#f59e0b":"#666"} fontSize="9" fontFamily="monospace"
                  initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.3 }}>
                  {edge.label}
                </motion.text>
              )}
            </g>
          );
        })}

        {GRAPH_NODES.map((node, i) => {
          const cx       = toX(node.x), cy = toY(node.y);
          const isActive  = nodeActive(i);
          const isCurrent = nodeCurrent(i);
          const isHov     = hoveredNode === node.id;
          const isDec     = node.type === "decision";
          const isHum     = node.type === "human";
          const clr       = isActive || isCurrent ? node.color : "#C4C4C4";
          return (
            <motion.g key={node.id}
              animate={{
                opacity: step === -1 ? 0.38 : isActive || isCurrent ? 1 : 0.22,
                scale:   isCurrent ? 1.1 : 1,
              }}
              transition={{ duration: 0.35 }}
              onHoverStart={() => setHoveredNode(node.id)}
              onHoverEnd={() => setHoveredNode(null)}
              style={{ cursor: "pointer", transformOrigin: `${cx}px ${cy}px` }}>

              {(isHov || isCurrent) && (
                <circle cx={cx} cy={cy} r={28} fill={clr} opacity={0.15} />
              )}
              {isCurrent && (
                <motion.circle cx={cx} cy={cy} r={20} stroke={clr} strokeWidth={1.5} fill="none"
                  animate={{ r: [18, 27, 18], opacity: [0.8, 0.1, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity }} />
              )}

              {isDec ? (
                <rect x={cx-18} y={cy-18} width={36} height={36} rx={4}
                  fill={`${clr}22`} stroke={clr}
                  strokeWidth={isCurrent ? 2.5 : isActive ? 2 : 1}
                  transform={`rotate(45 ${cx} ${cy})`} />
              ) : (
                <rect x={cx-36} y={cy-14} width={72} height={28} rx={isHum ? 14 : 6}
                  fill={`${clr}22`} stroke={clr}
                  strokeWidth={isCurrent ? 2.5 : isActive ? 2 : 1}
                  strokeDasharray={isHum ? "4 2" : "none"} />
              )}
              <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle" fontSize={isDec?"10":"12"}>
                {node.icon}
              </text>
              <text x={cx} y={cy+22} textAnchor="middle"
                fill={isActive || isCurrent ? "#1f2937" : "#A0A0A0"}
                fontSize="8" fontWeight="600" fontFamily="Inter, sans-serif">
                {node.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Days Counter Animation ───────────────────────────────────────────────────

function DaysCounter({ playing }: { playing: boolean }) {
  const [days, setDays] = useState(7);

  useEffect(() => {
    if (!playing) { setDays(7); return; }
    const steps = [7, 6, 5, 4, 3, 2];
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < steps.length) setDays(steps[idx]);
      else clearInterval(interval);
    }, 850);
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div className="mb-2">
      <div className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-4">Month-end close time</div>
      <div className="flex items-center gap-5 justify-center">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1.5 font-medium">Legacy</div>
          <div className="text-5xl font-black text-red-400 leading-none">7</div>
          <div className="text-gray-400 text-xs mt-1">days</div>
        </div>
        <div className="text-gray-300 text-3xl font-light">→</div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1.5 font-medium">Simulating</div>
          <AnimatePresence mode="wait">
            <motion.div key={days}
              initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`text-7xl font-black leading-none ${days === 2 ? "text-emerald-500" : days <= 4 ? "text-amber-500" : "text-red-500"}`}>
              {days}
            </motion.div>
          </AnimatePresence>
          <div className="text-gray-500 text-xs mt-1">days</div>
        </div>
        <div className="text-gray-300 text-3xl font-light">→</div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1.5 font-medium">AI-orchestrated</div>
          <div className="text-5xl font-black text-emerald-500 leading-none">2</div>
          <div className="text-gray-400 text-xs mt-1">days</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function TheWorkforce() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const [flowPlaying, setFlowPlaying]   = useState(false);
  const [flowDone, setFlowDone]         = useState(false);
  const [funcPlaying, setFuncPlaying]   = useState(false);
  const [funcDone, setFuncDone]         = useState(false);
  const [graphPlaying, setGraphPlaying] = useState(false);
  const [graphDone, setGraphDone]       = useState(false);

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

  const playGraph = () => {
    if (graphPlaying) return;
    setGraphPlaying(true);
    setGraphDone(false);
    setTimeout(() => { setGraphPlaying(false); setGraphDone(true); }, 6500);
  };

  return (
    <section id="workforce" ref={ref} className="relative py-32 overflow-hidden bg-[#F9F8F5]">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 mb-6">
            <span className="text-emerald-700 text-xs font-medium tracking-widest uppercase">Phase 03</span>
          </motion.div>
          <motion.h2 initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.8 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Understanding Architecture.<br />
            <span className="relative inline-block">
              <span className="text-emerald-500">Right tool. Right job.</span>
              <motion.span initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }}
                transition={{ duration:0.8, delay:0.7, ease:"easeOut" }}
                className="absolute bottom-1 left-0 h-[4px] bg-emerald-400 rounded-full origin-left block" />
            </span>
          </motion.h2>
          <motion.p initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.8, delay:0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flow Agents bring auditability and compliance certainty.
            Function Agents bring reasoning and adaptability.
            The firms getting this right are deploying both, precisely where each one excels.
          </motion.p>
        </div>

        {/* Flow vs Function split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Flow Agents */}
          <motion.div initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            transition={{ duration:0.8 }} className="light-card rounded-2xl p-8 border border-blue-200">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    flowPlaying       ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                    : flowDone        ? "bg-emerald-600 text-white hover:bg-emerald-700"
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
                {["KYC/AML Routing","Month-End Close","Trade Confirmation","Regulatory Reporting"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs border border-blue-200">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Function Agents */}
          <motion.div initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            transition={{ duration:0.8 }} className="light-card rounded-2xl p-8 border border-violet-200">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    funcPlaying       ? "bg-violet-100 text-violet-400 cursor-not-allowed"
                    : funcDone        ? "bg-emerald-600 text-white hover:bg-emerald-700"
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
                {["Earnings Analysis","M&A Due Diligence","Budget Variance","Scenario Modelling"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs border border-violet-200">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Strategic Choice callout */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.8 }}
          className="light-card rounded-2xl p-6 border border-gray-200 text-center max-w-3xl mx-auto mb-32">
          <div className="text-gray-900 font-semibold mb-2">The Hybrid Advantage</div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Leading financial institutions are not choosing between Flow and Function.
            They are deploying <span className="text-gray-900">hybrid architectures</span> where
            Flow agents handle the regulated core and Function agents tackle the complex edge cases humans used to own.
          </p>
        </motion.div>

        {/* ─── LangGraph Section ─────────────────────────────────────────── */}
        <div id="langgraph" className="scroll-mt-20">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-200 bg-amber-50 mb-6">
              <span className="text-amber-700 text-xs font-medium tracking-widest uppercase">Phase 04 — LangGraph</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.8 }}
              className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Close faster.<br /><span className="text-amber-500">More time for analysis.</span>
            </motion.h2>
            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ duration:0.8, delay:0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto">
              Linear pipelines can only go forward. Our graphs handle exceptions, loops,
              and human-in-the-loop decisions. That is how finance actually works.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: play button + day counter + concepts */}
            <div className="space-y-6">
              {/* Play Button + Days */}
              <motion.div initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                className="light-card rounded-2xl p-7 border border-amber-200 text-center">
                <DaysCounter playing={graphPlaying || graphDone} />

                <motion.button onClick={playGraph}
                  whileHover={!graphPlaying?{scale:1.04}:{}} whileTap={!graphPlaying?{scale:0.97}:{}}
                  disabled={graphPlaying}
                  className={`mx-auto flex items-center gap-3 px-8 py-3.5 rounded-2xl font-semibold text-sm shadow-lg transition-all ${
                    graphPlaying ? "bg-amber-100 text-amber-400 cursor-not-allowed"
                    : graphDone  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    :              "bg-amber-500 text-white hover:bg-amber-600"
                  }`}>
                  {graphPlaying ? (
                    <>
                      <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}
                        className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full" />
                      Simulating close cycle...
                    </>
                  ) : graphDone ? (
                    <><span>▶</span> Run Again</>
                  ) : (
                    <><span className="text-lg">▶</span> Simulate Month-End Close</>
                  )}
                </motion.button>

                {graphDone && (
                  <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                    className="mt-4 text-xs text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 inline-block">
                    T+2 close achieved. Board pack ready.
                  </motion.div>
                )}
              </motion.div>

              {/* Three key concepts */}
              {[
                { icon:"🔵", title:"Nodes run the work",        desc:"Each node is a focused AI task: fetch sub-ledger, run reconciliation, generate commentary. One job, done well.", color:"#3b82f6" },
                { icon:"↔️", title:"Edges route the outcome",   desc:"Exceptions branch to human review. Clean runs auto-post. Logic, not guesswork.", color:"#f59e0b" },
                { icon:"👤", title:"Humans stay in control",    desc:"LangGraph pauses and waits for approval before continuing. Non-negotiable for material entries.", color:"#ef4444" },
              ].map((item, i) => (
                <motion.div key={item.title} initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                  transition={{ delay:i*0.12 }} className="light-card rounded-xl p-4 border border-gray-200 flex gap-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background:`${item.color}20`, border:`1px solid ${item.color}40` }}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold text-sm mb-1">{item.title}</div>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: LangGraph visualization */}
            <div>
              <motion.div initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                transition={{ duration:0.8 }} className="light-card rounded-2xl p-6 border border-amber-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-gray-900 font-bold">Month-End Close Graph</div>
                    <div className="text-amber-400 text-xs mt-0.5">Financial Controller Workflow</div>
                  </div>
                  <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${
                    graphPlaying ? "bg-amber-500/20 border border-amber-500/30" :
                    graphDone    ? "bg-emerald-500/20 border border-emerald-500/30" :
                                   "bg-gray-100 border border-gray-200"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      graphPlaying ? "bg-amber-400 animate-pulse" :
                      graphDone    ? "bg-emerald-400" : "bg-gray-400"
                    }`} />
                    <span className={`text-xs font-mono ${
                      graphPlaying ? "text-amber-500" :
                      graphDone    ? "text-emerald-500" : "text-gray-400"
                    }`}>{graphPlaying ? "running" : graphDone ? "complete" : "ready"}</span>
                  </div>
                </div>
                <LangGraphViz playing={graphPlaying} done={graphDone} />
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2">
                  {[
                    { color:"#3b82f6", label:"Process node" },
                    { color:"#f59e0b", label:"Decision node" },
                    { color:"#ef4444", label:"Human gate", rounded:true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded flex-shrink-0"
                        style={{ background:`${item.color}30`, border:`1.5px solid ${item.color}`, borderRadius:item.rounded?"50%":undefined }} />
                      <span className="text-gray-600 text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Before / After */}
              <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:0.3 }} className="mt-4 light-card rounded-xl p-4 border border-gray-200">
                <div className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-widest">Before vs. After</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-3">
                    <div className="text-red-400 text-xs font-bold mb-2">BEFORE</div>
                    <ul className="space-y-1">
                      {["5-7 day close cycle","Manual recs: 40+ hours","Error rate: 3-8%","Board pack delayed to T+7"].map(t => (
                        <li key={t} className="text-gray-500 text-xs flex gap-1.5"><span>-</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                    <div className="text-emerald-400 text-xs font-bold mb-2">AFTER</div>
                    <ul className="space-y-1">
                      {["1-2 day close cycle","Auto-recs: 15 min","Error rate: <0.5%","Board pack ready at T+2"].map(t => (
                        <li key={t} className="text-gray-500 text-xs flex gap-1.5"><span className="text-emerald-500">✓</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        {/* ─── End LangGraph ─────────────────────────────────────────────── */}

      </motion.div>
    </section>
  );
}
