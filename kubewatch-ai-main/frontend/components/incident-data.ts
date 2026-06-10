export type IncidentSeverity = "critical" | "high" | "medium" | "low";

export interface IncidentRecord {
  id: string;
  namespace: string;
  category: string;
  summary: string;
  severity: IncidentSeverity;
  lastSeen: string;
  remediation: string;
  impact?: string;
  confidence?: string;
  status?: string;
  timeline?: string[];
}

export const incidentData: IncidentRecord[] = [
  {
    id: "INC-001",
    namespace: "payments",
    category: "CrashLoopBackOff",
    summary: "Checkout pod restarting repeatedly",
    severity: "critical",
    lastSeen: "2m ago",
    remediation: "Inspect container logs and scale deployment if necessary.",
    impact: "Customer-facing checkout and payment confirmation paths are at risk due to repeated restarts in the payments namespace.",
    confidence: "93%",
    status: "Active incident",
    timeline: [
      "08:14 — Alert burst detected across payments-api and cache-worker.",
      "08:21 — AI analysis flagged restart churn and admission pressure in the payments namespace.",
      "08:28 — SRE confirmed degraded replica availability and opened the response bridge.",
    ],
  },
  {
    id: "INC-002",
    namespace: "web",
    category: "Replica mismatch",
    summary: "Frontend deployment under-provisioned",
    severity: "high",
    lastSeen: "7m ago",
    remediation: "Validate deployment replica count and check node capacity.",
    impact: "Frontend and customer experience dashboards are affected by under-provisioned replicas and rollout drift in the web namespace.",
    confidence: "89%",
    status: "Monitoring",
    timeline: [
      "08:17 — Replica mismatch recorded on the web-frontend deployment.",
      "08:24 — Capacity pressure indicators appeared in related node pools.",
      "08:31 — Platform team marked the event for review during the next deployment window.",
    ],
  },
  {
    id: "INC-003",
    namespace: "api",
    category: "Unhealthy Pod",
    summary: "Latency spike correlated with restarts",
    severity: "medium",
    lastSeen: "15m ago",
    remediation: "Inspect pod resource limits and service dependencies.",
    impact: "Latency is elevated in the api namespace, increasing uncertainty for downstream service calls and customer requests.",
    confidence: "86%",
    status: "Under review",
    timeline: [
      "08:19 — Latency spike correlated with repeated restarts in user-service.",
      "08:26 — Resource limits and dependency latency were flagged for follow-up.",
      "08:33 — Incident owner moved the event to investigation backlog for the next response cycle.",
    ],
  },
];
