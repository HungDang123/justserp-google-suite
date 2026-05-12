interface ResponseViewerProps {
  status?: number
  payload?: unknown
  error?: string
  isLoading: boolean
}

export function ResponseViewer({
  status,
  payload,
  error,
  isLoading,
}: ResponseViewerProps) {
  const content = formatPayload(payload)

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h2>Response</h2>
          <p>Structured JSON from the Go proxy.</p>
        </div>
        {status ? <span className="status-badge">HTTP {status}</span> : null}
      </div>

      {error ? <div className="error-banner">{error}</div> : null}

      <pre className="response-viewer">
        {isLoading ? 'Loading response...' : content ?? 'Run a request to see the response.'}
      </pre>
    </section>
  )
}

function formatPayload(payload: unknown): string | null {
  if (payload === undefined) {
    return null
  }

  if (typeof payload === 'string') {
    return payload
  }

  try {
    return JSON.stringify(payload, null, 2)
  } catch {
    return String(payload)
  }
}
