package k8s

import (
	"context"
	"fmt"
	"log"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type PodService struct {
	client *Client
}

func NewPodService(client *Client) *PodService {
	return &PodService{client: client}
}

type PodDetail struct {
	Name            string
	Namespace       string
	Status          string
	Phase           corev1.PodPhase
	RestartCount    int32
	NodeName        string
	ContainerCount  int
	ReadyContainers int
	Image           string
}

func (ps *PodService) FetchAllPods(ctx context.Context) ([]PodDetail, error) {
	podList, err := ps.client.ListPods(ctx, metav1.NamespaceAll)
	if err != nil {
		log.Printf("error: failed to fetch pods from cluster: %v", err)
		return nil, fmt.Errorf("failed to fetch pods: %w", err)
	}

	details := make([]PodDetail, 0, len(podList.Items))
	for _, pod := range podList.Items {
		detail := ps.convertPodToDetail(pod)
		details = append(details, detail)
	}

	log.Printf("info: successfully fetched %d pods from cluster", len(details))
	return details, nil
}

func (ps *PodService) FetchPodsInNamespace(ctx context.Context, namespace string) ([]PodDetail, error) {
	podList, err := ps.client.ListPods(ctx, namespace)
	if err != nil {
		log.Printf("error: failed to fetch pods in namespace %s: %v", namespace, err)
		return nil, fmt.Errorf("failed to fetch pods in namespace %s: %w", namespace, err)
	}

	details := make([]PodDetail, 0, len(podList.Items))
	for _, pod := range podList.Items {
		detail := ps.convertPodToDetail(pod)
		details = append(details, detail)
	}

	log.Printf("info: fetched %d pods from namespace %s", len(details), namespace)
	return details, nil
}

func (ps *PodService) convertPodToDetail(pod corev1.Pod) PodDetail {
	restarts := int32(0)
	for _, status := range pod.Status.ContainerStatuses {
		restarts += status.RestartCount
	}

	readyContainers := 0
	for _, status := range pod.Status.ContainerStatuses {
		if status.Ready {
			readyContainers++
		}
	}

	image := ""
	if len(pod.Spec.Containers) > 0 {
		image = pod.Spec.Containers[0].Image
	}

	return PodDetail{
		Name:            pod.Name,
		Namespace:       pod.Namespace,
		Status:          ps.getReadableStatus(pod),
		Phase:           pod.Status.Phase,
		RestartCount:    restarts,
		NodeName:        pod.Spec.NodeName,
		ContainerCount:  len(pod.Spec.Containers),
		ReadyContainers: readyContainers,
		Image:           image,
	}
}

func (ps *PodService) getReadableStatus(pod corev1.Pod) string {
	if pod.Status.Phase == corev1.PodRunning {
		for _, condition := range pod.Status.Conditions {
			if condition.Type == corev1.PodReady {
				if condition.Status == corev1.ConditionTrue {
					return "Running"
				}
				return "NotReady"
			}
		}
		return "Running"
	}
	return string(pod.Status.Phase)
}

func (ps *PodService) GetUnhealthyPods(ctx context.Context) ([]PodDetail, error) {
	allPods, err := ps.FetchAllPods(ctx)
	if err != nil {
		return nil, err
	}

	unhealthy := make([]PodDetail, 0)
	for _, pod := range allPods {
		if pod.Phase != corev1.PodRunning || pod.RestartCount > 5 || pod.ReadyContainers < pod.ContainerCount {
			unhealthy = append(unhealthy, pod)
		}
	}

	return unhealthy, nil
}
