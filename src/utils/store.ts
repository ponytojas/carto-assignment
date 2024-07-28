import { create } from 'zustand'
import { Node, Edge } from '@xyflow/react'
import { FeatureCollection } from 'geojson'
import { viewPoint } from '../components/map/types'

interface FlowState {
  nodes: Node[]
  edges: Edge[]
  storeData: Record<string, FeatureCollection>
  viewPoint: viewPoint
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  setStoreData: (newData: GeoJson[]) => void
  saveFlowState: (nodes: Node[], edges: Edge[]) => void
  loadFlowState: () => { nodes: Node[], edges: Edge[] }
  setViewPoint: (viewPoint: viewPoint) => void
}

const useStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  storeData: {},
  viewPoint: null,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setStoreData: (newData) => set({ storeData: newData }),
  saveFlowState: (nodes, edges) => set({ nodes, edges }),
  setViewPoint: (viewPoint) => set({ viewPoint }),
  loadFlowState: () => {
    const { nodes, edges } = useStore.getState()
    return { nodes, edges }
  }
}))

export default useStore
