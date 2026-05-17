package k8s

import (
	"context"
	"fmt"
	"log"
)

type ClusterInfo struct {
	IsConnected bool
	IsMockMode  bool
	NodeCount   int
	Error       string
}

func (c *Client) GetClusterInfo(ctx context.Context) *ClusterInfo {
	info := &ClusterInfo{
		IsConnected: !c.IsMock(),
		IsMockMode:  c.IsMock(),
	}

	nodes, err := c.ListNodes(ctx)
	if err != nil {
		info.Error = err.Error()
		return info
	}

	info.NodeCount = len(nodes.Items)
	return info
}

func (c *Client) VerifyConnection(ctx context.Context) error {
	if c.IsMock() {
		log.Println("info: using mock Kubernetes client (mock mode enabled)")
		return nil
	}

	_, err := c.ListNamespaces(ctx)
	if err != nil {
		return fmt.Errorf("failed to verify kubernetes cluster connection: %w", err)
	}

	info := c.GetClusterInfo(ctx)
	log.Printf("info: successfully connected to Kubernetes cluster with %d nodes", info.NodeCount)
	return nil
}
