package router

import (
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"justserp-google-suite/backend/internal/config"
	"justserp-google-suite/backend/internal/http/handlers"
)

func New(cfg config.Config, justSerpHandler *handlers.JustSerpHandler) *gin.Engine {
	engine := gin.New()
	engine.Use(gin.Logger(), gin.Recovery())
	engine.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.FrontendOrigin},
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	engine.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := engine.Group("/api")
	api.GET("/endpoints", justSerpHandler.ListEndpoints)
	api.POST("/proxy/:endpointKey", justSerpHandler.Proxy)

	return engine
}
