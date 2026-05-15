import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { Alert, Box, Chip, Paper, Stack, Typography } from '@mui/material'

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
  const hasPayload = content !== null
  const statusLabel = getStatusLabel({ error, hasPayload, isLoading })

  return (
    <Paper className="mui-panel response-panel" elevation={0}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'stretch', sm: 'flex-start' },
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h2">Response</Typography>
            <Typography color="text.secondary">Structured JSON from the Go proxy.</Typography>
          </Box>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Chip
              icon={statusLabel.icon}
              label={statusLabel.label}
              color={statusLabel.color}
              variant={statusLabel.variant}
            />
            {status ? <Chip label={`HTTP ${status}`} variant="outlined" /> : null}
          </Stack>
        </Stack>

        {error ? (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        ) : null}

        <Box component="pre" className="response-viewer">
          {isLoading ? 'Loading response...' : content ?? 'Run a request to see the response.'}
        </Box>
      </Stack>
    </Paper>
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

function getStatusLabel({
  error,
  hasPayload,
  isLoading,
}: {
  error?: string
  hasPayload: boolean
  isLoading: boolean
}): {
  color: 'default' | 'error' | 'info' | 'success'
  icon: React.ReactElement
  label: string
  variant: 'filled' | 'outlined'
} {
  if (isLoading) {
    return {
      color: 'info',
      icon: <HourglassTopIcon />,
      label: 'Loading',
      variant: 'filled',
    }
  }

  if (error) {
    return {
      color: 'error',
      icon: <ErrorIcon />,
      label: 'Error',
      variant: 'filled',
    }
  }

  if (hasPayload) {
    return {
      color: 'success',
      icon: <CheckCircleIcon />,
      label: 'Success',
      variant: 'filled',
    }
  }

  return {
    color: 'default',
    icon: <RadioButtonUncheckedIcon />,
    label: 'Idle',
    variant: 'outlined',
  }
}
