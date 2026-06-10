import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MetricsChartProps {
  title: string;
  labels: string[];
  values: number[];
  accent: string;
}

export function MetricsChart({ title, labels, values, accent }: MetricsChartProps) {
  const max = Math.max(...values, 1);

  return (
    <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-3">
            {values.map((value, index) => (
              <div key={index} className="relative flex-1 text-center">
                <div
                  className={`mx-auto h-48 w-full max-w-[48px] rounded-3xl bg-slate-200/80 dark:bg-slate-800 ${accent}`}
                  style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
                />
                <p className="mt-3 text-xs text-slate-500">{labels[index]}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/70 p-4 text-sm text-slate-300">
              Peak value <span className="font-semibold text-slate-100">{max}</span>
            </div>
            <div className="rounded-3xl bg-slate-900/70 p-4 text-sm text-slate-300">
              Trend <span className="font-semibold text-slate-100">{values[values.length - 1] >= values[0] ? "rising" : "steady"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
