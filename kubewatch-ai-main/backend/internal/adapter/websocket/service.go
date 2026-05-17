package websocket

import (
	"context"
	"encoding/json"
	"time"

	"kubewatch-ai/internal/core/model"
)

type WebSocketService struct {
	Hub               *Hub
	mockIncidentQueue chan []byte
}

func NewWebSocketService(hub *Hub) *WebSocketService {
	return &WebSocketService{
		Hub:               hub,
		mockIncidentQueue: make(chan []byte, 32),
	}
}

func (s *WebSocketService) Start(ctx context.Context) {
	go s.runMockIncidentProducer(ctx)
	go s.runMockIncidentBroadcaster(ctx)
}

func (s *WebSocketService) Publish(payload []byte) {
	s.Hub.Broadcast(payload)
}

func (s *WebSocketService) runMockIncidentProducer(ctx context.Context) {
	ticker := time.NewTicker(6 * time.Second)
	defer ticker.Stop()

	templateIncidents := []model.Incident{
		{
			ID:                   "mock-001",
			Namespace:            "payments",
			Workload:             "checkout-service",
			Type:                 "CrashLoopBackOff",
			Category:             model.IncidentCategoryCrashLoopBackOff,
			Summary:              "Checkout service restarted unexpectedly",
			Details:              "Pod is reporting CrashLoopBackOff after a failed deployment.",
			Severity:             model.SeverityCritical,
			SeverityScore:        90,
			SuggestedRemediation: "Check container logs, verify image, and restart the deployment.",
			Source:               "mock-stream",
		},
		{
			ID:                   "mock-002",
			Namespace:            "web",
			Workload:             "frontend",
			Type:                 "HighRestartCount",
			Category:             model.IncidentCategoryHighRestartCount,
			Summary:              "Frontend pod restart rate has spiked",
			Details:              "Restart count exceeded threshold for the last 5 minutes.",
			Severity:             model.SeverityHigh,
			SeverityScore:        70,
			SuggestedRemediation: "Review readiness probes and recent deployments.",
			Source:               "mock-stream",
		},
		{
			ID:                   "mock-003",
			Namespace:            "api",
			Workload:             "user-service",
			Type:                 "UnhealthyDeployment",
			Category:             model.IncidentCategoryUnhealthyDeployment,
			Summary:              "Deployment is reporting fewer ready replicas than desired",
			Details:              "Deployment ready count is 1 of 3 replicas.",
			Severity:             model.SeverityMedium,
			SeverityScore:        55,
			SuggestedRemediation: "Inspect rolling update and check node pressure.",
			Source:               "mock-stream",
		},
	}

	index := 0
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			incident := templateIncidents[index%len(templateIncidents)]
			incident.LastSeen = time.Now()
			incident.FirstSeen = time.Now().Add(-5 * time.Minute)
			payload := struct {
				Type      string         `json:"type"`
				Incident  model.Incident `json:"incident"`
				Timestamp time.Time      `json:"timestamp"`
			}{
				Type:      "alert",
				Incident:  incident,
				Timestamp: time.Now(),
			}
			message, _ := json.Marshal(payload)
			select {
			case s.mockIncidentQueue <- message:
			default:
			}
			index++
		}
	}
}

func (s *WebSocketService) runMockIncidentBroadcaster(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		case payload := <-s.mockIncidentQueue:
			s.Hub.Broadcast(payload)
		}
	}
}
