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
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h2>{endpoint.label}</h2>
          <p>{endpoint.description}</p>
        </div>
        <a href={endpoint.docsUrl} target="_blank" rel="noreferrer" className="link-button">
          Open docs
        </a>
      </div>

      <div className="meta-grid">
        <div>
          <span className="meta-grid__label">Method</span>
          <code>{endpoint.method}</code>
        </div>
        <div>
          <span className="meta-grid__label">Path</span>
          <code>{endpoint.path}</code>
        </div>
      </div>

      {endpoint.requiredOneOf?.length ? (
        <div className="info-banner">
          {endpoint.requiredOneOf.map((group, index) => (
            <p key={`${endpoint.key}-${index}`}>
              Provide at least one of: <strong>{group.join(', ')}</strong>
            </p>
          ))}
        </div>
      ) : null}

      <div className="form-grid">
        {endpoint.params.map((param) => (
          <label key={param.name} className="field">
            <span className="field__label">
              {param.label}
              {param.required ? <span className="field__required">Required</span> : null}
            </span>

            {param.type === 'boolean' ? (
              <span className="checkbox-field">
                <input
                  type="checkbox"
                  checked={Boolean(values[param.name])}
                  onChange={(event) => onValueChange(param.name, event.target.checked)}
                />
                <span>Enable</span>
              </span>
            ) : (
              <input
                className="field__input"
                type={param.type === 'integer' ? 'number' : 'text'}
                value={String(values[param.name] ?? '')}
                placeholder={
                  param.example !== undefined ? String(param.example) : param.default?.toString()
                }
                onChange={(event) => onValueChange(param.name, event.target.value)}
              />
            )}

            {param.description ? <small className="field__hint">{param.description}</small> : null}
            {!param.description && (param.example !== undefined || param.default !== undefined) ? (
              <small className="field__hint">
                {param.example !== undefined ? `Example: ${String(param.example)}` : null}
                {param.example !== undefined && param.default !== undefined ? ' | ' : null}
                {param.default !== undefined ? `Default: ${String(param.default)}` : null}
              </small>
            ) : null}
          </label>
        ))}
      </div>

      <div className="actions">
        <button type="button" className="button button--ghost" onClick={onReset}>
          Reset examples
        </button>
        <button type="button" className="button" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send request'}
        </button>
      </div>
    </section>
  )
}
