import { Activity, LoaderCircle, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StateCardProps {
  variant?: "loading" | "empty" | "error";
  title: string;
  description: string;
  actionLabel?: string;
  className?: string;
}

export function StateCard({ variant = "empty", title, description, actionLabel, className }: StateCardProps) {
  const styles = {
    loading: { icon: LoaderCircle, badge: "default" as const, badgeText: "Loading" },
    empty: { icon: Activity, badge: "success" as const, badgeText: "No data" },
    error: { icon: ShieldAlert, badge: "danger" as const, badgeText: "Attention" },
  };

  const Icon = styles[variant].icon;

  return (
    <Card className={className}>
      <CardHeader className="mb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/90 text-slate-700 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100">
              <Icon className="h-4 w-4" />
            </span>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Badge variant={styles[variant].badge}>{styles[variant].badgeText}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription>{description}</CardDescription>
        {actionLabel ? <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{actionLabel}</p> : null}
      </CardContent>
    </Card>
  );
}
