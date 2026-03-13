"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

interface SQLResult {
  id: string;
  name: string;
  actual: string;
  ref: string;
  delta: string;
  bad: boolean;
}

const SQL_QUERIES: {
  id: string;
  question: string;
  sql: string;
  results: SQLResult[];
  note: string;
}[] = [
  {
    id: "variance",
    question: "Which cost centres exceeded budget by >10% in Q3 2025?",
    sql: `SELECT
  cost_centre,
  cost_centre_name,
  actual_spend,
  budget_spend,
  ROUND(
    (actual_spend - budget_spend)
    / budget_spend * 100, 1
  ) AS variance_pct
FROM gl_accounts
WHERE period = 'Q3-2025'
  AND (actual_spend - budget_spend)
      / budget_spend > 0.10
ORDER BY variance_pct DESC;`,
    results: [
      { id: "CC-204", name: "Technology Infrastructure",  actual: "A$4.28M", ref: "A$3.47M", delta: "+23.5%", bad: true },
      { id: "CC-117", name: "Client Advisory Services",   actual: "A$2.89M", ref: "A$2.44M", delta: "+18.5%", bad: true },
      { id: "CC-331", name: "Risk & Compliance",          actual: "A$4.74M", ref: "A$4.09M", delta: "+15.8%", bad: true },
      { id: "CC-089", name: "Operations & Settlements",   actual: "A$1.32M", ref: "A$1.17M", delta: "+12.8%", bad: true },
    ],
    note: "4 cost centres flagged · Generated in 0.4s",
  },
  {
    id: "revenue",
    question: "Top 5 revenue drivers year-on-year for FY2025?",
    sql: `SELECT
  revenue_driver,
  SUM(CASE WHEN fy=2025 THEN amount END) AS fy2025,
  SUM(CASE WHEN fy=2024 THEN amount END) AS fy2024,
  ROUND(
    ( SUM(CASE WHEN fy=2025 THEN amount END)
    - SUM(CASE WHEN fy=2024 THEN amount END) )
    / NULLIF(
        SUM(CASE WHEN fy=2024 THEN amount END),0
      ) * 100, 1
  ) AS yoy_pct
FROM revenue_fact
GROUP BY revenue_driver
ORDER BY fy2025 DESC
LIMIT 5;`,
    results: [
      { id: "Advisory Fees",    name: "M&A Advisory",        actual: "A$62.0M", ref: "A$55.4M", delta: "+12.0%", bad: false },
      { id: "Asset Management", name: "AUM-based Fees",       actual: "A$58.3M", ref: "A$47.0M", delta: "+24.0%", bad: false },
      { id: "Fixed Income",     name: "Trading Desk Revenue", actual: "A$33.7M", ref: "A$36.3M", delta: "−7.1%",  bad: true  },
      { id: "FX Services",      name: "Currency Solutions",   actual: "A$28.5M", ref: "A$23.4M", delta: "+21.9%", bad: false },
      { id: "Structured Prods", name: "Bespoke Instruments",  actual: "A$21.4M", ref: "A$17.8M", delta: "+20.3%", bad: false },
    ],
    note: "FY2025 vs FY2024 · 5 drivers ranked by revenue",
  },
  {
    id: "anomaly",
    question: "Flag GL accounts with unusual transaction patterns this month.",
    sql: `WITH monthly_stats AS (
  SELECT account_id,
    AVG(txn_count)    AS avg_txn,
    STDDEV(txn_count) AS std_txn
  FROM gl_transactions
  WHERE period < DATE_TRUNC('month', NOW())
  GROUP BY account_id
)
SELECT
  t.account_id,
  t.account_name,
  t.txn_count        AS this_month,
  ROUND(s.avg_txn,0) AS historical_avg,
  ROUND(
    (t.txn_count - s.avg_txn) / s.std_txn, 2
  )                  AS z_score
FROM gl_transactions t
JOIN monthly_stats s USING (account_id)
WHERE ABS(
  (t.txn_count - s.avg_txn) / s.std_txn
) > 2.5
  AND t.period = DATE_TRUNC('month', NOW())
ORDER BY ABS(z_score) DESC;`,
    results: [
      { id: "GL-7821", name: "Intercompany Settlements", actual: "147 txns", ref: "42 avg", delta: "z=4.9 ⚠", bad: true },
      { id: "GL-3302", name: "Derivatives Margin Calls",  actual: "89 txns",  ref: "28 avg", delta: "z=3.7 ⚠", bad: true },
      { id: "GL-1105", name: "FX Revaluation Entries",    actual: "203 txns", ref: "85 avg", delta: "z=2.8 ⚠", bad: true },
    ],
    note: "3 anomalies detected · Review recommended",
  },
];

