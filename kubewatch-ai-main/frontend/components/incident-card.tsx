import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface IncidentCardProps {
  id: string;
  namespace: string;
  category: string;
  summary: string;
  severity: "critical" | "high" | "medium" | "low";
  lastSeen: string;
  remediation: string;
  onViewDetails?: () => void;
}

type IncidentSeverity = "critical" | "high" | "medium" | "low";

const severityMap: Record<IncidentSeverity, "default" | "danger" | "warning" | "muted"> = {
  critical: "danger",
  high: "warning",
  medium: "default",
  low: "muted",
};

export function IncidentCard({ id, namespace, category, summary, severity, lastSeen, remediation, onViewDetails }: IncidentCardProps) {
  return (
    <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400/40 dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardDescription className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{id}</CardDescription>
          <CardTitle className="text-lg">{summary}</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">{namespace} • {category}</p>
        </div>
        <Badge variant={severityMap[severity]}>{severity.toUpperCase()}</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300">Remediation: {remediation}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="rounded-3xl bg-slate-100/90 px-4 py-3 text-xs uppercase tracking-[0.24em] text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
              Last seen {lastSeen}
            </div>
            <button
              type="button"
              onClick={onViewDetails}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/90 px-3 py-2 text-xs uppercase tracking-[0.24em] text-slate-700 transition hover:border-emerald-400/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
            >
              Details
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
