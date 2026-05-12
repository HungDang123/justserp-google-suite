import type { EndpointDefinition, EndpointParam, FormValues } from '../types'

export function buildInitialValues(endpoint: EndpointDefinition): FormValues {
  return endpoint.params.reduce<FormValues>((acc, param) => {
    acc[param.name] = getInitialValue(param)
    return acc
  }, {})
}

export function prepareParams(endpoint: EndpointDefinition, values: FormValues): FormValues {
  return endpoint.params.reduce<FormValues>((acc, param) => {
    const value = values[param.name]

    if (param.type === 'boolean') {
      const boolValue = Boolean(value)
      const defaultValue =
        typeof param.default === 'boolean' ? param.default : undefined

      if (param.required || defaultValue === undefined ? boolValue : boolValue !== defaultValue) {
        acc[param.name] = boolValue
      }

      return acc
    }

    const stringValue = typeof value === 'string' ? value.trim() : String(value ?? '').trim()
    if (stringValue !== '') {
      acc[param.name] = stringValue
    }

    return acc
  }, {})
}

function getInitialValue(param: EndpointParam): string | boolean {
  if (param.type === 'boolean') {
    if (typeof param.default === 'boolean') {
      return param.default
    }
    if (param.required && typeof param.example === 'boolean') {
      return param.example
    }
    return false
  }

  if (!param.required) {
    return ''
  }

  if (param.example !== undefined && param.example !== null) {
    return String(param.example)
  }

  if (param.default !== undefined && param.default !== null) {
    return String(param.default)
  }

  return ''
}
