package service

import (
	"context"
	"encoding/json"
	"log"
	"sync"
	"time"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"kubewatch-ai/internal/adapter/websocket"
	"kubewatch-ai/internal/core/model"
	"kubewatch-ai/internal/infrastructure/k8s"
	"kubewatch-ai/internal/infrastructure/monitoring"
)

type IncidentService struct {
	monitor         *KubernetesMonitor
	podService      *k8s.PodService
	metrics         *monitoring.PrometheusMetrics
	hub             *websocket.Hub
	mu              sync.RWMutex
	incidents       []model.Incident
	clusterOverview model.ClusterOverview
}

func NewIncidentService(client *k8s.Client, metrics *monitoring.PrometheusMetrics, hub *websocket.Hub) *IncidentService {
	return &IncidentService{
		monitor:    NewKubernetesMonitor(client),
		podService: k8s.NewPodService(client),
		metrics:    metrics,
		hub:        hub,
	}
}

func (s *IncidentService) StartPolling(ctx context.Context) {
	ticker := time.NewTicker(15 * time.Second)
	defer ticker.Stop()

	s.refreshCluster(ctx)
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			s.refreshCluster(ctx)
		}
	}
}

func (s *IncidentService) GetClusterOverview(ctx context.Context) (model.ClusterOverview, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.clusterOverview, nil
}

func (s *IncidentService) GetNamespaces(ctx context.Context) ([]string, error) {
	return s.monitor.ListNamespaces(ctx)
}

func (s *IncidentService) GetPods(ctx context.Context) ([]corev1.Pod, error) {
	return s.monitor.ListPods(ctx, metav1.NamespaceAll)
}

func (s *IncidentService) GetPodDetails(ctx context.Context) ([]k8s.PodDetail, error) {
	details, err := s.podService.FetchAllPods(ctx)
	if err != nil {
		log.Printf("error: failed to get pod details: %v", err)
		return nil, err
	}
	return details, nil
}

func (s *IncidentService) GetUnhealthyPods(ctx context.Context) ([]k8s.PodDetail, error) {
	unhealthy, err := s.podService.GetUnhealthyPods(ctx)
	if err != nil {
		log.Printf("error: failed to get unhealthy pods: %v", err)
		return nil, err
	}
	return unhealthy, nil
}

func (s *IncidentService) GetClusterHealth(ctx context.Context) (model.ClusterHealth, error) {
	s.mu.RLock()
	overview := s.clusterOverview
	s.mu.RUnlock()

	pods, err := s.monitor.ListPods(ctx, "")
	if err != nil {
		return model.ClusterHealth{}, err
	}

	namespaces, err := s.monitor.ListNamespaces(ctx)
	if err != nil {
		return model.ClusterHealth{}, err
	}

	status := "healthy"
	if overview.ActiveIncidents > 0 {
		status = "degraded"
	}

	return model.ClusterHealth{
		Status:          status,
		Overview:        overview,
		TotalPods:       len(pods),
		TotalNamespaces: len(namespaces),
		IncidentCount:   overview.ActiveIncidents,
		UnhealthyPods:   overview.CrashLoopBackOff + overview.UnhealthyDeployments,
		LastUpdated:     time.Now(),
	}, nil
}

func (s *IncidentService) GetIncidents(ctx context.Context) ([]model.Incident, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]model.Incident, len(s.incidents))
	copy(out, s.incidents)
	return out, nil
}

func (s *IncidentService) refreshCluster(ctx context.Context) {
	pods, _ := s.monitor.ListPods(ctx, metav1.NamespaceAll)
	deployments, _ := s.monitor.ListDeployments(ctx, metav1.NamespaceAll)
	nodes, _ := s.monitor.ListNodes(ctx)
	services, _ := s.monitor.ListServices(ctx, metav1.NamespaceAll)
	namespaces, _ := s.monitor.ListNamespaces(ctx)

	incidents := make([]model.Incident, 0)
	incidents = append(incidents, mustDetect(s.monitor.DetectCrashLoopBackOff(ctx, metav1.NamespaceAll))...)
	incidents = append(incidents, mustDetect(s.monitor.DetectUnhealthyPods(ctx, metav1.NamespaceAll))...)
	incidents = append(incidents, mustDetect(s.monitor.DetectDeploymentReplicaMismatches(ctx, metav1.NamespaceAll))...)

	incidentCounters := map[string]int{}
	incidentNamespaces := map[string]struct{}{}
	for _, incident := range incidents {
		incidentCounters[incident.Type]++
		incidentNamespaces[incident.Namespace] = struct{}{}
	}

	overview := model.ClusterOverview{
		TotalNodes:           len(nodes),
		ReadyNodes:           countReadyNodes(nodes),
		TotalNamespaces:      len(namespaces),
		CrashLoopBackOff:     incidentCounters["CrashLoopBackOff"],
		UnhealthyDeployments: incidentCounters["UnhealthyPod"],
		ReplicaMismatch:      incidentCounters["DeploymentReplicaMismatch"],
		FailedServices:       incidentCounters["FailedService"],
		ActiveIncidents:      len(incidents),
	}

	s.mu.Lock()
	s.incidents = incidents
	s.clusterOverview = overview
	s.mu.Unlock()

	healthyPods := countHealthyPods(pods)
	readyNodes := overview.ReadyNodes

	s.metrics.UpdateIncidentCounts(len(incidents))
	s.metrics.UpdateUnhealthyWorkloads(
		incidentCounters["CrashLoopBackOff"],
		incidentCounters["UnhealthyPod"],
		incidentCounters["DeploymentReplicaMismatch"],
	)
	s.metrics.UpdateClusterHealth(healthyPods, readyNodes)
	s.metrics.UpdateOverviewMetrics(len(nodes), len(pods), len(deployments), len(services))

	payload, _ := json.Marshal(wsPayload{Type: "snapshot", Incidents: incidents, Timestamp: time.Now()})
	s.hub.Broadcast(payload)
}

func countHealthyPods(pods []corev1.Pod) int {
	healthy := 0
	for _, pod := range pods {
		ready := false
		for _, condition := range pod.Status.Conditions {
			if condition.Type == corev1.PodReady && condition.Status == corev1.ConditionTrue {
				ready = true
				break
			}
		}
		if ready && pod.Status.Phase == corev1.PodRunning {
			healthy++
		}
	}
	return healthy
}

type wsPayload struct {
	Type      string           `json:"type"`
	Incidents []model.Incident `json:"incidents"`
	Timestamp time.Time        `json:"timestamp"`
}

func mustDetect(incidents []model.Incident, err error) []model.Incident {
	if err != nil {
		return nil
	}
	return incidents
}

func countReadyNodes(nodes []corev1.Node) int {
	ready := 0
	for _, node := range nodes {
		for _, condition := range node.Status.Conditions {
			if condition.Type == corev1.NodeReady && condition.Status == corev1.ConditionTrue {
				ready++
				break
			}
		}
	}
	return ready
}
