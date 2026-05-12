package justserp

import (
	"encoding/json"
	"fmt"
	"os"
)

type Registry struct {
	manifest Manifest
	byKey    map[string]Endpoint
}

func LoadRegistry(path string) (*Registry, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("read manifest: %w", err)
	}

	var manifest Manifest
	if err := json.Unmarshal(data, &manifest); err != nil {
		return nil, fmt.Errorf("parse manifest: %w", err)
	}

	byKey := make(map[string]Endpoint, len(manifest.Endpoints))
	for _, endpoint := range manifest.Endpoints {
		if endpoint.Key == "" {
			return nil, fmt.Errorf("manifest contains endpoint with empty key")
		}

		if _, exists := byKey[endpoint.Key]; exists {
			return nil, fmt.Errorf("duplicate endpoint key: %s", endpoint.Key)
		}

		byKey[endpoint.Key] = endpoint
	}

	return &Registry{
		manifest: manifest,
		byKey:    byKey,
	}, nil
}

func (r *Registry) Manifest() Manifest {
	return r.manifest
}

func (r *Registry) Endpoint(key string) (Endpoint, bool) {
	endpoint, ok := r.byKey[key]
	return endpoint, ok
}
