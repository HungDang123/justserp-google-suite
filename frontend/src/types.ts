export type ParamType = 'string' | 'integer' | 'boolean'

export interface EndpointParam {
  name: string
  label: string
  type: ParamType
  required: boolean
  description?: string
  default?: unknown
  example?: unknown
}

export interface EndpointDefinition {
  key: string
  group: string
  groupLabel: string
  label: string
  description: string
  docsUrl: string
  method: string
  path: string
  requiredOneOf?: string[][]
  params: EndpointParam[]
}

export interface Manifest {
  version: string
  baseUrl: string
  endpoints: EndpointDefinition[]
}

export interface ProxyResult {
  status: number
  data: unknown
  rawText: string
}

export type FormValues = Record<string, string | boolean>
