import React, { useState, useEffect, useCallback, memo, useRef } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import { Typography, IconButton, TextField } from '@mui/material'
import { BaseNode } from './BaseNode'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'sonner'
import useStore from '../../../utils/store'

const InputNode = ({ id, data }): JSX.Element => {
  const { updateNodeData } = useReactFlow()
  const storeData = useStore((state) => state.storeData)
  const setStoreData = useStore((state) => state.setStoreData)

  const { label, onDeleteNode } = data
  const [hovered, setHovered] = useState(false)
  const [iconHovered, setIconHovered] = useState(false)
  const [url, setUrl] = useState('')
  const loading = useRef(false)

  useEffect(() => {
    const { url: initialUrl } = data
    if (initialUrl !== undefined && initialUrl !== null && initialUrl !== url) {
      setUrl(initialUrl)
      handleFetchGeoJSON(initialUrl)
    }
  }, [data])

  const handleFetchGeoJSON = async (inputUrl: string): void => {
    if (inputUrl === null || inputUrl === undefined || inputUrl === '' || loading.current) return
    loading.current = true

    try {
      const response = await fetch(inputUrl)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const geojson = await response.json()
      setStoreData([...storeData, { id, geojson }])
      toast.success('GeoJSON fetched successfully')
    } catch (error) {
      console.error('Failed to fetch GeoJSON:', error)
      toast.error('Failed to fetch GeoJSON')
    }
    loading.current = false
  }

  const handleBlur = useCallback((event) => {
    const inputUrl = event?.target?.value ?? null
    if (inputUrl === undefined || inputUrl === null || inputUrl === url) return

    setUrl(inputUrl)
    handleFetchGeoJSON(inputUrl)
    if (inputUrl !== url)updateNodeData(id, { url: inputUrl })
  }, [id, updateNodeData, url])

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
        onBlur={handleBlur}
        placeholder='URL'
        size='small'
        sx={{ fontSize: 5, width: '100%', padding: 0, margin: 0 }}
      />
      <Handle type='source' position={Position.Right} style={{ background: '#555' }} />
    </BaseNode>
  )
}

export default memo(InputNode)
