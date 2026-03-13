"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const OBS_TYPES = [
  {
    id: "langfuse",
    icon: "🔭",
    color: "#8b5cf6",
    title: "Trace Monitoring — Langfuse",
    subtitle: "Every token. Every decision. Immutable.",
    description:
      "Langfuse is an open-source LLM observability platform that captures the full lifecycle of every AI call: inputs, outputs, latency, cost, token counts, and model metadata. In finance, this means an immutable audit trail for every AI-generated output, from a market summary to a trade rationale. We can replay any trace, compare model versions, and drill into the exact retrieval chunk that caused a bad answer.",
    bullets: [
      "End-to-end traces: prompt to retrieval to generation to evaluation",
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
      "Rather than manually reviewing thousands of outputs, we deploy a separate, highly-capable model (e.g. Claude Opus 4) as an automated evaluator. It scores each output against predefined finance-specific criteria: factual accuracy, source faithfulness, hallucination presence, regulatory tone, and confidence. Runs asynchronously with zero latency impact on users.",
    bullets: [
      "Hallucination detection on every client-facing output",
      "Regulatory tone checks — ASIC, APRA language compliance",
      "Faithfulness scoring: does the answer match the source data?",
      "Structured verdicts with reasoning chains, not just scores",
    ],
  },
  {
    id: "groundtruth",
    icon: "🎯",
    color: "#10b981",
    title: "Ground Truth Evaluation",
    subtitle: "Known correct answers as our regression suite",
    description:
      "We maintain a curated golden dataset of questions paired with verified correct answers: financial ratios, regulatory thresholds, historical data points, standard accounting treatments. Run our AI against these continuously to detect drift and regressions after every model update or prompt change, before they reach users.",
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
      "Guardrails sit as a synchronous middleware layer. Input guardrails block harmful, off-topic, or regulatory-grey queries before they reach the model. Output guardrails scrub the response: strip PII, add required ASIC/APRA disclaimers, cap financial projections to allowed ranges, and flag uncertainty. Key frameworks: Guardrails AI, NVIDIA NeMo Guardrails, LlamaGuard.",
    bullets: [
      "Input: block jailbreaks, off-topic queries, grey-area requests",
      "Output: add mandatory ASIC/APRA disclosures, strip PII, bound projections",
      "Real-time — applied in <25ms before output reaches user",
      "Fully auditable: every guardrail trigger is logged in Langfuse",
    ],
  },
];

export default function BottomLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  const [activeType, setActiveType] = useState(0);

  return (
    <section id="roi" ref={ref} className="relative min-h-screen py-28 bg-[#F3F2EF] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-200 bg-violet-50 mb-6">
            <span className="text-violet-700 text-xs font-semibold tracking-widest uppercase">
              Phase 06 · LLM Observability
            </span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Deploying AI without observability<br />
            <span className="text-violet-600">is an audit finding waiting to happen.</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            In financial services, a wrong AI output is not an inconvenience. It is a regulatory event.
            Observability closes the gap between AI capability and institutional accountability.
            <strong className="text-gray-800"> Every inference traced. Every decision auditable. Every output evaluated.</strong>
          </motion.p>
        </div>

        {/* Four types of observability */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

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

      </motion.div>
    </section>
  );
}
