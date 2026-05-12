package handlers

import (
	"errors"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"

	"justserp-google-suite/backend/internal/justserp"
)

type JustSerpHandler struct {
	registry *justserp.Registry
	client   *justserp.Client
}

type ProxyRequest struct {
	Params map[string]any `json:"params"`
}

func NewJustSerpHandler(registry *justserp.Registry, client *justserp.Client) *JustSerpHandler {
	return &JustSerpHandler{
		registry: registry,
		client:   client,
	}
}

func (h *JustSerpHandler) ListEndpoints(c *gin.Context) {
	c.JSON(http.StatusOK, h.registry.Manifest())
}

func (h *JustSerpHandler) Proxy(c *gin.Context) {
	endpoint, ok := h.registry.Endpoint(c.Param("endpointKey"))
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"message": "endpoint not found"})
		return
	}

	var request ProxyRequest
	if err := c.ShouldBindJSON(&request); err != nil && !errors.Is(err, io.EOF) {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid request body"})
		return
	}

	params, err := justserp.NormalizeParams(endpoint, request.Params)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	statusCode, body, contentType, err := h.client.Proxy(c.Request.Context(), endpoint, params)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		return
	}

	c.Data(statusCode, contentType, body)
}
