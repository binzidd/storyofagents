"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const agents = [
  { id: "quant", label: "Quant Agent", icon: "📊", color: "#3b82f6", x: 50, y: 5, desc: "Identifies alpha" },
  { id: "risk", label: "Risk Agent", icon: "🔴", color: "#ef4444", x: 85, y: 40, desc: "Challenges exposure" },
  { id: "compliance", label: "Compliance Agent", icon: "⚖️", color: "#f59e0b", x: 70, y: 80, desc: "Enforces rules" },
  { id: "execution", label: "Execution Agent", icon: "⚡", color: "#10b981", x: 30, y: 80, desc: "Executes trades" },
  { id: "auditor", label: "Audit Agent", icon: "📋", color: "#8b5cf6", x: 15, y: 40, desc: "Records decisions" },
];

const connections = [
  { from: 0, to: 1, label: "Strategy proposal" },
  { from: 1, to: 2, label: "Risk challenge" },
  { from: 2, to: 3, label: "Compliance clearance" },
  { from: 3, to: 4, label: "Execution log" },
  { from: 4, to: 0, label: "Audit feedback" },
  { from: 0, to: 2, label: "Direct check" },
];

export default function A2ASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-15%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section id="a2a" ref={ref} className="relative min-h-screen py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050814] via-[#080a18] to-[#050814]" />

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-violet-500/5 blur-3xl" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-6"
          >
            <span className="text-violet-400 text-xs font-medium tracking-widest uppercase">Phase 05 — The Frontier</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            The virtual
            <br />
            <span className="text-violet-400">firm.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Agent-to-Agent (A2A) is where AI stops being a tool and starts being an organization.
            Specialized agents collaborating, challenging each other, and reaching consensus —
            the way your best teams do, at machine speed.
          </motion.p>
        </div>

        {/* Evolution timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {[
            {
              era: "LLM + Tools",
              desc: "One brilliant analyst trying to use 50 tools simultaneously. Inevitable bottleneck.",
              icon: "🔧",
              color: "gray",
              problem: "Bottleneck"
            },
            {
              era: "MCP",
              desc: "Standardized data pipeline. Clean, secure, scalable access to enterprise systems.",
              icon: "🔗",
              color: "cyan",
              problem: "Infrastructure"
            },
            {
              era: "A2A",
              desc: "The virtual firm. Specialized agents collaborating like a world-class team.",
              icon: "🌐",
              color: "violet",
              problem: "Scale"
            },
          ].map((item, i) => (
            <motion.div
              key={item.era}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`glass-card rounded-2xl p-6 border ${
                item.color === "violet"
                  ? "border-violet-500/30 bg-violet-500/5"
                  : item.color === "cyan"
                  ? "border-cyan-500/20"
                  : "border-white/5"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{item.icon}</div>
                <div className={`text-xs font-mono px-2 py-1 rounded ${
                  item.color === "violet" ? "bg-violet-500/20 text-violet-400" :
                  item.color === "cyan" ? "bg-cyan-500/20 text-cyan-400" :
                  "bg-white/5 text-gray-500"
                }`}>
                  {item.problem}
                </div>
              </div>
              <div className="text-white font-bold text-lg mb-2">{item.era}</div>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>

              {i < 2 && (
                <div className="mt-4 flex justify-end">
                  <span className="text-gray-600 text-xl">→</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Agent Network Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Network viz */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative h-[400px]"
          >
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" opacity="0.6" />
                </marker>
              </defs>

              {connections.map(({ from, to }, i) => {
                const fromAgent = agents[from];
                const toAgent = agents[to];
                return (
                  <motion.line
                    key={i}
                    x1={`${fromAgent.x}%`}
                    y1={`${fromAgent.y + 5}%`}
                    x2={`${toAgent.x}%`}
                    y2={`${toAgent.y + 5}%`}
                    stroke="#8b5cf6"
                    strokeWidth="1.5"
                    strokeOpacity="0.25"
                    strokeDasharray="6 4"
                    markerEnd="url(#arrowhead)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    transition={{ duration: 1.2, delay: i * 0.15 + 0.3 }}
                  />
                );
              })}
            </svg>

            {agents.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${agent.x}%`, top: `${agent.y + 5}%` }}
              >
                <motion.div
                  animate={isInView ? {
                    boxShadow: [
                      `0 0 15px ${agent.color}30`,
                      `0 0 35px ${agent.color}60`,
                      `0 0 15px ${agent.color}30`,
                    ]
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }}
                  className="glass-card rounded-2xl p-3 text-center cursor-default"
                  style={{
                    border: `1px solid ${agent.color}40`,
                    minWidth: '110px'
                  }}
                >
                  <div className="text-2xl mb-1">{agent.icon}</div>
                  <div className="text-white text-xs font-bold">{agent.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: agent.color }}>{agent.desc}</div>

                  {/* Activity pulse */}
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    className="mt-2 flex items-center justify-center gap-1"
                  >
                    <div className="w-1 h-1 rounded-full" style={{ background: agent.color }} />
                    <span className="text-xs font-mono" style={{ color: agent.color }}>active</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                {
                  title: "The Quant Agent identifies a momentum trade",
                  desc: "Screens 47,000 securities, finds 3 asymmetric risk/reward opportunities based on current market micro-structure.",
                  color: "#3b82f6"
                },
                {
                  title: "The Risk Agent challenges the thesis",
                  desc: "Cross-references with current portfolio exposure, identifies hidden correlation with existing positions, flags concentration risk.",
                  color: "#ef4444"
                },
                {
                  title: "The Compliance Agent adjudicates",
                  desc: "Reviews against current regulatory restrictions, client mandates, and ESG screens. Issues modified approval with sizing constraints.",
                  color: "#f59e0b"
                },
                {
                  title: "The Audit Agent records everything",
                  desc: "Every decision, challenge, and rationale is logged with full transparency — regulatory audit-ready from the moment of execution.",
                  color: "#8b5cf6"
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm mb-1">{item.title}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-xl p-4 border border-violet-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-violet-400 text-xs font-medium uppercase tracking-widest">The Bottom Line</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                A2A doesn&apos;t replace your investment committee. It <span className="text-white">augments it</span>.
                The human strategic vision at the top; a tireless, always-current, bias-free analytical layer beneath.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
