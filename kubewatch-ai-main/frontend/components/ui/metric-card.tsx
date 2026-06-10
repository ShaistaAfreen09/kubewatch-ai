import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  note?: string;
  accent?: string;
}

export function MetricCard({ label, value, note, accent, className }: MetricCardProps & { className?: string }) {
  return (
    <Card className={cn("border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90", className)}>
      <CardHeader>
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{label}</span>
        <CardTitle className={cn("text-3xl tracking-tight text-slate-900 dark:text-white", accent)}>{value}</CardTitle>
      </CardHeader>
      {note ? <CardDescription>{note}</CardDescription> : null}
    </Card>
  );
}
