"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthWidget } from "@/components/ui/health-widget";
import { MetricCard } from "@/components/ui/metric-card";
import { MetricsChart } from "@/components/metrics-chart";
import { TelemetryCard, TelemetryStatRow } from "@/components/ui/telemetry-card";
import { DependencyGraph, ErrorRateCards, FlowTimeline, LatencyBreakdown, TraceHighlights } from "@/components/trace-visuals";

const latencyCards = [
  { label: "Trace ingest rate", value: "82K/s", note: "Spans received in the last minute", accent: "text-violet-300" },
  { label: "Service latency", value: "162 ms", note: "P95 across traced services", accent: "text-emerald-300" },
  { label: "Span error rate", value: "2.8%", note: "Errors captured from traced requests", accent: "text-rose-300" },
];

const ingestionStats = [
  { label: "Collector status", value: "Healthy", detail: "No ingestion drops detected" },
  { label: "Pipeline throughput", value: "1.1M spans/min", detail: "Sustained high-volume tracing" },
  { label: "Backfill lag", value: "12 s", detail: "Telemetry backlog within SLAs" },
];

const traceHealthMetrics = [
  { title: "Trace health", status: "healthy", value: "94%", detail: "Successful traces with no sampling errors." },
  { title: "Service saturation", status: "degraded", value: "68%", detail: "Trace ingest pipeline is under moderate load." },
  { title: "Dropped spans", status: "danger", value: "4.1%", detail: "Retryable ingestion errors need investigation." },
];

const serviceLatency = [
  { service: "payments-api", latency: "238 ms", trend: "rising", health: "degraded" },
  { service: "user-auth", latency: "178 ms", trend: "steady", health: "healthy" },
  { service: "frontend", latency: "92 ms", trend: "stable", health: "healthy" },
  { service: "cache-worker", latency: "310 ms", trend: "spiking", health: "danger" },
];

const errorRates = [
  { service: "checkout", rate: "6.1%", badge: "danger" },
  { service: "api-gateway", rate: "3.4%", badge: "warning" },
  { service: "payments", rate: "2.0%", badge: "default" },
  { service: "notifications", rate: "1.0%", badge: "success" },
];

const traceCatalog = [
  { id: "TRC-9042", service: "payments-api", latency: "238 ms", status: "warning", summary: "Checkout payment callback shows elevated latency after rollout update.", detail: "Span analysis points to upstream DB I/O and network retries. Recommended action: validate the recent image tag and inspect the database connection pool." },
  { id: "TRC-9021", service: "user-auth", latency: "178 ms", status: "healthy", summary: "Auth request path is within SLO after the cache warm-up window.", detail: "No critical error signatures found. Continue observing JWT validation and token refresh latency." },
  { id: "TRC-9015", service: "cache-worker", latency: "310 ms", status: "danger", summary: "Restart churn is creating a trace fan-out pattern under high traffic.", detail: "Pod restarts and CPU pressure coincide with the skewed latency profile. Confirm limits, probes, and heap usage." },
];

