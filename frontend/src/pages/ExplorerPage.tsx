import ApiIcon from '@mui/icons-material/Api'
import CodeIcon from '@mui/icons-material/Code'
import DatasetIcon from '@mui/icons-material/Dataset'
import KeyIcon from '@mui/icons-material/Key'
import SearchIcon from '@mui/icons-material/Search'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
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
    return (
      <Box className="loading-shell">
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <CircularProgress />
          <Typography color="text.secondary">Loading endpoint manifest...</Typography>
        </Stack>
      </Box>
    )
  }

  if (!manifest || !selectedEndpoint) {
    return (
      <Box className="loading-shell">
        <Alert severity="error">{error || 'No endpoints available.'}</Alert>
      </Box>
    )
  }

  const requiredCount = selectedEndpoint.params.filter((param) => param.required).length

  return (
    <Container className="app-shell" maxWidth={false}>
      <Paper className="hero-panel" elevation={0}>
        <Stack className="hero-content" spacing={3}>
          <Stack spacing={2}>
            <Chip
              className="hero-chip"
              icon={<SearchIcon />}
              label="JustSerp Google Suite"
              color="primary"
            />
            <Box>
              <Typography variant="h1">Google endpoint explorer</Typography>
              <Typography className="hero-subtitle" color="text.secondary">
                Build requests from the shared manifest, proxy them through Go, and inspect
                structured responses without exposing API credentials in the browser.
              </Typography>
            </Box>
          </Stack>

          <Box className="hero-metrics">
            <MetricCard
              icon={<DatasetIcon />}
              label="Available endpoints"
              value={manifest.endpoints.length}
            />
            <MetricCard
              icon={<ApiIcon />}
              label="Params in this request"
              value={selectedEndpoint.params.length}
            />
            <MetricCard icon={<KeyIcon />} label="Required fields" value={requiredCount} />
          </Box>
        </Stack>
      </Paper>

      <Box className="workspace-grid">
        <aside className="sidebar">
          <Paper className="mui-panel sidebar-panel" elevation={0}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h2">Endpoint catalog</Typography>
                <Typography color="text.secondary">
                  Select an API, review params, then send a proxied request.
                </Typography>
              </Box>

              <EndpointSelector
                endpoints={manifest.endpoints}
                selectedKey={selectedKey}
                onSelect={handleSelect}
              />

              <Stack spacing={1.25}>
                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Chip label={selectedEndpoint.groupLabel} color="primary" variant="outlined" />
                  <Chip label={selectedEndpoint.method} color="secondary" variant="outlined" />
                </Stack>
                <Stack className="endpoint-path" direction="row" spacing={1}>
                  <CodeIcon fontSize="small" />
                  <code>{selectedEndpoint.path}</code>
                </Stack>
                <Typography color="text.secondary">{selectedEndpoint.description}</Typography>
              </Stack>
            </Stack>
          </Paper>
        </aside>

        <Stack spacing={2.5}>
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
        </Stack>
      </Box>
    </Container>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <Paper className="metric-card" elevation={0}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <span className="metric-icon">{icon}</span>
        <Box>
          <Typography className="metric-value">{value}</Typography>
          <Typography className="metric-label">{label}</Typography>
        </Box>
      </Stack>
    </Paper>
  )
}
