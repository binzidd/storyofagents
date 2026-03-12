"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

function FlowAgentViz({ isVisible }: { isVisible: boolean }) {
  const steps = [
    { label: "KYC Data Received", icon: "📥", color: "#3b82f6" },
    { label: "Identity Verified", icon: "✅", color: "#3b82f6" },
    { label: "Risk Scored", icon: "⚡", color: "#3b82f6" },
    { label: "Compliance Check", icon: "⚖️", color: "#3b82f6" },
    { label: "Account Approved", icon: "🏦", color: "#10b981" },
  ];

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.5, delay: i * 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: `${step.color}20`, border: `1px solid ${step.color}40` }}
            >
              {step.icon}
            </div>
            <div className="flex-1 h-10 rounded-lg glass-card flex items-center px-3">
              <span className="text-white text-sm font-medium">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.3, delay: i * 0.2 + 0.4 }}
                className="text-blue-500 text-xl origin-left"
              >
                ↓
              </motion.div>
            )}
          </div>

          {/* Progress indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.3, delay: i * 0.2 + 0.3 }}
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: `${step.color}20`, border: `1px solid ${step.color}` }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: step.color }} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function FunctionAgentViz({ isVisible }: { isVisible: boolean }) {
  const nodes = [
    { label: "Optimize Tax Burden", x: 50, y: 10, color: "#8b5cf6", main: true },
    { label: "Harvest Losses", x: 10, y: 45, color: "#8b5cf6", main: false },
    { label: "Rebalance Sectors", x: 85, y: 40, color: "#8b5cf6", main: false },
    { label: "Check Wash Rules", x: 25, y: 78, color: "#ef4444", main: false },
    { label: "Execute Trades", x: 70, y: 75, color: "#10b981", main: false },
  ];

  const connections = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [1, 2]
  ];

  return (
    <div className="relative h-64">
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(([from, to], i) => {
          const fromNode = nodes[from];
          const toNode = nodes[to];
          return (
            <motion.line
              key={i}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y + 5}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y + 5}%`}
              stroke="#8b5cf6"
              strokeWidth="1"
              strokeOpacity="0.3"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isVisible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 + 0.5 }}
            />
          );
        })}
      </svg>

      {nodes.map((node, i) => (
        <motion.div
          key={node.label}
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}%`, top: `${node.y + 5}%` }}
        >
          <motion.div
            animate={isVisible ? {
              boxShadow: [`0 0 10px ${node.color}40`, `0 0 25px ${node.color}80`, `0 0 10px ${node.color}40`]
            } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            className={`rounded-xl px-3 py-2 text-center cursor-default ${node.main ? 'border-2' : 'border'}`}
            style={{
              background: `${node.color}15`,
              borderColor: `${node.color}60`,
              minWidth: '100px'
            }}
          >
            <div className="text-xs font-medium" style={{ color: node.color }}>
              {node.label}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export default function TheWorkforce() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-15%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section id="workforce" ref={ref} className="relative min-h-screen py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050814] via-[#08091c] to-[#050814]" />

      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-6"
          >
            <span className="text-emerald-400 text-xs font-medium tracking-widest uppercase">Phase 03</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            From assistant
            <br />
            to <span className="text-emerald-400">workforce.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Not all AI agents are built alike. The architecture you choose determines
            whether your AI is a reliable processor or an autonomous problem-solver.
          </motion.p>
        </div>

        {/* Split comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

          {/* Flow Agents */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card rounded-2xl p-8 border border-blue-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                🔄
              </div>
              <div>
                <div className="text-white font-bold text-xl">Flow Agents</div>
                <div className="text-blue-400 text-sm">Deterministic Processors</div>
              </div>
              <div className="ml-auto px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                Predictable
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Like a well-engineered assembly line. Every step is defined, auditable, and repeatable.
              <span className="text-white"> Step A always precedes Step B.</span>
              Regulators love them. Auditors can trace every decision.
            </p>

            <FlowAgentViz isVisible={isInView} />

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-widest">Best For</div>
              <div className="flex flex-wrap gap-2">
                {["KYC/AML Routing", "Loan Processing", "Trade Confirmation", "Regulatory Reporting"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Function Agents */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card rounded-2xl p-8 border border-violet-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-2xl">
                🧠
              </div>
              <div>
                <div className="text-white font-bold text-xl">Function Agents</div>
                <div className="text-violet-400 text-sm">Autonomous Problem Solvers</div>
              </div>
              <div className="ml-auto px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium">
                Adaptive
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Give them a goal, not a script.
              <span className="text-white"> &ldquo;Optimize this portfolio&apos;s Q4 tax burden&rdquo;</span> —
              and they determine which tools to use, in what order, and how to adapt when market conditions shift mid-execution.
            </p>

            <FunctionAgentViz isVisible={isInView} />

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-widest">Best For</div>
              <div className="flex flex-wrap gap-2">
                {["Portfolio Optimization", "M&A Due Diligence", "Market Research", "Tax Strategy"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs border border-violet-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom insight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-2xl p-6 border border-white/5 text-center max-w-3xl mx-auto"
        >
          <div className="text-white font-semibold mb-2">The Strategic Choice</div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Leading financial institutions aren&apos;t choosing between Flow and Function —
            they&apos;re deploying <span className="text-white">hybrid architectures</span>.
            Flow agents handle the regulated core; Function agents tackle the complex edge cases humans used to own.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
