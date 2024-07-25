import { useCallback } from 'react'
import { useNodesState, useEdgesState, addEdge, reconnectEdge, Connection, Edge, Node } from '@xyflow/react'

interface useFlowReturn {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: Node[]) => void
  onEdgesChange: (changes: Edge[]) => void
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
  onConnect: (params: Edge | Connection) => void
  onReconnect: (oldEdge: Edge, newConnection: Connection) => void
}

export const useFlow = (screenToFlowPosition): useFlowReturn => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })

      const newNode = {
        id: `${type}_${nodes.length}`,
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` }
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [nodes, setNodes, screenToFlowPosition]
  )

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      // Check if the new connection already exists
      const connectionExists = edges.some(
        (edge) =>
          (edge.source === newConnection.source && edge.target === newConnection.target) ||
          (edge.source === newConnection.target && edge.target === newConnection.source)
      )

      if (connectionExists) {
        console.log('Connection already exists. Ignoring reconnection.')
        return edges
      }

      return setEdges((els) => reconnectEdge(oldEdge, newConnection, els))
    },
    [edges, setEdges]
  )

  const onDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onDrop,
    onDragOver,
    onConnect,
    onReconnect
  }
}
