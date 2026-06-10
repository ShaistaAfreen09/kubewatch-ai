import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statusStyles = {
  healthy: "text-emerald-300",
  degraded: "text-amber-300",
  danger: "text-rose-300",
};

interface HealthWidgetProps {
  title: string;
  status: "healthy" | "degraded" | "danger";
  value: string;
  detail: string;
}

export function HealthWidget({ title, status, value, detail }: HealthWidgetProps) {
  return (
    <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
      <CardHeader>
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{title}</span>
        <CardTitle className={cn("text-4xl tracking-tight", statusStyles[status])}>{value}</CardTitle>
      </CardHeader>
      <CardDescription>{detail}</CardDescription>
    </Card>
  );
}
