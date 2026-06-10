import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const alerts = [
  { label: "CrashLoopBackOff", namespace: "payments", time: "2m ago", severity: "critical" },
  { label: "Deployment replica mismatch", namespace: "web", time: "5m ago", severity: "high" },
  { label: "Pod restart trend", namespace: "api", time: "12m ago", severity: "medium" },
];

export function AlertsPanel() {
  return (
    <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
      <CardHeader>
        <CardTitle>Realtime Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={`${alert.label}-${alert.namespace}`} className="rounded-3xl border border-white/5 bg-slate-900/80 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{alert.label}</p>
                  <p className="text-xs text-slate-500">{alert.namespace}</p>
                </div>
                <Badge variant={alert.severity === "critical" ? "danger" : alert.severity === "high" ? "warning" : "muted"}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>
              <p className="mt-3 text-xs text-slate-500">{alert.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
