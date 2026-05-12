package main

import (
	"log"

	"justserp-google-suite/backend/internal/config"
	"justserp-google-suite/backend/internal/http/handlers"
	"justserp-google-suite/backend/internal/http/router"
	"justserp-google-suite/backend/internal/justserp"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	registry, err := justserp.LoadRegistry(cfg.ManifestPath)
	if err != nil {
		log.Fatal(err)
	}

	client := justserp.NewClient(cfg.UpstreamBaseURL, cfg.JustSerpAPIKey, cfg.RequestTimeout)
	handler := handlers.NewJustSerpHandler(registry, client)
	engine := router.New(cfg, handler)

	if err := engine.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
