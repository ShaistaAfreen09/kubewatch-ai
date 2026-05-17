package rest

import (
	"net/http"

	"github.com/gin-gonic/gin"
	ginprometheus "github.com/zsais/go-gin-prometheus"
	"kubewatch-ai/internal/adapter/websocket"
	"kubewatch-ai/internal/core/service"
	"kubewatch-ai/internal/infrastructure/k8s"
	"kubewatch-ai/internal/infrastructure/monitoring"
)

func NewRouter(k8sClient *k8s.Client, incidentService *service.IncidentService, metrics *monitoring.PrometheusMetrics, hub *websocket.Hub) *gin.Engine {
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(MetricsMiddleware(metrics))
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	prometheus := ginprometheus.NewPrometheus("kubewatch_ai")
	prometheus.SetListenAddress("")
	prometheus.Use(router)

	api := router.Group("/api/v1")
	{
		api.GET("/overview", func(c *gin.Context) { OverviewHandler(c, incidentService) })
		api.GET("/pods", func(c *gin.Context) { PodsHandler(c, incidentService) })
		api.GET("/pods/details", func(c *gin.Context) { PodDetailsHandler(c, incidentService) })
		api.GET("/pods/unhealthy", func(c *gin.Context) { UnhealthyPodsHandler(c, incidentService) })
		api.GET("/namespaces", func(c *gin.Context) { NamespacesHandler(c, incidentService) })
		api.GET("/incidents", func(c *gin.Context) { IncidentListHandler(c, incidentService) })
		api.GET("/cluster-health", func(c *gin.Context) { ClusterHealthHandler(c, incidentService) })
		api.GET("/cluster-info", func(c *gin.Context) { ClusterInfoHandler(c, k8sClient) })
		api.GET("/ws/alerts", func(c *gin.Context) { WebSocketHandler(c, hub) })
	}

	router.GET("/health", HealthHandler)
	router.GET("/healthz", HealthHandler)

	return router
}
