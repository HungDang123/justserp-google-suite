package justserp

import (
	"context"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
	"time"
)

func TestClientProxy(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if got := r.Header.Get("X-API-Key"); got != "test-key" {
			t.Fatalf("expected api key header, got %q", got)
		}

		if got := r.URL.Query().Get("query"); got != "coffee" {
			t.Fatalf("expected query param, got %q", got)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"message":"success"}`))
	}))
	defer server.Close()

	client := NewClient(server.URL, "test-key", 5*time.Second)
	endpoint := Endpoint{
		Method: http.MethodGet,
		Path:   "/api/v1/google/search",
	}

	statusCode, body, contentType, err := client.Proxy(context.Background(), endpoint, url.Values{
		"query": []string{"coffee"},
	})
	if err != nil {
		t.Fatalf("Proxy() error = %v", err)
	}

	if statusCode != http.StatusOK {
		t.Fatalf("expected 200 status, got %d", statusCode)
	}

	if string(body) != `{"message":"success"}` {
		t.Fatalf("unexpected body: %s", string(body))
	}

	if contentType != "application/json" {
		t.Fatalf("unexpected content type: %s", contentType)
	}
}

func TestNormalizeParamsValidatesRequiredOneOf(t *testing.T) {
	endpoint := Endpoint{
		Key:           "maps-places",
		RequiredOneOf: [][]string{{"place_id", "data_id"}},
		Params: []Parameter{
			{Name: "place_id", Type: "string"},
			{Name: "data_id", Type: "string"},
		},
	}

	if _, err := NormalizeParams(endpoint, map[string]any{}); err == nil {
		t.Fatal("expected requiredOneOf validation error")
	}
}
