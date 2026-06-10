"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

type NamespaceHealth = "healthy" | "degraded" | "warning";

const namespaces: Array<{ name: string; pods: number; health: NamespaceHealth }> = [
  { name: "payments", pods: 28, health: "degraded" },
  { name: "web", pods: 18, health: "healthy" },
  { name: "api", pods: 35, health: "degraded" },
  { name: "platform", pods: 12, health: "healthy" },
  { name: "database", pods: 9, health: "warning" },
];

const healthMap: Record<NamespaceHealth, "success" | "warning" | "danger"> = {
  healthy: "success",
  degraded: "warning",
  warning: "danger",
};

export default function NamespacesPage() {
  const [query, setQuery] = useState("");
  const [selectedHealth, setSelectedHealth] = useState<NamespaceHealth | "all">("all");

  const filteredNamespaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return namespaces.filter((namespace) => {
      const matchesHealth = selectedHealth === "all" || namespace.health === selectedHealth;
      const matchesQuery = normalizedQuery.length === 0 || namespace.name.toLowerCase().includes(normalizedQuery);

      return matchesHealth && matchesQuery;
    });
  }, [query, selectedHealth]);

  return (
    <DashboardShell title="Namespaces" description="Visualize namespace health and resource distribution across the cluster.">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <Card className="glass-panel card-hover border-slate-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-950/85">
            <CardHeader>
              <CardTitle>Namespace health</CardTitle>
              <CardDescription>Search namespaces and focus on the most urgent service domains without leaving the main view.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex items-center gap-3 rounded-3xl border border-slate-200/70 bg-slate-50/90 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Filter by namespace"
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
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Showing {filteredNamespaces.length} of {namespaces.length} namespaces</p>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredNamespaces.map((namespace) => (
              <Card key={namespace.name} className="glass-panel card-hover border-slate-200/80 bg-white/90 dark:border-white/10 dark:bg-slate-950/85">
                <CardHeader className="flex items-center justify-between gap-4">
                  <CardTitle className="text-base">{namespace.name}</CardTitle>
                  <Badge variant={healthMap[namespace.health]}>{namespace.health.toUpperCase()}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400">{namespace.pods} pods deployed</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <Card className="glass-panel card-hover border-slate-200/80 bg-white/90 dark:border-white/10 dark:bg-slate-950/85">
            <CardHeader>
              <CardTitle>Namespace trends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">Namespace-level health and pod density help isolate faults before they impact broader services or SLOs.</p>
            </CardContent>
          </Card>
          <Card className="glass-panel card-hover border-slate-200/80 bg-white/90 dark:border-white/10 dark:bg-slate-950/85">
            <CardHeader>
              <CardTitle>Priority watchlist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">payments — elevated restart risk and degraded stability</li>
                <li className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">api — moderate latency pressure across workloads</li>
                <li className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">database — watch pod density and reliability thresholds</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </DashboardShell>
  );
}
