package k8s

import (
	"context"
	"log"
	"os"
	"path/filepath"

	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

type Client struct {
	Clientset kubernetes.Interface
	Mock      bool
}

func NewKubernetesClient() (*Client, error) {
	config, err := rest.InClusterConfig()
	if err != nil {
		kubeconfig := os.Getenv("KUBECONFIG")
		if kubeconfig == "" {
			kubeconfig = filepath.Join(homeDir(), ".kube", "config")
		}

		if _, statErr := os.Stat(kubeconfig); statErr != nil {
			if os.IsNotExist(statErr) {
				log.Printf("warning: kubeconfig not found at %s, using mock Kubernetes data", kubeconfig)
				return NewMockKubernetesClient(), nil
			}
		}

		config, err = clientcmd.BuildConfigFromFlags("", kubeconfig)
		if err != nil {
			log.Printf("warning: failed to load kubeconfig from %s, using mock Kubernetes data: %v", kubeconfig, err)
			return NewMockKubernetesClient(), nil
		}
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, err
	}
	return &Client{Clientset: clientset}, nil
}

func NewMockKubernetesClient() *Client {
	return &Client{Mock: true}
}

func (c *Client) IsMock() bool {
	return c != nil && c.Mock
}

func (c *Client) ListNamespaces(ctx context.Context) (*corev1.NamespaceList, error) {
	if c.IsMock() {
		return &corev1.NamespaceList{Items: []corev1.Namespace{
			{ObjectMeta: metav1.ObjectMeta{Name: "default"}},
			{ObjectMeta: metav1.ObjectMeta{Name: "staging"}},
			{ObjectMeta: metav1.ObjectMeta{Name: "production"}},
		}}, nil
	}
	return c.Clientset.CoreV1().Namespaces().List(ctx, metav1.ListOptions{})
}

func (c *Client) ListPods(ctx context.Context, namespace string) (*corev1.PodList, error) {
	if namespace == "" {
		namespace = metav1.NamespaceAll
	}

	if c.IsMock() {
		allPods := []corev1.Pod{
			{
				ObjectMeta: metav1.ObjectMeta{Name: "frontend-abc123", Namespace: "default"},
				Status: corev1.PodStatus{
					Phase:             corev1.PodRunning,
					Conditions:        []corev1.PodCondition{{Type: corev1.PodReady, Status: corev1.ConditionTrue}},
					ContainerStatuses: []corev1.ContainerStatus{{Name: "frontend", Ready: true, RestartCount: 0}},
				},
			},
			{
				ObjectMeta: metav1.ObjectMeta{Name: "worker-crashloop", Namespace: "staging"},
				Status: corev1.PodStatus{
					Phase:      corev1.PodRunning,
					Conditions: []corev1.PodCondition{{Type: corev1.PodReady, Status: corev1.ConditionFalse}},
					ContainerStatuses: []corev1.ContainerStatus{{
						Name:         "worker",
						State:        corev1.ContainerState{Waiting: &corev1.ContainerStateWaiting{Reason: "CrashLoopBackOff", Message: "Back-off restarting failed container"}},
						RestartCount: 5,
					}},
				},
			},
			{
				ObjectMeta: metav1.ObjectMeta{Name: "db-unhealthy", Namespace: "production"},
				Status: corev1.PodStatus{
					Phase:             corev1.PodFailed,
					Conditions:        []corev1.PodCondition{{Type: corev1.PodReady, Status: corev1.ConditionFalse}},
					ContainerStatuses: []corev1.ContainerStatus{{Name: "postgres", Ready: false, RestartCount: 2}},
				},
			},
			{
				ObjectMeta: metav1.ObjectMeta{Name: "cache-high-restarts", Namespace: "production"},
				Status: corev1.PodStatus{
					Phase:             corev1.PodRunning,
					Conditions:        []corev1.PodCondition{{Type: corev1.PodReady, Status: corev1.ConditionFalse}},
					ContainerStatuses: []corev1.ContainerStatus{{Name: "redis", Ready: false, RestartCount: 12}},
				},
			},
		}

		if namespace == metav1.NamespaceAll {
			return &corev1.PodList{Items: allPods}, nil
		}

		filtered := make([]corev1.Pod, 0, len(allPods))
		for _, pod := range allPods {
			if pod.Namespace == namespace {
				filtered = append(filtered, pod)
			}
		}
		return &corev1.PodList{Items: filtered}, nil
	}

	return c.Clientset.CoreV1().Pods(namespace).List(ctx, metav1.ListOptions{})
}

func (c *Client) ListDeployments(ctx context.Context, namespace string) (*appsv1.DeploymentList, error) {
	if namespace == "" {
		namespace = metav1.NamespaceAll
	}

	if c.IsMock() {
		allDeployments := []appsv1.Deployment{
			{
				ObjectMeta: metav1.ObjectMeta{Name: "frontend", Namespace: "default"},
				Status:     appsv1.DeploymentStatus{Replicas: 3, ReadyReplicas: 2, AvailableReplicas: 2},
			},
			{
				ObjectMeta: metav1.ObjectMeta{Name: "api-server", Namespace: "production"},
				Status:     appsv1.DeploymentStatus{Replicas: 4, ReadyReplicas: 1, AvailableReplicas: 1},
			},
		}

		if namespace == metav1.NamespaceAll {
			return &appsv1.DeploymentList{Items: allDeployments}, nil
		}

		filtered := make([]appsv1.Deployment, 0, len(allDeployments))
		for _, deploy := range allDeployments {
			if deploy.Namespace == namespace {
				filtered = append(filtered, deploy)
			}
		}
		return &appsv1.DeploymentList{Items: filtered}, nil
	}

	return c.Clientset.AppsV1().Deployments(namespace).List(ctx, metav1.ListOptions{})
}

func (c *Client) ListNodes(ctx context.Context) (*corev1.NodeList, error) {
	if c.IsMock() {
		return &corev1.NodeList{Items: []corev1.Node{
			{
				ObjectMeta: metav1.ObjectMeta{Name: "mock-node-1"},
				Status:     corev1.NodeStatus{Conditions: []corev1.NodeCondition{{Type: corev1.NodeReady, Status: corev1.ConditionTrue}}},
			},
		}}, nil
	}
	return c.Clientset.CoreV1().Nodes().List(ctx, metav1.ListOptions{})
}

func (c *Client) ListServices(ctx context.Context, namespace string) (*corev1.ServiceList, error) {
	if namespace == "" {
		namespace = metav1.NamespaceAll
	}

	if c.IsMock() {
		allServices := []corev1.Service{
			{
				ObjectMeta: metav1.ObjectMeta{Name: "frontend-service", Namespace: "default"},
			},
			{
				ObjectMeta: metav1.ObjectMeta{Name: "api-service", Namespace: "production"},
			},
		}

		if namespace == metav1.NamespaceAll {
			return &corev1.ServiceList{Items: allServices}, nil
		}

		filtered := make([]corev1.Service, 0, len(allServices))
		for _, svc := range allServices {
			if svc.Namespace == namespace {
				filtered = append(filtered, svc)
			}
		}
		return &corev1.ServiceList{Items: filtered}, nil
	}

	return c.Clientset.CoreV1().Services(namespace).List(ctx, metav1.ListOptions{})
}

func homeDir() string {
	if h, err := os.UserHomeDir(); err == nil {
		return h
	}
	return "."
}
