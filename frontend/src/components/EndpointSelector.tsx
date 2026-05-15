import ApiIcon from '@mui/icons-material/Api'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from '@mui/material'

import type { EndpointDefinition } from '../types'

interface EndpointSelectorProps {
  endpoints: EndpointDefinition[]
  selectedKey: string
  onSelect: (endpointKey: string) => void
}

export function EndpointSelector({
  endpoints,
  selectedKey,
  onSelect,
}: EndpointSelectorProps) {
  const groups = endpoints.reduce<Record<string, EndpointDefinition[]>>((acc, endpoint) => {
    const key = endpoint.groupLabel
    acc[key] ??= []
    acc[key].push(endpoint)
    return acc
  }, {})

  const selectedEndpoint = endpoints.find((endpoint) => endpoint.key === selectedKey)

  return (
    <FormControl fullWidth>
      <InputLabel id="endpoint-selector-label">Endpoint</InputLabel>
      <Select
        labelId="endpoint-selector-label"
        label="Endpoint"
        value={selectedKey}
        onChange={(event) => onSelect(event.target.value)}
        startAdornment={<ApiIcon color="action" sx={{ mr: 1 }} />}
      >
        {Object.entries(groups).flatMap(([groupLabel, groupEndpoints]) => [
          <ListSubheader key={groupLabel}>{groupLabel}</ListSubheader>,
          ...groupEndpoints.map((endpoint) => (
            <MenuItem key={endpoint.key} value={endpoint.key}>
              {endpoint.label}
            </MenuItem>
          )),
        ])}
      </Select>
      {selectedEndpoint ? (
        <FormHelperText>
          {selectedEndpoint.method} request in {selectedEndpoint.groupLabel}
        </FormHelperText>
      ) : null}
    </FormControl>
  )
}
