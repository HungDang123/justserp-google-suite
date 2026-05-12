FROM node:22-alpine AS frontend-builder
WORKDIR /build/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM golang:1.26-alpine AS backend-builder
WORKDIR /build/backend

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /build/api ./cmd/api

FROM alpine:3.22
WORKDIR /app

RUN adduser -D -u 10001 appuser

COPY --from=backend-builder /build/api /app/api
COPY --from=frontend-builder /build/frontend/dist /app/frontend/dist
COPY shared/justserp-google-endpoints.json /app/shared/justserp-google-endpoints.json

ENV PORT=8080
ENV STATIC_DIR=/app/frontend/dist
ENV MANIFEST_PATH=/app/shared/justserp-google-endpoints.json

EXPOSE 8080

USER appuser

CMD ["/app/api"]
