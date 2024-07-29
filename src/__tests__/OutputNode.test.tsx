import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import OutputNode from '../components/flow/nodes/OutputNode'

interface HandleProps {
  type: string
  position: string
  style: React.CSSProperties
}

vi.mock('@xyflow/react', () => ({
  Handle: ({ type, position, style }: HandleProps) => <div data-testid='handle' data-type={type} data-position={position} style={style} />,
  Position: {
    Left: 'left'
  }
}))

describe('OutputNode', () => {
  afterEach(cleanup)

  const defaultProps = {
    id: 'test-id',
    data: {
      label: 'Output Node',
      onDeleteNode: vi.fn()
    }
  }

  it('renders correctly', () => {
    render(<OutputNode {...defaultProps} />)

    expect(screen.getByText('Output Node')).toBeInTheDocument()
    expect(screen.getByTestId('handle')).toBeInTheDocument()
  })

  it('shows delete icon on hover', () => {
    render(<OutputNode {...defaultProps} />)

    const baseNode = screen.getByText('Output Node').closest('div')
    expect(baseNode).toBeInTheDocument()
    if (baseNode != null) {
      fireEvent.mouseEnter(baseNode)
      expect(screen.getByRole('button')).toBeInTheDocument()

      fireEvent.mouseLeave(baseNode)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    }
  })

  it('handles delete button click', () => {
    render(<OutputNode {...defaultProps} />)

    const baseNode = screen.getByText('Output Node').closest('div')
    if (baseNode != null) {
      fireEvent.mouseEnter(baseNode)

      const iconButton = screen.getByRole('button')
      fireEvent.click(iconButton)

      expect(defaultProps.data.onDeleteNode).toHaveBeenCalledWith([{ id: 'test-id', data: defaultProps.data }])
    }
  })

  it('changes icon color on hover', () => {
    render(<OutputNode {...defaultProps} />)

    const baseNode = screen.getByText('Output Node').closest('div')
    if (baseNode != null) {
      fireEvent.mouseEnter(baseNode)

      const iconButton = screen.getByRole('button')
      expect((iconButton?.firstChild as Element)?.classList).toContain('MuiSvgIcon-colorAction')
      expect((iconButton?.firstChild as Element)?.classList).not.toContain('MuiSvgIcon-colorError')
      fireEvent.mouseEnter(iconButton)

      expect((iconButton?.firstChild as Element)?.classList).not.toContain('MuiSvgIcon-colorAction')
      expect((iconButton?.firstChild as Element)?.classList).toContain('MuiSvgIcon-colorError')
    }
  })
})
