import DashboardShell from "@/components/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthWidget } from "@/components/ui/health-widget";
import { MetricCard } from "@/components/ui/metric-card";
import { MetricsChart } from "@/components/metrics-chart";
import { TelemetryCard, TelemetryStatRow } from "@/components/ui/telemetry-card";

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

export default function OpenTelemetryPage() {
  return (
    <DashboardShell
      title="OpenTelemetry"
      description="A distributed tracing overview for telemetry health, latency, and span error visibility."
    >
      <div className="grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
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

          <Card className="border-white/10 bg-slate-950/80">
            <CardHeader>
              <CardTitle>Distributed tracing overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Mock telemetry data shows trace collection across service boundaries, latency distribution, and span error health. Use these insights to optimize instrumentation and reduce request-level failures.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/70 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Services traced</p>
                  <p className="mt-3 text-3xl font-semibold text-white">24</p>
                </div>
                <div className="rounded-3xl bg-slate-900/70 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sampling rate</p>
                  <p className="mt-3 text-3xl font-semibold text-white">78%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card className="border-white/10 bg-slate-950/80">
            <CardHeader>
              <CardTitle>Service latency cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceLatency.map((item) => (
                  <div key={item.service} className="rounded-3xl bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-400">{item.service}</p>
                        <p className="mt-1 text-lg font-semibold text-slate-100">{item.latency}</p>
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
    </DashboardShell>
  );
}
