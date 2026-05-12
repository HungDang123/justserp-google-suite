import type { FormValues, Manifest, ProxyResult } from '../types'

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
  /\/$/,
  '',
)

const API_BASE_URL = configuredBaseUrl ?? (import.meta.env.DEV ? 'http://localhost:8080' : '')

export async function fetchManifest(): Promise<Manifest> {
  const response = await fetch(`${API_BASE_URL}/api/endpoints`)
  if (!response.ok) {
    throw new Error(`Failed to load endpoints (${response.status})`)
  }

  return (await response.json()) as Manifest
}

export async function proxyEndpoint(
  endpointKey: string,
  params: FormValues,
): Promise<ProxyResult> {
  const response = await fetch(`${API_BASE_URL}/api/proxy/${endpointKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ params }),
  })

  const rawText = await response.text()
  let data: unknown = rawText

  try {
    data = JSON.parse(rawText)
  } catch {
    // Return the raw payload when the upstream content is not JSON.
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String(data.message)
        : `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return {
    status: response.status,
    data,
    rawText,
  }
}
