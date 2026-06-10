import { Activity, ArrowRight, ShieldAlert, Workflow } from "lucide-react";

export function DependencyGraph() {
  return (
    <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Dependency graph</p>
          <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">Request path mapping</p>
        </div>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-200">Live</span>
      </div>
      <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-200">
        {[
          ["Ingress", "api-gateway", "frontend"],
          ["api-gateway", "payments-api", "checkout"],
          ["api-gateway", "user-auth", "auth"],
          ["payments-api", "cache-worker", "cache"],
        ].map(([source, target, label]) => (
          <div key={`${source}-${target}`} className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/80">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-slate-900 dark:text-white">{source}</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <span className="font-medium text-slate-900 dark:text-white">{target}</span>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{label} request path</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlowTimeline() {
  return (
    <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
        <Workflow className="h-5 w-5 text-violet-500 dark:text-violet-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Trace timeline</p>
          <p className="text-base font-semibold">Request flow</p>
        </div>
      </div>
      <div className="space-y-3">
        {[
          { step: "Ingress accepted", duration: "8 ms", status: "healthy" },
          { step: "Auth validation", duration: "18 ms", status: "healthy" },
          { step: "Payments API", duration: "142 ms", status: "warning" },
          { step: "Cache worker", duration: "63 ms", status: "healthy" },
          { step: "Response returned", duration: "5 ms", status: "healthy" },
        ].map((item) => (
          <div key={item.step} className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200/70 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/80">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.step}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Span completion</p>
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              <span>{item.duration}</span>
              <span className={`rounded-full px-2 py-1 ${item.status === "warning" ? "bg-amber-500/10 text-amber-700 dark:text-amber-200" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"}`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LatencyBreakdown() {
  return (
    <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
        <Activity className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Latency breakdown</p>
          <p className="text-base font-semibold">P95 latency by service</p>
        </div>
      </div>
      <div className="space-y-3">
        {[
          { label: "frontend", ms: 92, share: "24%" },
          { label: "user-auth", ms: 178, share: "31%" },
          { label: "payments-api", ms: 238, share: "36%" },
          { label: "cache-worker", ms: 310, share: "9%" },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/80">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm text-slate-700 dark:text-slate-200">
              <span className="font-medium">{item.label}</span>
              <span>{item.ms} ms</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-2 rounded-full bg-gradient-to-r from-violet-400 to-emerald-400" style={{ width: item.share }} />
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Share of total request time: {item.share}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorRateCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
      {[
        { label: "Checkout errors", value: "6.1%", tone: "danger", note: "Highest error rate in the current trace window" },
        { label: "Gateway retries", value: "3.4%", tone: "warning", note: "Retryable attempts are elevated but under control" },
        { label: "Auth success", value: "99.2%", tone: "success", note: "User-auth pipeline continues to perform normally" },
        { label: "Span loss", value: "0.8%", tone: "muted", note: "Dropped spans remain within acceptable range" },
      ].map((item) => (
        <div key={item.label} className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em] ${item.tone === "danger" ? "bg-rose-500/10 text-rose-700 dark:text-rose-200" : item.tone === "warning" ? "bg-amber-500/10 text-amber-700 dark:text-amber-200" : item.tone === "success" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200" : "bg-slate-200 text-slate-700 dark:bg-white/5 dark:text-slate-300"}`}>{item.tone}</span>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{item.note}</p>
        </div>
      ))}
    </div>
  );
}

export function TraceHighlights() {
  return (
    <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center gap-3 text-slate-900 dark:text-white">
        <ShieldAlert className="h-5 w-5 text-rose-500 dark:text-rose-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Trace highlights</p>
          <p className="text-base font-semibold">Where attention is needed</p>
        </div>
      </div>
      <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
        <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/80">Checkout path is the dominant contributor to current trace latency and error rate.</li>
        <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/80">Gateway retries remain low and recoverable, but latency is trending upward for payments-api.</li>
        <li className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/80">Telemetry ingestion remains healthy, and there are no active span backlog violations.</li>
      </ul>
    </div>
  );
}
