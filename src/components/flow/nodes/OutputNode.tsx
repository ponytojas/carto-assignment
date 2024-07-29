import React, { useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import { IconButton, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface OutputNodeProps {
  id: string
  data: {
    label: string
    onDeleteNode: (node: Node) => void
  }
}

const OutputNode = ({ id, data }: OutputNodeProps): JSX.Element => {
  const { label, onDeleteNode } = data
  const [hovered, setHovered] = useState(false)
  const [iconHovered, setIconHovered] = useState(false)

  return (
    <BaseNode
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <IconButton
          onMouseEnter={() => setIconHovered(true)}
          onMouseLeave={() => setIconHovered(false)}
          size='small'
          onClick={() => onDeleteNode([{ id, data }])}
          style={{ position: 'absolute', top: -25, right: 0 }}
        >
          <DeleteIcon
            fontSize='small' color={iconHovered ? 'error' : 'action'}
          />
        </IconButton>
      )}
      <Typography fontSize={10}>{label}</Typography>
      <Handle type='target' position={Position.Left} style={{ background: '#555' }} data-testid='node-handler-target' />
    </BaseNode>
  )
}

export default OutputNode
