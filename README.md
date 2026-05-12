# JustSerp Google Suite

React + Go/Gin fullstack app that proxies all Google endpoints currently listed in the JustSerp API documentation.

## Stack

- `frontend/`: Vite + React + TypeScript
- `backend/`: Go + Gin
- `shared/justserp-google-endpoints.json`: shared manifest for 30 Google endpoints

## Features

- Covers all 30 Google endpoints from the JustSerp Google API directory
- Builds request forms dynamically from the shared endpoint manifest
- Keeps `JUSTSERP_API_KEY` on the Go backend only
- Exposes `GET /api/endpoints` and `POST /api/proxy/:endpointKey`
- Includes smoke tests for frontend rendering and backend registry/proxy behavior

## Local setup

1. Create a local env file from the example:

   ```bash
   copy .env.example .env
   ```

2. Set your JustSerp API key in `.env`:

   ```env
   JUSTSERP_API_KEY=your-secret-key
   ```

3. Start both apps from the project root:

   ```bash
   npm run dev
   ```

4. Open:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:8080/healthz`

## Useful commands

```bash
npm run dev
npm run build
npm run test
npm run lint
```

## Backend API

- `GET /api/endpoints`: returns the manifest used by the UI
- `POST /api/proxy/:endpointKey`: validates params, adds `X-API-Key`, and forwards the request to JustSerp

Example request:

```json
{
  "params": {
    "query": "coffee",
    "country": "us",
    "language": "en"
  }
}
```

## Notes

- The backend auto-loads `.env` from the project root.
- The frontend uses `http://localhost:8080` by default for API calls.
- To add more JustSerp endpoints later, update the shared manifest and the UI/backend will pick them up automatically.
