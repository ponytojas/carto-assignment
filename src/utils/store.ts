import { create } from 'zustand'
import { Node, Edge } from '@xyflow/react'
import { FeatureCollection } from 'geojson'
import { MapViewState } from 'deck.gl'

export interface FlowState {
  nodes: Node[]
  edges: Edge[]
  storeData: Record<string, FeatureCollection>
  viewPoint: MapViewState | null
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  setStoreData: (newData: Record<string, FeatureCollection>) => void
  removeStoreData: (id: string) => void // Add this line
  saveFlowState: (nodes: Node[], edges: Edge[]) => void
  loadFlowState: () => { nodes: Node[], edges: Edge[] }
  setViewPoint: (viewPoint: MapViewState) => void
}
// @ts-expect-error This is a workaround for a TypeScript error of useStore implicitly having an any type
const useStore = create<FlowState>()((set) => ({
  nodes: [],
  edges: [],
  storeData: {},
  viewPoint: null,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setStoreData: (newData) => set((state) => ({
    storeData: { ...state.storeData, ...newData }
  })),
  removeStoreData: (id) => set((state) => {
    const newStoreData = { ...state.storeData }
    delete newStoreData[id]
    return { storeData: newStoreData }
  }),
  saveFlowState: (nodes, edges) => set({ nodes, edges }),
  setViewPoint: (viewPoint) => set({ viewPoint }),
  // @ts-expect-error This is a workaround for a TypeScript error of useStore implicitly having an any type
  loadFlowState: () => {
    // @ts-expect-error This is a workaround for a TypeScript error of useStore implicitly having an any type
    const { nodes, edges } = useStore.getState()
    return { nodes, edges }
  }
}))

export default useStore
