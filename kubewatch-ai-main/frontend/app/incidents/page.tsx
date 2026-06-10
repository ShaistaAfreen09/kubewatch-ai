"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import { IncidentCard } from "@/components/incident-card";
import { IncidentDetailsDrawer } from "@/components/incident-details-drawer";
import { LiveIncidentFeed } from "@/components/live-incident-feed";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { incidentData } from "@/components/incident-data";
import { Activity, Bell, Search, ShieldAlert, Sparkles } from "lucide-react";

const incidents = incidentData;

export default function IncidentsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<(typeof incidents)[number] | null>(null);

  const severityOptions = ["All", "critical", "high", "medium", "low"] as const;

  const filteredIncidents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return incidents.filter((incident) => {
      const matchesSeverity = selectedSeverity === "All" || incident.severity === selectedSeverity;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [incident.id, incident.namespace, incident.category, incident.summary, incident.remediation]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesSeverity && matchesQuery;
    });
  }, [query, selectedSeverity]);

  return (
    <DashboardShell title="Incident Center" description="Track live alerts, severity trends, and AI-generated remediation guidance across your Kubernetes estate.">
      <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Critical", value: "2", note: "Sev-1 events currently open" },
              { label: "Average MTTR", value: "18m", note: "Across the last 24 hours" },
              { label: "AI confidence", value: "92%", note: "Root-cause analysis confidence" },
            ].map((stat) => (
              <Card key={stat.label} className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
                <CardHeader>
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{stat.label}</span>
                  <CardTitle className="text-3xl text-slate-900 dark:text-white">{stat.value}</CardTitle>
                </CardHeader>
                <CardDescription>{stat.note}</CardDescription>
              </Card>
            ))}
          </div>

          <Card className="glass-panel card-hover border border-slate-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-950/85">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-300"><ShieldAlert className="h-4 w-4" /> Incident response</div>
                  <CardTitle>Severity filters</CardTitle>
                </div>
                <Badge variant="warning">Live</Badge>
              </div>
              <CardDescription>Use the controls below to focus on the incidents that matter most for your current triage window.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex items-center gap-3 rounded-3xl border border-slate-200/70 bg-slate-50/90 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search incidents, namespaces, or remediation steps"
                    className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
                  />
                </label>
                <div className="flex flex-wrap gap-3">
                  {severityOptions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedSeverity(tag)}
                      className={`rounded-full border px-4 py-2 text-sm capitalize transition ${selectedSeverity === tag ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-100" : "border-slate-200/80 bg-slate-50/80 text-slate-700 hover:border-emerald-400/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"}`}
                    >
                      {tag === "All" ? "All severities" : tag}
                    </button>
                  ))}
                </div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Showing {filteredIncidents.length} of {incidents.length} active incidents</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
            <CardHeader>
              <div className="flex items-center gap-3 text-slate-900 dark:text-white"><Sparkles className="h-5 w-5 text-emerald-500 dark:text-emerald-400" /><CardTitle>AI analysis</CardTitle></div>
              <CardDescription>Suggested resolutions generated from recent incident context and deployment signals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Root cause</p>
                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">Replica mismatch and restart saturation in payments and api namespaces are driving the incident burst.</p>
                </div>
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Actions</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    <li>Review rollout health and image tags.</li>
                    <li>Inspect pod limits and node pressure.</li>
                    <li>Trigger incident bridge and notify SRE on-call.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            {filteredIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                {...incident}
                onViewDetails={() => setSelectedIncident(incident)}
              />
            ))}
            {filteredIncidents.length === 0 && (
              <Card className="glass-panel border border-dashed border-slate-200/80 bg-white/90 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/85 dark:text-slate-300">
                No incidents match the current filters. Clear the search or choose a different severity to restore the view.
              </Card>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <LiveIncidentFeed />
          <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
            <CardHeader>
              <div className="flex items-center gap-3 text-slate-900 dark:text-white"><Bell className="h-5 w-5 text-emerald-500 dark:text-emerald-400" /><CardTitle>Incident timeline</CardTitle></div>
              <CardDescription>Recent timeline markers for the current incident batch.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '08:14', note: 'Alert burst detected across payments-api and cache-worker' },
                  { time: '08:21', note: 'AI analysis flagged restart churn and admission pressure' },
                  { time: '08:28', note: 'SRE noticed degraded replica availability on three workloads' },
                ].map((item) => (
                  <div key={item.time} className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.time}</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{item.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
            <CardHeader>
              <div className="flex items-center gap-3 text-slate-900 dark:text-white"><Activity className="h-5 w-5 text-violet-500 dark:text-violet-400" /><CardTitle>Incident stats</CardTitle></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center justify-between rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80"><span>Open incidents</span><strong>3</strong></li>
                <li className="flex items-center justify-between rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80"><span>Responders engaged</span><strong>5</strong></li>
                <li className="flex items-center justify-between rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80"><span>Mean time to detect</span><strong>4m</strong></li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>

      <IncidentDetailsDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </DashboardShell>
  );
}
