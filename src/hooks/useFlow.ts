import { useCallback, useEffect } from 'react'
import { useNodesState, useEdgesState, addEdge, reconnectEdge, Connection, Edge, Node } from '@xyflow/react'
import { toast } from 'sonner'
import useStore from '../utils/store'

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
  saveFlowToStore: () => void
  loadFlowFromStore: () => void
  saveFlow: () => void
  loadFlow: () => void
  onNodeDragStop: (event: React.MouseEvent, node: Node) => void
}

export const useFlow = (screenToFlowPosition): useFlowReturn => {
  const initialNodes = useStore((state) => state.nodes)
  const initialEdges = useStore((state) => state.edges)
  const setNodes = useStore((state) => state.setNodes)
  const setEdges = useStore((state) => state.setEdges)
  const saveFlowState = useStore((state) => state.saveFlowState)
  const loadFlowState = useStore((state) => state.loadFlowState)
  const [nodes, setNodesState, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const existingSourceConnection = edges.some(edge => edge.source === params.source)
      const existingTargetConnection = edges.some(edge => edge.target === params.target)
      const targetIsIntersection = params.target.includes('intersection')

      if ((existingSourceConnection || existingTargetConnection) && !targetIsIntersection) {
        toast.warning('Each source or layer node can only have one connection.')
        return
      }

      const amountOfConnections = edges.filter(edge => edge.target === params.target).length
      if (amountOfConnections === 2 && targetIsIntersection) {
        toast.warning('Each source node can only have two connections.')
        return
      }

      setEdgesState((eds) => addEdge({ ...params, key: `edge-${params.source}-${params.target}`, id: `edge-${params.source}-${params.target}` }, eds))
      const _edges = [...edges, params]
      setEdges(_edges)
    },
    [edges, setEdgesState, setEdges]
  )

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      const existingSourceConnection = edges.some(edge => edge.source === newConnection.source && edge.id !== oldEdge.id)
      const existingTargetConnection = edges.some(edge => edge.target === newConnection.target && edge.id !== oldEdge.id)

      if (existingSourceConnection || existingTargetConnection) {
        toast.warning('Each source or layer node can only have one connection.')
        return edges
      }

      const _edges = setEdgesState((els) => reconnectEdge(oldEdge, newConnection, els))
      setEdges(_edges)
      return _edges
    },
    [edges, setEdgesState, setEdges]
  )

  const onDeleteNode = useCallback(
    (nodesToDelete: Node[]) => {
      const _nodes = nodes.filter((node) => nodesToDelete.some(n => n.id !== node.id))
      setNodesState(_nodes)
      setNodes(_nodes)

      const _edgesIdsToDelete = edges.filter((edge) => nodesToDelete.some(n => n.id === edge.source || n.id === edge.target)).map(e => e.id)
      const _edges = edges.filter((edge) => !_edgesIdsToDelete.includes(edge.id))
      setEdgesState(_edges)
      setEdges(_edges)
    },
    [setNodesState, setEdgesState, setNodes, setEdges, nodes, edges]
  )

  const onDeleteEdge = useCallback(
    (edgesToDelete: Edge[]) => {
      setEdgesState((eds) => eds.filter((edge) => edgesToDelete.some(e => e.id !== edge.id)))
      const _edges = edges.filter((edge) => edgesToDelete.some(e => e.id !== edge.id))
      setEdges(_edges)
    },
    [setEdgesState, setEdges, edges]
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
        key: `${type}_${nodes.length}`,
        type,
        position,
        data: { label, url: '' }
      }

      setNodesState((nds) => nds.concat(newNode))
      setNodes([...nodes, newNode])
    },
    [nodes, setNodesState, setNodes, screenToFlowPosition]
  )

  const onNodeDragStop = useCallback(
    (event, node) => {
      const _nodes = nodes.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
      setNodesState((nds) =>
        nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
      )
      setNodes(_nodes)
    },
    [setNodesState, nodes, setNodes]
  )

  const saveFlowToStore = useCallback(() => {
    saveFlowState(nodes, edges)
    toast.success('State saved successfully')
  }, [nodes, edges, saveFlowState])

  const loadFlowFromStore = useCallback(() => {
    const { nodes: savedNodes, edges: savedEdges } = loadFlowState()
    setNodes(savedNodes)
    setEdges(savedEdges)
    setNodesState(savedNodes)
    setEdgesState(savedEdges)
    toast.success('State loaded successfully')
  }, [loadFlowState, setNodes, setEdges, setNodesState, setEdgesState])

  const saveFlow = useCallback(() => {
    const flowState = {
      nodes: nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          url: node?.data?.url ?? ''
        }
      })),
      edges
    }
    localStorage.setItem('flowState', JSON.stringify(flowState))
    toast.success('State saved successfully')
  }, [nodes, edges])

  const loadFlow = useCallback(() => {
    const savedFlowState = localStorage.getItem('flowState')
    if (savedFlowState !== null) {
      const { nodes, edges } = JSON.parse(savedFlowState)
      setNodes(nodes)
      setNodesState(nodes)
      setEdges(edges)
      setEdgesState(edges)
      toast.success('State loaded successfully')
    }
  }, [setNodes, setEdges, setNodesState, setEdgesState])

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
    saveFlowToStore,
    loadFlowFromStore,
    saveFlow,
    loadFlow,
    onNodeDragStop
  }
}
