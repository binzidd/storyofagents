"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const tools = [
  { icon: "📊", label: "Bloomberg Terminal", desc: "Live market data", color: "#f59e0b", angle: -60 },
  { icon: "🗄️", label: "SQL Database", desc: "Enterprise records", color: "#3b82f6", angle: -20 },
  { icon: "📧", label: "Email & Comms", desc: "Client correspondence", color: "#8b5cf6", angle: 20 },
  { icon: "📈", label: "Portfolio Systems", desc: "Risk & returns", color: "#10b981", angle: 60 },
  { icon: "⚖️", label: "Compliance Engine", desc: "Regulatory checks", color: "#ef4444", angle: 100 },
  { icon: "📋", label: "Report Generator", desc: "Board-ready decks", color: "#06b6d4", angle: 140 },
];

function ToolNode({ tool, index, isVisible }: { tool: typeof tools[0], index: number, isVisible: boolean }) {
  const rad = (tool.angle * Math.PI) / 180;
  const radius = 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={isVisible ? {
        opacity: 1,
        scale: 1,
        x,
        y,
      } : { opacity: 0, scale: 0, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
      className="absolute"
    >
      {/* Connection line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
        className="absolute top-1/2 left-1/2 h-px origin-left"
        style={{
          width: radius,
          transform: `translate(-50%, -50%) rotate(${tool.angle + 180}deg)`,
          background: `linear-gradient(to right, ${tool.color}40, ${tool.color}10)`,
        }}
      />
      <div
        className="relative -translate-x-1/2 -translate-y-1/2 w-24 glass-card rounded-xl p-3 text-center cursor-default"
        style={{ border: `1px solid ${tool.color}40` }}
      >
        <div className="text-2xl mb-1">{tool.icon}</div>
        <div className="text-white text-xs font-semibold leading-tight">{tool.label}</div>
        <div className="text-gray-500 text-xs mt-0.5">{tool.desc}</div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
          style={{ background: tool.color }}
        />
      </div>
    </motion.div>
  );
}

export default function InternPhase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section id="intern" ref={ref} className="relative min-h-screen py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050814] via-[#070a1a] to-[#050814]" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-6"
          >
            <span className="text-violet-400 text-xs font-medium tracking-widest uppercase">Phase 02</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            Talking wasn&apos;t enough.
            <br />
            <span className="text-violet-400">We needed AI to</span>{" "}
            <span className="shimmer-text">do.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Tool Calling gave AI the ability to act on the world — not just describe it.
            Suddenly, a language model could reach into your Bloomberg terminal, query your loan database,
            and draft the compliance summary — all from a single instruction.
          </motion.p>
        </div>

        {/* Central visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: AI Core with sprouting connections */}
          <div className="flex items-center justify-center">
            <div className="relative w-[480px] h-[480px] flex items-center justify-center">
              {/* AI Core */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 w-28 h-28 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center animate-pulse-glow"
              >
                <div className="text-center">
                  <div className="text-4xl">🤖</div>
                  <div className="text-white text-xs font-bold mt-1">AI Core</div>
                </div>

                {/* Ripple rings */}
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-2xl border border-violet-500/30"
                    animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 }}
                  />
                ))}
              </motion.div>

              {/* Tool nodes */}
              {tools.map((tool, i) => (
                <ToolNode key={tool.label} tool={tool} index={i} isVisible={isInView} />
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card rounded-2xl p-6 border border-violet-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <span className="text-violet-400 text-lg">🤝</span>
                </div>
                <div>
                  <div className="text-white font-bold">Copilot Agents</div>
                  <div className="text-violet-400 text-xs">Human-in-the-loop AI</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Think of it as your most diligent junior analyst — one who never sleeps, never misses a data point,
                and can query your entire enterprise data warehouse in seconds.
                <span className="text-white"> The human remains the pilot</span>; the AI is the executor.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  title: "Morning Brief Automation",
                  desc: "Pulls overnight market data, sentiment analysis, and portfolio performance into a CEO-ready brief. What took an analyst 90 minutes now takes 4 seconds.",
                  time: "90min → 4sec",
                  color: "blue"
                },
                {
                  title: "SQL-to-Insight Pipeline",
                  desc: "Ask 'What are our top 10 underperforming loans by sector?' in plain English. The copilot writes and executes the query, then interprets the results.",
                  time: "Natural Language",
                  color: "emerald"
                },
                {
                  title: "Compliance Pre-screening",
                  desc: "Before any trade confirmation reaches a compliance officer, the AI copilot flags regulatory conflicts, cross-references policy documents, and drafts the rationale.",
                  time: "24/7 Coverage",
                  color: "amber"
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                  className="glass-card rounded-xl p-4 border border-white/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-white font-medium text-sm mb-1">{item.title}</div>
                      <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                    </div>
                    <div className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-mono font-bold ${
                      item.color === "blue" ? "bg-blue-500/20 text-blue-400" :
                      item.color === "emerald" ? "bg-emerald-500/20 text-emerald-400" :
                      "bg-amber-500/20 text-amber-400"
                    }`}>
                      {item.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
