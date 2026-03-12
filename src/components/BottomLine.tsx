"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TraceSpan {
  id: string;
  label: string;
  ms: number;
  status: "ok" | "warn" | "error";
  detail: string;
  color: string;
}

interface EvalResult {
  label: string;
  value: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const OBS_TYPES = [
  {
    id: "langfuse",
    icon: "🔭",
    color: "#8b5cf6",
    title: "Trace Monitoring — Langfuse",
    subtitle: "Every token. Every decision. Immutable.",
    description:
      "Langfuse is an open-source LLM observability platform that captures the full lifecycle of every AI call — inputs, outputs, latency, cost, token counts, and model metadata. In finance, this means an immutable audit trail for every AI-generated output: from a market summary to a trade rationale. You can replay any trace, compare versions, and drill into the exact retrieval chunk that caused a bad answer.",
    bullets: [
      "End-to-end traces: prompt → retrieval → generation → evaluation",
      "Compare model versions before production rollout",
      "Root-cause hallucinations to the exact retrieval step",
      "Cost attribution per workflow, team, or client mandate",
    ],
  },
  {
    id: "judge",
    icon: "⚖️",
    color: "#3b82f6",
    title: "LLM-as-a-Judge",
    subtitle: "AI evaluating AI — at scale, asynchronously",
    description:
      "Rather than manually reviewing thousands of outputs, deploy a separate, highly-capable model (e.g. Claude Opus 4) as an automated evaluator. It scores each output against predefined finance-specific criteria: factual accuracy, source faithfulness, hallucination presence, regulatory tone, and confidence. Runs asynchronously — zero latency impact on users.",
    bullets: [
      "Hallucination detection on every client-facing output",
      "Regulatory tone checks — FCA, SEC language compliance",
      "Faithfulness scoring: does the answer match the source data?",
      "Structured verdicts with reasoning chains, not just scores",
    ],
  },
  {
    id: "groundtruth",
    icon: "🎯",
    color: "#10b981",
    title: "Ground Truth Evaluation",
    subtitle: "Known correct answers as your regression suite",
    description:
      "Maintain a curated 'golden dataset' of questions paired with verified correct answers — financial ratios, regulatory thresholds, historical data points, standard accounting treatments. Run your AI against these continuously to detect drift and regressions after every model update or prompt change, before they reach users.",
    bullets: [
      "500+ verified financial Q&A pairs covering common workflows",
      "Automated regression testing on every model or prompt change",
      "Catches silent performance degradation before users see it",
      "Segmented by type: regulatory, market data, internal analytics",
    ],
  },
  {
    id: "guardrails",
    icon: "🛡️",
    color: "#f59e0b",
    title: "Guardrails",
    subtitle: "Input + output validation — real-time",
    description:
      "Guardrails sit as a synchronous middleware layer. Input guardrails block harmful, off-topic, or regulatory-grey queries before they reach the model. Output guardrails scrub the response: strip PII, add required FCA/SEC disclaimers, cap financial projections to allowed ranges, and flag uncertainty. Key frameworks: Guardrails AI, NVIDIA NeMo Guardrails, LlamaGuard.",
    bullets: [
      "Input: block jailbreaks, off-topic queries, grey-area requests",
      "Output: add mandatory disclosures, strip PII, bound projections",
      "Real-time — applied in <25ms before output reaches user",
      "Fully auditable: every guardrail trigger is logged in Langfuse",
    ],
  },
];

const INDUSTRY_TOOLS = [
  { name: "Langfuse",     role: "Trace & evaluation",       logo: "🔭", color: "#8b5cf6", type: "Open Source" },
  { name: "LangSmith",   role: "LangChain observability",  logo: "🔗", color: "#f59e0b", type: "Commercial"  },
  { name: "Arize Phoenix",role: "LLM + ML monitoring",     logo: "🦅", color: "#ef4444", type: "Open Source" },
  { name: "Guardrails AI",role: "Output validation",       logo: "🛡️", color: "#10b981", type: "Open Source" },
  { name: "NVIDIA NeMo", role: "Enterprise guardrails",    logo: "⚡", color: "#3b82f6", type: "Commercial"  },
  { name: "Datadog LLM", role: "Infra + LLM monitoring",  logo: "🐕", color: "#06b6d4", type: "Commercial"  },
];

const DEMO_QUERIES = [
  {
    id: "ebitda",
    label: "EBITDA margin vs peers",
    query: "Compare our Q3 2025 EBITDA margin to sector peers and flag any material divergence.",
    spans: [
      { id: "intent",       label: "Intent Classification",  ms: 42,  status: "ok"   as const, color: "#8b5cf6", detail: "Query type: Comparative analysis · Sensitivity: Internal + Public · Auth: Analyst+" },
      { id: "guard-in",    label: "Input Guardrail",         ms: 18,  status: "ok"   as const, color: "#f59e0b", detail: "PII check: Clean · Query scope: Permitted · Jailbreak: None detected" },
      { id: "retrieval",   label: "RAG Retrieval",           ms: 210, status: "ok"   as const, color: "#3b82f6", detail: "Sources: GL Q3 report, Bloomberg peer comps, Analyst consensus · 4 chunks · Score ≥ 0.82" },
      { id: "llm",         label: "LLM Generation",          ms: 380, status: "ok"   as const, color: "#10b981", detail: "Model: claude-sonnet-4-6 · Tokens: 1,240 in / 380 out · Temp: 0.2 · Cost: £0.004" },
      { id: "judge",       label: "LLM-as-Judge Eval",       ms: 145, status: "ok"   as const, color: "#3b82f6", detail: "Accuracy: 9.4/10 · Faithfulness: 9.1/10 · Hallucinations: 0 · Citations verified: 4" },
      { id: "guard-out",   label: "Output Guardrail",        ms: 22,  status: "ok"   as const, color: "#f59e0b", detail: "FCA disclaimer added · PII: None · Projection bounds: Within ±5% tolerance" },
    ] as TraceSpan[],
    evals: [
      { label: "Hallucination",  value: "None",   status: "pass" as const, detail: "All 4 factual claims traced to primary source documents" },
      { label: "Accuracy",       value: "9.4/10", status: "pass" as const, detail: "LLM judge verified output against ground truth Q3 dataset" },
      { label: "Faithfulness",   value: "9.1/10", status: "pass" as const, detail: "Output consistent with all retrieved context chunks" },
      { label: "Disclaimer",     value: "Added",  status: "pass" as const, detail: "FCA-required investment disclaimer automatically appended" },
      { label: "PII",            value: "None",   status: "pass" as const, detail: "No personal or client-identifiable data in input or output" },
      { label: "Confidence",     value: "High",   status: "pass" as const, detail: "Model certainty: 94% · Human escalation: Not required" },
    ] as EvalResult[],
  },
  {
    id: "anomaly",
    label: "Unusual GL transactions",
    query: "Which GL accounts show statistically unusual activity this month vs. their historical baseline?",
    spans: [
      { id: "intent",       label: "Intent Classification",  ms: 38,  status: "ok"   as const, color: "#8b5cf6", detail: "Query type: Anomaly detection · Sensitivity: High — internal financial data" },
      { id: "guard-in",    label: "Input Guardrail",         ms: 15,  status: "ok"   as const, color: "#f59e0b", detail: "Scope: Permitted analyst query · Auth level: Finance Controller · Rate limit: OK" },
      { id: "sql",         label: "SQL Weaver Tool Call",    ms: 320, status: "ok"   as const, color: "#10b981", detail: "Z-score analysis · 847 GL accounts · 2.3M rows scanned · Runtime: 318ms" },
      { id: "llm",         label: "LLM Generation",          ms: 290, status: "warn" as const, color: "#f59e0b", detail: "⚠ Low confidence on 2 accounts — historical data gap pre-2022. Flagged for review." },
      { id: "judge",       label: "LLM-as-Judge Eval",       ms: 160, status: "warn" as const, color: "#f59e0b", detail: "Accuracy: 8.1/10 · 2 claims: 'insufficient data' · Escalation: Recommended" },
      { id: "guard-out",   label: "Output Guardrail",        ms: 24,  status: "ok"   as const, color: "#f59e0b", detail: "Uncertainty disclosure added · Human review flag triggered for GL-7821, GL-3302" },
    ] as TraceSpan[],
    evals: [
      { label: "Hallucination",  value: "None",     status: "pass" as const, detail: "All anomaly flags backed by direct statistical computation" },
      { label: "Accuracy",       value: "8.1/10",   status: "warn" as const, detail: "2 accounts have insufficient baseline — flagged in output" },
      { label: "Faithfulness",   value: "8.8/10",   status: "pass" as const, detail: "Output narrative consistent with SQL result set" },
      { label: "Disclaimer",     value: "Added",    status: "pass" as const, detail: "Data-gap caveat and uncertainty disclosure included" },
      { label: "Confidence",     value: "Medium",   status: "warn" as const, detail: "2 items routed to human review — insufficient history" },
      { label: "Human Review",   value: "Required", status: "warn" as const, detail: "GL-7821 + GL-3302 escalated to Group Controller" },
    ] as EvalResult[],
  },
];

const STATUS_COLOR = { ok: "#10b981", warn: "#f59e0b", error: "#ef4444" };
const EVAL_COLOR   = { pass: "#10b981", warn: "#f59e0b", fail: "#ef4444" };
const EVAL_BG      = { pass: "#10b98110", warn: "#f59e0b10", fail: "#ef444410" };

// ─── Trace viewer ─────────────────────────────────────────────────────────────

function TraceViewer({ spans, active }: { spans: TraceSpan[]; active: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const totalMs = spans.reduce((s, sp) => s + sp.ms, 0);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Trace spans</span>
        <span className="text-xs font-mono text-gray-400">{totalMs}ms total</span>
      </div>

      {spans.map((span, i) => {
        const widthPct = Math.max((span.ms / totalMs) * 100, 8);
        const isSel    = selected === span.id;
        return (
          <div key={span.id}>
            <motion.button
              onClick={() => setSelected(isSel ? null : span.id)}
              initial={{ opacity: 0, x: -8 }}
              animate={active ? { opacity: 1, x: 0 } : { opacity: 0.25, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="w-full group text-left"
            >
              <div className="flex items-center gap-2 py-0.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: STATUS_COLOR[span.status] }} />

                <span className="text-xs text-gray-600 w-40 truncate flex-shrink-0">{span.label}</span>

                <div className="flex-1 h-5 bg-gray-100 rounded relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={active ? { width: `${widthPct}%` } : { width: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 + 0.1, ease: "easeOut" }}
                    className="absolute left-0 top-0 h-full rounded"
                    style={{ background: `${span.color}35`, border: `1px solid ${span.color}50` }}
                  />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={active ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: i * 0.1 + 0.45 }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono"
                    style={{ color: span.color }}
                  >
                    {span.ms}ms
                  </motion.span>
                </div>

                <span className="text-xs font-semibold w-10 text-right flex-shrink-0"
                  style={{ color: STATUS_COLOR[span.status] }}>
                  {span.status}
                </span>
              </div>
            </motion.button>

            <AnimatePresence>
              {isSel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="ml-4 mb-1.5 pl-3 py-2 text-xs text-gray-600 leading-relaxed rounded-lg"
                    style={{ background: `${span.color}08`, borderLeft: `3px solid ${span.color}40` }}>
                    {span.detail}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Eval panel ───────────────────────────────────────────────────────────────

function EvalPanel({ evals, active }: { evals: EvalResult[]; active: boolean }) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
        LLM-as-Judge Results
      </div>
      <div className="space-y-2">
        {evals.map((ev, i) => (
          <motion.div
            key={ev.label}
            initial={{ opacity: 0, y: 4 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0.25, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 + 0.3 }}
            className="flex items-start gap-3 p-2.5 rounded-xl"
            style={{ background: EVAL_BG[ev.status], border: `1px solid ${EVAL_COLOR[ev.status]}25` }}
          >
            <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
              style={{ background: EVAL_COLOR[ev.status] }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gray-700">{ev.label}</span>
                <span className="text-xs font-bold font-mono flex-shrink-0"
                  style={{ color: EVAL_COLOR[ev.status] }}>
                  {ev.value}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{ev.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function BottomLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  const [activeType,  setActiveType]  = useState(0);
  const [activeQuery, setActiveQuery] = useState(0);
  const [running,     setRunning]     = useState(false);
  const [done,        setDone]        = useState(false);

  const demo = DEMO_QUERIES[activeQuery];

  const runTrace = () => {
    if (running) return;
    setRunning(false);
    setDone(false);
    requestAnimationFrame(() => {
      setRunning(true);
      const totalMs = demo.spans.reduce((s, sp) => s + sp.ms, 0);
      setTimeout(() => { setRunning(false); setDone(true); }, totalMs + 700);
    });
  };

  const switchQuery = (i: number) => {
    setActiveQuery(i);
    setRunning(false);
    setDone(false);
  };

  return (
    <section id="roi" ref={ref} className="relative min-h-screen py-28 bg-[#F3F2EF] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-200 bg-violet-50 mb-6">
            <span className="text-violet-700 text-xs font-semibold tracking-widest uppercase">
              Phase 07 · LLM Observability
            </span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            You can&apos;t trust<br />
            <span className="text-violet-600">what you can&apos;t see.</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            In finance, a wrong AI answer isn&apos;t an inconvenience — it&apos;s a liability.
            Observability is how you make every AI decision visible, measurable, and auditable.
            <strong className="text-gray-800"> Langfuse is the platform that makes this real.</strong>
          </motion.p>
        </div>

        {/* ── Four types of observability ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20">

          {/* Tab sidebar */}
          <div className="lg:col-span-4 space-y-2">
            {OBS_TYPES.map((type, i) => (
              <motion.button
                key={type.id}
                onClick={() => setActiveType(i)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 2 }}
                className="w-full text-left rounded-2xl p-4 border transition-all duration-200"
                style={activeType === i ? {
                  borderWidth: 2,
                  borderColor: type.color,
                  background: `${type.color}08`,
                  boxShadow: `0 4px 20px ${type.color}20`,
                } : { background: "#fff", borderColor: "#E5E7EB", borderWidth: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${type.color}15`, border: `1.5px solid ${type.color}30` }}>
                    {type.icon}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-sm font-bold leading-tight ${activeType === i ? "text-gray-900" : "text-gray-700"}`}>
                      {type.title}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: activeType === i ? type.color : "#9CA3AF" }}>
                      {type.subtitle}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {(() => {
                const type = OBS_TYPES[activeType];
                return (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28 }}
                    className="light-card rounded-2xl p-7 h-full"
                    style={{ borderLeft: `4px solid ${type.color}` }}
                  >
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ background: `${type.color}15`, border: `2px solid ${type.color}30` }}>
                        {type.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 mb-1">{type.title}</h3>
                        <div className="text-sm font-medium" style={{ color: type.color }}>{type.subtitle}</div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{type.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {type.bullets.map((b, bi) => (
                        <motion.div key={bi}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: bi * 0.07 }}
                          className="flex items-start gap-2.5 p-3 rounded-xl"
                          style={{ background: `${type.color}08`, border: `1px solid ${type.color}20` }}>
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ background: type.color }} />
                          <span className="text-xs text-gray-700 leading-relaxed">{b}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Industry ecosystem ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-20">
          <div className="text-center mb-7">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">The Ecosystem</div>
            <div className="text-2xl font-black text-gray-900">Tools the industry uses</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {INDUSTRY_TOOLS.map((tool, i) => (
              <motion.div key={tool.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3, boxShadow: `0 8px 24px ${tool.color}25` }}
                className="light-card rounded-xl p-4 text-center transition-all duration-200">
                <div className="text-2xl mb-2">{tool.logo}</div>
                <div className="text-sm font-bold text-gray-800 mb-0.5">{tool.name}</div>
                <div className="text-xs text-gray-500 mb-2 leading-tight">{tool.role}</div>
                <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ color: tool.color, background: `${tool.color}15`, border: `1px solid ${tool.color}25` }}>
                  {tool.type}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Interactive Langfuse trace demo ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }}>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-200 bg-violet-50 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-violet-700 text-xs font-semibold uppercase tracking-widest">See it in action</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">A Langfuse trace, live.</h3>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
              Choose a finance query, run it, and watch the full observability stack fire in real time —
              input guardrails, retrieval, LLM generation, LLM-as-judge, output guardrails.
              <span className="text-gray-800 font-medium"> Click any span to inspect its detail.</span>
            </p>
          </div>

          <div className="light-card rounded-2xl overflow-hidden shadow-lg">

            {/* Langfuse-style header bar */}
            <div className="px-5 py-3.5 bg-gray-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-gray-400 text-xs font-mono ml-1">
                  Langfuse · FS Analytics · Trace Explorer
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  running ? "bg-amber-400 animate-pulse" : done ? "bg-emerald-400" : "bg-gray-600"
                }`} />
                <span className="text-gray-500 text-xs font-mono">
                  {running ? "running…" : done ? "complete" : "ready"}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Query selector row */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 space-y-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Select query</div>
                  <div className="flex gap-2 flex-wrap">
                    {DEMO_QUERIES.map((q, i) => (
                      <button key={q.id} onClick={() => switchQuery(i)}
                        className={`px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                          activeQuery === i
                            ? "border-violet-400 bg-violet-50 text-violet-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-violet-300"
                        }`}>
                        {q.label}
                      </button>
                    ))}
                  </div>
                  <div className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 italic">
                    &ldquo;{demo.query}&rdquo;
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <motion.button
                    onClick={runTrace}
                    whileHover={!running ? { scale: 1.03 } : {}}
                    whileTap={!running ? { scale: 0.97 } : {}}
                    disabled={running}
                    className={`px-7 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                      running   ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
                      done      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md" :
                                  "bg-violet-600 text-white hover:bg-violet-700 shadow-md"
                    }`}>
                    {running ? "⏳ Running…" : done ? "▶ Run Again" : "▶ Run Trace"}
                  </motion.button>
                </div>
              </div>

              {/* Two-column: trace + evals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Trace spans */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <TraceViewer spans={demo.spans} active={running || done} />

                  <AnimatePresence>
                    {done && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Total latency</span>
                        <span className="text-sm font-bold font-mono text-gray-800">
                          {demo.spans.reduce((s, sp) => s + sp.ms, 0)}ms
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Eval results */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <EvalPanel evals={demo.evals} active={running || done} />

                  <AnimatePresence>
                    {done && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200">
                        {demo.evals.some(e => e.status === "warn") ? (
                          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2.5 rounded-xl border border-amber-200">
                            <span>⚠</span>
                            <span>Human review triggered — flagged items routed to controller</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2.5 rounded-xl border border-emerald-200">
                            <span>✓</span>
                            <span>All checks passed — output approved for delivery</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {!running && !done && (
                <div className="text-center mt-5 text-gray-400 text-sm">
                  ↑ Click <span className="font-semibold text-violet-600">Run Trace</span> to see the full observability stack fire
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Closing ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 light-card rounded-2xl p-8 text-center border-t-4 border-violet-500">
          <div className="text-3xl mb-3">✨</div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">The future doesn&apos;t wait.</h3>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            The firms that will lead the next decade aren&apos;t the ones with the most data.
            They&apos;re the ones that build AI systems they can
            <strong className="text-gray-800"> trust</strong>,
            <strong className="text-gray-800"> measure</strong>, and
            <strong className="text-gray-800"> continuously improve</strong>.
            Observability is the foundation. Every trace is a step toward that edge.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-gray-400">
            <span>FS Analytics · AI Briefing · March 2026</span>
            <span>·</span>
            <span>By Binay</span>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
