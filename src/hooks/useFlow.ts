import { useCallback } from 'react'
import { useNodesState, useEdgesState, addEdge, reconnectEdge, Connection, Edge, Node } from '@xyflow/react'
import { toast } from 'sonner'

interface useFlowReturn {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: Node[]) => void
  onEdgesChange: (changes: Edge[]) => void
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
  onConnect: (params: Edge | Connection) => void
  onReconnect: (oldEdge: Edge, newConnection: Connection) => void
  onDeleteNode: (nodeId: string) => void
  onDeleteEdge: (edgeId: string) => void
  saveFlow: () => void
  loadFlow: () => void
}

export const useFlow = (screenToFlowPosition): useFlowReturn => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      const connectionExists = edges.some(
        (edge) =>
          (edge.source === newConnection.source && edge.target === newConnection.target) ||
          (edge.source === newConnection.target && edge.target === newConnection.source)
      )

      if (connectionExists) {
        toast.warning('Connection already exists. Ignoring reconnection.')
        return edges
      }

      return setEdges((els) => reconnectEdge(oldEdge, newConnection, els))
    },
    [edges, setEdges]
  )

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
    },
    [setNodes, setEdges]
  )

  const onDeleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId))
    },
    [setEdges]
  )

  const onDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const { type, label } = JSON.parse(event.dataTransfer.getData('application/reactflow'))
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })

      const newNode = {
        id: `${type}_${nodes.length}`,
        type,
        position,
        data: { label }
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [nodes, setNodes, screenToFlowPosition]
  )

  const saveFlow = useCallback(() => {
    const flowState = { nodes, edges }
    localStorage.setItem('flowState', JSON.stringify(flowState))
    toast.success('State saved successfully')
  }, [nodes, edges])

  const loadFlow = useCallback(() => {
    const savedFlowState = localStorage.getItem('flowState')
    if (savedFlowState !== null) {
      const { nodes, edges } = JSON.parse(savedFlowState)
      setNodes(nodes)
      setEdges(edges)
      toast.success('State loaded successfully')
    }
  }, [setNodes, setEdges])

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onDrop,
    onDragOver,
    onConnect,
    onReconnect,
    onDeleteNode,
    onDeleteEdge,
    saveFlow,
    loadFlow
  }
}
