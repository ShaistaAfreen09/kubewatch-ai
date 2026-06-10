import DashboardShell from "@/components/dashboard-shell";
import { MetricCard } from "@/components/ui/metric-card";
import { LiveIncidentFeed } from "@/components/live-incident-feed";
import { MetricsChart } from "@/components/metrics-chart";
import { IncidentCard } from "@/components/incident-card";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ArrowRight, Bell, Cpu, ShieldCheck, Sparkles, Wrench } from "lucide-react";

type IncidentSeverity = "critical" | "high" | "medium" | "low";

const recentIncidents: Array<{
  id: string;
  namespace: string;
  category: string;
  summary: string;
  severity: IncidentSeverity;
  lastSeen: string;
  remediation: string;
}> = [
  {
    id: "INC-001",
    namespace: "payments",
    category: "CrashLoopBackOff",
    summary: "Checkout service restarted 6 times in 10 minutes",
    severity: "critical",
    lastSeen: "2m ago",
    remediation: "Review logs and rollout a recovery image.",
  },
  {
    id: "INC-002",
    namespace: "api",
    category: "High restart count",
    summary: "Cache worker pod reporting frequent restarts",
    severity: "high",
    lastSeen: "8m ago",
    remediation: "Inspect memory and lifecycle probes.",
  },
];

export default function Home() {
  return (
    <DashboardShell title="Executive Overview" description="A production-grade observability workspace for incident response, cluster health, telemetry, and platform operations.">
      <div className="grid gap-8 xl:grid-cols-[1.25fr_0.85fr]">
        <section className="space-y-6">
          <Card className="glass-panel card-hover border-slate-200/80 bg-white/90 p-6 dark:border-white/10 dark:bg-slate-950/85">
            <CardHeader className="p-0 pb-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.32em] text-emerald-600 dark:text-emerald-300">Operations pulse</p>
                  <CardTitle className="text-2xl text-slate-950 dark:text-white">Live platform status at a glance</CardTitle>
                  <CardDescription>AI-assisted reliability signals, current recovery actions, and platform performance are summarized here for fast triage.</CardDescription>
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-200">Healthy</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: "Data freshness", value: "2 min", detail: "Telemetry and incident feeds are current" },
                  { label: "Recovery queue", value: "3 actions", detail: "Rollouts and restarts need attention" },
                  { label: "AI confidence", value: "92%", detail: "Suggested remediations are highly reliable" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Active incidents" value="8" note="Critical and warning events in the last hour" accent="text-emerald-600 dark:text-emerald-300" />
            <MetricCard label="SLO coverage" value="99.92%" note="Service objectives staying within budget" accent="text-slate-900 dark:text-slate-100" />
            <MetricCard label="Cluster health" value="88/100" note="Stable but watch for replica drift and pod churn" accent="text-amber-600 dark:text-amber-300" />
            <MetricCard label="Deployments" value="17" note="4 rolling out, 3 awaiting validation" accent="text-violet-600 dark:text-violet-300" />
          </div>

          <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-emerald-600 dark:text-emerald-300"><ShieldCheck className="h-4 w-4" /> Executive overview</div>
                  <CardTitle className="text-2xl">Platform reliability at a glance</CardTitle>
                  <CardDescription>AI-assisted triage highlights the most important operational signals for SRE and platform teams managing production Kubernetes workloads.</CardDescription>
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-200">Healthy</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: "Pod availability", value: "96.4%", detail: "Three namespaces showing mild instability" },
                  { label: "Node pressure", value: "Low", detail: "CPU and memory remain within thresholds" },
                  { label: "AI confidence", value: "92%", detail: "Root-cause analysis confidence for active incidents" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <MetricsChart title="Incident trend" labels={["1h", "2h", "3h", "4h", "5h", "6h"]} values={[3, 5, 6, 4, 7, 8]} accent="bg-emerald-400/80" />

          <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
            <CardHeader>
              <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                <Cpu className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                <CardTitle>Recent deployments</CardTitle>
              </div>
              <CardDescription>Production rollouts with confidence scores and rollout health signals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "payments-api", status: "Rolling out", namespace: "payments", confidence: "94%" },
                  { name: "web-frontend", status: "Stable", namespace: "web", confidence: "98%" },
                  { name: "auth-proxy", status: "Canary", namespace: "platform", confidence: "89%" },
                ].map((deployment) => (
                  <div key={deployment.name} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{deployment.name}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{deployment.namespace}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">{deployment.status}</span>
                      <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200">{deployment.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6">
          <LiveIncidentFeed />

          <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
            <CardHeader>
              <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                <Sparkles className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                <CardTitle>AI incident summary</CardTitle>
              </div>
              <CardDescription>Recommended next steps for the current incident wave.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <p>Checkout service and cache worker are the main contributors to the current incident window. Expected recovery path is to validate rollout health, reduce restart churn, and inspect pod limits.</p>
                <div className="rounded-3xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Suggested commands</p>
                  <pre className="mt-3 whitespace-pre-wrap break-words font-mono text-xs text-slate-900 dark:text-slate-100">kubectl get pods -n payments --watch<br />kubectl describe pod -n payments checkout-6c9b8</pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
            <CardHeader>
              <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                <Wrench className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                <CardTitle>Operations focus</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80"><span>Node pressure</span><strong className="text-emerald-600 dark:text-emerald-300">Normal</strong></li>
                <li className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80"><span>Pod restarts</span><strong className="text-amber-600 dark:text-amber-300">Watch</strong></li>
                <li className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80"><span>Trace latency</span><strong className="text-violet-600 dark:text-violet-300">Stable</strong></li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Incident priorities</CardTitle>
                <span className="rounded-full border border-slate-200/80 bg-slate-50/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">Updated 2m ago</span>
              </div>
              <CardDescription>Prioritize live alerts and coordinate remediation actions across your platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {recentIncidents.map((incident) => (
                  <IncidentCard key={incident.id} {...incident} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
            <CardHeader>
              <div className="flex items-center gap-3 text-slate-900 dark:text-white"><Bell className="h-5 w-5 text-emerald-500 dark:text-emerald-400" /><CardTitle>Realtime activity</CardTitle></div>
              <CardDescription>Recent service updates, events, and signal changes from your platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "payments-api restarted 3 containers in 9 minutes",
                  "web-frontend rolled out a new image to 40% of traffic",
                  "Tracing pipeline recovered 98% of dropped spans",
                ].map((entry) => (
                  <div key={entry} className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm text-slate-700 dark:text-slate-200">{entry}</p>
                      <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardShell>
  );
}
