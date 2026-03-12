"use client";
import { motion } from "framer-motion";

export default function Footer() {
  const sections = [
    { label: "The Spark", href: "#hero" },
    { label: "Intern Phase", href: "#intern" },
    { label: "The Workforce", href: "#workforce" },
    { label: "MCP", href: "#mcp" },
    { label: "A2A", href: "#a2a" },
    { label: "Business ROI", href: "#roi" },
  ];

  return (
    <footer className="relative py-20 border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-[#030609] to-[#050814]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <div>
              <div className="text-white font-bold text-lg">Story of Agents</div>
              <div className="text-gray-500 text-xs">Finance Leadership Briefing 2025</div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-500 text-sm max-w-xl leading-relaxed mb-8"
          >
            From the 2017 Transformer paper to the emergence of autonomous agent networks —
            the evolution of AI represents the most significant operational transformation
            in financial services since the introduction of electronic trading.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {sections.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
              >
                {s.label}
              </a>
            ))}
          </motion.div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-700 text-xs">
            &copy; 2025 Story of Agents. Built for Finance Leadership.
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-gray-700 text-xs font-mono">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
