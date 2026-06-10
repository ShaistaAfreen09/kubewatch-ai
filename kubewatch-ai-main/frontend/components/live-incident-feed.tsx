"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StateCard } from "@/components/ui/state-card";

type IncidentSeverity = "critical" | "high" | "medium" | "low";

type Incident = {
  id: string;
  namespace: string;
  category: string;
  summary: string;
  severity: IncidentSeverity;
  lastSeen: string;
  remediation?: string;
};

type WebSocketPayload = {
  type: string;
  incident?: Incident;
  incidents?: Incident[];
  timestamp?: string;
};

const initialIncidents: Incident[] = [
  {
    id: "INC-001",
    namespace: "payments",
    category: "CrashLoopBackOff",
    summary: "Checkout service restarted 6 times in 10 minutes",
    severity: "critical",
    lastSeen: "2m ago",
  },
  {
    id: "INC-002",
    namespace: "api",
    category: "High restart count",
    summary: "Cache worker pod reporting frequent restarts",
    severity: "high",
    lastSeen: "8m ago",
  },
];

function buildWebSocketUrl() {
  if (typeof window === "undefined") {
    return "";
  }
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.hostname}:8080/api/v1/ws/alerts`;
}

export function LiveIncidentFeed() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [status, setStatus] = useState("connecting");

  const statusTone = status === "connected" ? "success" : status === "error" || status === "disconnected" ? "warning" : "muted";

  useEffect(() => {
    const wsUrl = buildWebSocketUrl();
    if (!wsUrl) {
      return;
    }

    const socket = new WebSocket(wsUrl);

    socket.addEventListener("open", () => {
      setStatus("connected");
    });

    socket.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data) as WebSocketPayload;
        if (payload.type === "alert" && payload.incident) {
          const incident = payload.incident;
          setIncidents((current) => [incident, ...current].slice(0, 8));
        } else if (payload.type === "snapshot" && payload.incidents) {
          const incidents = payload.incidents;
          setIncidents((current) => [...incidents, ...current].slice(0, 8));
        }
      } catch {
        return;
      }
    });

    socket.addEventListener("close", () => setStatus("disconnected"));
    socket.addEventListener("error", () => setStatus("error"));

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/90 dark:via-slate-900/90 dark:to-slate-950/90">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Realtime incident feed</CardTitle>
            <CardDescription>Live pipeline status and event activity for operators.</CardDescription>
          </div>
          <Badge variant={statusTone}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {status === "connecting" ? (
          <StateCard variant="loading" title="Connecting to incident stream" description="The live alert channel is establishing a connection. Existing fallback data remains visible while the feed is warming up." actionLabel="Status: Initializing" />
        ) : null}
        {status === "error" || status === "disconnected" ? (
          <StateCard variant="error" title="Live feed unavailable" description="The WebSocket stream is not responding right now, but the incident view continues to show the latest known data." actionLabel="Status: Offline" />
        ) : null}
        {status === "connected" && incidents.length === 0 ? (
          <StateCard variant="empty" title="No active incidents" description="No live incidents are currently being reported from this workspace." actionLabel="Status: Healthy" />
        ) : null}
        <div className="space-y-4">
          {incidents.map((incident, index) => (
            <div
              key={`${incident.id}-${incident.lastSeen}-${index}`}
              className="animate-pulse rounded-3xl border border-slate-200/80 bg-slate-50/90 p-4 transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900/80"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{incident.category}</p>
                  <p className="text-xs text-slate-500">{incident.namespace}</p>
                </div>
                <Badge
                  variant={
                    incident.severity === "critical"
                      ? "danger"
                      : incident.severity === "high"
                      ? "warning"
                      : "muted"
                  }
                >
                  {incident.severity.toUpperCase()}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-slate-300">{incident.summary}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{incident.lastSeen}</span>
                {incident.remediation ? <span>{incident.remediation}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
