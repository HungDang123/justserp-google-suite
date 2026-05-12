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

  return (
    <label className="field">
      <span className="field__label">Endpoint</span>
      <select
        className="field__input"
        value={selectedKey}
        onChange={(event) => onSelect(event.target.value)}
      >
        {Object.entries(groups).map(([groupLabel, groupEndpoints]) => (
          <optgroup key={groupLabel} label={groupLabel}>
            {groupEndpoints.map((endpoint) => (
              <option key={endpoint.key} value={endpoint.key}>
                {endpoint.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  )
}
