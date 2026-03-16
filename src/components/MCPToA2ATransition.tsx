"use client";
import { motion } from "framer-motion";

const AGENTS = [
  { label: "Finance Agent",  icon: "💰", color: "#3b82f6", source: "ERP / SAP" },
  { label: "Policy Agent",   icon: "📋", color: "#ef4444", source: "Policy Engine" },
  { label: "Approval Agent", icon: "✅", color: "#10b981", source: "HR Delegation Matrix" },
];

export default function MCPToA2ATransition() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
            MCP gives each agent a secure read on its system.
            <br />
            <span className="text-violet-600">A2A is where they start working as a team.</span>
          </p>
        </motion.div>

        {/* Agent cards with sources */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {AGENTS.map((agent) => (
            <div key={agent.label} className="rounded-xl p-4 text-center"
              style={{ background: `${agent.color}08`, border: `1.5px solid ${agent.color}30` }}>
              <div className="text-2xl mb-2">{agent.icon}</div>
              <div className="text-sm font-bold text-gray-800 mb-1">{agent.label}</div>
              <div className="text-xs px-2 py-0.5 rounded-full inline-block"
                style={{ color: agent.color, background: `${agent.color}15`, border: `1px solid ${agent.color}25` }}>
                via MCP → {agent.source}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Arrow + bridge text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="text-2xl text-gray-300"
          >
            ↓
          </motion.div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5 max-w-2xl mx-auto text-left">
            <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-2">What happens next</div>
            <p className="text-gray-700 text-sm leading-relaxed">
              The Finance Agent reads the claim from SAP. The Policy Agent checks it against the expense rulebook.
              The Approval Agent queries the delegation matrix to find the right sign-off.
              They pass the work between each other — blocking on breaches, validating exceptions, and only
              escalating to a controller when the rules say so.
              <strong className="text-gray-900"> Controls that run themselves.</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
