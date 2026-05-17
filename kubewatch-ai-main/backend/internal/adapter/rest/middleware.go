package rest

import (
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"kubewatch-ai/internal/infrastructure/monitoring"
)

func MetricsMiddleware(metrics *monitoring.PrometheusMetrics) gin.HandlerFunc {
	return func(c *gin.Context) {
		startTime := time.Now()

		c.Next()

		duration := time.Since(startTime).Seconds()
		endpoint := c.Request.URL.Path
		method := c.Request.Method
		status := strconv.Itoa(c.Writer.Status())

		metrics.RecordAPIRequest(endpoint, method, status, duration)
	}
}
