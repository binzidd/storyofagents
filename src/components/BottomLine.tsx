"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return controls.stop;
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

const metrics = [
  {
    category: "Accuracy & Trust",
    icon: "🎯",
    color: "#3b82f6",
    kpis: [
      { label: "Hallucination Rate Target", value: "<0.1%", desc: "For any client-facing output. Verified by independent fact-checking agent layer." },
      { label: "Source Attribution", value: "100%", desc: "Every claim traceable to a primary source. No black-box conclusions in regulated outputs." },
      { label: "Confidence Scoring", value: "Required", desc: "Outputs graded by certainty level. Low-confidence items escalated to human review." },
    ]
  },
  {
    category: "Speed vs. Depth",
    icon: "⚡",
    color: "#f59e0b",
    kpis: [
      { label: "Trade Decision Latency", value: "< 200ms", desc: "High-frequency signal generation. Optimized for execution, not explanation." },
      { label: "Quarterly Report Generation", value: "4 hours", desc: "Full analyst-grade narrative with supporting data. Was: 3 weeks." },
      { label: "Real-time Risk Alerts", value: "Continuous", desc: "24/7 portfolio monitoring with immediate escalation on threshold breaches." },
    ]
  },
  {
    category: "Workflow ROI",
    icon: "💰",
    color: "#10b981",
    kpis: [
      { label: "Reconciliation Hours Saved", value: "73%", desc: "Automated cross-system reconciliation. Errors caught before end-of-day." },
      { label: "Loan Processing Throughput", value: "4.2x", desc: "Increased application capacity without headcount addition." },
      { label: "Compliance Review Time", value: "−61%", desc: "Pre-screened submissions. Officers focused on exceptions, not routine checks." },
    ]
  },
];

export default function BottomLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section id="roi" ref={ref} className="relative min-h-screen py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050814] via-[#060d14] to-[#050814]" />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-6"
          >
            <span className="text-emerald-400 text-xs font-medium tracking-widest uppercase">Phase 06 — The Business Case</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            It&apos;s not about
            <br />
            parameters.
            <br />
            <span className="text-emerald-400">It&apos;s about returns.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Finance evaluates AI differently. Forget benchmark scores.
            The questions that matter: <span className="text-white">What does a wrong answer cost?</span>
            How fast does it need to be? What does it free up your people to do?
          </motion.p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {metrics.map((metric, mi) => (
            <motion.div
              key={metric.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: mi * 0.15 }}
              className="glass-card rounded-2xl p-6"
              style={{ border: `1px solid ${metric.color}25` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${metric.color}20` }}
                >
                  {metric.icon}
                </div>
                <div>
                  <div className="text-white font-bold">{metric.category}</div>
                  <div className="text-xs" style={{ color: metric.color }}>Key Performance Indicators</div>
                </div>
              </div>

              <div className="space-y-4">
                {metric.kpis.map((kpi, ki) => (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: mi * 0.15 + ki * 0.1 }}
                    className="border-t border-white/5 pt-4 first:border-0 first:pt-0"
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-gray-400 text-xs">{kpi.label}</span>
                      <span
                        className="text-sm font-bold font-mono"
                        style={{ color: metric.color }}
                      >
                        {kpi.value}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed">{kpi.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ROI summary */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-2xl p-8 border border-emerald-500/20 mb-16"
        >
          <div className="text-center mb-8">
            <div className="text-white font-bold text-2xl mb-2">The Compounding Advantage</div>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              Unlike human productivity gains that plateau, AI compound returns accelerate.
              Each workflow improved creates data that makes the next improvement faster.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Hours Returned to Senior Staff", value: 2400, suffix: "hrs/yr", color: "#3b82f6" },
              { label: "Faster Compliance Turnaround", value: 61, suffix: "%", color: "#f59e0b" },
              { label: "Reduction in Reporting Errors", value: 89, suffix: "%", color: "#10b981" },
              { label: "Increase in Loan Throughput", value: 320, suffix: "%", color: "#8b5cf6" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-black mb-2"
                  style={{ color: item.color }}
                >
                  <AnimatedNumber value={item.value} suffix={item.suffix} />
                </div>
                <div className="text-gray-500 text-xs leading-tight">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Evaluation Framework */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 border border-white/5"
        >
          <div className="text-white font-bold text-xl mb-6 text-center">
            The Finance AI Evaluation Framework
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: "What's the cost of a hallucination?", a: "Define acceptable error rates before deployment. Build independent verification layers for high-stakes outputs." },
              { q: "Latency or depth — which matters more?", a: "Trading infrastructure demands sub-second response. Quarterly reporting demands comprehensive synthesis. Architect accordingly." },
              { q: "How do we maintain regulatory oversight?", a: "Every AI decision must be traceable. Flow agents provide audit trails; Function agents must log their reasoning chains." },
              { q: "What's our build vs. buy threshold?", a: "MCP-compatible tools reduce the integration burden. Focus custom engineering on your proprietary data advantages, not plumbing." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-white/5 p-4"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="text-emerald-400 font-medium text-sm mb-2">{item.q}</div>
                <p className="text-gray-500 text-xs leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
