import { useEffect, useMemo, useState } from 'react'

import { EndpointForm } from '../components/EndpointForm'
import { EndpointSelector } from '../components/EndpointSelector'
import { ResponseViewer } from '../components/ResponseViewer'
import { fetchManifest, proxyEndpoint } from '../lib/api'
import { buildInitialValues, prepareParams } from '../lib/form'
import type { FormValues, Manifest, ProxyResult } from '../types'

export function ExplorerPage() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [selectedKey, setSelectedKey] = useState('')
  const [formValues, setFormValues] = useState<FormValues>({})
  const [result, setResult] = useState<ProxyResult | null>(null)
  const [error, setError] = useState('')
  const [isLoadingManifest, setIsLoadingManifest] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadManifest() {
      try {
        const nextManifest = await fetchManifest()
        if (!isMounted) {
          return
        }

        const initialEndpoint = nextManifest.endpoints[0] ?? null
        setManifest(nextManifest)
        setSelectedKey(initialEndpoint?.key ?? '')
        setFormValues(initialEndpoint ? buildInitialValues(initialEndpoint) : {})
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'Failed to load endpoints.')
      } finally {
        if (isMounted) {
          setIsLoadingManifest(false)
        }
      }
    }

    void loadManifest()

    return () => {
      isMounted = false
    }
  }, [])

  const selectedEndpoint = useMemo(
    () => manifest?.endpoints.find((endpoint) => endpoint.key === selectedKey) ?? null,
    [manifest, selectedKey],
  )

  async function handleSubmit() {
    if (!selectedEndpoint) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const nextResult = await proxyEndpoint(
        selectedEndpoint.key,
        prepareParams(selectedEndpoint, formValues),
      )
      setResult(nextResult)
    } catch (submitError) {
      setResult(null)
      setError(submitError instanceof Error ? submitError.message : 'Request failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleValueChange(name: string, value: string | boolean) {
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleReset() {
    if (!selectedEndpoint) {
      return
    }

    setFormValues(buildInitialValues(selectedEndpoint))
  }

  function handleSelect(endpointKey: string) {
    if (!manifest) {
      return
    }

    const nextEndpoint = manifest.endpoints.find((endpoint) => endpoint.key === endpointKey)
    setSelectedKey(endpointKey)
    setFormValues(nextEndpoint ? buildInitialValues(nextEndpoint) : {})
    setResult(null)
    setError('')
  }

  if (isLoadingManifest) {
    return <main className="shell shell--centered">Loading endpoint manifest...</main>
  }

  if (!manifest || !selectedEndpoint) {
    return <main className="shell shell--centered">{error || 'No endpoints available.'}</main>
  }

  return (
    <main className="shell">
      <section className="layout-grid">
        <aside className="sidebar">
          <div className="panel">
            <div className="panel__header">
              <div>
                <h2>Endpoint catalog</h2>
                <p>Select an API, review params, then send a proxied request.</p>
              </div>
            </div>

            <EndpointSelector
              endpoints={manifest.endpoints}
              selectedKey={selectedKey}
              onSelect={handleSelect}
            />

            <div className="sidebar__summary">
              <span className="status-badge">{selectedEndpoint.groupLabel}</span>
              <code>{selectedEndpoint.path}</code>
            </div>
          </div>
        </aside>

        <div className="content-stack">
          <EndpointForm
            endpoint={selectedEndpoint}
            values={formValues}
            isSubmitting={isSubmitting}
            onValueChange={handleValueChange}
            onReset={handleReset}
            onSubmit={handleSubmit}
          />

          <ResponseViewer
            status={result?.status}
            payload={result?.data}
            error={error}
            isLoading={isSubmitting}
          />
        </div>
      </section>
    </main>
  )
}
