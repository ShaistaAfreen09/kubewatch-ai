import { Activity, ArrowRight, ShieldAlert, Sparkles, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type IncidentDrawerItem = {
  id: string;
  namespace: string;
  category: string;
  summary: string;
  severity: "critical" | "high" | "medium" | "low";
  lastSeen: string;
  remediation: string;
  impact?: string;
  confidence?: string;
  status?: string;
  timeline?: string[];
};

interface IncidentDetailsDrawerProps {
  incident: IncidentDrawerItem | null;
  onClose: () => void;
}

const severityMap = {
  critical: "danger",
  high: "warning",
  medium: "default",
  low: "muted",
} as const;

export function IncidentDetailsDrawer({ incident, onClose }: IncidentDetailsDrawerProps) {
  if (!incident) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-md" onClick={onClose}>
      <aside
        className="h-full w-full max-w-xl border-l border-slate-200/70 bg-white/95 shadow-[0_30px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200/70 p-6 dark:border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.32em] text-emerald-600 dark:text-emerald-300">Incident detail view</p>
                <CardTitle className="text-2xl text-slate-950 dark:text-white">{incident.summary}</CardTitle>
                <CardDescription className="max-w-md text-slate-600 dark:text-slate-400">{incident.namespace} • {incident.category} • Last seen {incident.lastSeen}</CardDescription>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50/90 text-slate-700 transition hover:border-emerald-400/50 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                aria-label="Close incident details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant={severityMap[incident.severity]}>{incident.severity.toUpperCase()}</Badge>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-200">{incident.status ?? "Live"}</span>
              <span className="rounded-full border border-slate-200/70 bg-slate-50/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">AI confidence {incident.confidence ?? "92%"}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <Card className="border-slate-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-950/90">
              <CardHeader>
                <div className="flex items-center gap-3 text-slate-900 dark:text-white"><ShieldAlert className="h-5 w-5 text-rose-500 dark:text-rose-400" /><CardTitle>Operational impact</CardTitle></div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 dark:text-slate-300">{incident.impact ?? "The current incident pattern is being monitored for customer-facing impact and rollout stability."}</p>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-slate-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-950/90">
                <CardHeader>
                  <div className="flex items-center gap-3 text-slate-900 dark:text-white"><Sparkles className="h-5 w-5 text-emerald-500 dark:text-emerald-400" /><CardTitle>AI readout</CardTitle></div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-slate-300">This incident cluster is being driven by repeated restart churn and replica inconsistency in the {incident.namespace} namespace. The recommended response is to verify the deployment image, inspect restart policy limits, and confirm rollout stability before further traffic shifts.</p>
                  <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">{incident.remediation}</div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-950/90">
                <CardHeader>
                  <div className="flex items-center gap-3 text-slate-900 dark:text-white"><Activity className="h-5 w-5 text-violet-500 dark:text-violet-400" /><CardTitle>Recommended next steps</CardTitle></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <li className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">Confirm rollout status and image digest for {incident.namespace} services.</li>
                    <li className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">Inspect pod restarts and resource pressure on the affected deployment.</li>
                    <li className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">Notify the on-call responder if the incident persists beyond the current window.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 border-slate-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-950/90">
              <CardHeader>
                <div className="flex items-center gap-3 text-slate-900 dark:text-white"><ArrowRight className="h-5 w-5 text-emerald-500 dark:text-emerald-400" /><CardTitle>Timeline</CardTitle></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(incident.timeline ?? []).map((item, index) => (
                    <div key={`${incident.id}-${item}`} className="flex gap-4 rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-100">{index + 1}</div>
                      <p className="text-sm text-slate-700 dark:text-slate-200">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </aside>
    </div>
  );
}
