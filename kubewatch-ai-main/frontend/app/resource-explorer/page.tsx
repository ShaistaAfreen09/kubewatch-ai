"use client";

import { useMemo, useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Boxes, Cpu, Search, ShieldCheck, Server, Workflow } from "lucide-react";

type ResourceStatus = "Healthy" | "Warning" | "Critical";
type ResourceKind = "Node" | "Namespace" | "Pod" | "Deployment" | "Service";

type ExplorerItem = {
  id: string;
  name: string;
  kind: ResourceKind;
  namespace?: string;
  status: ResourceStatus;
  health: number;
  summary: string;
  details: string;
  uptime?: string;
  replicas?: string;
  cpu?: string;
  memory?: string;
};

const resources: ExplorerItem[] = [
  {
    id: "node-1",
    name: "aks-prod-01",
    kind: "Node",
    status: "Healthy",
    health: 94,
    summary: "Primary production node pool instance handling user-facing traffic.",
    details: "CPU pressure is within threshold, with Kubernetes scheduling healthy and no recent eviction events.",
    uptime: "42d",
    cpu: "38%",
    memory: "61%",
  },
  {
    id: "node-2",
    name: "aks-prod-02",
    kind: "Node",
    status: "Warning",
    health: 82,
    summary: "Secondary worker node for platform and telemetry services.",
    details: "Memory pressure is elevated after the last deployment window; a small increase in pod churn is visible.",
    uptime: "19d",
    cpu: "67%",
    memory: "79%",
  },
  {
    id: "node-3",
    name: "aks-prod-03",
    kind: "Node",
    status: "Healthy",
    health: 91,
    summary: "Dedicated node for database and stateful workloads.",
    details: "No unstable pods detected. Storage I/O and networking are operating in the expected range.",
    uptime: "31d",
    cpu: "44%",
    memory: "53%",
  },
  {
    id: "ns-payments",
    name: "payments",
    kind: "Namespace",
    status: "Warning",
    health: 76,
    summary: "Payments namespace with two critical customer-facing services.",
    details: "This namespace is carrying the highest restart risk in the current environment. Review rollout health before promotions.",
  },
  {
    id: "ns-web",
    name: "web",
    kind: "Namespace",
    status: "Healthy",
    health: 92,
    summary: "Frontend and edge delivery workloads are healthy.",
    details: "Traffic routing, front-end replicas, and CDN alignment are stable across the namespace.",
  },
  {
    id: "ns-api",
    name: "api",
    kind: "Namespace",
    status: "Warning",
    health: 71,
    summary: "API namespace showing elevated latency and pod churn.",
    details: "User-service and cache-worker are under moderate pressure, but the namespace still meets its SLO window.",
  },
  {
    id: "pod-payments-1",
    name: "payments-api-7dcf5",
    kind: "Pod",
    namespace: "payments",
    status: "Critical",
    health: 48,
    summary: "CrashLoopBackOff detected on the checkout service path.",
    details: "Two restart loops occurred in the last 10 minutes. The container image and memory limits should be reviewed immediately.",
    replicas: "3/3",
    cpu: "84%",
    memory: "72%",
  },
  {
    id: "pod-web-1",
    name: "web-frontend-58b7d",
    kind: "Pod",
    namespace: "web",
    status: "Healthy",
    health: 95,
    summary: "Frontend pod running the latest stable rollout.",
    details: "The pod is healthy, serving traffic as expected, and has no active readiness issues.",
    replicas: "12/12",
    cpu: "31%",
    memory: "45%",
  },
  {
    id: "deploy-payments",
    name: "payments-api",
    kind: "Deployment",
    namespace: "payments",
    status: "Warning",
    health: 68,
    summary: "Customer checkout deployment with rollout drift.",
    details: "Replica availability is slightly below target, and the latest rollout is carrying increased restart churn.",
    replicas: "6/8",
  },
  {
    id: "deploy-web",
    name: "web-frontend",
    kind: "Deployment",
    namespace: "web",
    status: "Healthy",
    health: 93,
    summary: "Stable deployment for the public application frontend.",
    details: "This deployment is healthy and stable with no pending canary or rollback conditions.",
    replicas: "12/12",
  },
  {
    id: "svc-payments",
    name: "payments-svc",
    kind: "Service",
    namespace: "payments",
    status: "Warning",
    health: 74,
    summary: "Service traffic is routed through the current payments cluster nodes.",
    details: "Traffic is available, but one endpoint is seeing elevated error response time during traffic spikes.",
  },
  {
    id: "svc-web",
    name: "web-svc",
    kind: "Service",
    namespace: "web",
    status: "Healthy",
    health: 96,
    summary: "Public entry point for the user-facing portal.",
    details: "Latency is stable and service availability remains above target with no active incidents.",
  },
];

const healthTone: Record<ResourceStatus, "success" | "warning" | "danger"> = {
  Healthy: "success",
  Warning: "warning",
  Critical: "danger",
};

const treeSections = [
  { label: "Cluster", detail: "prod-us-west-1" },
  { label: "Nodes", detail: "3 active" },
  { label: "Namespaces", detail: "4 monitored" },
  { label: "Pods", detail: "18 running" },
  { label: "Deployments", detail: "7 current" },
  { label: "Services", detail: "12 exposed" },
];

