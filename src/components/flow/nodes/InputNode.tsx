import React, { useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Typography, IconButton, TextField } from '@mui/material'
import { BaseNode } from './BaseNode'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'sonner'

const InputNode = ({ id, data }): JSX.Element => {
  const { label, onDeleteNode } = data
  const [hovered, setHovered] = useState(false)
  const [iconHovered, setIconHovered] = useState(false)
  const [url, setUrl] = useState('')

  const handleFetchGeoJSON = async (event): void => {
    const inputUrl = event?.target?.value ?? null
    setUrl(inputUrl)
    if (inputUrl === null || inputUrl === undefined || inputUrl === '') return

    try {
      const response = await fetch(inputUrl)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const geojson = await response.json()
      // Handle the geojson data as needed
      console.log(geojson)
      toast.success('GeoJSON fetched successfully')
    } catch (error) {
      console.error('Failed to fetch GeoJSON:', error)
      toast.error('Failed to fetch GeoJSON')
    }
  }

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
          onClick={() => onDeleteNode(id)}
          style={{ position: 'absolute', top: -25, right: 0 }}
        >
          <DeleteIcon
            fontSize='small' color={iconHovered ? 'error' : 'action'}
          />
        </IconButton>
      )}
      <Typography fontSize={10}>{label}</Typography>
      <TextField
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onBlur={handleFetchGeoJSON}
        placeholder='URL'
        size='small'
        sx={{ fontSize: 5, width: '100%', padding: 0, margin: 0 }}
      />
      <Handle type='source' position={Position.Right} style={{ background: '#555' }} />
    </BaseNode>
  )
}

export default InputNode
