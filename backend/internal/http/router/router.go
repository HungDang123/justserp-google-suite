package router

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"justserp-google-suite/backend/internal/config"
	"justserp-google-suite/backend/internal/http/handlers"
)

func New(cfg config.Config, justSerpHandler *handlers.JustSerpHandler) *gin.Engine {
	engine := gin.New()
	engine.Use(gin.Logger(), gin.Recovery())

	if cfg.FrontendOrigin != "" {
		engine.Use(cors.New(cors.Config{
			AllowOrigins:     []string{cfg.FrontendOrigin},
			AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodOptions},
			AllowHeaders:     []string{"Content-Type"},
			ExposeHeaders:    []string{"Content-Type"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		}))
	}

	engine.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := engine.Group("/api")
	api.GET("/endpoints", justSerpHandler.ListEndpoints)
	api.POST("/proxy/:endpointKey", justSerpHandler.Proxy)

	if cfg.StaticDir != "" {
		engine.NoRoute(func(c *gin.Context) {
			if strings.HasPrefix(c.Request.URL.Path, "/api/") {
				c.JSON(http.StatusNotFound, gin.H{"message": "route not found"})
				return
			}

			requestPath := strings.TrimPrefix(c.Request.URL.Path, "/")
			if requestPath == "" {
				c.File(filepath.Join(cfg.StaticDir, "index.html"))
				return
			}

			assetPath := filepath.Join(cfg.StaticDir, filepath.Clean(requestPath))
			if isStaticFile(assetPath, cfg.StaticDir) {
				c.File(assetPath)
				return
			}

			c.File(filepath.Join(cfg.StaticDir, "index.html"))
		})
	}

	return engine
}

func isStaticFile(path string, root string) bool {
	relative, err := filepath.Rel(root, path)
	if err != nil || strings.HasPrefix(relative, "..") {
		return false
	}

	info, err := os.Stat(path)
	if err != nil {
		return false
	}

	return !info.IsDir()
}
