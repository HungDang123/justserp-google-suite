import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SendIcon from '@mui/icons-material/Send'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import type { EndpointDefinition, FormValues } from '../types'

interface EndpointFormProps {
  endpoint: EndpointDefinition
  values: FormValues
  isSubmitting: boolean
  onValueChange: (name: string, value: string | boolean) => void
  onReset: () => void
  onSubmit: () => void
}

export function EndpointForm({
  endpoint,
  values,
  isSubmitting,
  onValueChange,
  onReset,
  onSubmit,
}: EndpointFormProps) {
  const requiredParams = endpoint.params.filter((param) => param.required).length

  return (
    <Paper className="mui-panel" elevation={0}>
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'stretch', md: 'flex-start' },
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h2">{endpoint.label}</Typography>
            <Typography color="text.secondary">{endpoint.description}</Typography>
          </Box>
          <Button
            component={Link}
            href={endpoint.docsUrl}
            target="_blank"
            rel="noreferrer"
            variant="outlined"
            endIcon={<OpenInNewIcon />}
            sx={{ flexShrink: 0 }}
          >
            Open docs
          </Button>
        </Stack>

        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip label={`${endpoint.params.length} params`} color="primary" variant="outlined" />
          <Chip label={`${requiredParams} required`} color="warning" variant="outlined" />
          <Chip label={endpoint.method} color="secondary" />
        </Stack>

        <Box className="request-meta-grid">
          <Paper className="request-meta" elevation={0}>
            <Typography className="meta-label">Method</Typography>
            <Typography component="code">{endpoint.method}</Typography>
          </Paper>
          <Paper className="request-meta" elevation={0}>
            <Typography className="meta-label">Path</Typography>
            <Typography component="code">{endpoint.path}</Typography>
          </Paper>
        </Box>

        {endpoint.requiredOneOf?.length ? (
          <Alert severity="info" variant="outlined">
            {endpoint.requiredOneOf.map((group, index) => (
              <Typography key={`${endpoint.key}-${index}`} variant="body2">
                Provide at least one of: <strong>{group.join(', ')}</strong>
              </Typography>
            ))}
          </Alert>
        ) : null}

        <Divider />

        <Box className="params-grid">
          {endpoint.params.map((param) => (
            <Card key={param.name} className="param-card" variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
                  >
                    <Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                      >
                        <Typography sx={{ fontWeight: 700 }}>{param.label}</Typography>
                        {param.required ? (
                          <Chip size="small" label="Required" color="warning" />
                        ) : null}
                      </Stack>
                      <Typography className="param-key" component="code">
                        {param.name}
                      </Typography>
                    </Box>
                    <Chip size="small" label={param.type} variant="outlined" />
                  </Stack>

                  {param.type === 'boolean' ? (
                    <FormControlLabel
                      className="boolean-control"
                      control={
                        <Checkbox
                          checked={Boolean(values[param.name])}
                          onChange={(event) => onValueChange(param.name, event.target.checked)}
                        />
                      }
                      label="Enable"
                    />
                  ) : (
                    <TextField
                      fullWidth
                      type={param.type === 'integer' ? 'number' : 'text'}
                      value={String(values[param.name] ?? '')}
                      placeholder={
                        param.example !== undefined
                          ? String(param.example)
                          : param.default?.toString()
                      }
                      onChange={(event) => onValueChange(param.name, event.target.value)}
                      size="small"
                    />
                  )}

                  {param.description ? (
                    <Typography variant="body2" color="text.secondary">
                      {param.description}
                    </Typography>
                  ) : null}
                  {!param.description && (param.example !== undefined || param.default !== undefined) ? (
                    <Typography variant="body2" color="text.secondary">
                      {param.example !== undefined ? `Example: ${String(param.example)}` : null}
                      {param.example !== undefined && param.default !== undefined ? ' | ' : null}
                      {param.default !== undefined ? `Default: ${String(param.default)}` : null}
                    </Typography>
                  ) : null}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ justifyContent: 'flex-end' }}
        >
          <Button
            type="button"
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={onReset}
          >
            Reset examples
          </Button>
          <Button
            type="button"
            variant="contained"
            size="large"
            startIcon={<SendIcon />}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send request'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
