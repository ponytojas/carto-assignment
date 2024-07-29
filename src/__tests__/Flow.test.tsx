import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Flow } from '../components/flow/Flow'

vi.mock('../../utils/store', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    saveFlowState: vi.fn(),
    loadFlowState: vi.fn(() => ({ nodes: [], edges: [] })),
    setNodes: vi.fn(),
    setEdges: vi.fn(),
    nodes: [],
    edges: []
  }))
}))

describe('Flow Component', () => {
  afterEach(cleanup)

  it('should render component', () => {
    render(
      <MemoryRouter>
        <Flow />
      </MemoryRouter>
    )
  })

  it('renders and handles navigation', () => {
    render(
      <MemoryRouter>
        <Flow />
      </MemoryRouter>
    )

    const mapButton = screen.getByText(/Map/i)
    expect(mapButton).toBeInTheDocument()

    fireEvent.click(mapButton)
    expect(mapButton).toBeInTheDocument()
  })

  it('should open drawer', () => {
    render(
      <MemoryRouter>
        <Flow />
      </MemoryRouter>
    )

    const $menuIcon = screen.getByTestId('menu-icon')
    expect($menuIcon).toBeInTheDocument()

    fireEvent.click($menuIcon)

    const $drawer = screen.getByTestId('drawer')
    expect($drawer).toBeInTheDocument()
  })

  it('drawer should contain sidebar items', () => {
    render(
      <MemoryRouter>
        <Flow />
      </MemoryRouter>
    )

    const $menuIcon = screen.getByTestId('menu-icon')
    expect($menuIcon).toBeInTheDocument()

    fireEvent.click($menuIcon)

    const $sidebarItemSource = screen.getByTestId('sidebar-item-sourceNode')
    expect($sidebarItemSource).toBeInTheDocument()

    const $sidebarItemLayer = screen.getByTestId('sidebar-item-layerNode')
    expect($sidebarItemLayer).toBeInTheDocument()
  })

  it('should render load and save flow state', () => {
    render(
      <MemoryRouter>
        <Flow />
      </MemoryRouter>
    )

    const $saveStateButton = screen.getByTestId('save-state-button')
    expect($saveStateButton).toBeInTheDocument()

    const $loadStateButton = screen.getByTestId('load-state-button')
    expect($loadStateButton).toBeInTheDocument()
  })
})
