package main

import (
	"context"
	"log"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	"kubewatch-ai/internal/adapter/rest"
	"kubewatch-ai/internal/adapter/websocket"
	"kubewatch-ai/internal/core/service"
	"kubewatch-ai/internal/infrastructure/k8s"
	"kubewatch-ai/internal/infrastructure/monitoring"
)

func main() {
	gin.SetMode(gin.ReleaseMode)

	k8sClient, err := k8s.NewKubernetesClient()
	if err != nil {
		log.Fatalf("failed to build kubernetes client: %v", err)
	}

	metrics := monitoring.NewPrometheusMetrics()
	hub := websocket.NewHub()
	wsService := websocket.NewWebSocketService(hub)
	incidentService := service.NewIncidentService(k8sClient, metrics, hub)

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	if err := k8sClient.VerifyConnection(ctx); err != nil {
		log.Fatalf("kubernetes cluster verification failed: %v", err)
	}

	go hub.Run(ctx)
	go wsService.Start(ctx)
	go incidentService.StartPolling(ctx)

	engine := rest.NewRouter(k8sClient, incidentService, metrics, hub)
	addr := ":8080"
	log.Printf("starting KubeWatch AI backend on %s", addr)

	if err := engine.Run(addr); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
