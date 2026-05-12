import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EndpointForm } from './EndpointForm'
import type { EndpointDefinition, FormValues } from '../types'

const endpoint: EndpointDefinition = {
  key: 'lens',
  group: 'discovery',
  groupLabel: 'Discovery',
  label: 'Google Lens Search',
  description: 'Lens endpoint',
  docsUrl: 'https://docs.example.test/lens',
  method: 'GET',
  path: '/api/v1/google/lens',
  params: [
    {
      name: 'url',
      label: 'Image URL',
      type: 'string',
      required: true,
      example: 'https://example.test/image.jpg',
    },
    {
      name: 'visual_matches',
      label: 'Visual Matches',
      type: 'boolean',
      required: false,
      default: false,
    },
  ],
}

const values: FormValues = {
  url: 'https://example.test/image.jpg',
  visual_matches: false,
}

describe('EndpointForm', () => {
  it('renders fields and emits changes', () => {
    const onValueChange = vi.fn()

    render(
      <EndpointForm
        endpoint={endpoint}
        values={values}
        isSubmitting={false}
        onValueChange={onValueChange}
        onReset={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )

    expect(screen.getByText('Google Lens Search')).toBeInTheDocument()
    expect(screen.getByText('Required')).toBeInTheDocument()

    fireEvent.change(screen.getByDisplayValue('https://example.test/image.jpg'), {
      target: { value: 'https://example.test/updated.jpg' },
    })
    fireEvent.click(screen.getByRole('checkbox'))

    expect(onValueChange).toHaveBeenCalledWith('url', 'https://example.test/updated.jpg')
    expect(onValueChange).toHaveBeenCalledWith('visual_matches', true)
  })
})