const TOOLS = [
  { icon: "📊", label: "Bloomberg Terminal", color: "#f59e0b", angle: -60 },
  { icon: "🗄️", label: "SQL Database",       color: "#3b82f6", angle: -20 },
  { icon: "📧", label: "Email & Comms",       color: "#8b5cf6", angle:  20 },
  { icon: "📈", label: "Portfolio Systems",   color: "#10b981", angle:  60 },
  { icon: "⚖️", label: "Compliance Engine",   color: "#ef4444", angle: 100 },
  { icon: "📋", label: "Report Generator",    color: "#06b6d4", angle: 140 },
];

function TypewriterSQL({ sql, active }: { sql: string; active: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(sql.slice(0, i));
      if (i >= sql.length) { clearInterval(id); setDone(true); }
    }, 10);
    return () => clearInterval(id);
  }, [sql, active]);

  const highlight = (code: string) =>
    code
      .replace(/\b(SELECT|FROM|WHERE|AND|OR|GROUP BY|ORDER BY|LIMIT|WITH|AS|JOIN|USING|ON|CASE|WHEN|THEN|END|NULLIF|ROUND|STDDEV|AVG|SUM|ABS|DATE_TRUNC|DESC|ASC|DISTINCT|NOT|IN|BETWEEN|HAVING|NOW)\b/g,
        '<span class="code-keyword">$1</span>')
      .replace(/'([^']*)'/g, "<span class=\"code-string\">'$1'</span>")
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="code-number">$1</span>');

  return (
    <div className="code-block text-xs leading-relaxed min-h-[160px] relative">
      <div dangerouslySetInnerHTML={{ __html: highlight(displayed) }} />
      {active && !done && <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-0.5 animate-pulse align-middle" />}
    </div>
  );
}

