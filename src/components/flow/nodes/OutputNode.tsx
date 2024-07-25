import React from 'react'
import { Handle, Position } from '@xyflow/react'

const OutputNode = ({ data }): JSX.Element => {
  return (
    <div style={{ padding: 10, border: '1px solid black' }}>
      <label>{data.label}</label>
      <Handle type='target' position={Position.Left} style={{ background: '#555' }} />
    </div>
  )
}

export default OutputNode
