package justserp

import "testing"

func TestLoadRegistry(t *testing.T) {
	registry, err := LoadRegistry("../../../shared/justserp-google-endpoints.json")
	if err != nil {
		t.Fatalf("LoadRegistry() error = %v", err)
	}

	if got := len(registry.Manifest().Endpoints); got != 30 {
		t.Fatalf("expected 30 endpoints, got %d", got)
	}

	endpoint, ok := registry.Endpoint("autocomplete")
	if !ok {
		t.Fatal("expected autocomplete endpoint to exist")
	}

	if endpoint.Path != "/api/v1/google/autocomplete" {
		t.Fatalf("unexpected endpoint path: %s", endpoint.Path)
	}
}
