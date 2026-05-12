package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Port            string
	FrontendOrigin  string
	JustSerpAPIKey  string
	UpstreamBaseURL string
	ManifestPath    string
	RequestTimeout  time.Duration
}

func Load() (Config, error) {
	_ = godotenv.Load(".env", "../.env")

	manifestPath, err := resolveManifestPath(os.Getenv("MANIFEST_PATH"))
	if err != nil {
		return Config{}, err
	}

	apiKey := os.Getenv("JUSTSERP_API_KEY")
	if apiKey == "" {
		return Config{}, fmt.Errorf("JUSTSERP_API_KEY is required")
	}

	timeoutSeconds := 30
	if raw := os.Getenv("REQUEST_TIMEOUT_SECONDS"); raw != "" {
		parsed, err := strconv.Atoi(raw)
		if err != nil {
			return Config{}, fmt.Errorf("invalid REQUEST_TIMEOUT_SECONDS: %w", err)
		}
		timeoutSeconds = parsed
	}

	return Config{
		Port:            getEnv("PORT", "8080"),
		FrontendOrigin:  getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),
		JustSerpAPIKey:  apiKey,
		UpstreamBaseURL: getEnv("JUSTSERP_BASE_URL", "https://api.justserpapi.com"),
		ManifestPath:    manifestPath,
		RequestTimeout:  time.Duration(timeoutSeconds) * time.Second,
	}, nil
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func resolveManifestPath(explicit string) (string, error) {
	candidates := []string{}
	if explicit != "" {
		candidates = append(candidates, explicit)
	}

	candidates = append(candidates,
		"shared/justserp-google-endpoints.json",
		"../shared/justserp-google-endpoints.json",
	)

	for _, candidate := range candidates {
		if _, err := os.Stat(candidate); err == nil {
			return candidate, nil
		}
	}

	return "", fmt.Errorf("could not locate shared manifest file")
}