export default function OpenTelemetryPage() {
  const [query, setQuery] = useState("");
  const [selectedTrace, setSelectedTrace] = useState<(typeof traceCatalog)[number] | null>(traceCatalog[0]);

  const filteredTraces = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return traceCatalog;
    }

    return traceCatalog.filter((trace) => [trace.id, trace.service, trace.summary].some((field) => field.toLowerCase().includes(normalized)));
  }, [query]);
  return (
    <DashboardShell
      title="OpenTelemetry"
      description="A distributed tracing overview for telemetry health, latency, and span error visibility."
    >
      <div className="grid gap-8 xl:grid-cols-[1.25fr_0.95fr]">
        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {latencyCards.map((card) => (
              <MetricCard key={card.label} label={card.label} value={card.value} note={card.note} accent={card.accent} />
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <TelemetryCard title="Telemetry ingestion">
              <div className="space-y-4">
                {ingestionStats.map((stat) => (
                  <TelemetryStatRow key={stat.label} {...stat} />
                ))}
              </div>
            </TelemetryCard>

            <div className="space-y-6">
              {traceHealthMetrics.map((metric) => (
                <HealthWidget key={metric.title} title={metric.title} status={metric.status as "healthy" | "degraded" | "danger"} value={metric.value} detail={metric.detail} />
              ))}
            </div>

            <TelemetryCard title="Span error rate">
              <div className="space-y-4">
                {errorRates.map((item) => (
                  <div key={item.service} className="flex items-center justify-between rounded-3xl bg-slate-900/70 p-4">
                    <div>
                      <p className="text-sm text-slate-400">{item.service}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-100">{item.rate}</p>
                    </div>
                    <Badge variant={item.badge as "success" | "warning" | "danger" | "muted"}>{item.badge === "default" ? "Normal" : item.badge === "warning" ? "Elevated" : item.badge === "danger" ? "Critical" : "Stable"}</Badge>
                  </div>
                ))}
              </div>
            </TelemetryCard>
          </div>

          <MetricsChart
            title="Service latency trend"
            labels={["30m", "25m", "20m", "15m", "10m", "5m", "Now"]}
            values={[120, 138, 149, 170, 185, 198, 212]}
            accent="bg-violet-400/80"
          />

          <Card className="glass-panel card-hover border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-slate-950/90">
            <CardHeader>
              <CardTitle>Distributed tracing overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Mock telemetry data shows trace collection across service boundaries, latency distribution, and span error health. Use these insights to optimize instrumentation and reduce request-level failures.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-900/80">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Services traced</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">24</p>
                </div>
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-slate-900/80">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Sampling rate</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">78%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DependencyGraph />
          <FlowTimeline />
          <LatencyBreakdown />
        </section>

        <aside className="space-y-6">
          <Card className="glass-panel card-hover border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-slate-950/90">
            <CardHeader>
              <CardTitle>Service latency cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceLatency.map((item) => (
                  <div key={item.service} className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.service}</p>
                        <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{item.latency}</p>
                      </div>
                      <Badge variant={item.health === "healthy" ? "success" : item.health === "degraded" ? "warning" : "danger"}>
                        {item.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <ErrorRateCards />

          <Card className="glass-panel card-hover border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-slate-950/90">
            <CardHeader>
              <CardTitle>Trace search</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by trace ID, service, or pattern"
                className="w-full rounded-3xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400/60 focus:bg-white dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:bg-slate-900"
              />
              <div className="mt-4 space-y-3">
                {filteredTraces.map((trace) => (
                  <button
                    key={trace.id}
                    type="button"
                    onClick={() => setSelectedTrace(trace)}
                    className={`w-full rounded-3xl border p-4 text-left transition ${selectedTrace?.id === trace.id ? "border-emerald-400/60 bg-emerald-500/10" : "border-slate-200/70 bg-slate-50/90 hover:border-emerald-400/40 dark:border-white/10 dark:bg-slate-900/80 dark:hover:bg-slate-800/90"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{trace.id}</p>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{trace.service}</p>
                      </div>
                      <Badge variant={trace.status === "danger" ? "danger" : trace.status === "warning" ? "warning" : "success"}>{trace.latency}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{trace.summary}</p>
                  </button>
                ))}
                {filteredTraces.length === 0 ? <p className="rounded-3xl border border-dashed border-slate-200/70 bg-slate-50/90 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">No traces match the current search. Try a different service or ID.</p> : null}
              </div>
            </CardContent>
          </Card>

          <TraceHighlights />

          <TelemetryCard title="Telemetry ingestion status">
            <div className="space-y-4">
              <TelemetryStatRow label="Retention sync" value="Active" detail="Backend ingestion healthy" />
              <TelemetryStatRow label="Exporter health" value="OK" detail="All exporters responding" />
              <TelemetryStatRow label="Span backlog" value="0.2%" detail="Within target SLA" />
            </div>
          </TelemetryCard>

          <Card className="border-white/10 bg-slate-950/80">
            <CardHeader>
              <CardTitle>Trace health metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-900/70 p-4 text-slate-300">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Root-cause span errors</p>
                  <p className="mt-3 text-3xl font-semibold text-white">5</p>
                </div>
                <div className="rounded-3xl bg-slate-900/70 p-4 text-slate-300">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Latency outliers</p>
                  <p className="mt-3 text-3xl font-semibold text-white">3 services</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {selectedTrace ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md" onClick={() => setSelectedTrace(null)}>
          <Card className="w-full max-w-2xl border border-slate-200/80 bg-white/95 shadow-[0_30px_120px_rgba(15,23,42,0.30)] dark:border-white/10 dark:bg-slate-950/95" onClick={(event) => event.stopPropagation()}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{selectedTrace.id} · {selectedTrace.service}</CardTitle>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Selected trace detail for investigation and remediation planning.</p>
                </div>
                <button type="button" onClick={() => setSelectedTrace(null)} className="rounded-full border border-slate-200/80 bg-slate-50/90 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-slate-700 transition hover:border-emerald-400/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10">Close</button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Latency</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{selectedTrace.latency}</p>
                </div>
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Signal</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{selectedTrace.status}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">{selectedTrace.detail}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </DashboardShell>
  );
}
