"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface Dot {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

function DataParticleCanvas({ scrollProgress }: { scrollProgress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
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

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    const NUM_DOTS = 200;
    const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

    dotsRef.current = Array.from({ length: NUM_DOTS }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      targetX: (i % 20) * (W / 20) + W / 40,
      targetY: Math.floor(i / 20) * (H / 10) + H / 20,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let time = 0;
    const animate = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const progress = progressRef.current;
      time += 0.01;

      dotsRef.current.forEach((dot, i) => {
        const targetX = dot.targetX + Math.sin(time + i * 0.1) * (1 - progress) * 20;
        const targetY = dot.targetY + Math.cos(time + i * 0.05) * (1 - progress) * 20;

        const chaoticX = (dot.x + dot.vx + W) % W;
        const chaoticY = (dot.y + dot.vy + H) % H;

        const finalX = chaoticX * (1 - progress) + targetX * progress;
        const finalY = chaoticY * (1 - progress) + targetY * progress;

        dot.x = finalX;
        dot.y = finalY;

        ctx.beginPath();
        ctx.arc(finalX, finalY, dot.size * (0.5 + progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = dot.opacity * (0.4 + progress * 0.6);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (progress > 0.3) {
          dotsRef.current.slice(i + 1, i + 4).forEach((other) => {
            const dist = Math.hypot(finalX - other.x, finalY - other.y);
            if (dist < 60) {
              ctx.beginPath();
              ctx.moveTo(finalX, finalY);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = dot.color;
              ctx.globalAlpha = (1 - dist / 60) * progress * 0.3;
              ctx.lineWidth = 0.5;
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          });
        }
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
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
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

  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.4)_0%,#050814_70%)]" />

      {/* Particle canvas */}
      <DataParticleCanvas scrollProgress={progress} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-400 text-xs font-medium tracking-widest uppercase">FS Analytics · AI Briefing · March 2026</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-6xl md:text-8xl font-black text-white leading-none mb-6 tracking-tight"
        >
          Before AI could
          <br />
          <span className="shimmer-text">predict,</span>
          <br />
          it had to{" "}
          <span className="text-blue-400">understand.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
        >
          The 2017 <span className="text-blue-300 font-medium">Transformer</span> architecture didn&apos;t just improve machine learning — it taught machines to read the room.
          Context. Nuance. Relationships between ideas separated by paragraphs.
          The kind of judgment your senior analysts spend years developing.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12"
        >
          {[
            { value: "2017", label: "Transformer Paper", accent: "blue" },
            { value: "Nov '22", label: "ChatGPT Launch", accent: "violet" },
            { value: "100M+", label: "Users in 60 Days", accent: "emerald" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <div className={`text-2xl font-bold mb-1 ${
                stat.accent === "blue" ? "text-blue-400" :
                stat.accent === "violet" ? "text-violet-400" : "text-emerald-400"
              }`}>{stat.value}</div>
              <div className="text-gray-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Key insight card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="glass-card rounded-2xl p-6 max-w-2xl mx-auto border border-blue-500/20"
        >
          <div className="flex items-start gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-blue-400 text-lg">⚡</span>
            </div>
            <div>
              <div className="text-white font-semibold mb-2">The Democratization Moment</div>
              <p className="text-gray-400 text-sm leading-relaxed">
                ChatGPT didn&apos;t create new intelligence. It put a <span className="text-white">PhD-level analyst</span> inside a chat window.
                The same capabilities that previously required a six-figure data science team became accessible to every knowledge worker —
                in minutes, not months.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-gray-600 text-xs tracking-widest uppercase">Scroll to explore the evolution</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-gray-700 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-blue-400" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 right-8 text-right"
        >
          <div className="text-gray-600 text-xs">Presented by</div>
          <div className="text-white text-sm font-semibold">Binay</div>
        </motion.div>
      </motion.div>
    </section>
  );
}
