"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

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
      <div className="whitespace-pre" dangerouslySetInnerHTML={{ __html: highlight(displayed) }} />
      {active && !done && <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-0.5 animate-pulse align-middle" />}
    </div>
  );
}

const DEMO_TASKS = [
  { task: "Q4 budget review",      owner: "Sarah M.", due: "2 days ago" },
  { task: "Client onboarding docs", owner: "James K.", due: "5 days ago" },
  { task: "Risk assessment",        owner: "Priya L.", due: "1 day ago"  },
];

function ToolCallDemo() {
  const [phase, setPhase]     = useState(0);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    if (playing) return;
    setPlaying(true);
    setPhase(0);
    [600, 2200, 4000, 6000, 8000].forEach((d, i) =>
      setTimeout(() => setPhase(i + 1), d)
    );
    setTimeout(() => setPlaying(false), 9000);
  };

  const reset = () => { setPhase(0); setPlaying(false); };

  return (
    <div className="light-card rounded-2xl overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3.5 bg-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-400 text-xs font-mono ml-2">Tool Call · Step by Step</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${playing ? "bg-amber-400 animate-pulse" : phase >= 5 ? "bg-emerald-400" : "bg-gray-500"}`} />
          <span className={`text-xs font-mono ${playing ? "text-amber-400" : phase >= 5 ? "text-emerald-400" : "text-gray-500"}`}>
            {playing ? "running" : phase >= 5 ? "complete" : "ready"}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-3 min-h-[380px]">
        {/* Empty state */}
        {phase === 0 && !playing && (
          <div className="flex items-center justify-center h-52 text-gray-400 text-sm">
            Click <span className="mx-1 font-semibold text-violet-600">Run Demo</span> to see tool calling in action
          </div>
        )}

        <AnimatePresence>
          {/* Step 1 — user question */}
          {phase >= 1 && (
            <motion.div key="q" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-sm flex-shrink-0">👤</div>
              <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                <div className="text-xs text-blue-500 font-semibold mb-0.5">User</div>
                <div className="text-sm text-gray-800">Show me overdue tasks for the team</div>
              </div>
            </motion.div>
          )}

          {/* Step 2 — agent thinking */}
          {phase >= 2 && (
            <motion.div key="think" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
              <div className="flex-1 bg-violet-50 border border-violet-200 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                <div className="text-xs text-violet-500 font-semibold mb-0.5">Agent · Planning</div>
                <div className="text-xs text-gray-600 font-mono">
                  I need to call <span className="text-violet-700 font-bold">get_tasks()</span> with a status filter to find overdue items...
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3 — tool call code snippet */}
          {phase >= 3 && (
            <motion.div key="tool" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl overflow-hidden border border-amber-200">
              <div className="bg-gray-900 px-3 py-2 flex items-center justify-between">
                <span className="text-amber-400 text-xs font-mono font-bold">🔧 Tool Call</span>
                <span className="text-gray-500 text-xs font-mono">task_manager API</span>
              </div>
              <div className="bg-[#1e1e2e] p-3.5 font-mono text-xs leading-relaxed">
                <div className="text-gray-500"># AI constructs the right parameters</div>
                <div className="mt-1.5">
                  <span className="text-amber-400">get_tasks</span>
                  <span className="text-white">(</span>
                </div>
                <div className="ml-4">
                  <span className="text-blue-300">status</span>
                  <span className="text-white"> = </span>
                  <span className="text-green-400">&quot;overdue&quot;</span>
                  <span className="text-white">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-blue-300">assignee</span>
                  <span className="text-white"> = </span>
                  <span className="text-green-400">&quot;all&quot;</span>
                  <span className="text-white">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-blue-300">sort_by</span>
                  <span className="text-white"> = </span>
                  <span className="text-green-400">&quot;due_date&quot;</span>
                </div>
                <div className="text-white">)</div>
              </div>
            </motion.div>
          )}

          {/* Step 4 — tool result */}
          {phase >= 4 && (
            <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-emerald-200 overflow-hidden">
              <div className="bg-emerald-50 px-3 py-2 flex items-center gap-2 border-b border-emerald-100">
                <span className="text-emerald-600 text-xs font-mono font-bold">✓ Tool Response</span>
                <span className="text-emerald-500 text-xs">3 records returned</span>
              </div>
              <div className="bg-white px-3 py-2 space-y-1.5">
                {DEMO_TASKS.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-700 font-medium">{t.task}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{t.owner}</span>
                      <span className="text-red-500 font-semibold">{t.due}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Processing indicator — shows between phases */}
          {playing && phase >= 1 && phase < 5 && (
            <motion.div key={`dots-${phase}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-2">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400"
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} />
              ))}
              <span className="text-xs text-gray-400 ml-0.5">Agent processing...</span>
            </motion.div>
          )}

          {/* Step 5 — final answer */}
          {phase >= 5 && (
            <motion.div key="answer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                <div className="text-xs text-violet-500 font-semibold mb-0.5">Agent · Answer</div>
                <div className="text-sm text-gray-800 leading-relaxed">
                  You have <strong>3 overdue tasks</strong>. Priya&apos;s risk assessment (1 day late) and
                  Sarah&apos;s budget review (2 days late) are most urgent. James&apos; onboarding docs
                  are 5 days overdue.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
        <div className="text-xs text-gray-400">1 tool call · natural language in, structured data out</div>
        <div className="flex items-center gap-2">
          {phase > 0 && !playing && (
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Reset</button>
          )}
          <motion.button onClick={playing ? undefined : play}
            whileHover={!playing ? { scale: 1.02 } : {}}
            whileTap={!playing ? { scale: 0.97 } : {}}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              playing       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : phase >= 5  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-violet-600 text-white hover:bg-violet-700"
            }`}>
            {playing ? "Running..." : phase >= 5 ? "▶ Run Again" : "▶ Run Demo"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function InternPhase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  const [activeQ, setActiveQ] = useState(0);
  const [stage, setStage]     = useState<"idle"|"sql"|"results">("idle");

  const runQuery = (idx: number) => {
    setActiveQ(idx);
    setStage("sql");
  };

  useEffect(() => {
    if (stage !== "sql") return;
    const sql = SQL_QUERIES[activeQ].sql;
    const ms  = sql.length * 10 + 1800;
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
            <span className="text-violet-600 text-xs font-semibold tracking-widest uppercase">Phase 01 · Tool Calling</span>
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
            Our Bloomberg terminal. Our GL database. Our compliance engine.
            <strong className="text-gray-800"> All accessible from a single natural language query.</strong>
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — animated tool call demo */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <ToolCallDemo />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { n:"1", t:"Understand intent",   c:"#8b5cf6" },
                { n:"2", t:"Select & call tools", c:"#3b82f6" },
                { n:"3", t:"Synthesise answer",   c:"#10b981" },
              ].map(s => (
                <div key={s.n} className="rounded-lg p-2.5 text-center" style={{ background:`${s.c}10`, border:`1px solid ${s.c}25` }}>
                  <div className="text-xs font-black mb-1" style={{ color: s.c }}>Step {s.n}</div>
                  <div className="text-xs text-gray-600">{s.t}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Natural Language to SQL demo */}
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
                  <span className="text-gray-400 text-xs font-mono ml-2">Natural Language to SQL</span>
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
              <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">Natural Language to SQL</span>
              <span className="text-xs text-gray-400">· plain English, enterprise results</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
