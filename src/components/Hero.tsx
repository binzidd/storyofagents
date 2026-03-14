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

    interface Node { x: number; y: number; vx: number; vy: number; size: number; color: string; }
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];
    const nodes: Node[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, W(), H());
      nodes.forEach((n) => {
        n.x = (n.x + n.vx + W()) % W();
        n.y = (n.y + n.vy + H()) % H();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.09;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      nodes.forEach((a, i) => {
        nodes.slice(i + 1, i + 4).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 90) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.color; ctx.globalAlpha = (1 - d / 90) * 0.05;
            ctx.lineWidth = 0.8; ctx.stroke(); ctx.globalAlpha = 1;
          }
        });
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animFrameRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
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

  const y       = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F9F8F5]">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`, backgroundSize: "72px 72px" }}
      />
      <DataGridCanvas scrollProgress={progress} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

      <motion.div style={{ y, opacity, scale }} className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">

        {/* Label */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm mb-10">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-gray-500 text-xs font-medium tracking-widest uppercase">AI Briefing · March 2026</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
          className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.93] mb-8 tracking-tight">
          The intelligence
          <br />
          our industry has.
          <br />
          <span className="text-blue-600">Finally put to work.</span>
        </motion.h1>

        {/* Horizontal timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
          className="relative max-w-3xl mx-auto mb-12">
          {/* Timeline line */}
          <div className="absolute top-7 left-12 right-12 h-px bg-gray-200" />
          <div className="grid grid-cols-3 gap-0">
            {/* 2017 */}
            <div className="relative flex flex-col items-start">
              <div className="relative z-10 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-md mb-2" />
              <div className="text-left">
                <div className="text-2xl font-black text-blue-600">2017</div>
                <div className="font-bold text-gray-900 text-sm leading-tight">Transformer</div>
                <div className="text-gray-500 text-xs">Architecture</div>
              </div>
            </div>
            {/* Nov '22 */}
            <div className="relative flex flex-col items-center">
              <div className="relative z-10 w-3.5 h-3.5 rounded-full bg-violet-600 border-2 border-white shadow-md mb-2" />
              <div className="text-center">
                <div className="text-2xl font-black text-violet-600">Nov <span className="text-violet-400">&rsquo;22</span></div>
                <div className="font-bold text-gray-900 text-sm leading-tight">ChatGPT</div>
                <div className="text-gray-500 text-xs">Goes Mainstream</div>
              </div>
            </div>
            {/* 100M */}
            <div className="relative flex flex-col items-end">
              <div className="relative z-10 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-md mb-2" />
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-600">100M+</div>
                <div className="font-bold text-gray-900 text-sm leading-tight">Users</div>
                <div className="text-gray-500 text-xs">In 60 Days</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Inflection Point card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.0 }}
          className="rounded-2xl border border-blue-100 bg-blue-50 p-6 max-w-2xl mx-auto">
          <div className="flex items-start gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-lg">⚡</span>
            </div>
            <div>
              <div className="text-gray-900 font-semibold mb-1.5">The Inflection Point</div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Senior analyst-grade capability. Every knowledge worker. No data science team required.
                The question is not <em>whether</em> to adopt AI.
                It is <strong className="text-gray-900">how fast we build the infrastructure to trust it.</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Multi-Agent & Human Partnership card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.3 }}
          className="rounded-2xl border border-violet-100 bg-violet-50 p-6 max-w-2xl mx-auto mt-4">
          <div className="flex items-start gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-violet-600 text-lg">🤝</span>
            </div>
            <div>
              <div className="text-gray-900 font-semibold mb-1.5">2026: Multi-Agent Reality</div>
              <p className="text-gray-600 text-sm leading-relaxed">
                By 2026, the competitive advantage is not a single AI. It is a team of specialists—each owning one domain, challenging each other, making decisions faster and better than any human or algorithm alone.
                <strong className="text-gray-900"> AI is not here to take your job. It is here to make you the best version of yourself.</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}
          className="mt-12 flex flex-col items-center gap-2">
          <span className="text-gray-400 text-xs tracking-widest uppercase">Explore the journey</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-gray-300 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-blue-500" />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 right-8 text-right">
          <div className="text-gray-400 text-xs">Presented by</div>
          <div className="text-gray-700 text-sm font-semibold">Binay</div>
        </motion.div>
      </motion.div>
    </section>
  );
}
