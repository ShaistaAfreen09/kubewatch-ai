package monitoring

import (
	"github.com/prometheus/client_golang/prometheus"
)

type PrometheusMetrics struct {
	incidentGauge         prometheus.Gauge
	clusterGauge          prometheus.Gauge
	eventCounter          prometheus.Counter
	scrapeHistogram       prometheus.Histogram
	crashloopGauge        prometheus.Gauge
	unhealthyDeployGauge  prometheus.Gauge
	replicaMismatchGauge  prometheus.Gauge
	healthyPodsGauge      prometheus.Gauge
	nodeHealthGauge       prometheus.Gauge
	apiRequestDurationVec *prometheus.HistogramVec
	apiRequestCounterVec  *prometheus.CounterVec
}

func NewPrometheusMetrics() *PrometheusMetrics {
	incidentGauge := prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "kubewatch_incident_count",
		Help: "Current number of active incidents detected by KubeWatch AI.",
	})
	clusterGauge := prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "kubewatch_cluster_resources",
		Help: "Resource count for cluster objects monitored by KubeWatch AI.",
	})
	eventCounter := prometheus.NewCounter(prometheus.CounterOpts{
		Name: "kubewatch_incident_events_total",
		Help: "Total number of incident events emitted by KubeWatch AI.",
	})
	scrapeHistogram := prometheus.NewHistogram(prometheus.HistogramOpts{
		Name:    "kubewatch_scrape_duration_seconds",
		Help:    "Duration of Kubernetes cluster scans.",
		Buckets: prometheus.DefBuckets,
	})
	crashloopGauge := prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "kubewatch_crashloop_count",
		Help: "Current number of pods in CrashLoopBackOff state.",
	})
	unhealthyDeployGauge := prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "kubewatch_unhealthy_deployments",
		Help: "Current number of unhealthy deployments with replica mismatches.",
	})
	replicaMismatchGauge := prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "kubewatch_replica_mismatch_count",
		Help: "Current number of deployments with replica count mismatches.",
	})
	healthyPodsGauge := prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "kubewatch_healthy_pods",
		Help: "Current number of pods in Ready state.",
	})
	nodeHealthGauge := prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "kubewatch_ready_nodes",
		Help: "Current number of ready nodes in the cluster.",
	})
	apiRequestDurationVec := prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "kubewatch_api_request_duration_seconds",
			Help:    "API request latency by endpoint.",
			Buckets: []float64{.001, .005, .01, .025, .05, .1, .25, .5, 1},
		},
		[]string{"endpoint", "method", "status"},
	)
	apiRequestCounterVec := prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "kubewatch_api_requests_total",
			Help: "Total API requests by endpoint and status.",
		},
		[]string{"endpoint", "method", "status"},
	)

	prometheus.MustRegister(
		incidentGauge, clusterGauge, eventCounter, scrapeHistogram,
		crashloopGauge, unhealthyDeployGauge, replicaMismatchGauge,
		healthyPodsGauge, nodeHealthGauge,
		apiRequestDurationVec, apiRequestCounterVec,
	)

	return &PrometheusMetrics{
		incidentGauge:         incidentGauge,
		clusterGauge:          clusterGauge,
		eventCounter:          eventCounter,
		scrapeHistogram:       scrapeHistogram,
		crashloopGauge:        crashloopGauge,
		unhealthyDeployGauge:  unhealthyDeployGauge,
		replicaMismatchGauge:  replicaMismatchGauge,
		healthyPodsGauge:      healthyPodsGauge,
		nodeHealthGauge:       nodeHealthGauge,
		apiRequestDurationVec: apiRequestDurationVec,
		apiRequestCounterVec:  apiRequestCounterVec,
	}
}

func (m *PrometheusMetrics) UpdateIncidentCounts(count int) {
	m.incidentGauge.Set(float64(count))
	m.eventCounter.Add(1)
}

func (m *PrometheusMetrics) UpdateUnhealthyWorkloads(crashloop, unhealthy, mismatch int) {
	m.crashloopGauge.Set(float64(crashloop))
	m.unhealthyDeployGauge.Set(float64(unhealthy))
	m.replicaMismatchGauge.Set(float64(mismatch))
}

func (m *PrometheusMetrics) UpdateClusterHealth(healthyPods, readyNodes int) {
	m.healthyPodsGauge.Set(float64(healthyPods))
	m.nodeHealthGauge.Set(float64(readyNodes))
}

func (m *PrometheusMetrics) UpdateOverviewMetrics(nodes, pods, deployments, services int) {
	total := nodes + pods + deployments + services
	m.clusterGauge.Set(float64(total))
}

func (m *PrometheusMetrics) ObserveScrapeDuration(seconds float64) {
	m.scrapeHistogram.Observe(seconds)
}

func (m *PrometheusMetrics) RecordAPIRequest(endpoint, method, status string, duration float64) {
	m.apiRequestDurationVec.WithLabelValues(endpoint, method, status).Observe(duration)
	m.apiRequestCounterVec.WithLabelValues(endpoint, method, status).Inc()
}
