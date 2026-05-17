import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TelemetryCardProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

export function TelemetryCard({ title, className, children }: TelemetryCardProps) {
  return (
    <Card className={cn("border-white/10 bg-slate-950/80", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface TelemetryStatRowProps {
  label: string;
  value: string;
  detail?: string;
}

export function TelemetryStatRow({ label, value, detail }: TelemetryStatRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-3xl bg-slate-900/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-lg font-semibold text-slate-100">{value}</p>
      </div>
      {detail ? <p className="text-sm text-slate-500">{detail}</p> : null}
    </div>
  );
}
