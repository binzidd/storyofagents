"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

function DataGridCanvas({ scrollProgress }: { scrollProgress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const progressRef = useRef(scrollProgress);

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Node {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      color: string;
    }

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const NUM = 80;
    const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];

    const nodes: Node[] = Array.from({ length: NUM }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, W(), H());
      const progress = progressRef.current;

      nodes.forEach((n) => {
        n.x = (n.x + n.vx + W()) % W();
        n.y = (n.y + n.vy + H()) % H();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = (0.08 + progress * 0.06);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      nodes.forEach((a, i) => {
        nodes.slice(i + 1, i + 5).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.color;
            ctx.globalAlpha = (1 - d / 100) * 0.07;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsub = smoothProgress.on("change", (v) => setProgress(v));
    return unsub;
  }, [smoothProgress]);

  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F9F8F5]">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Node canvas */}
      <DataGridCanvas scrollProgress={progress} />

      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm mb-10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-gray-500 text-xs font-medium tracking-widest uppercase">FS Analytics · AI Briefing · March 2026</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.95] mb-7 tracking-tight"
        >
          The intelligence
          <br />
          your firm{" "}
          <span className="text-blue-600">already has.</span>
          <br />
          <span className="text-gray-400 font-light text-5xl md:text-6xl">Finally put to work.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          In 2017, a research paper changed how machines understand language.
          By 2022, that breakthrough was inside a chat window.
          Today, it is running your <span className="text-gray-800 font-medium">month-end close, your trade surveillance, and your board pack</span> — autonomously.
          This is how we got here.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12"
        >
          {[
            { value: "2017", label: "Transformer Architecture", accent: "blue" },
            { value: "Nov '22", label: "Generative AI Goes Mainstream", accent: "violet" },
            { value: "100M+", label: "Users in 60 Days", accent: "emerald" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className={`text-2xl font-bold mb-1 ${
                stat.accent === "blue" ? "text-blue-600" :
                stat.accent === "violet" ? "text-violet-600" : "text-emerald-600"
              }`}>{stat.value}</div>
              <div className="text-gray-500 text-xs leading-tight">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Key insight card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="rounded-2xl border border-blue-100 bg-blue-50 p-6 max-w-2xl mx-auto"
        >
          <div className="flex items-start gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-blue-600 text-lg">⚡</span>
            </div>
            <div>
              <div className="text-gray-900 font-semibold mb-2">The Inflection Point</div>
              <p className="text-gray-600 text-sm leading-relaxed">
                ChatGPT did not create new intelligence. It made <span className="text-gray-900 font-medium">senior analyst-grade capability</span> accessible to every knowledge worker — instantly,
                at scale, without a six-figure data science team. The question is no longer <em>whether</em> to adopt AI. It is <em>how fast</em> you build the infrastructure to trust it.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-14 flex flex-col items-center gap-2"
        >
          <span className="text-gray-400 text-xs tracking-widest uppercase">Explore the journey</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-gray-300 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-blue-500" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 right-8 text-right"
        >
          <div className="text-gray-400 text-xs">Presented by</div>
          <div className="text-gray-700 text-sm font-semibold">Binay</div>
        </motion.div>
      </motion.div>
    </section>
  );
}
