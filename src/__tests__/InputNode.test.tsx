import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { toast } from 'sonner'
import InputNode from '../components/flow/nodes/InputNode'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock('../../../utils/store', () => ({
  __esModule: true,
  default: vi.fn().mockReturnValue({
    setStoreData: vi.fn(),
    setViewPoint: vi.fn()
  })
}))

const mockUseReactFlow = {
  updateNodeData: vi.fn()
}

vi.mock('@xyflow/react', () => ({
  useReactFlow: () => mockUseReactFlow,
  Handle: ({ type, position, style }) => <div data-testid='handle' data-type={type} data-position={position} style={style} />,
  Position: {
    Right: 'right'
  }
}))

vi.mock('../../../hooks/useIsFirstRender', () => ({
  useIsFirstRender: () => true
}))

describe('InputNode', () => {
  afterEach(cleanup)

  const defaultProps = {
    id: 'test-id',
    data: {
      label: 'Test Node',
      onDeleteNode: vi.fn(),
      url: 'http://example.com/geojson'
    }
  }

  it('renders correctly', () => {
    render(<InputNode {...defaultProps} />)

    expect(screen.getByText('Test Node')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('URL')).toHaveValue('http://example.com/geojson')
    expect(screen.getByTestId('handle')).toBeInTheDocument()
  })

  it('handles URL change and blur correctly', async () => {
    render(<InputNode {...defaultProps} />)

    const input = screen.getByPlaceholderText('URL')
    fireEvent.change(input, { target: { value: 'http://example.com/new-geojson' } })
    fireEvent.blur(input)

    expect(input).toHaveValue('http://example.com/new-geojson')

    await waitFor(() => {
      expect(mockUseReactFlow.updateNodeData).toHaveBeenCalledWith('test-id', { url: 'http://example.com/new-geojson' })
    })
  })

  it('fetches GeoJSON on initial render', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ type: 'FeatureCollection', features: [] })
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    render(<InputNode {...defaultProps} />)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('GeoJSON fetched successfully')
    })
  })

  it('displays error toast on failed GeoJSON fetch', async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({})
    }
    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    render(<InputNode {...defaultProps} />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch GeoJSON')
    })
  })

  it('handles delete button click', () => {
    render(<InputNode {...defaultProps} />)

    fireEvent.mouseOver(screen.getByTestId('input-node'))

    const iconButton = screen.getByTestId('delete-node')
    fireEvent.click(iconButton)

    expect(defaultProps.data.onDeleteNode).toHaveBeenCalledWith([{ id: 'test-id', data: defaultProps.data }])
  })
})
