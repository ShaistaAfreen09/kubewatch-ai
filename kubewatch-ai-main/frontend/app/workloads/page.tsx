"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

type WorkloadHealth = "healthy" | "degraded" | "warning";

const workloads: Array<{ name: string; namespace: string; replicas: string; health: WorkloadHealth }> = [
  { name: "payments-api", namespace: "payments", replicas: "6/8", health: "degraded" },
  { name: "web-frontend", namespace: "web", replicas: "12/12", health: "healthy" },
  { name: "user-service", namespace: "api", replicas: "4/5", health: "warning" },
  { name: "auth-proxy", namespace: "platform", replicas: "3/3", health: "healthy" },
];

const healthMap: Record<WorkloadHealth, "success" | "warning" | "danger"> = {
  healthy: "success",
  degraded: "warning",
  warning: "danger",
};

export default function WorkloadsPage() {
  const [query, setQuery] = useState("");
  const [selectedHealth, setSelectedHealth] = useState<WorkloadHealth | "all">("all");

  const filteredWorkloads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return workloads.filter((workload) => {
      const matchesHealth = selectedHealth === "all" || workload.health === selectedHealth;
      const matchesQuery = normalizedQuery.length === 0 || [workload.name, workload.namespace].join(" ").toLowerCase().includes(normalizedQuery);

      return matchesHealth && matchesQuery;
    });
  }, [query, selectedHealth]);

  return (
    <DashboardShell title="Workloads" description="Inspect deployment health, scaling patterns, and workload reliability.">
      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <Card className="glass-panel card-hover border-slate-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-950/85">
            <CardHeader>
              <CardTitle>Deployment health</CardTitle>
              <CardDescription>Refine the workload list quickly to focus on the deployments most likely to affect service reliability.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex items-center gap-3 rounded-3xl border border-slate-200/70 bg-slate-50/90 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search workloads or namespaces"
                    className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["all", "healthy", "degraded", "warning"] as const).map((health) => (
                    <button
                      key={health}
                      type="button"
                      onClick={() => setSelectedHealth(health === "all" ? "all" : health)}
                      className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.24em] transition ${selectedHealth === health ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-100" : "border-slate-200/80 bg-slate-50/80 text-slate-700 hover:border-emerald-400/40 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"}`}
                    >
                      {health === "all" ? "All" : health}
                    </button>
                  ))}
                </div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Showing {filteredWorkloads.length} of {workloads.length} workloads</p>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-4">
            {filteredWorkloads.map((workload) => (
              <Card key={workload.name} className="glass-panel card-hover border-slate-200/80 bg-white/90 dark:border-white/10 dark:bg-slate-950/85">
                <CardHeader className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{workload.name}</CardTitle>
                    <p className="text-sm text-slate-500">{workload.namespace}</p>
                  </div>
                  <Badge variant={healthMap[workload.health]}>{workload.health.toUpperCase()}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300">Replica set: {workload.replicas}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <Card className="glass-panel card-hover border-slate-200/80 bg-white/90 dark:border-white/10 dark:bg-slate-950/85">
            <CardHeader>
              <CardTitle>Workload summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">Workload health widgets help teams identify amplification risks, rollout regressions, and performance drift at a glance.</p>
            </CardContent>
          </Card>
          <Card className="glass-panel card-hover border-slate-200/80 bg-white/90 dark:border-white/10 dark:bg-slate-950/85">
            <CardHeader>
              <CardTitle>Recommended actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">Scale the payments-api rollout before replica drift affects availability.</li>
                <li className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">Review user-service resource limits to reduce restart churn and saturation.</li>
                <li className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">Confirm node pressure on the platform namespace before the next deployment window.</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </DashboardShell>
  );
}