export default function InternPhase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  const [activeQ, setActiveQ]   = useState(0);
  const [stage, setStage]       = useState<"idle"|"sql"|"results">("idle");

  const runQuery = (idx: number) => {
    setActiveQ(idx);
    setStage("sql");
  };

  useEffect(() => {
    if (stage !== "sql") return;
    const sql = SQL_QUERIES[activeQ].sql;
    const ms  = sql.length * 10 + 600;
    const t   = setTimeout(() => setStage("results"), ms);
    return () => clearTimeout(t);
  }, [stage, activeQ]);

  return (
    <section id="intern" ref={ref} className="relative min-h-screen py-28 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
      <div className="absolute top-0 right-0 w-2/5 h-full bg-gradient-to-l from-violet-50 to-transparent pointer-events-none" />

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-200 bg-violet-50 mb-6">
            <span className="text-violet-600 text-xs font-semibold tracking-widest uppercase">Phase 02 · Tool Calling</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Insight without action<br />
            <span className="relative inline-block">
              <span className="text-violet-600">is just commentary.</span>
              <motion.span initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }}
                transition={{ duration:0.8, delay:0.7, ease:"easeOut" }}
                className="absolute bottom-1 left-0 h-[4px] bg-violet-500 rounded-full origin-left block" />
            </span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Tool Calling was the capability that transformed AI from an advisor into an operator.
            Your Bloomberg terminal. Your GL database. Your compliance engine.
            <strong className="text-gray-800"> All accessible from a single natural language query.</strong>
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — tool orbit */}
          <div>
            <div className="relative w-[340px] h-[340px] flex items-center justify-center mx-auto">
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-xl animate-pulse-glow">
                <div className="text-center">
                  <div className="text-3xl">🤖</div>
                  <div className="text-white text-xs font-bold mt-1">AI Core</div>
                </div>
                {[1,2,3].map(i => (
                  <motion.div key={i} className="absolute inset-0 rounded-2xl border border-violet-400/40"
                    animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 }}
                  />
                ))}
              </motion.div>

              {TOOLS.map((tool, i) => {
                const rad = (tool.angle * Math.PI) / 180;
                const r   = 130;
                const x   = Math.cos(rad) * r;
                const y   = Math.sin(rad) * r;
                return (
                  <motion.div key={tool.label}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1, x, y } : { opacity: 0, scale: 0, x: 0, y: 0 }}
                    transition={{ duration: 0.7, delay: i * 0.12 }}
                    className="absolute">
                    <div className="-translate-x-1/2 -translate-y-1/2 w-20 bg-white rounded-xl p-2.5 text-center shadow-md border"
                      style={{ borderColor: `${tool.color}25` }}>
                      <div className="text-xl mb-1">{tool.icon}</div>
                      <div className="text-gray-800 text-xs font-semibold leading-tight">{tool.label}</div>
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: tool.color }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 light-card rounded-2xl p-5 border-l-4 border-violet-500">
              <div className="font-semibold text-gray-900 mb-2">How Tool Calling works</div>
              <p className="text-gray-500 text-sm leading-relaxed">
                When a user asks a question, the AI identifies which tools to call, constructs the right parameters, executes them, and synthesises the outputs. The human sees only the answer.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { n:"1", t:"Understand intent",   c:"#8b5cf6" },
                  { n:"2", t:"Select & call tools", c:"#3b82f6" },
                  { n:"3", t:"Synthesise answer",   c:"#10b981" },
                ].map(s => (
                  <div key={s.n} className="rounded-lg p-2 text-center" style={{ background:`${s.c}10`, border:`1px solid ${s.c}25` }}>
                    <div className="text-xs font-black mb-1" style={{ color: s.c }}>Step {s.n}</div>
                    <div className="text-xs text-gray-600">{s.t}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — SQL Weaver demo */}
          <div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="light-card rounded-2xl overflow-hidden">
              {/* Mac-style header */}
              <div className="px-5 py-3.5 bg-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-400 text-xs font-mono ml-2">SQL Weaver · FS Analytics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-mono">connected · gl_prod</span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Ask a finance question</div>
                  <div className="space-y-2">
                    {SQL_QUERIES.map((q, i) => (
                      <motion.button key={q.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        onClick={() => runQuery(i)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                          activeQ === i && stage !== "idle"
                            ? "border-violet-400 bg-violet-50 text-violet-700 font-medium"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-violet-300 hover:bg-violet-50"
                        }`}>
                        <span className="font-mono text-gray-400 mr-2">{i+1}.</span>
                        {q.question}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {stage !== "idle" && (
                    <motion.div key={`sql-${activeQ}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Generated SQL</div>
                        {stage === "results" && (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-xs text-emerald-600 font-medium">✓ Executed</motion.span>
                        )}
                      </div>
                      <TypewriterSQL sql={SQL_QUERIES[activeQ].sql} active={stage === "sql" || stage === "results"} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {stage === "results" && (
                    <motion.div key={`results-${activeQ}`}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Results</div>
                      <div className="overflow-hidden rounded-xl border border-gray-200">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="text-left px-3 py-2 text-gray-500 font-semibold">ID</th>
                              <th className="text-left px-3 py-2 text-gray-500 font-semibold">Name</th>
                              <th className="text-right px-3 py-2 text-gray-500 font-semibold">Actual</th>
                              <th className="text-right px-3 py-2 text-gray-500 font-semibold">Ref</th>
                              <th className="text-right px-3 py-2 text-gray-500 font-semibold">Delta</th>
                            </tr>
                          </thead>
                          <tbody>
                            {SQL_QUERIES[activeQ].results.map((row, i) => (
                              <motion.tr key={i}
                                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors">
                                <td className="px-3 py-2 font-mono text-blue-600">{row.id}</td>
                                <td className="px-3 py-2 text-gray-700">{row.name}</td>
                                <td className="px-3 py-2 text-right text-gray-800 font-medium">{row.actual}</td>
                                <td className="px-3 py-2 text-right text-gray-500">{row.ref}</td>
                                <td className={`px-3 py-2 text-right font-bold ${row.bad ? "text-red-500" : "text-emerald-600"}`}>
                                  {row.delta}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-2 text-xs text-gray-400 font-mono text-right">{SQL_QUERIES[activeQ].note}</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {stage === "idle" && (
                  <div className="text-center py-6 text-gray-400 text-sm">↑ Click a question to generate SQL</div>
                )}
              </div>
            </motion.div>

            <div className="mt-3 flex items-center justify-end gap-2">
              <span className="text-xs text-gray-400">Powered by</span>
              <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">SQL Weaver</span>
              <span className="text-xs text-gray-400">· Natural language → enterprise SQL</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
