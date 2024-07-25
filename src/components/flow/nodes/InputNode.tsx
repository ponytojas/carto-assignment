import React from 'react'
import { Handle, Position } from '@xyflow/react'

const InputNode = ({ data }): JSX.Element => {
  return (
    <div style={{ padding: 10, border: '1px solid black' }}>
      <label>{data.label}</label>
      <input type='text' placeholder='URL' />
      <Handle type='source' position={Position.Right} style={{ background: '#555' }} />
    </div>
  )
}

export default InputNode
