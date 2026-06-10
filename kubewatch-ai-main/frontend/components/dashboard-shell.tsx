"use client";

import Link from "next/link";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, Moon, Shield, Sparkles, Sun } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { incidentData } from "@/components/incident-data";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/incidents", label: "Incidents" },
  { href: "/cluster-health", label: "Cluster Health" },
  { href: "/resource-explorer", label: "Resource Explorer" },
  { href: "/namespaces", label: "Namespaces" },
  { href: "/workloads", label: "Workloads" },
  { href: "/open-telemetry", label: "OpenTelemetry" },
];

interface DashboardShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function DashboardShell({ title, description, children }: DashboardShellProps) {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const stored = window.localStorage.getItem("kubewatch-theme") as "dark" | "light" | null;
    if (stored === "dark" || stored === "light") {
      return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notifications, setNotifications] = useState(() =>
    incidentData.slice(0, 4).map((incident, index) => ({
      id: incident.id,
      title: incident.summary,
      detail: incident.remediation,
      namespace: incident.namespace,
      severity: incident.severity,
      time: incident.lastSeen,
      unread: index < 2,
    })),
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("kubewatch-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!notificationsOpen) {
      return;
    }

    const timer = window.setTimeout(() => setNotificationsLoading(false), 350);
    const handlePointerDown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [notificationsOpen]);

  return (
    <div className="min-h-screen text-slate-900 transition-colors dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-10 px-6 py-8 xl:px-12">
        <header className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-[0_30px_120px_rgba(15,23,42,0.35)] lg:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5"><Shield className="h-3.5 w-3.5" /> KubeWatch AI</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><Sparkles className="h-3.5 w-3.5" /> SaaS observability</span>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">{title}</h1>
                <p className="max-w-2xl text-slate-600 dark:text-slate-400">{description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">24 clusters monitored</span>
                <span className="rounded-full border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">99.92% service health</span>
                <span className="rounded-full border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">AI triage enabled</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:text-emerald-200">Live data</span>
                <span className="rounded-full border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">Last sync: 2 min ago</span>
                <span className="rounded-full border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">API health: stable</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 xl:items-end">
              <div className="flex flex-wrap items-center gap-3">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-full border border-slate-200/80 bg-slate-50/80 px-4 py-2 text-sm text-slate-700 transition hover:border-emerald-400/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10">
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsLoading(true);
                      setNotificationsOpen((open) => !open);
                      window.setTimeout(() => setNotificationsLoading(false), 350);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/90 px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:border-emerald-400/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                    aria-label="Open notifications"
                  >
                    <Bell className="h-4 w-4" />
                    Alerts
                    {unreadCount > 0 ? <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-200">{unreadCount}</span> : null}
                  </button>
                  {notificationsOpen ? (
                    <div className="fixed right-4 top-28 z-[110] w-[min(24rem,calc(100vw-1.5rem))] rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-4 shadow-[0_30px_120px_rgba(15,23,42,0.22)] backdrop-blur-xl transition-all duration-200 animate-in fade-in zoom-in dark:border-white/10 dark:bg-slate-950/95 sm:right-6 lg:top-32">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">Realtime notification center</p>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Recent incidents and alert activity</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotifications((items) => items.map((item) => ({ ...item, unread: false })))}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/90 px-3 py-1.5 text-xs text-slate-700 transition hover:border-emerald-400/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                        >
                          <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                        </button>
                      </div>
                      {notificationsLoading ? (
                        <div className="rounded-3xl border border-dashed border-slate-200/70 bg-slate-50/90 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">Loading alert stream…</div>
                      ) : notifications.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-200/70 bg-slate-50/90 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">No active issues are currently being reported.</div>
                      ) : (
                        <div className="space-y-3">
                          {notifications.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setNotifications((current) => current.map((entry) => entry.id === item.id ? { ...entry, unread: false } : entry))}
                            className={`w-full rounded-3xl border p-4 text-left transition ${item.unread ? "border-emerald-400/40 bg-emerald-500/10" : "border-slate-200/70 bg-slate-50/90 hover:border-emerald-400/40 hover:bg-white dark:border-white/10 dark:bg-slate-900/80 dark:hover:bg-slate-800/90"}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.namespace}</p>
                                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{item.detail}</p>
                              </div>
                              <Badge variant={item.severity === "critical" ? "danger" : item.severity === "high" ? "warning" : item.severity === "medium" ? "default" : "muted"}>{item.severity}</Badge>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                              <span>{item.time}</span>
                              <span>{item.unread ? "Unread" : "Read"}</span>
                            </div>
                          </button>
                        ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/90 px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:border-emerald-400/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </button>
                <Link href="/open-telemetry" className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-700 transition hover:bg-emerald-500/15 dark:text-emerald-200">
                  <Sparkles className="h-4 w-4" /> Trace insights
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="grid gap-8">{children}</main>

        <Card className="border-slate-200/80 bg-white/90 p-6 text-slate-600 dark:border-white/10 dark:bg-slate-900/65 dark:text-slate-400">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">Built for cloud-native teams managing Kubernetes observability, incident response, and real-time operational intelligence.</p>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              <span>Theme aware</span>
              <span>Responsive</span>
              <span>API-first</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
