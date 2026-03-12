"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const dataSilos = [
  { label: "Salesforce CRM", icon: "☁️", color: "#00a1e0", x: 15, y: 15 },
  { label: "SAP ERP", icon: "⚙️", color: "#0066b3", x: 75, y: 12 },
  { label: "Bloomberg Feed", icon: "📡", color: "#f59e0b", x: 8, y: 60 },
  { label: "Risk Database", icon: "🔴", color: "#ef4444", x: 80, y: 58 },
  { label: "Compliance Docs", icon: "📋", color: "#8b5cf6", x: 42, y: 80 },
];

export default function MCPSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const mcpScale = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const mcpOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <section id="mcp" ref={ref} className="relative min-h-screen py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050814] via-[#060d1a] to-[#050814]" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6"
          >
            <span className="text-cyan-400 text-xs font-medium tracking-widest uppercase">Phase 04</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            The universal
            <br />
            <span className="text-cyan-400">translator</span> for AI.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            As AI agents proliferated, every new connection required custom engineering.
            Bloomberg integration for Agent A. Different CRM connector for Agent B.
            The result? A maintenance nightmare with compounding security risks.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">

          {/* Visualization */}
          <div className="relative h-[400px]">

            {/* Data Silos */}
            {dataSilos.map((silo, i) => (
              <motion.div
                key={silo.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="absolute"
                style={{ left: `${silo.x}%`, top: `${silo.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <motion.div
                  animate={isInView ? {
                    borderColor: [`${silo.color}80`, "#ef444480", `${silo.color}80`],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  className="glass-card rounded-xl p-3 text-center"
                  style={{ border: `1px solid ${silo.color}40`, minWidth: '110px' }}
                >
                  <div className="text-xl mb-1">{silo.icon}</div>
                  <div className="text-xs text-gray-300 font-medium">{silo.label}</div>

                  {/* Status indicator */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="mt-2 text-xs text-red-400 font-mono"
                  >
                    ⚠ Siloed
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}

            {/* MCP Ring - center */}
            <motion.div
              style={{ scale: mcpScale, opacity: mcpOpacity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative w-28 h-28">
                {/* Outer ring */}
                {[1, 1.5, 2].map((s, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border border-cyan-500/30"
                    style={{ transform: `scale(${s})` }}
                    animate={{ opacity: [0.2, 0.6, 0.2], rotate: i % 2 === 0 ? [0, 360] : [360, 0] }}
                    transition={{ duration: 6 + i * 2, repeat: Infinity }}
                  />
                ))}

                {/* Core */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-600/40 to-blue-600/40 border-2 border-cyan-400/60 flex flex-col items-center justify-center animate-pulse-glow">
                  <div className="text-2xl">🔗</div>
                  <div className="text-cyan-400 text-xs font-bold mt-1">MCP</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-6 border border-cyan-500/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                  🔌
                </div>
                <div>
                  <div className="text-white font-bold text-lg mb-2">The Universal USB Port</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    MCP (Model Context Protocol) is to AI what USB-C is to devices.
                    One standard protocol that any AI agent can use to <span className="text-white">securely read enterprise data</span> —
                    without ever exposing the underlying system, credentials, or architecture.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  before: "50+ custom integrations per AI deployment",
                  after: "One MCP server per data source, used by all agents",
                  icon: "⚡"
                },
                {
                  before: "Direct database access with raw credentials",
                  after: "Permissioned, auditable read operations only",
                  icon: "🔒"
                },
                {
                  before: "Months of engineering per new data connection",
                  after: "Days to onboard a new enterprise system",
                  icon: "📅"
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-4 border border-white/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-lg flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-red-400 text-xs line-through opacity-60">{item.before}</span>
                      </div>
                      <div className="text-emerald-400 text-sm font-medium">{item.after}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-xl p-4 border border-cyan-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400 text-xs font-medium uppercase tracking-widest">Executive Implication</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                MCP transforms AI from a series of <span className="text-white">one-off projects</span> into a
                <span className="text-white"> composable enterprise platform</span>.
                Every new MCP server built for one use case immediately becomes available to all your AI agents.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
