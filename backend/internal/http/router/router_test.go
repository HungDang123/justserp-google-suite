package router

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"justserp-google-suite/backend/internal/config"
	"justserp-google-suite/backend/internal/http/handlers"
)

func TestNoRouteServesFrontendIndex(t *testing.T) {
	tempDir := t.TempDir()
	indexPath := filepath.Join(tempDir, "index.html")
	if err := os.WriteFile(indexPath, []byte("<html>app</html>"), 0o644); err != nil {
		t.Fatalf("write index: %v", err)
	}

	engine := New(config.Config{
		StaticDir: tempDir,
	}, handlers.NewJustSerpHandler(nil, nil))

	request := httptest.NewRequest(http.MethodGet, "/", nil)
	recorder := httptest.NewRecorder()
	engine.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", recorder.Code)
	}

	if body := recorder.Body.String(); body != "<html>app</html>" {
		t.Fatalf("unexpected body: %s", body)
	}
}

func TestUnknownAPIRouteReturnsJSON404(t *testing.T) {
	tempDir := t.TempDir()
	indexPath := filepath.Join(tempDir, "index.html")
	if err := os.WriteFile(indexPath, []byte("<html>app</html>"), 0o644); err != nil {
		t.Fatalf("write index: %v", err)
	}

	engine := New(config.Config{
		StaticDir: tempDir,
	}, handlers.NewJustSerpHandler(nil, nil))

	request := httptest.NewRequest(http.MethodGet, "/api/unknown", nil)
	recorder := httptest.NewRecorder()
	engine.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", recorder.Code)
	}
}
