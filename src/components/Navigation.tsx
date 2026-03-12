"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { label: "The Spark", href: "#hero" },
  { label: "Intern Phase", href: "#intern" },
  { label: "Workforce", href: "#workforce" },
  { label: "MCP", href: "#mcp" },
  { label: "A2A", href: "#a2a" },
  { label: "ROI", href: "#roi" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navItems.map(item => item.href.slice(1));
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050814]/90 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">Story of Agents</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                activeSection === item.href.slice(1)
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:block text-xs text-gray-500 font-mono">Finance Briefing 2025</span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>
      </div>
    </motion.nav>
  );
}
