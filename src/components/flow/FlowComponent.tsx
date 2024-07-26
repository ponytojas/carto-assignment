import React, { useEffect, useRef } from 'react'
import { useReactFlow, Background, Controls, ReactFlow } from '@xyflow/react'
import { Button, Box, ButtonGroup } from '@mui/material'
import { useFlow } from '../../hooks/useFlow'
import InputNode from './nodes/InputNode'
import OutputNode from './nodes/OutputNode'
import { NodeType } from '../../enums/flow'
import { FileUpload, SaveOutlined } from '@mui/icons-material'

const nodeTypes = {
  [NodeType.SOURCE]: InputNode,
  [NodeType.LAYER]: OutputNode
}

export function FlowComponent (): JSX.Element {
  const height = window.innerHeight
  const reactFlowWrapper = useRef(null)
  const { screenToFlowPosition } = useReactFlow()

  const {
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
  } = useFlow(screenToFlowPosition)

  return (
    <div
      ref={reactFlowWrapper}
      style={{ height, width: '100%' }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <Box sx={{ position: 'absolute', bottom: 20, right: 10, zIndex: 100, display: 'flex' }}>
        <ButtonGroup variant='outlined' size='small' color='secondary' aria-label='Basic button group'>
          <Button onClick={saveFlow}>
            <SaveOutlined fontSize='small' sx={{ marginRight: 2 }} />
            Save
          </Button>
          <Button onClick={loadFlow}>
            <FileUpload fontSize='small' sx={{ marginRight: 2 }} />
            Load
          </Button>
        </ButtonGroup>

      </Box>
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onDeleteNode
          }
        }))}
        edges={edges.map(edge => ({
          ...edge,
          data: {
            onDeleteEdge
          }
        }))}
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