export default function ResourceExplorerPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ExplorerItem>(resources[0]);

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return resources;
    }

    return resources.filter((item) =>
      [item.name, item.kind, item.namespace ?? "", item.summary, item.details]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const activeResources = filteredResources.slice(0, 8);

  return (
    <DashboardShell
      title="Kubernetes Resource Explorer"
      description="Inspect cluster resources, health posture, and operational context with realistic production-style mock data."
    >
      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.4fr_0.9fr]">
        <section className="space-y-6">
          <Card className="glass-panel card-hover border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-slate-950/90">
            <CardHeader>
              <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                <Boxes className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                <CardTitle>Explorer tree</CardTitle>
              </div>
              <CardDescription>Browse the resource hierarchy from cluster to namespace to workload.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                {treeSections.map((section, index) => (
                  <button
                    key={section.label}
                    type="button"
                    onClick={() => setSelected(resources[index] ?? resources[0])}
                    className="w-full rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 text-left transition hover:border-emerald-400/40 hover:bg-white dark:border-white/10 dark:bg-slate-900/80 dark:hover:bg-slate-800/90"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-slate-900 dark:text-white">{section.label}</span>
                      <Badge variant={index === 0 ? "success" : index < 3 ? "warning" : "muted"}>{section.detail}</Badge>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{index === 0 ? "Cluster root" : index === 1 ? "Worker nodes" : index === 2 ? "Namespace scope" : "Managed resources"}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel card-hover border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-slate-950/90">
            <CardHeader>
              <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                <ShieldCheck className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                <CardTitle>Health snapshot</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {[
                { label: "Cluster health", value: "89/100", note: "Stable with two watch areas" },
                { label: "Restart churn", value: "Low", note: "One critical pod still needs review" },
                { label: "Node pressure", value: "Moderate", note: "Memory pressure on one worker" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.label}</p>
                    <strong className="text-slate-900 dark:text-white">{item.value}</strong>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <Card className="glass-panel border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-slate-950/90">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Search & inspect</CardTitle>
                  <CardDescription>Filter production resources by name, type, namespace, or operational signal.</CardDescription>
                </div>
                <Badge variant="success">Mock data</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <label className="flex items-center gap-3 rounded-3xl border border-slate-200/70 bg-slate-50/90 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search nodes, pods, services, namespaces..."
                  className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
                />
              </label>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {[
              { label: "Nodes", value: "3", detail: "Healthy / warning mix" },
              { label: "Namespaces", value: "4", detail: "Monitored domains" },
              { label: "Deployments", value: "7", detail: "Rolling and stable" },
              { label: "Services", value: "12", detail: "Exposed and healthy" },
            ].map((item) => (
              <Card key={item.label} className="glass-panel card-hover border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-slate-950/90">
                <CardHeader>
                  <CardTitle className="text-base text-slate-900 dark:text-white">{item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-panel border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-slate-950/90">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Matching resources</CardTitle>
                  <CardDescription>Click any item to inspect its operational detail panel.</CardDescription>
                </div>
                <Badge variant="warning">{activeResources.length} shown</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeResources.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item)}
                    className={`w-full rounded-3xl border p-4 text-left transition ${selected.id === item.id ? "border-emerald-400/60 bg-emerald-500/10" : "border-slate-200/70 bg-slate-50/90 hover:border-emerald-400/40 hover:bg-white dark:border-white/10 dark:bg-slate-900/80 dark:hover:bg-slate-800/90"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.kind}{item.namespace ? ` • ${item.namespace}` : ""}</p>
                        <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{item.summary}</p>
                      </div>
                      <Badge variant={healthTone[item.status]}>{item.status}</Badge>
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1"><Cpu className="h-3.5 w-3.5" /> {item.cpu ?? "-"}</span>
                      <span className="inline-flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> Health {item.health}%</span>
                      <span className="inline-flex items-center gap-1"><Workflow className="h-3.5 w-3.5" /> {item.replicas ?? item.uptime ?? "Live"}</span>
                    </div>
                  </button>
                ))}
                {activeResources.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-slate-200/70 bg-slate-50/90 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">No resources match that search phrase. Try a namespace, deployment, or node name instead.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card className="glass-panel border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-slate-950/90">
            <CardHeader>
              <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                <Server className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                <CardTitle>Resource details</CardTitle>
              </div>
              <CardDescription>Operational context for the selected resource in the explorer.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Selected resource</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{selected.name}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{selected.kind}{selected.namespace ? ` • ${selected.namespace}` : ""}</p>
                  </div>
                  <Badge variant={healthTone[selected.status]}>{selected.status}</Badge>
                </div>

                <div className="mt-4 rounded-3xl border border-slate-200/70 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/70">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{selected.details}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    {selected.uptime ? <span>Uptime: {selected.uptime}</span> : null}
                    {selected.replicas ? <span>Replicas: {selected.replicas}</span> : null}
                    {selected.cpu ? <span>CPU: {selected.cpu}</span> : null}
                    {selected.memory ? <span>Memory: {selected.memory}</span> : null}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      <span>Health</span>
                      <span>{selected.health}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-violet-500" style={{ width: `${selected.health}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      <span>Availability</span>
                      <span>{Math.max(74, selected.health)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className="h-2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" style={{ width: `${Math.max(74, selected.health)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-slate-200/80 bg-white/95 dark:border-white/10 dark:bg-slate-950/90">
            <CardHeader>
              <CardTitle>Ops guidance</CardTitle>
              <CardDescription>Recommended focus area for the active resource context.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">Review the payments namespace before the next rollout window.</li>
                <li className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">Watch node memory pressure and pod churn on aks-prod-02.</li>
                <li className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/80">Keep deployment availability high for customer-facing services.</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </DashboardShell>
  );
}
