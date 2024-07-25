import React, { useEffect, useRef } from 'react'
import { useReactFlow, Background, Controls, ReactFlow } from '@xyflow/react'
import { useFlow } from '../../hooks/useFlow'
import InputNode from './nodes/InputNode'
import OutputNode from './nodes/OutputNode'

const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode
}

export function FlowComponent (): JSX.Element {
  const height = window.innerHeight
  const reactFlowWrapper = useRef(null)
  const { screenToFlowPosition } = useReactFlow()

  const { nodes, edges, onNodesChange, onEdgesChange, onDrop, onDragOver, onConnect, onReconnect } = useFlow(screenToFlowPosition)
  useEffect(() => {
    console.log(nodes)
    console.log(edges)
  }, [nodes, edges])

  return (
    <div
      ref={reactFlowWrapper}
      style={{ height, width: '100%' }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onReconnect={onReconnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
